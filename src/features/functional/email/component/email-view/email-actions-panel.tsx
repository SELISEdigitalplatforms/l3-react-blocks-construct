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
 * EmailActionsPanel Component
 *
 * A toolbar panel for email actions such as reply, reply all, and forward.
 * It displays action icons and a dropdown menu for users to interact with an email in different ways.
 * When actions are selected, sender avatars and buttons appear to indicate the active state.
 *
 * Features:
 * - Inline icon controls for common email actions (Reply, Reply All, Forward)
 * - Dropdown menu with additional actions, including pop-out reply
 * - Dynamic display of sender avatars when in reply modes
 * - Uses Lucide icons and a dropdown UI from the component library
 *
 * Props:
 * @param {TEmail} [selectedEmail] - The currently selected email to reply to or forward.
 * @param {TActiveAction} activeAction - Object representing the currently active action (e.g., reply, replyAll, forward).
 * @param {(action: 'reply' | 'replyAll' | 'forward') => void} handleSetActive - Callback to activate a specific reply action.
 * @param {(replyData?: TReply) => void} handleComposeEmailForward - Function to trigger forwarding or pop-out reply logic.
 * @param {(action: TActiveAction) => void} setActiveAction - Function to update the overall active action state.
 *
 * @returns {JSX.Element} The action panel UI for email replies and forwarding.
 *
 * @example
 * <EmailActionsPanel
 *   selectedEmail={email}
 *   activeAction={{ reply: false, replyAll: false, forward: false }}
 *   handleSetActive={(action) => setActive(action)}
 *   handleComposeEmailForward={(reply) => forward(reply)}
 *   setActiveAction={(action) => setState(action)}
 * />
 */

interface EmailActionsPanelTypeProps {
  selectedEmail?: TEmail;
  handleComposeEmailForward: (replyData?: TReply) => void;
  setActiveAction: (action: TActiveAction) => void;
  activeAction: TActiveAction;
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
}

type ActionType = 'reply' | 'replyAll' | 'forward' | 'popOutReply';

interface MenuAction {
  type: ActionType;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  onClick: () => void;
}

const REPLY_ALL_AVATARS = [
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

const ICON_CLASSES = 'h-5 w-5';
const MENU_ITEM_CLASSES = 'flex p-3 gap-2 hover:bg-surface';
const TEXT_CLASSES = 'text-high-emphasis font-normal';
const ICON_TEXT_CLASSES = 'h-5 w-5 text-medium-emphasis';

const EmailActionsPanel = ({
  selectedEmail,
  activeAction,
  handleSetActive,
  handleComposeEmailForward,
}: Readonly<EmailActionsPanelTypeProps>) => {
  const { t } = useTranslation();

  // Create menu actions configuration
  const menuActions: MenuAction[] = [
    {
      type: 'reply',
      icon: Reply,
      labelKey: 'REPLY',
      onClick: () => handleSetActive('reply'),
    },
    {
      type: 'replyAll',
      icon: ReplyAll,
      labelKey: 'REPLY_ALL',
      onClick: () => handleSetActive('replyAll'),
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

  const renderActiveIcon = () => {
    if (activeAction.reply) return <Reply className={ICON_CLASSES} />;
    if (activeAction.replyAll) return <ReplyAll className={ICON_CLASSES} />;
    if (activeAction.forward) return <Forward className={ICON_CLASSES} />;
    return null;
  };

  const renderMenuItem = (action: MenuAction) => {
    const IconComponent = action.icon;
    return (
      <DropdownMenuItem key={action.type} className={MENU_ITEM_CLASSES} onClick={action.onClick}>
        <IconComponent className={ICON_TEXT_CLASSES} />
        <p className={TEXT_CLASSES}>{t(action.labelKey)}</p>
      </DropdownMenuItem>
    );
  };

  // Render avatar button
  const renderAvatarButton = (src: string, alt: string, senderName?: string) => (
    <Button variant="outline">
      <CustomAvatar src={src} alt={alt} height={24} width={24} />
      <span className="hidden md:block">{senderName}</span>
    </Button>
  );

  const renderReplyButtons = () => {
    if (activeAction.reply) {
      return renderAvatarButton(
        REPLY_ALL_AVATARS[0].src,
        REPLY_ALL_AVATARS[0].alt,
        Array.isArray(selectedEmail?.sender)
          ? selectedEmail?.sender.join(', ')
          : selectedEmail?.sender
      );
    }

    if (activeAction.replyAll) {
      return (
        <div className="flex gap-2">
          {REPLY_ALL_AVATARS.map((avatar) => (
            <div key={uuidv4()}>
              {renderAvatarButton(
                avatar.src,
                avatar.alt,
                Array.isArray(selectedEmail?.sender)
                  ? selectedEmail?.sender.join(', ')
                  : selectedEmail?.sender
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border-b border-low-emphasis py-1">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 text-medium-emphasis">
          {renderActiveIcon()}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronDown className={`${ICON_CLASSES} cursor-pointer`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52">
              {menuActions.map(renderMenuItem)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="">{renderReplyButtons()}</div>
      </div>
    </div>
  );
};

export default EmailActionsPanel;
