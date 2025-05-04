import { Star, Reply, EllipsisVertical, ReplyAll, Forward, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import { TEmail, TIsReplySingleActionState, TReply } from '../../types/email.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

/**
 * EmailSingleActions Component
 *
 * A component that provides a set of actions that can be performed on a single email, such as starring, replying, replying all,
 * forwarding, and more. It also displays the timestamp of the email and includes a pop-out reply option.
 *
 * Features:
 * - Star functionality to mark important emails
 * - Reply, Reply All, and Forward actions with customizable handling
 * - Dropdown menu for additional options such as pop-out reply
 * - Tooltip descriptions for each action for better user experience
 * - Allows toggling of the reply editor state
 *
 * Props:
 * @param {TEmail | TReply | null} selectedEmail - The email or reply object to display the actions for
 * @param {Function} formatDateTime - A function to format the date of the email into a human-readable format
 * @param {Function} [onToggleStar] - A callback function to toggle the starred state of the email
 * @param {Function} [onReplyClick] - A callback function to trigger the in-place reply editor
 * @param {Function} [onPopOutReplyClick] - A callback function to trigger the pop-out reply editor
 * @param {Function} [onMoreOptionsClick] - A callback function for triggering more options like delete or mark as read
 * @param {Function} handleSetActiveReply - A function to set the active reply action (Reply, Reply All, Forward)
 * @param {TIsReplySingleActionState} [isReplySingleAction] - State for the single reply action mode (for toggle reply editor)
 * @param {React.Dispatch<React.SetStateAction<{ isReplyEditor: boolean; replyId: string }>>} [setIsReplySingleAction] - State setter to manage the reply editor state
 * @param {Function} handleComposeEmailForward - A function to trigger forwarding of the email
 * @param {Object} activeActionReply - An object containing flags for the active reply actions (reply, replyAll, forward)
 * @param {Function} handleSetActive - A function to handle the action for setting the reply type (reply, replyAll, forward)
 *
 * @returns {JSX.Element} - The EmailSingleActions component with available actions and timestamps.
 *
 * @example
 * return (
 *   <EmailSingleActions
 *     selectedEmail={selectedEmail}
 *     formatDateTime={formatDateTime}
 *     onToggleStar={toggleStar}
 *     handleSetActiveReply={setActiveReply}
 *     handleComposeEmailForward={handleForward}
 *     activeActionReply={activeActionReply}
 *   />
 * )
 */

interface EmailSingleActionsProps {
  selectedEmail: TEmail | TReply | null;
  reply?: TReply;
  formatDateTime: (date: string) => string;
  onToggleStar?: (emailId: string, replyId?: string) => void;
  onReplyClick?: () => void; // Keep this for the in-place reply
  onPopOutReplyClick?: (email: TEmail | TReply | null) => void; // New prop for pop-out
  onMoreOptionsClick?: () => void;
  handleSetActiveReply: (action: 'reply' | 'replyAll' | 'forward') => void;
  isReplySingleAction?: TIsReplySingleActionState;
  setIsReplySingleAction?: React.Dispatch<
    React.SetStateAction<{ isReplyEditor: boolean; replyId: string }>
  >;
  handleComposeEmailForward: () => void;
  activeActionReply: { reply: boolean; replyAll: boolean; forward: boolean };
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
}

const EmailSingleActions = ({
  selectedEmail,
  formatDateTime,
  onToggleStar,
  onMoreOptionsClick,
  handleSetActiveReply,
  reply,
  setIsReplySingleAction,
  handleComposeEmailForward,
}: EmailSingleActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-end items-end line-clamp-1 gap-3 w-68 ">
      <p className="text-xs md:text-sm text-medium-emphasis">
        {formatDateTime(selectedEmail?.date || '')}
      </p>

      <div className="flex gap-3 justify-center items-center">
        <div className="hidden md:block w-px h-4 bg-low-emphasis" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Star
              className={`h-5 w-5 ${selectedEmail?.isStarred && 'text-warning'} ${reply?.isStarred && 'text-warning'} cursor-pointer text-medium-emphasis`}
              onClick={() => {
                if (selectedEmail && onToggleStar) {
                  if (reply) {
                    onToggleStar(selectedEmail.id, reply.id);
                  } else {
                    onToggleStar(selectedEmail.id);
                  }
                }
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-surface text-medium-emphasis" side="top" align="center">
            <p>{selectedEmail?.isStarred ? 'Not starred' : 'Starred'}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Reply
              className="h-5 w-5 text-medium-emphasis cursor-pointer"
              onClick={() => {
                if (setIsReplySingleAction) {
                  if (reply) {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      replyId: reply.id,
                    }));
                  } else {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      isReplyEditor: !prev.isReplyEditor,
                    }));
                  }
                  handleSetActiveReply('reply');
                }
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-surface text-medium-emphasis" side="top" align="center">
            <p>Reply</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical
              className="h-5 w-5 text-medium-emphasis cursor-pointer"
              onClick={() => {
                if (onMoreOptionsClick) {
                  onMoreOptionsClick();
                }
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-52">
            <DropdownMenuItem
              className="flex p-3 gap-2 hover:bg-surface"
              onClick={() => {
                // handleSetActiveReply('reply');

                if (setIsReplySingleAction) {
                  if (reply) {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      replyId: reply.id,
                    }));
                  } else {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      isReplyEditor: !prev.isReplyEditor,
                    }));
                  }
                  handleSetActiveReply('reply');
                }
              }}
            >
              <Reply className="h-5 w-5 text-medium-emphasis" />
              <p className="text-high-emphasis font-normal">Reply</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex p-3 gap-2 hover:bg-surface"
              onClick={() => {
                if (setIsReplySingleAction) {
                  if (reply) {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      replyId: reply.id,
                    }));
                  } else {
                    setIsReplySingleAction((prev) => ({
                      ...prev,
                      isReplyEditor: !prev.isReplyEditor,
                    }));
                  }
                  handleSetActiveReply('replyAll');
                }
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
    </div>
  );
};

export default EmailSingleActions;
