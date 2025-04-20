import { ChevronDown, Forward, Reply, ReplyAll, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { TActiveAction, TEmail } from '../../types/email.types';
import { Button } from 'components/ui/button';
import EmailAvatar from '../email-ui/email-avatar';

/**
 * EmailViewResponseMore component provides additional email response options such as Reply, Reply All, Forward,
 * and Pop out reply. It also displays the sender's avatar and name with a button that triggers these actions.
 * It is typically used within an email view interface where users can choose to interact with the email in various ways.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isReply - A flag indicating whether the user is in reply mode.
 * @param {Function} props.setIsReply - A function to toggle the reply mode state.
 * @param {TEmail} [props.selectedEmail] - The selected email object containing details like the sender's name and avatar.
 *
 * @returns {JSX.Element} - The EmailViewResponseMore component with response options and sender information.
 *
 * @example
 * return (
 *   <EmailViewResponseMore
 *     isReply={isReply}
 *     setIsReply={setIsReply}
 *     selectedEmail={selectedEmail}
 *   />
 * )
 */

interface EmailActionsPanelTypeProps {
  selectedEmail?: TEmail;
  handleComposeEmailForward: () => void;
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
                onClick={handleComposeEmailForward}
              >
                <Forward className="h-5 w-5 text-medium-emphasis" />
                <p className="text-high-emphasis font-normal">Forward</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-3 gap-2 hover:bg-surface "
                onClick={handleComposeEmailForward}
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
              <EmailAvatar
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
                <EmailAvatar
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg"
                  alt="Profile avatar"
                  height={24}
                  width={24}
                />
                <span className="hidden md:block">{selectedEmail?.sender}</span>
              </Button>
              <Button variant={'outline'}>
                <EmailAvatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile avatar"
                  height={24}
                  width={24}
                />
                <span className="hidden md:block">{selectedEmail?.sender}</span>
              </Button>
              <Button variant={'outline'}>
                <EmailAvatar
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
