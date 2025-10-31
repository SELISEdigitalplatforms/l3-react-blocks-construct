import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { EmailViewProps, TReply } from '@/modules/email/types/email.types';
import empty_email from '@/assets/images/empty_email.svg';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Label } from '@/components/ui-kit/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui-kit/tooltip';
import { Button } from '@/components/ui-kit/button';
import { EmailActionsPanel } from '../email-actions-panel/email-actions-panel';
import { EmailCompose } from '../email-compose/email-compose';
import { TooltipConfirmAction } from '../email-tooltip-confirm-action/email-tooltip-confirm-action';
import { EmailSingleActions } from '../email-single-action/email-single-action';
import { EmailActionsReplyPanel } from '../email-actions-reply-panel/email-actions-reply-panel';
import { sanitizeHTML } from '@/utils/sanitizer';
import { EmailViewResponseType } from '../email-view-response-type/email-view-response-type';
import { EmailTextEditor } from '../email-text-editor/email-text-editor';
import { htmlToPlainText } from '../../utils/email-utils';

/**
 * EmailViewMobile Component
 *
 * A mobile-friendly component for viewing individual emails in detail. It supports full interaction with email data,
 * including tagging, replying, forwarding, deleting, and restoring emails. The layout adapts for smaller screens.
 *
 * Features:
 * - Responsive mobile design for email view
 * - Tagging with dropdown menu
 * - Trash, Spam, Restore, and Permanent delete actions with confirmation
 * - Reply, Reply All, Forward capabilities with email editor
 * - Supports expandable threaded replies
 * - Interactive tooltips for icons
 *
 * Props:
 * @param {Email} selectedEmail - Currently selected email to be displayed
 * @param {object} statusLabels - Mapping of email status keys to their metadata (label, color, etc.)
 * @param {object} viewState - Current state of tag checkboxes
 * @param {function} handleTagChange - Updates tag checkbox states
 * @param {function} toggleEmailAttribute - Toggles email properties like 'isStarred'
 * @param {function} setSelectedEmail - Clears selected email (closes view)
 * @param {function} moveEmailToCategory - Moves email to another folder (e.g., spam, trash)
 * @param {function} formatDateTime - Utility for formatting timestamps
 * @param {string} activeAction - Currently active main email action
 * @param {function} setActiveAction - Sets active email action
 * @param {function} handleSetActive - Handles active state of email item
 * @param {function} handleComposeEmailForward - Triggers email forwarding
 * @param {string} content - Current text editor content
 * @param {function} handleContentChange - Updates text editor content
 * @param {function} handleSendEmail - Sends the composed email
 * @param {boolean} isComposing - Whether a new email is being composed
 * @param {function} addOrUpdateEmailInSent - Adds or updates email in sent folder
 * @param {function} handleCloseCompose - Closes the email composer
 * @param {boolean} isReplyVisible - Controls visibility of reply UI
 * @param {function} onGoBack - Handles back navigation (typically clears selected email)
 * @param {function} handleToggleReplyVisibility - Toggles reply UI visibility
 * @param {string} category - Current email folder (e.g., inbox, spam, trash)
 * @param {function} deleteEmailsPermanently - Deletes emails permanently
 * @param {function} restoreEmailsToCategory - Restores emails from spam/trash
 * @param {Array<string>} expandedReplies - List of expanded reply IDs
 * @param {function} toggleExpand - Toggles reply expand/collapse state
 * @param {function} onSetActiveActionFalse - Resets main action state
 * @param {function} toggleReplyAttribute - Toggles reply-level attributes
 * @param {function} setIsReplySingleAction - Sets single-reply action state
 * @param {boolean} isReplySingleAction - Whether single reply action mode is active
 * @param {string} activeActionReply - Currently active reply-level action
 * @param {function} handleSetActiveReply - Sets active reply
 * @param {function} setActiveActionReply - Updates reply-level active action
 * @param {object} formData - Form data used for composing replies or forwards
 * @param {function} setFormData - Updates form data
 *
 * @example
 * <EmailViewMobile
 *   selectedEmail={email}
 *   statusLabels={labelMap}
 *   viewState={tagState}
 *   handleTagChange={updateTagState}
 *   ...
 * />
 */

