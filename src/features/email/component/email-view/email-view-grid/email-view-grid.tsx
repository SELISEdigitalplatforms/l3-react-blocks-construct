import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Forward,
  History,
  Image,
  MailOpen,
  Paperclip,
  Reply,
  ReplyAll,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { EmailViewProps, TReply } from 'features/email/types/email.types';
import empty_email from 'assets/images/empty_email.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import EmailViewResponseType from '../email-view-response-type';
import { Button } from 'components/ui/button';
import EmailActionsPanel from '../email-actions-panel';
import EmailTextEditor from '../../email-ui/email-text-editor';
import { EmailCompose } from '../../email-compose/email-compose';
import { htmlToPlainText } from 'features/email/services/email';
import EmailTooltipConfirmAction from '../../email-ui/email-tooltip-confirm-action';
import EmailSingleActions from '../email-single-action';
import EmailActionsReplyPanel from '../email-actions-reply-panel';
import { sanitizeHTML } from 'utils/sanitizer';

interface AttachmentDisplayProps {
  attachments?: string[];
  images?: string[];
  isReplyVisible: boolean;
  handleToggleReplyVisibility: () => void;
}

interface ActionButtonsProps {
  selectedEmail: any;
  category: string;
  updateEmailReadStatus: (id: string, category: string, isRead: boolean) => void;
  moveEmailToCategory: (id: string, category: 'spam' | 'trash') => void;
  restoreEmailsToCategory: (ids: string[]) => void;
  deleteEmailsPermanently: (ids: string[]) => void;
}

