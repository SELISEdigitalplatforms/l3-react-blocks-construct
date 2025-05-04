import { ChevronDown, Forward, Reply, ReplyAll, Trash2 } from 'lucide-react';
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

const EmailActionsPanel = ({
  selectedEmail,
  activeAction,
  handleSetActive,
  handleComposeEmailForward,
}: Readonly<EmailActionsPanelTypeProps>) => {
  return (
    <div className="border-b border-low-emphasis py-1">
      <div className="flex gap-2 items-center ">
        <div className="flex  gap-2 text-medium-emphasis ">
          {activeAction.reply && <Reply className="h-5 w-5 " />}
          {activeAction.replyAll && <ReplyAll className="h-5 w-5 " />}
          {activeAction.forward && <Forward className="h-5 w-5 " />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronDown className="h-5 w-5 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52">
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface"
                onClick={() => {
                  handleSetActive('reply');
                }}
              >
                <Reply className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">Reply</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => {
                  handleSetActive('replyAll');
                }}
              >
                <ReplyAll className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">Reply All</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => handleComposeEmailForward({} as TReply)}
              >
                <Forward className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">Forward</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={() => handleComposeEmailForward({} as TReply)}
              >
                <Trash2 className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">Pop out reply</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="">
          {activeAction.reply && (
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
          {activeAction.replyAll && (
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

export default EmailActionsPanel;
