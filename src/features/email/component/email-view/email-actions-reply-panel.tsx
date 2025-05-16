import { ChevronDown, Forward, Reply, ReplyAll, Trash2 } from 'lucide-react';
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

const EmailActionsReplyPanel = ({
  selectedEmail,
  activeActionReply,
  handleSetActiveReply,
  handleComposeEmailForward,
}: Readonly<EmailActionsPanelReplyTypeProps>) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-low-emphasis py-1">
      <div className="flex gap-2 items-center ">
        <div className="flex  gap-2 text-medium-emphasis ">
          {activeActionReply.reply && <Reply className="h-5 w-5 " />}
          {activeActionReply.replyAll && <ReplyAll className="h-5 w-5 " />}
          {activeActionReply.forward && <Forward className="h-5 w-5 " />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronDown className="h-5 w-5 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52">
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface"
                onClick={() => {
                  handleSetActiveReply('reply');
                }}
              >
                <Reply className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">{t('REPLY')}</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => {
                  handleSetActiveReply('replyAll');
                }}
              >
                <ReplyAll className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">{t('REPLY_ALL')}</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => handleComposeEmailForward({} as TReply)}
              >
                <Forward className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">{t('FORWARD')}</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => handleComposeEmailForward({} as TReply)}
              >
                <Trash2 className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">{t('POP_OUT_REPLY')}</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="">
          {!activeActionReply.replyAll && (
            <Button variant={'outline'}>
              <CustomAvatar
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg"
                alt="Profile avatar"
                height={24}
                width={24}
              />
              {selectedEmail?.sender}
            </Button>
          )}
          {activeActionReply.replyAll && (
            <div className="flex gap-2">
              <Button variant={'outline'}>
                <CustomAvatar
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg"
                  alt="Profile avatar"
                  height={24}
                  width={24}
                />
                <span className="hidden md:block">{selectedEmail?.sender}</span>
              </Button>
              <Button variant={'outline'}>
                <CustomAvatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile avatar"
                  height={24}
                  width={24}
                />
                <span className="hidden md:block">{selectedEmail?.sender}</span>
              </Button>
              <Button variant={'outline'}>
                <CustomAvatar
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile avatar"
                  height={24}
                  width={24}
                />
                <span className="hidden md:block">{selectedEmail?.sender}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailActionsReplyPanel;