const AttachmentDisplay: React.FC<AttachmentDisplayProps & { t: any }> = ({
  attachments = [],
  images = [],
  isReplyVisible,
  handleToggleReplyVisibility,
  t,
}) => {
  const totalAttachments = attachments.length + images.length;

  if (totalAttachments === 0) return null;

  const renderAttachmentItem = (name: string, type: 'attachment' | 'image') => (
    <div key={name} className="flex items-center gap-2">
      <div className="bg-white p-2 rounded">
        {type === 'attachment' ? (
          <FileText className="w-10 h-10 text-secondary-400" />
        ) : (
          <Image className="w-10 h-10 text-secondary-400" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-high-emphasis">{name}</p>
        <p className="text-[10px] text-medium-emphasis">600.00 KB</p>
      </div>
    </div>
  );

  return (
    <div className="p-2 flex flex-col gap-3 bg-surface rounded">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center text-medium-emphasis text-sm">
          <Paperclip className="w-4 h-4" />
          <p>{`${totalAttachments} ${t('ATTACHMENTS')}`}</p>
          <button onClick={handleToggleReplyVisibility} className="cursor-pointer">
            {isReplyVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button variant="link">
          <Download className="h-4 w-4" />
          {t('DOWNLOAD_ALL')}
        </Button>
      </div>
      {isReplyVisible && (
        <div className="grid grid-cols-2 gap-4">
          {attachments.map((attachment) => renderAttachmentItem(attachment, 'attachment'))}
          {images.map((image) => renderAttachmentItem(image, 'image'))}
        </div>
      )}
    </div>
  );
};

const EmailActionButtons: React.FC<ActionButtonsProps & { t: any }> = ({
  selectedEmail,
  category,
  updateEmailReadStatus,
  moveEmailToCategory,
  restoreEmailsToCategory,
  deleteEmailsPermanently,
  t,
}) => {
  const renderTooltipAction = (
    Icon: React.ComponentType<any>,
    tooltipText: string,
    onClick: () => void,
    className = 'h-5 w-5 cursor-pointer text-medium-emphasis'
  ) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon className={className} onClick={onClick} />
      </TooltipTrigger>
      <TooltipContent className="bg-surface text-medium-emphasis" side="top" align="center">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="flex gap-4">
      {selectedEmail.isRead &&
        renderTooltipAction(MailOpen, t('MARK_AS_UNREAD'), () =>
          updateEmailReadStatus(selectedEmail.id, category, false)
        )}

      {category !== 'spam' &&
        renderTooltipAction(TriangleAlert, t('SPAM'), () =>
          moveEmailToCategory(selectedEmail.id, 'spam')
        )}

      {category !== 'trash' &&
        category !== 'spam' &&
        renderTooltipAction(Trash2, t('TRASH'), () =>
          moveEmailToCategory(selectedEmail.id, 'trash')
        )}

      {(category === 'trash' || category === 'spam') && (
        <>
          <EmailTooltipConfirmAction
            tooltipLabel={t('RESTORE_ITEM')}
            confirmTitle={t('RESTORE_ITEM')}
            confirmDescription={t('CONFIRM_RESTORE_SELECTED_ITEM')}
            onConfirm={() => restoreEmailsToCategory([selectedEmail.id])}
            toastDescription={t('MAIL_RESTORED')}
          >
            <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
          </EmailTooltipConfirmAction>

          <EmailTooltipConfirmAction
            tooltipLabel={t('DELETE_ITEM_PERMANENTLY')}
            confirmTitle={t('DELETE_ITEM_PERMANENTLY')}
            confirmDescription={t('CONFIRM_PERMANENTLY_DELETE_SELECTED_ITEM')}
            onConfirm={() => deleteEmailsPermanently([selectedEmail.id])}
            toastDescription={t('MAIL_DELETED_PERMANENTLY')}
          >
            <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
          </EmailTooltipConfirmAction>
        </>
      )}
    </div>
  );
};

const ReplyEditor: React.FC<{
  content: string;
  handleContentChange: (content: string) => void;
  handleSendEmail: (emailId: string, category: 'inbox' | 'sent', reply?: any) => void;
  onCancel: () => void;
  selectedEmail: any;
  reply?: any;
  formData?: any;
  setFormData?: (data: any) => void;
  t: any;
}> = ({
  content,
  handleContentChange,
  handleSendEmail,
  onCancel,
  selectedEmail,
  reply,
  formData,
  setFormData,
  t,
}) => (
  <EmailTextEditor
    value={content}
    onChange={handleContentChange}
    submitName={t('SEND')}
    cancelButton={t('DISCARD')}
    showIcons={true}
    formData={formData}
    setFormData={setFormData}
    onSubmit={() =>
      handleSendEmail(
        selectedEmail.id,
        (selectedEmail.sectionCategory as 'inbox' | 'sent') || 'sent',
        reply
      )
    }
    onCancel={onCancel}
  />
);

// Extracted component for main action buttons
const MainActionButtons: React.FC<{
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
  handleComposeEmailForward: () => void;
  t: any;
}> = ({ handleSetActive, handleComposeEmailForward, t }) => (
  <div className="flex gap-4 text-sm px-4 pb-8">
    <Button variant="outline" size="sm" onClick={() => handleSetActive('reply')}>
      <Reply className="h-4 w-4" />
      {t('REPLY')}
    </Button>
    <Button variant="outline" size="sm" onClick={() => handleSetActive('replyAll')}>
      <ReplyAll className="h-4 w-4" />
      {t('REPLY_ALL')}
    </Button>
    <Button variant="outline" size="sm" onClick={handleComposeEmailForward}>
      <Forward className="h-4 w-4" />
      {t('FORWARD')}
    </Button>
  </div>
);

/**
 * EmailViewGrid Component
 *
 * A comprehensive email reader interface that displays selected email content,
 * manages actions (reply, forward, delete, mark spam), and integrates labels and attachments.
 * Supports both single and multi-email interactions.
 *
 * Features:
 * - Displays email details with subject, labels, and content
 * - Handles tagging, trashing, spam marking, and restore/delete permanently actions
 * - Integrates attachments/images preview and toggleable reply editor
 * - Supports reply and forward with inline editor
 * - Responsive layout adapting to selection state
 *
 * Props (from EmailViewProps):
 * @param {Object} selectedEmail - The currently selected email object
 * @param {Object} statusLabels - A map of label configurations for email tagging
 * @param {Object} viewState - State object mapping labels to booleans
 * @param {Function} handleTagChange - Function to toggle tag state for an email
 * @param {Function} toggleEmailAttribute - Toggles an email attribute like `isStarred`
 * @param {string[]} checkedEmailIds - Array of selected email IDs for bulk actions
 * @param {Function} moveEmailToCategory - Moves an email to a new category (e.g., spam, trash)
 * @param {Function} formatDateTime - Formats timestamps
 * @param {string} activeAction - Current active action (e.g., reply, forward)
 * @param {Function} setActiveAction - Setter for active action
 * @param {Function} handleSetActive - Sets the currently active email
 * @param {Function} handleComposeEmailForward - Triggers forward action
 * @param {string} content - Current email compose content
 * @param {Function} handleContentChange - Handler for compose content changes
 * @param {Function} handleSendEmail - Sends the composed email
 * @param {boolean} isComposing - Boolean indicating if a reply/forward is being composed
 * @param {Function} addOrUpdateEmailInSent - Updates the sent folder with sent mail
 * @param {Function} handleCloseCompose - Handler for closing the compose editor
 * @param {Function} updateEmailReadStatus - Marks email read/unread
 * @param {Function} handleToggleReplyVisibility - Toggles reply section visibility
 * @param {boolean} isReplyVisible - Whether reply section is visible
 * @param {string} category - Current mailbox category (e.g., inbox, trash)
 * @param {Function} restoreEmailsToCategory - Restores email to its original category
 * @param {Function} deleteEmailsPermanently - Deletes email permanently
 * @param {string[]} expandedReplies - Array of expanded reply IDs
 * @param {Function} toggleExpand - Expands or collapses replies
 * @param {Function} onSetActiveActionFalse - Clears active action state
 * @param {Function} toggleReplyAttribute - Toggles an attribute of a reply (e.g., starred)
 * @param {Function} setIsReplySingleAction - Sets single reply action state
 * @param {Object} isReplySingleAction - State to determine reply editor visibility
 * @param {string} activeActionReply - Current active reply action
 * @param {Function} setActiveActionReply - Setter for active reply action
 * @param {Function} handleSetActiveReply - Sets the active reply
 * @param {Object} formData - Form data for email compose
 * @param {Function} setFormData - Setter for form data
 *
 * @returns {JSX.Element} A dynamic email view layout with interaction controls
 *
 * @example
 * <EmailViewGrid
 *   selectedEmail={email}
 *   statusLabels={statusMap}
 *   viewState={tagState}
 *   handleTagChange={onChangeTag}
 *   ...
 * />
 */
export function EmailViewGrid({
  selectedEmail,
  statusLabels,
  viewState,
  handleTagChange,
  toggleEmailAttribute,
  checkedEmailIds,
  moveEmailToCategory,
  formatDateTime,
  activeAction,
  setActiveAction,
  handleSetActive,
  handleComposeEmailForward,
  content,
  handleContentChange,
  handleSendEmail,
  isComposing,
  addOrUpdateEmailInSent,
  handleCloseCompose,
  updateEmailReadStatus,
  handleToggleReplyVisibility,
  isReplyVisible,
  category,
  restoreEmailsToCategory,
  deleteEmailsPermanently,
  expandedReplies,
  toggleExpand,
  onSetActiveActionFalse,
  toggleReplyAttribute,
  setIsReplySingleAction,
  isReplySingleAction,
  activeActionReply,
  setActiveActionReply,
  handleSetActiveReply,
  formData,
  setFormData,
}: Readonly<EmailViewProps>) {
  const [replyData, setReplyData] = useState<TReply | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (replyData) {
      handleComposeEmailForward(replyData);
      setReplyData(null);
    }
  }, [replyData, handleComposeEmailForward]);

  const renderEmailActionsAndEditor = (
    emailData: any,
    handleComposeEmailForwardFn: () => void,
    isMainEmail = false
  ) => (
    <div className={`${isMainEmail ? '' : 'p-2'} flex flex-col gap-6`}>
      <EmailActionsReplyPanel
        handleComposeEmailForward={handleComposeEmailForwardFn}
        selectedEmail={selectedEmail ?? undefined}
        setActiveActionReply={setActiveActionReply}
        activeActionReply={activeActionReply}
        handleSetActiveReply={handleSetActiveReply}
      />
      <ReplyEditor
        content={content}
        handleContentChange={handleContentChange}
        handleSendEmail={handleSendEmail}
        onCancel={onSetActiveActionFalse}
        selectedEmail={selectedEmail}
        reply={isMainEmail ? undefined : emailData}
        formData={formData}
        setFormData={setFormData}
        t={t}
      />
    </div>
  );

  if (!selectedEmail) {
    return (
      <div className="hidden md:flex h-[calc(100vh-130px)] w-full flex-col overflow-y-auto bg-surface">
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={empty_email} alt="emailSentIcon" />
          <h3 className="text-xl font-medium">{t('SELECT_MAIL_TO_READ')}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex h-[calc(100vh-130px)] w-full flex-col overflow-y-auto">
      {/* Header Section */}
      <div className="bg-white z-50 flex justify-between my-4 px-4 gap-4">
        <div className="flex flex-wrap items-center px-4 gap-2">
          <p className="text-high-emphasis font-semibold">{selectedEmail?.subject}</p>
          {Object.keys(viewState)
            .filter((key) => viewState[key] && statusLabels[key])
            .map((key) => {
              const { label, border, text } = statusLabels[key];
              return (
                <div
                  key={key}
                  className={`flex justify-center items-center gap-1 px-2 py-0.5 border ${border} rounded`}
                >
                  <p className={`font-semibold text-xs ${text}`}>{label}</p>
                  <X
                    className="h-3 w-3 text-medium-emphasis cursor-pointer"
                    onClick={() => handleTagChange(key, false)}
                  />
                </div>
              );
            })}
        </div>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tag className="h-5 w-5 text-medium-emphasis cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {selectedEmail.tags &&
                Object.keys(statusLabels).map((key) => (
                  <div key={key} className="flex items-center gap-2 px-4 py-2">
                    <Checkbox
                      id="select-all"
                      checked={viewState[key]}
                      onCheckedChange={(checked) => handleTagChange(key, !!checked)}
                    />
                    <Label
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {statusLabels[key].label}
                    </Label>
                  </div>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {checkedEmailIds.length === 0 && (
            <EmailActionButtons
              selectedEmail={selectedEmail}
              category={category}
              updateEmailReadStatus={updateEmailReadStatus}
              moveEmailToCategory={moveEmailToCategory}
              restoreEmailsToCategory={restoreEmailsToCategory}
              deleteEmailsPermanently={deleteEmailsPermanently}
              t={t}
            />
          )}
        </div>
      </div>

      {/* Email Content Section */}
      <div className="border-t">
        <div className="my-6 px-4 flex items-start justify-between">
          <EmailViewResponseType selectedEmail={selectedEmail} />
          <EmailSingleActions
            selectedEmail={selectedEmail}
            formatDateTime={formatDateTime}
            handleSetActiveReply={handleSetActiveReply}
            handleComposeEmailForward={handleComposeEmailForward}
            activeActionReply={activeActionReply}
            handleSetActive={handleSetActive}
            setIsReplySingleAction={
              setIsReplySingleAction ??
              (() => {
                console.warn('setIsReplySingleAction is not defined');
              })
            }
            isReplySingleAction={isReplySingleAction ?? { isReplyEditor: false, replyId: '' }}
            onToggleStar={(emailId, replyId) => {
              if (replyId) {
                toggleReplyAttribute(emailId, replyId, 'isStarred');
              } else {
                toggleEmailAttribute(emailId, 'isStarred');
              }
            }}
          />
        </div>

        <div className="mb-6 text-sm px-4">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(selectedEmail?.content ?? selectedEmail?.preview),
            }}
          />
        </div>

        {/* Reply Editor for Main Email */}
        {isReplySingleAction && isReplySingleAction.isReplyEditor && (
          <div className="px-4">
            {renderEmailActionsAndEditor(selectedEmail, handleComposeEmailForward, true)}
          </div>
        )}

        {/* Attachments Section for Main Email */}
        {((selectedEmail?.images?.length ?? 0) > 0 ||
          (selectedEmail?.attachments?.length ?? 0) > 0) && (
          <div className="px-4">
            <AttachmentDisplay
              attachments={selectedEmail?.attachments}
              images={selectedEmail?.images}
              isReplyVisible={isReplyVisible}
              handleToggleReplyVisibility={handleToggleReplyVisibility}
              t={t}
            />
          </div>
        )}

        <div className="bg-low-emphasis h-px mx-4 my-6" />

        {/* Replies Section */}
        {(selectedEmail?.reply ?? []).length > 0 && (
          <div className="px-4">
            {selectedEmail?.reply?.map((item: any, index: number) => {
              const isExpanded = expandedReplies.includes(index);

              return (
                <div key={`reply-${item.id}`}>
                  <div className="my-6 flex items-start justify-between">
                    <EmailViewResponseType selectedEmail={selectedEmail} />
                    <EmailSingleActions
                      selectedEmail={item}
                      formatDateTime={formatDateTime}
                      handleSetActiveReply={handleSetActiveReply}
                      handleComposeEmailForward={() => handleComposeEmailForward(item)}
                      activeActionReply={activeActionReply}
                      setIsReplySingleAction={setIsReplySingleAction}
                      handleSetActive={handleSetActive}
                      isReplySingleAction={
                        isReplySingleAction ?? { isReplyEditor: false, replyId: '' }
                      }
                      reply={item}
                      onToggleStar={() => {
                        toggleReplyAttribute(selectedEmail.id, item.id ?? '', 'isStarred');
                      }}
                      onReplyClick={() => {
                        setReplyData(item);
                        handleSetActive('reply');
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className={`w-full text-left cursor-pointer ${!isExpanded ? 'line-clamp-1' : ''}`}
                    onClick={() => toggleExpand(index)}
                    aria-expanded={isExpanded}
                  >
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: isExpanded ? sanitizeHTML(item.reply) : htmlToPlainText(item.reply),
                      }}
                    />
                    <div
                      className="text-sm text-medium-emphasis px-2"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(item.prevData),
                      }}
                    />
                  </button>

                  {/* Attachments for Reply */}
                  {((item?.images?.length ?? 0) > 0 || (item?.attachments?.length ?? 0) > 0) && (
                    <div className="p-4">
                      <AttachmentDisplay
                        attachments={item?.attachments}
                        images={item?.images}
                        isReplyVisible={isReplyVisible}
                        handleToggleReplyVisibility={handleToggleReplyVisibility}
                        t={t}
                      />
                    </div>
                  )}

                  {/* Reply Editor for Individual Reply */}
                  {isReplySingleAction &&
                    item.id === isReplySingleAction.replyId &&
                    renderEmailActionsAndEditor(item, () => handleComposeEmailForward(item))}

                  <div className="bg-low-emphasis h-px my-6" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      {!(activeAction.reply || activeAction.replyAll || activeAction.forward) && (
        <MainActionButtons
          handleSetActive={handleSetActive}
          handleComposeEmailForward={handleComposeEmailForward}
          t={t}
        />
      )}

      {/* Email Actions Panel */}
      {selectedEmail && (activeAction.reply || activeAction.replyAll || activeAction.forward) && (
        <div className="px-4 flex flex-col gap-6">
          <EmailActionsPanel
            handleComposeEmailForward={handleComposeEmailForward}
            selectedEmail={selectedEmail}
            setActiveAction={setActiveAction}
            activeAction={activeAction}
            handleSetActive={handleSetActive}
          />
          <ReplyEditor
            content={content}
            handleContentChange={handleContentChange}
            handleSendEmail={handleSendEmail}
            onCancel={onSetActiveActionFalse}
            selectedEmail={selectedEmail}
            t={t}
          />
        </div>
      )}

      {/* Email Compose Modal */}
      {(isComposing.isCompose || isComposing.isForward) && (
        <EmailCompose
          addOrUpdateEmailInSent={addOrUpdateEmailInSent}
          onClose={handleCloseCompose}
          selectedEmail={selectedEmail}
          isComposing={isComposing}
        />
      )}
    </div>
  );
}
