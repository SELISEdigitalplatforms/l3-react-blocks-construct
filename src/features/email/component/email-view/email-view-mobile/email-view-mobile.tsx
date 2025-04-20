import React from 'react';
import { EmailViewProps } from 'features/email/types/email.types';
import empty_email from 'assets/images/empty_email.svg';
import {
  ArchiveRestore,
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Forward,
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
}: EmailViewProps) {
  return (
    <div
      className={`flex md:hidden h-[calc(100vh-130px)] w-full flex-col overflow-y-auto ${!selectedEmail && 'bg-surface'}`}
    >
      {!selectedEmail && (
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={empty_email} alt="emailSentIcon" />
          <h3 className="text-xl font-medium">Select a mail to read</h3>
        </div>
      )}
      {selectedEmail && (
        <React.Fragment>
          <div className="flex justify-between items-center px-4 mb-4">
            <ArrowLeft className="h-5 w-5 text-medium-emphasis" onClick={onGoBack} />
            <div className="flex justify-end items-center   gap-4 min-h-[32px]">
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Bookmark
                    className={`h-5 w-5 ${selectedEmail.isImportant && 'text-secondary-400'} cursor-pointer`}
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
                    className={`h-5 w-5 ${selectedEmail?.isStarred && 'text-warning'} cursor-pointer`}
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

              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MailOpen
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setSelectedEmail(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-surface text-medium-emphasis"
                    side="top"
                    align="center"
                  >
                    <p>Close Mail</p>
                  </TooltipContent>
                </Tooltip>
                {category !== 'spam' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert
                        className="h-5 w-5 cursor-pointer"
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
                        className="h-5 w-5 cursor-pointer"
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ArchiveRestore
                          className="h-5 w-5 cursor-pointer text-medium-emphasis"
                          onClick={() => {
                            if (selectedEmail) {
                              restoreEmailsToCategory([selectedEmail.id]);
                            }
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-surface text-medium-emphasis"
                        side="top"
                        align="center"
                      >
                        <p>Restore</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="h-5 w-5 cursor-pointer text-medium-emphasis"
                          onClick={() => {
                            if (selectedEmail) {
                              deleteEmailsPermanently([selectedEmail.id]);
                            }
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-surface text-medium-emphasis"
                        side="top"
                        align="center"
                      >
                        <p>Delete permanently</p>
                      </TooltipContent>
                    </Tooltip>
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

                <div className="my-6 px-4 flex flex-col items-start ">
                  <EmailViewResponseType selectedEmail={selectedEmail} />
                  <p className="text-sm text-end  w-full text-medium-emphasis">
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
                            Download All
                          </Button>
                        </div>
                      </div>
                      {isReplyVisible && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="my-6 flex flex-col justify-start">
                    <EmailViewResponseType selectedEmail={selectedEmail} />
                    <p className="text-sm text-medium-emphasis text-end">
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

                  {selectedEmail.reply.slice(1).map((reply, index) => (
                    <div key={index + 1} className="">
                      <div>
                        <div className="my-6  flex flex-col justify-start">
                          <EmailViewResponseType selectedEmail={selectedEmail} />
                          <p className="text-sm text-medium-emphasis text-end">
                            {formatDateTime(selectedEmail?.date)}
                          </p>
                        </div>
                        <div
                          className={`line-clamp-2 text-sm`}
                          dangerouslySetInnerHTML={{
                            __html: reply,
                          }}
                        />
                      </div>
                      <div className="bg-low-emphasis h-px my-6" />
                    </div>
                  ))}
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
                Reply
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
                Reply All
              </Button>
              <Button
                className="w-full"
                variant="outline"
                size="sm"
                onClick={handleComposeEmailForward}
              >
                <Forward className="h-5 w-5" />
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
  );
}
