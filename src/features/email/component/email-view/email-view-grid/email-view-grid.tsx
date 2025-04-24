import { EmailViewProps } from 'features/email/types/email.types';
import empty_email from 'assets/images/empty_email.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import {
  Bookmark,
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
  Star,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import EmailViewResponseType from '../email-view-response-type';
import { Button } from 'components/ui/button';
import EmailActionsPanel from '../email-actions-panel';
import EmailTextEditor from '../../email-ui/email-text-editor';
import { EmailCompose } from '../../email-compose/email-compose';
import { htmlToPlainText } from 'features/email/services/email';
import React from 'react';
import EmailTooltipConfirmAction from '../../email-ui/email-tooltip-confirm-action';

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
}: EmailViewProps) {
  return (
    <>
      <div
        className={`hidden md:flex h-[calc(100vh-130px)] w-full flex-col overflow-y-auto  ${!selectedEmail && 'bg-surface'}`}
      >
        {!selectedEmail && (
          <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
            <img src={empty_email} alt="emailSentIcon" />
            <h3 className="text-xl font-medium">Select a mail to read</h3>
          </div>
        )}
        {selectedEmail && (
          <React.Fragment>
            <div className="sticky top-0 bg-white z-50 flex justify-end items-center my-4 px-4 gap-4 min-h-[32px] ">
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Bookmark
                    className={`h-5 w-5 ${selectedEmail.isImportant && 'text-secondary-400'} cursor-pointer text-medium-emphasis`}
                    onClick={() => {
                      if (selectedEmail) {
                        toggleEmailAttribute(selectedEmail.id, 'isImportant');
                      }
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-surface text-medium-emphasis"
                  side="top"
                  align="center"
                >
                  <p>{selectedEmail.isImportant ? 'not important' : 'Important'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Star
                    className={`h-5 w-5 ${selectedEmail?.isStarred && 'text-warning'} cursor-pointer text-medium-emphasis`}
                    onClick={() => {
                      if (selectedEmail) {
                        toggleEmailAttribute(selectedEmail.id, 'isStarred');
                      }
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-surface text-medium-emphasis"
                  side="top"
                  align="center"
                >
                  <p>{selectedEmail.isStarred ? 'Not starred' : 'Starred'}</p>
                </TooltipContent>
              </Tooltip>
              {checkedEmailIds.length === 0 && (
                <div className="flex gap-4">
                  {selectedEmail.isRead && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MailOpen
                          className="h-5 w-5 cursor-pointer text-medium-emphasis"
                          onClick={() => updateEmailReadStatus(selectedEmail.id, category, false)}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-surface text-medium-emphasis"
                        side="top"
                        align="center"
                      >
                        <p>Mark as unread</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
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
                        <p>Spam</p>
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
                        <p>Trash</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {(category === 'trash' || category === 'spam') && (
                    <>
                      <EmailTooltipConfirmAction
                        tooltipLabel={`Restore item`}
                        confirmTitle="Restore item"
                        confirmDescription={`Are you sure you want to restore selected item?`}
                        onConfirm={() => restoreEmailsToCategory([selectedEmail.id])}
                        toastDescription={`Mail restored`}
                      >
                        <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                      </EmailTooltipConfirmAction>

                      <EmailTooltipConfirmAction
                        tooltipLabel={`Delete item permanently`}
                        confirmTitle="Delete mail Permanently"
                        confirmDescription={`Are you sure you want to permanently delete selected item? This action cannot be undone.`}
                        onConfirm={() => deleteEmailsPermanently([selectedEmail.id])}
                        toastDescription={`Mail deleted permanently`}
                      >
                        <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                      </EmailTooltipConfirmAction>
                    </>
                  )}
                </div>
              )}
            </div>

            {selectedEmail && (
              <div className="border-t">
                <div>
                  <div className="flex justify-between py-3 border-b px-4">
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

                  <div className="my-6 px-4 flex items-center justify-between">
                    <EmailViewResponseType selectedEmail={selectedEmail} />
                    <p className="text-sm text-medium-emphasis">
                      {formatDateTime(selectedEmail?.date)}
                    </p>
                  </div>

                  <div className=" mb-6 text-sm px-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedEmail?.content || selectedEmail?.preview,
                      }}
                    />
                  </div>
                  {((selectedEmail?.images?.length ?? 0) > 0 ||
                    (selectedEmail?.attachments?.length ?? 0) > 0) && (
                    <div className="px-4">
                      <div className="p-2 flex flex-col gap-3  bg-surface rounded">
                        <div className="flex justify-between">
                          <div className="flex gap-2 items-center text-medium-emphasis text-sm">
                            <Paperclip className="w-4 h-4" />
                            <p>{`${(selectedEmail?.images?.length ?? 0) + (selectedEmail?.attachments?.length ?? 0)} attachments`}</p>
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
                              Download All
                            </Button>
                          </div>
                        </div>
                        {isReplyVisible && (
                          <div className="grid grid-cols-2 gap-4">
                            {(selectedEmail?.attachments?.length ?? 0) > 0 &&
                              (selectedEmail?.attachments ?? []).map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2">
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
                              (selectedEmail?.images ?? []).map((image, index) => (
                                <div key={index} className="flex items-center gap-2">
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

                {selectedEmail && selectedEmail.reply && selectedEmail.reply.length > 0 && (
                  <div className="px-4">
                    <div className="my-6 px-4 flex items-center justify-between">
                      <EmailViewResponseType selectedEmail={selectedEmail} />
                      <p className="text-sm text-medium-emphasis">
                        {formatDateTime(selectedEmail?.date)}
                      </p>
                    </div>
                    <div
                      className={`text-sm`}
                      dangerouslySetInnerHTML={{
                        __html: selectedEmail.reply[0],
                      }}
                    />

                    <div className="bg-low-emphasis h-px my-6" />

                    {/* {selectedEmail.reply.map((reply, index) => {
                      const isExpanded = expandedReplies.includes(index);
                      return (
                        <div key={index + 1}>
                          <div className="my-6 px-4 flex items-center justify-between">
                            <EmailViewResponseType selectedEmail={selectedEmail} />
                            <p className="text-sm text-medium-emphasis">
                              {formatDateTime(selectedEmail?.date)}
                            </p>
                          </div>

                          {!isExpanded ? (
                            <div
                              className={`line-clamp-1 text-sm`}
                              dangerouslySetInnerHTML={{
                                __html: htmlToPlainText(reply),
                              }}
                            />
                          ) : (
                            <div
                              className={` text-sm`}
                              dangerouslySetInnerHTML={{
                                __html: reply,
                              }}
                            />
                          )}

                          <div className="flex justify-end">
                            <Button variant={'link'} onClick={() => toggleExpand(index)}>
                              {isExpanded ? 'Show less' : 'Show more'}
                            </Button>
                          </div>

                          <div className="bg-low-emphasis h-px my-6" />
                        </div>
                      );
                    })} */}
                    {selectedEmail &&
                      selectedEmail.reply &&
                      selectedEmail.reply.slice(1).map((reply, index) => {
                        const isExpanded = expandedReplies.includes(index);

                        return (
                          <div key={index + 1}>
                            <div className="my-6 flex flex-col ">
                              <EmailViewResponseType selectedEmail={selectedEmail} />
                              <p className="text-sm text-medium-emphasis text-end">
                                {formatDateTime(selectedEmail?.date)}
                              </p>
                            </div>

                            <div
                              className={`text-sm cursor-pointer ${!isExpanded ? 'line-clamp-1' : ''}`}
                              onClick={() => {
                                if (!isExpanded) toggleExpand(index); // Expand only on first click
                              }}
                              dangerouslySetInnerHTML={{
                                __html: isExpanded ? reply : htmlToPlainText(reply),
                              }}
                            />

                            {isExpanded && (
                              <div className="flex justify-end">
                                <Button variant="link" onClick={() => toggleExpand(index)}>
                                  Show less
                                </Button>
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
                  size="sm"
                  onClick={() => {
                    handleSetActive('reply');
                  }}
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleSetActive('replyAll');
                  }}
                >
                  <ReplyAll className="h-4 w-4" />
                  Reply All
                </Button>
                <Button variant="outline" size="sm" onClick={handleComposeEmailForward}>
                  <Forward className="h-4 w-4" />
                  Forward
                </Button>
              </div>
            )}

            {selectedEmail &&
              (activeAction.reply || activeAction.replyAll || activeAction.forward) && (
                <>
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
                        submitName="Send"
                        cancelButton="Discard"
                        showIcons={true}
                        onSubmit={() => handleSendEmail(selectedEmail.id)}
                        onCancel={() => {
                          onSetActiveActionFalse();
                        }}
                      />
                    </div>
                  </div>
                </>
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
    </>
  );
}
