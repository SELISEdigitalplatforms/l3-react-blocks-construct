import { Star, Reply, EllipsisVertical, ReplyAll, Forward, PictureInPicture2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui-kit/tooltip';
import { EmailSingleActionsProps } from '../../types/email.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';

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

export const EmailSingleActions = ({
  selectedEmail,
  formatDateTime,
  onToggleStar,
  onMoreOptionsClick,
  handleSetActiveReply,
  reply,
  setIsReplySingleAction,
  handleComposeEmailForward,
}: EmailSingleActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-end items-end line-clamp-1 gap-3 w-68 ">
      <p className="text-xs md:text-sm text-medium-emphasis">
        {formatDateTime(selectedEmail?.date ?? '')}
      </p>

      <div className="flex gap-3 justify-center items-center">
        <div className="hidden md:block w-px h-4 bg-low-emphasis" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Star
              className={`h-5 w-5 ${selectedEmail?.isStarred && 'text-warning'} ${reply?.isStarred && 'text-warning'} cursor-pointer text-medium-emphasis`}
              fill={selectedEmail?.isStarred || reply?.isStarred ? 'currentColor' : 'none'}
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
            <p>{selectedEmail?.isStarred ? t('NOT_STARRED') : t('STARRED')}</p>
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
            <p>{t('REPLY')}</p>
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
              <p className="text-high-emphasis font-normal">{t('REPLY')}</p>
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
              <p className="text-high-emphasis font-normal">{t('REPLY_ALL')}</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex p-3 gap-2 hover:bg-surface "
              onClick={handleComposeEmailForward}
            >
              <Forward className="h-5 w-5 text-medium-emphasis" />
              <p className="text-high-emphasis font-normal">{t('FORWARD')}</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex p-3 gap-2 hover:bg-surface "
              onClick={handleComposeEmailForward}
            >
              <PictureInPicture2 className="h-5 w-5 text-medium-emphasis" />
              <p className="text-high-emphasis font-normal">{t('POP_OUT_REPLY')}</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
