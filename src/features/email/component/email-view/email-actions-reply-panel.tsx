import { ChevronDown, Forward, PictureInPicture2, Reply, ReplyAll } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { TActiveAction, TEmail, TReply } from '../../types/email.types';
import { Button } from 'components/ui/button';
import CustomAvatar from 'components/blocks/custom-avatar/custom-avatar';
import { v4 as uuidv4 } from 'uuid';

/**
 * EmailActionsReplyPanel Component
 *
 * A user interaction panel that enables reply, reply-all, forward, and pop-out reply actions for an email.
 * This panel dynamically reflects the currently active reply action, shows corresponding icons, and allows
 * the user to change the action via a dropdown menu.
 *
 * Features:
 * - Dynamically displays active action icons (reply/reply all/forward)
 * - Provides a dropdown with all available reply options
 * - Displays sender avatars based on the action type
 * - Uses accessible and responsive UI elements
 *
 * Props:
 * @param {TEmail} [selectedEmail] - The email object currently selected by the user
 * @param {(replyData?: TReply) => void} handleComposeEmailForward - Handler for triggering the forward/popup reply flow
 * @param {(action: TActiveAction) => void} setActiveActionReply - Function to set the current reply action state
 * @param {TActiveAction} activeActionReply - The current reply action state object (e.g., { reply: true, replyAll: false, ... })
 * @param {(action: 'reply' | 'replyAll' | 'forward') => void} handleSetActiveReply - Callback to change the active reply type
 *
 * @returns {JSX.Element} - A toolbar UI with reply actions and avatar-based buttons, or null if no action is active
 *
 * @example
 * <EmailActionsReplyPanel
 *   selectedEmail={selectedEmail}
 *   handleComposeEmailForward={handleComposeEmailForward}
 *   setActiveActionReply={setActiveActionReply}
 *   activeActionReply={activeActionReply}
 *   handleSetActiveReply={handleSetActiveReply}
 * />
 */

interface EmailActionsPanelReplyTypeProps {
  selectedEmail?: TEmail;
  handleComposeEmailForward: (replyData?: TReply) => void;
  setActiveActionReply: (action: TActiveAction) => void;
  activeActionReply: TActiveAction;
  handleSetActiveReply: (action: 'reply' | 'replyAll' | 'forward') => void;
}

type ReplyActionType = 'reply' | 'replyAll' | 'forward' | 'popOutReply';

interface ReplyMenuAction {
  type: ReplyActionType;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  onClick: () => void;
}

const REPLY_AVATARS = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    alt: 'Profile avatar',
  },
  {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Profile avatar',
  },
  {
    src: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Profile avatar',
  },
];

const ICON_SIZE_CLASSES = 'h-5 w-5';
const DROPDOWN_ITEM_CLASSES = 'flex p-3 gap-2 hover:bg-surface';
const TEXT_STYLING_CLASSES = 'text-high-emphasis font-normal';
const ICON_MEDIUM_EMPHASIS_CLASSES = 'h-5 w-5 text-medium-emphasis';
const AVATAR_SIZE = { height: 24, width: 24 };

const EmailActionsReplyPanel = ({
  selectedEmail,
  activeActionReply,
  handleSetActiveReply,
  handleComposeEmailForward,
}: Readonly<EmailActionsPanelReplyTypeProps>) => {
  const { t } = useTranslation();

  // Create menu actions configuration
  const replyMenuActions: ReplyMenuAction[] = [
    {
      type: 'reply',
      icon: Reply,
      labelKey: 'REPLY',
      onClick: () => handleSetActiveReply('reply'),
    },
    {
      type: 'replyAll',
      icon: ReplyAll,
      labelKey: 'REPLY_ALL',
      onClick: () => handleSetActiveReply('replyAll'),
    },
    {
      type: 'forward',
      icon: Forward,
      labelKey: 'FORWARD',
      onClick: () => handleComposeEmailForward({} as TReply),
    },
    {
      type: 'popOutReply',
      icon: PictureInPicture2,
      labelKey: 'POP_OUT_REPLY',
      onClick: () => handleComposeEmailForward({} as TReply),
    },
  ];

  const renderActiveReplyIcon = () => {
    if (activeActionReply.reply) return <Reply className={ICON_SIZE_CLASSES} />;
    if (activeActionReply.replyAll) return <ReplyAll className={ICON_SIZE_CLASSES} />;
    if (activeActionReply.forward) return <Forward className={ICON_SIZE_CLASSES} />;
    return null;
  };

  const renderDropdownMenuItem = (action: ReplyMenuAction) => {
    const IconComponent = action.icon;
    return (
      <DropdownMenuItem
        key={action.type}
        className={DROPDOWN_ITEM_CLASSES}
        onClick={action.onClick}
      >
        <IconComponent className={ICON_MEDIUM_EMPHASIS_CLASSES} />
        <p className={TEXT_STYLING_CLASSES}>{t(action.labelKey)}</p>
      </DropdownMenuItem>
    );
  };

  const renderAvatarButton = (
    avatarSrc: string,
    avatarAlt: string,
    senderName?: string,
    showSenderOnMobile = false
  ) => (
    <Button variant="outline">
      <CustomAvatar
        src={avatarSrc}
        alt={avatarAlt}
        height={AVATAR_SIZE.height}
        width={AVATAR_SIZE.width}
      />
      {showSenderOnMobile ? <span className="hidden md:block">{senderName}</span> : senderName}
    </Button>
  );

  const renderReplyButtons = () => {
    const hasActiveAction =
      activeActionReply.reply || activeActionReply.replyAll || activeActionReply.forward;

    if (!hasActiveAction) return null;

    if (activeActionReply.replyAll) {
      return (
        <div className="flex gap-2">
          {REPLY_AVATARS.map((avatar) => (
            <div key={`reply-all-${uuidv4()}`}>
              {renderAvatarButton(
                avatar.src,
                avatar.alt,
                Array.isArray(selectedEmail?.sender)
                  ? selectedEmail?.sender.join(', ')
                  : selectedEmail?.sender,
                true
              )}
            </div>
          ))}
        </div>
      );
    }

    return renderAvatarButton(
      REPLY_AVATARS[0].src,
      REPLY_AVATARS[0].alt,
      Array.isArray(selectedEmail?.sender)
        ? selectedEmail?.sender.join(', ')
        : selectedEmail?.sender,
      false
    );
  };

  return (
    <div className="border-b border-low-emphasis py-1">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 text-medium-emphasis">
          {renderActiveReplyIcon()}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronDown className={`${ICON_SIZE_CLASSES} cursor-pointer`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52">
              {replyMenuActions.map(renderDropdownMenuItem)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="">{renderReplyButtons()}</div>
      </div>
    </div>
  );
};

export default EmailActionsReplyPanel;