export function EmailViewMobile({
  selectedEmail,
  statusLabels,
  viewState,
  handleTagChange,
  toggleEmailAttribute,

  setSelectedEmail,
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
  isReplyVisible,
  onGoBack,
  handleToggleReplyVisibility,
  category,
  deleteEmailsPermanently,
  restoreEmailsToCategory,
  expandedReplies,
  toggleExpand,
  onSetActiveActionFalse,
  toggleReplyAttribute,
  setIsReplySingleAction,
  isReplySingleAction,
  activeActionReply,
  handleSetActiveReply,
  setActiveActionReply,
  formData,
  setFormData,
}: Readonly<EmailViewProps>) {
  const { t } = useTranslation();
  const [replyData, setReplyData] = useState<TReply | null>(null);

  useEffect(() => {
    if (replyData) {
      handleComposeEmailForward(replyData);
      setReplyData(null);
    }
  }, [replyData, handleComposeEmailForward]);

  return (
    <div
      className={`flex md:hidden h-[calc(100vh-130px)] w-full flex-col overflow-y-auto ${!selectedEmail && 'bg-surface'}`}
    >
      {!selectedEmail && (
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={empty_email} alt="emailSentIcon" />
          <h3 className="text-xl font-medium">{t('SELECT_MAIL_TO_READ')}</h3>
        </div>
      )}
      {selectedEmail && (
        <React.Fragment>
          <div className="flex justify-between items-center px-4 mb-4">
            <ArrowLeft className="h-5 w-5 text-medium-emphasis" onClick={onGoBack} />
            <div className="flex justify-end items-center gap-4 min-h-[32px]">
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
                          checked={viewState[key] || false}
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

              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MailOpen
                      className="h-5 w-5 cursor-pointer text-medium-emphasis"
                      onClick={() => setSelectedEmail(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis"
                    side="top"
                    align="center"
                  >
                    <p>{t('CLOSE_MAIL')}</p>
                  </TooltipContent>
                </Tooltip>
                {category !== 'spam' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert
                        className="h-5 w-5 cursor-pointer text-medium-emphasis"
                        onClick={() => {
                          if (selectedEmail) {
                            moveEmailToCategory(selectedEmail.id, 'spam');
                          }
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-surface text-medium-emphasis"
                      side="top"
                      align="center"
                    >
                      <p>{t('SPAM')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {category !== 'trash' && category !== 'spam' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Trash2
                        className="h-5 w-5 cursor-pointer text-medium-emphasis"
                        onClick={() => {
                          if (selectedEmail) {
                            moveEmailToCategory(selectedEmail.id, 'trash');
                          }
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-surface text-medium-emphasis"
                      side="top"
                      align="center"
                    >
                      <p>{t('TRASH')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {(category === 'trash' || category === 'spam') && (
                  <>
                    <TooltipConfirmAction
                      tooltipLabel={t('RESTORE_ITEM')}
                      confirmTitle={t('RESTORE_ITEM')}
                      confirmDescription={t('CONFIRM_RESTORE_SELECTED_ITEM')}
                      onConfirm={() => restoreEmailsToCategory([selectedEmail.id])}
                      toastDescription={t('ITEM_RESTORED_SUCCESSFULLY')}
                    >
                      <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                    </TooltipConfirmAction>
                    <TooltipConfirmAction
                      tooltipLabel={t('DELETE_ITEM_PERMANENTLY')}
                      confirmTitle={t('DELETE_ITEM_PERMANENTLY')}
                      confirmDescription={t('CONFIRM_PERMANENTLY_DELETE_SELECTED_ITEM')}
                      onConfirm={() => deleteEmailsPermanently([selectedEmail.id])}
                      toastDescription={t('ITEM_DELETED_SUCCESSFULLY')}
                    >
                      <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                    </TooltipConfirmAction>
                  </>
                )}
              </div>
            </div>
          </div>

          {selectedEmail && (
            <div className="border-t">
              <div>
                <div className="flex flex-col gap-2 justify-between py-3 border-b px-4">
                  <p className="text-high-emphasis font-semibold">{selectedEmail?.subject}</p>
                  <div className="flex gap-2">
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
                </div>

                <div className="my-6 px-4 flex flex-row items-start justify-between">
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
                    isReplySingleAction={
                      isReplySingleAction ?? { isReplyEditor: false, replyId: '' }
                    }
                    onToggleStar={(emailId, replyId) => {
                      if (replyId) {
                        toggleReplyAttribute(emailId, replyId, 'isStarred');
                      } else {
                        toggleEmailAttribute(emailId, 'isStarred');
                      }
                    }}
                  />
                </div>

                <div className=" mb-6 text-sm px-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(selectedEmail?.content ?? selectedEmail?.preview),
                    }}
                  />

                  {isReplySingleAction && isReplySingleAction.isReplyEditor && (
                    <div className=" px-4 flex flex-col gap-6">
                      <EmailActionsReplyPanel
                        handleComposeEmailForward={handleComposeEmailForward}
                        selectedEmail={selectedEmail}
                        setActiveActionReply={setActiveActionReply}
                        activeActionReply={activeActionReply}
                        handleSetActiveReply={handleSetActiveReply}
                      />
                      <div>
                        <EmailTextEditor
                          value={content}
                          onChange={handleContentChange}
                          submitName={t('SEND')}
                          cancelButton={t('DISCARD')}
                          // showIcons={true}
                          formData={formData}
                          setFormData={setFormData}
                          onSubmit={() =>
                            handleSendEmail(
                              selectedEmail.id,
                              (selectedEmail.sectionCategory as 'inbox') || 'sent'
                            )
                          }
                          onCancel={() => {
                            onSetActiveActionFalse();
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {((selectedEmail?.images?.length ?? 0) > 0 ||
                  (selectedEmail?.attachments?.length ?? 0) > 0) && (
                  <div className="px-4">
                    <div className="p-2 flex flex-col gap-3  bg-surface rounded">
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center text-medium-emphasis text-sm">
                          <Paperclip className="w-4 h-4" />
                          <p>{`${(selectedEmail?.images?.length ?? 0) + (selectedEmail?.attachments?.length ?? 0)} ${t('ATTACHMENTS')}`}</p>
                          {!isReplyVisible && (
                            <ChevronDown
                              className="h-5 w-5 cursor-pointer"
                              onClick={() => handleToggleReplyVisibility()}
                            />
                          )}
                          {isReplyVisible && (
                            <ChevronUp
                              className="h-5 w-5 cursor-pointer"
                              onClick={() => handleToggleReplyVisibility()}
                            />
                          )}
                        </div>
                        <div>
                          <Button variant={'link'}>
                            <Download className="h-5 w-5" />
                            {t('DOWNLOAD_ALL')}
                          </Button>
                        </div>
                      </div>
                      {isReplyVisible && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(selectedEmail?.attachments?.length ?? 0) > 0 &&
                            (selectedEmail?.attachments ?? []).map((attachment) => (
                              <div key={attachment} className="flex items-center gap-2">
                                <div className="bg-white p-2 rounded">
                                  <FileText className="w-10 h-10 text-secondary-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm  text-high-emphasis">{attachment}</p>
                                  <p className="text-[10px] text-medium-emphasis">{`600.00 KB`}</p>
                                </div>
                              </div>
                            ))}
                          {(selectedEmail?.images?.length ?? 0) > 0 &&
                            (selectedEmail?.images ?? []).map((image) => (
                              <div key={image} className="flex items-center gap-2">
                                <div className="bg-white p-2 rounded">
                                  <Image className="w-10 h-10 text-secondary-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm  text-high-emphasis">{image}</p>
                                  <p className="text-[10px] text-medium-emphasis">{`600.00 KB`}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-low-emphasis h-px mx-4 my-6" />
              </div>

              {(selectedEmail?.reply ?? []).length > 0 && (
                <div className="px-4">
                  {selectedEmail?.reply?.map((item, index) => {
                    const isExpanded = expandedReplies.includes(index);

                    return (
                      <div key={`reply-${index + 1}`}>
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
                          onClick={() => {
                            toggleExpand(index);
                          }}
                          aria-expanded={isExpanded}
                        >
                          <div
                            className="text-sm "
                            dangerouslySetInnerHTML={{
                              __html: isExpanded
                                ? sanitizeHTML(item.reply)
                                : htmlToPlainText(item.reply),
                            }}
                          />
                          <div
                            className={`text-sm text-medium-emphasis  px-2`}
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTML(item.prevData),
                            }}
                          />
                        </button>

                        {((item?.images?.length ?? 0) > 0 ||
                          (item?.attachments?.length ?? 0) > 0) && (
                          <div className="p-4">
                            <div className="p-2 flex flex-col gap-3  bg-surface rounded">
                              <div className="flex justify-between">
                                <div className="flex gap-2 items-center text-medium-emphasis text-sm">
                                  <Paperclip className="w-4 h-4" />
                                  <p>{`${(item?.images?.length ?? 0) + (item?.attachments?.length ?? 0)} ${t('ATTACHMENTS')}`}</p>
                                  {!isReplyVisible && (
                                    <ChevronDown
                                      className="h-4 w-4 cursor-pointer"
                                      onClick={() => handleToggleReplyVisibility()}
                                    />
                                  )}
                                  {isReplyVisible && (
                                    <ChevronUp
                                      className="h-4 w-4 cursor-pointer"
                                      onClick={() => handleToggleReplyVisibility()}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Button variant={'link'}>
                                    <Download className="h-4 w-4" />
                                    {t('DOWNLOAD_ALL')}
                                  </Button>
                                </div>
                              </div>
                              {isReplyVisible && (
                                <div className="grid grid-cols-2 gap-4">
                                  {(item?.attachments ?? []).map((attachment) => (
                                    <div key={attachment} className="flex items-center gap-2">
                                      <div className="bg-white p-2 rounded">
                                        <FileText className="w-10 h-10 text-secondary-400" />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <p className="text-sm  text-high-emphasis">{attachment}</p>
                                        <p className="text-[10px] text-medium-emphasis">{`600.00 KB`}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {(item?.images ?? []).map((image) => (
                                    <div key={image} className="flex items-center gap-2">
                                      <div className="bg-white p-2 rounded">
                                        <Image className="w-10 h-10 text-secondary-400" />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <p className="text-sm  text-high-emphasis">{image}</p>
                                        <p className="text-[10px] text-medium-emphasis">{`600.00 KB`}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {isReplySingleAction && item.id === isReplySingleAction.replyId && (
                          <div className=" p-4 flex flex-col gap-6">
                            <EmailActionsReplyPanel
                              handleComposeEmailForward={handleComposeEmailForward}
                              selectedEmail={selectedEmail}
                              setActiveActionReply={setActiveActionReply}
                              activeActionReply={activeActionReply}
                              handleSetActiveReply={handleSetActiveReply}
                            />

                            <div>
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
                                    (selectedEmail.sectionCategory as 'inbox') || 'sent',
                                    item
                                  )
                                }
                                onCancel={() => {
                                  onSetActiveActionFalse();
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-low-emphasis h-px my-6" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {!(activeAction.reply || activeAction.replyAll || activeAction.forward) && (
            <div className="flex gap-4 text-sm  px-4 pb-8">
              <Button
                variant="outline"
                className=" w-full"
                size="sm"
                onClick={() => {
                  handleSetActive('reply');
                }}
              >
                <Reply className="h-5 w-5" />
                {t('REPLY')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  handleSetActive('replyAll');
                }}
              >
                <ReplyAll className="h-5 w-5" />
                {t('REPLY_ALL')}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                size="sm"
                onClick={() => handleComposeEmailForward()}
              >
                <Forward className="h-5 w-5" />
                {t('FORWARD')}
              </Button>
            </div>
          )}

          {selectedEmail &&
            (activeAction.reply || activeAction.replyAll || activeAction.forward) && (
              <div className="px-4 flex flex-col gap-6">
                <EmailActionsPanel
                  handleComposeEmailForward={handleComposeEmailForward}
                  selectedEmail={selectedEmail}
                  setActiveAction={setActiveAction}
                  activeAction={activeAction}
                  handleSetActive={handleSetActive}
                />

                <div>
                  <EmailTextEditor
                    value={content}
                    onChange={handleContentChange}
                    submitName={t('SEND')}
                    cancelButton={t('DISCARD')}
                    showIcons={true}
                    onSubmit={() =>
                      handleSendEmail(
                        selectedEmail.id,
                        (selectedEmail.sectionCategory as 'inbox') || 'sent'
                      )
                    }
                    onCancel={() => {
                      onSetActiveActionFalse();
                    }}
                  />
                </div>
              </div>
            )}
        </React.Fragment>
      )}
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
