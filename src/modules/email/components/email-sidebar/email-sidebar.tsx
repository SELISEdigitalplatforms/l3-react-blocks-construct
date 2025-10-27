import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-kit/button';
import { TEmail, TEmailData } from '../../types/email.types';
import { useNavItems } from '../../constants/nav-items';
import { useLabelItems } from '../../constants/label-items';
import { EmailTextEditor } from '../email-text-editor/email-text-editor';

/**
 * NavItem Component
 *
 * A reusable component for rendering a navigation item in the sidebar.
 * This component supports:
 * - Displaying an icon and label
 * - Highlighting the active navigation item
 * - Showing an optional count (e.g., unread emails)
 *
 * Props:
 * @param {JSX.Element} icon - The icon to display next to the label
 * @param {string} label - The label for the navigation item
 * @param {number} [count] - Optional count displayed next to the label
 * @param {boolean} [isActive] - Whether the navigation item is active
 * @param {boolean} [isCollapsedEmailSidebar] - Whether the sidebar is collapsed
 * @param {() => void} onClick - Callback triggered when the navigation item is clicked
 *
 * @example
 * <NavItem
 *   icon={<Mail />}
 *   label="Inbox"
 *   count={50}
 *   isActive={true}
 *   onClick={() => console.log('Inbox clicked')}
 * />
 */

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  isCollapsedEmailSidebar?: boolean;
}

interface EmailSidebarProps {
  handleComposeEmail: () => void;
  handleCloseCompose: () => void;
  setSelectedEmail: (email: TEmail | null) => void;
  emails: Partial<TEmailData>;
  isCollapsedEmailSidebar?: boolean;
}

function NavItem({
  icon,
  label,
  count,
  isActive,
  isCollapsedEmailSidebar,
  onClick,
}: Readonly<NavItemProps>) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex w-full justify-start gap-2 h-10 text-high-emphasis',
        isActive && 'bg-primary-50 text-primary-600',
        isCollapsedEmailSidebar && 'justify-center'
      )}
    >
      {icon}
      {!isCollapsedEmailSidebar && (
        <>
          <span className="flex-1 text-left text-base">{label}</span>
          {count !== undefined && (
            <span className={`text-sm ${isActive && 'text-primary-600'}`}>{count}</span>
          )}
        </>
      )}
    </Button>
  );
}

/**
 * EmailSidebar Component
 *
 * A reusable sidebar component for navigating email categories and labels.
 * This component supports:
 * - Navigating between email categories (e.g., Inbox, Sent, Trash)
 * - Displaying labels for organizing emails
 * - Composing new emails
 * - Collapsing and expanding the sidebar
 *
 * Features:
 * - Dynamic navigation items based on email data
 * - Responsive design with support for collapsed and expanded states
 * - Integration with the email compose functionality
 *
 * Props:
 * @param {() => void} handleComposeEmail - Callback triggered to open the compose email modal
 * @param {() => void} handleCloseCompose - Callback triggered to close the compose email modal
 * @param {(email: TEmail | null) => void} setSelectedEmail - Callback to set the currently selected email
 * @param {Partial<TEmailData>} emails - The email data categorized by type (e.g., Inbox, Sent)
 * @param {boolean} [isCollapsedEmailSidebar] - Whether the sidebar is in a collapsed state
 *
 * @example
 * // Basic usage
 * <EmailSidebar
 *   handleComposeEmail={() => console.log('Compose Email')}
 *   handleCloseCompose={() => console.log('Close Compose')}
 *   setSelectedEmail={(email) => console.log('Selected Email:', email)}
 *   emails={emailData}
 *   isCollapsedEmailSidebar={false}
 * />
 */

export const EmailSidebar = ({
  handleComposeEmail,
  setSelectedEmail,
  emails,
  isCollapsedEmailSidebar,
}: Readonly<EmailSidebarProps>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const { t } = useTranslation();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const navItems = useNavItems(emails, location, navigate, setSelectedEmail);
  const labelItems = useLabelItems(location, navigate, setSelectedEmail);

  return (
    <>
      <div
        className={`
          'flex w-full flex-col transition-all duration-300 border-t border-Low-Emphasis',
        ${
          isCollapsedEmailSidebar
            ? 'md:min-w-[70px] md:max-w-[70px]'
            : 'md:min-w-[280px] md:max-w-[280px]'
        }

        `}
      >
        <div className="flex items-center justify-between px-2 py-4">
          <Button className="flex items-center gap-2 w-full" onClick={handleComposeEmail}>
            <SquarePen size={20} />
            {!isCollapsedEmailSidebar && <span className="text-base">{t('COMPOSE')}</span>}
          </Button>
        </div>

        <div className="flex-1 px-2">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} isCollapsedEmailSidebar={isCollapsedEmailSidebar} />
          ))}

          {!isCollapsedEmailSidebar && (
            <>
              <h2 className="px-4 py-2 text-[10px] font-semibold uppercase text-medium-emphasis">
                {t('LABELS')}
              </h2>
              {labelItems.map((item) => (
                <NavItem
                  key={item.label}
                  {...item}
                  isCollapsedEmailSidebar={isCollapsedEmailSidebar}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <EmailTextEditor
          value={content}
          onChange={handleContentChange}
          submitName={t('SEND')}
          cancelButton={t('DISCARD')}
          showIcons={true}
        />
      )}
    </>
  );
};
