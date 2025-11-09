import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  History,
  Mail,
  MailOpen,
  Menu,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui-kit/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui-kit/tooltip';
import { useEmailUI } from '../../hooks/use-email-ui';
import { useEmailState } from '../../hooks/use-email-state';
import { useEmailSelection } from '../../hooks/use-email-selection';
import { EmailList } from '../../components/email-list/email-list';
import { EmailCompose } from '../../components/email-compose/email-compose';
import { EmailHeaderTool } from '../../components/email-header-tool/email-header-tool';
import { EmailSidebar } from '../../components/email-sidebar/email-sidebar';
import { TooltipConfirmAction } from '../../components/email-tooltip-confirm-action/email-tooltip-confirm-action';
import { EmailView } from '../../components/email-view/email-view';
import { useEmailCompose } from '../../hooks/use-email-compose';
import { TActiveAction } from '../../types/email.types';

/**
 * Email Component
 *
 * A comprehensive email management component for rendering and managing emails.
 * This component supports:
 * - Viewing, composing, and managing emails
 * - Filtering emails by category, search term, and tags
 * - Performing bulk actions like marking as read/unread, moving to spam/trash, and deleting
 *
 * Features:
 * - Sidebar for navigating email categories
 * - Email list with filtering and selection capabilities
 * - Email view for reading and managing individual emails
 * - Compose email functionality with support for forwarding and replying
 *
 * State:
 * - `emails`: Stores the email data categorized by type (e.g., inbox, sent, trash)
 * - `selectedEmail`: The currently selected email for viewing or managing
 * - `filteredEmails`: The list of emails filtered by the current category or search term
 * - `isComposing`: Tracks the state of the compose email modal
 * - `activeAction`: Tracks the active email action (e.g., reply, reply all, forward)
 * - `checkedEmailIds`: Tracks the IDs of selected emails for bulk actions
 * - `searchTerm`: The current search term for filtering emails
 *
 * @example
 * // Basic usage
 * <Email />
 */

export const EmailPage = () => {
  const { t } = useTranslation();
  const {
    category,
    emailId,
    navigate,
    isSearching,
    searchTerm,
    searchRef,
    isCollapsedEmailSidebar,
    setIsSearching,
    setSearchTerm,
    setIsCollapsedEmailSidebar,
    handleClearInput,
    handleEmailSelection,
    onGoBack,
    filterEmailsBySearch,
  } = useEmailUI();
  const {
    emails,
    selectedEmail,
    filteredEmails,
    setEmails,
    setSelectedEmail,
    updateEmail,
    moveEmailToCategory,
    addOrUpdateEmailInSent,
    restoreEmailsToCategory,
    deleteEmailsPermanently,
  } = useEmailState(category, emailId);
  const {
    isAllSelected,
    checkedEmailIds,
    hasUnreadSelected,
    setIsAllSelected,
    setCheckedEmailIds,
    updateReadStatus,
    resetSelection,
  } = useEmailSelection(filteredEmails, updateEmail);
  const {
    isComposing,
    activeAction,
    isReplyVisible,
    isReplySingleAction,
    setIsComposing,
    setActiveAction,
    setIsReplyVisible,
    setIsReplySingleAction,
    handleComposeEmail,
    handleComposeEmailForward,
    handleCloseCompose,
    onSetActiveActionFalse,
    handleReplyAction,
    updateReplyInEmail,
  } = useEmailCompose(setEmails, selectedEmail, setSelectedEmail);

  useEffect(() => {
    resetSelection();
  }, [category, resetSelection]);

  const toggleEmailAttribute = (emailId: string, attribute: 'isStarred') => {
    let currentEmail = filteredEmails.find((email) => email.id === emailId);

    if (!currentEmail) {
      for (const category in emails) {
        const found = emails[category]?.find((email) => email.id === emailId);
        if (found) {
          currentEmail = found;
          break;
        }
      }
    }

    if (currentEmail) {
      const newValue = !currentEmail[attribute];
      updateEmail(emailId, { [attribute]: newValue });
    }
  };

  const updateEmailReadStatus = (emailId: string, category: string, isRead: boolean) => {
    updateEmail(emailId, { isRead });
  };

  const handleSetActive = (actionType: keyof TActiveAction) => {
    handleReplyAction(actionType);
  };

  const toggleReplyAttribute = (emailId: string, replyId: string, attribute: 'isStarred') => {
    updateReplyInEmail(emailId, replyId, attribute);
  };

  return (
    <>
      {/* Grid View */}
      <div className="hidden md:block w-full">
        <EmailHeaderTool
          isCollapsedEmailSidebar={isCollapsedEmailSidebar}
          setIsCollapsedEmailSidebar={setIsCollapsedEmailSidebar}
          category={category}
          checkedEmailIds={checkedEmailIds}
          hasUnreadSelected={hasUnreadSelected}
          updateReadStatus={updateReadStatus}
          moveEmailToCategory={moveEmailToCategory}
          restoreEmailsToCategory={restoreEmailsToCategory}
          deleteEmailsPermanently={deleteEmailsPermanently}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchRef={searchRef}
          handleClearInput={handleClearInput}
        />

        <div className="">
          {/* Grid view */}
          <div className="hidden md:flex bg-white">
            <div className="flex flex-1 bg-background">
              <EmailSidebar
                emails={emails}
                setSelectedEmail={setSelectedEmail}
                handleComposeEmail={handleComposeEmail}
                handleCloseCompose={handleCloseCompose}
                isCollapsedEmailSidebar={isCollapsedEmailSidebar}
              />
            </div>

            <div className="flex w-full border-t border-Low-Emphasis">
              <div className="flex flex-1 flex-col border-x w-full border-Low-Emphasis">
                <EmailList
                  emails={filterEmailsBySearch(filteredEmails)}
                  setEmails={setEmails}
                  onSelectEmail={setSelectedEmail}
                  selectedEmail={selectedEmail}
                  category={category ?? ''}
                  setIsAllSelected={setIsAllSelected}
                  setCheckedEmailIds={setCheckedEmailIds}
                  checkedEmailIds={checkedEmailIds}
                  handleComposeEmail={handleComposeEmail}
                  handleEmailSelection={handleEmailSelection}
                />
              </div>
              <div className=" flex w-full border-x border-t border-Low-Emphasis">
                <EmailView
                  isComposing={isComposing}
                  handleCloseCompose={handleCloseCompose}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                  updateEmail={updateEmail}
                  moveEmailToCategory={moveEmailToCategory}
                  isAllSelected={isAllSelected}
                  addOrUpdateEmailInSent={addOrUpdateEmailInSent}
                  checkedEmailIds={checkedEmailIds}
                  setEmails={setEmails}
                  emails={emails}
                  handleComposeEmailForward={handleComposeEmailForward}
                  toggleEmailAttribute={toggleEmailAttribute}
                  updateEmailReadStatus={updateEmailReadStatus}
                  category={category ?? ''}
                  restoreEmailsToCategory={restoreEmailsToCategory}
                  deleteEmailsPermanently={deleteEmailsPermanently}
                  activeAction={activeAction}
                  setActiveAction={setActiveAction}
                  isReplyVisible={isReplyVisible}
                  setIsReplyVisible={setIsReplyVisible}
                  handleSetActive={handleSetActive}
                  onSetActiveActionFalse={onSetActiveActionFalse}
                  toggleReplyAttribute={toggleReplyAttribute}
                  isReplySingleAction={isReplySingleAction}
                  setIsReplySingleAction={setIsReplySingleAction}
                  setIsComposing={setIsComposing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden w-full bg-white h-full">
        {!category && (
          <>
            <div className=" p-4 md:min-w-[280px] md:max-w-[280px] ">
              <h2 className="text-2xl font-bold tracking-tight">{t('MAIL')}</h2>
            </div>

            <div className="flex flex-1 bg-background ">
              <EmailSidebar
                emails={emails}
                setSelectedEmail={setSelectedEmail}
                handleComposeEmail={handleComposeEmail}
                handleCloseCompose={handleCloseCompose}
                isCollapsedEmailSidebar={isCollapsedEmailSidebar}
              />
            </div>
          </>
        )}

        {category && (
          <>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              {checkedEmailIds.length === 0 && !selectedEmail && (
                <>
                  <div className="flex gap-3 items-center ">
                    <Menu className="h-4 w-4 cursor-pointer" onClick={() => navigate('/mail')} />
                    <div className="text-xl font-semibold">{t(category?.toUpperCase())}</div>
                  </div>
                  <div className="flex items-center justify-end gap-2 flex-1 ">
                    {isSearching ? (
                      <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <Input
                          placeholder={t('SEARCH')}
                          ref={searchRef}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 bg-surface w-full"
                        />
                        {searchTerm && (
                          <X
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 cursor-pointer"
                            onClick={() => setSearchTerm('')}
                          />
                        )}
                      </div>
                    ) : (
                      <Search
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => setIsSearching(true)}
                      />
                    )}
                  </div>
                </>
              )}

              {checkedEmailIds.length > 0 && !selectedEmail && (
                <div className="flex items-center w-full justify-between ">
                  <div className="flex items-center justify-center gap-3">
                    <ArrowLeft
                      className="h-5 w-5 text-medium-emphasis hover:text-high-emphasis cursor-pointer"
                      onClick={() => onGoBack()}
                    />
                    <p className="text-xl font-semibold text-high-emphasis">
                      {checkedEmailIds.length} {t('SELECTED')}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {hasUnreadSelected && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Mail
                            className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                            onClick={() => updateReadStatus(false)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis "
                          side="top"
                          align="center"
                        >
                          <p>{t('MARK_AS_UNREAD')}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {!hasUnreadSelected && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <MailOpen
                            className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                            onClick={() => updateReadStatus(true)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis "
                          side="top"
                          align="center"
                        >
                          <p>{t('MARK_AS_READ')}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {category !== 'spam' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TriangleAlert
                            className="h-5 w-5 cursor-pointer text-medium-emphasis"
                            onClick={() => {
                              moveEmailToCategory(checkedEmailIds, 'spam');
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis"
                          side="top"
                          align="center"
                        >
                          <p>
                            {t('SPAM')} {checkedEmailIds.length} {t('ITEMS')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {category !== 'trash' && category !== 'spam' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="h-5 w-5 cursor-pointer text-medium-emphasis"
                            onClick={() => {
                              moveEmailToCategory(checkedEmailIds, 'trash');
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis"
                          side="top"
                          align="center"
                        >
                          <p>
                            {t('TRASH')} {checkedEmailIds.length} {t('ITEMS')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {(category === 'trash' || category === 'spam') && (
                      <>
                        <TooltipConfirmAction
                          tooltipLabel={`${t('RESTORE')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                          confirmTitle={t('RESTORE_EMAILS')}
                          confirmDescription={`${t('ARE_YOU_SURE_WANT_RESTORE')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}?`}
                          onConfirm={() => restoreEmailsToCategory(checkedEmailIds)}
                          toastDescription={`${t('RESTORED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                        >
                          <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                        </TooltipConfirmAction>

                        <TooltipConfirmAction
                          tooltipLabel={`${t('DELETE')} ${checkedEmailIds.length} ${t('ITEMS_PERMANENTLY')}`}
                          confirmTitle={t('DELETE_EMAILS_PERMANENTLY')}
                          confirmDescription={`${t('ARE_YOU_SURE_WANT_DELETE_PERMANENTLY')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}? ${t('THIS_ACTION_CANNOT_BE_UNDONE')}`}
                          onConfirm={() => deleteEmailsPermanently(checkedEmailIds)}
                          toastDescription={`${t('DELETED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                        >
                          <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                        </TooltipConfirmAction>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {!selectedEmail && (
              <div className="flex flex-1 flex-col border-x w-full border-Low-Emphasis">
                <EmailList
                  emails={filterEmailsBySearch(filteredEmails)}
                  setEmails={setEmails}
                  onSelectEmail={setSelectedEmail}
                  selectedEmail={selectedEmail}
                  category={category ?? ''}
                  setIsAllSelected={setIsAllSelected}
                  setCheckedEmailIds={setCheckedEmailIds}
                  checkedEmailIds={checkedEmailIds}
                  handleComposeEmail={handleComposeEmail}
                  handleEmailSelection={handleEmailSelection}
                />
              </div>
            )}

            {selectedEmail && (
              <div className="flex w-full border-x border-Low-Emphasis">
                <EmailView
                  isComposing={isComposing}
                  handleCloseCompose={handleCloseCompose}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                  updateEmail={updateEmail}
                  moveEmailToCategory={moveEmailToCategory}
                  isAllSelected={isAllSelected}
                  addOrUpdateEmailInSent={addOrUpdateEmailInSent}
                  checkedEmailIds={checkedEmailIds}
                  setEmails={setEmails}
                  emails={emails}
                  handleComposeEmailForward={handleComposeEmailForward}
                  toggleEmailAttribute={toggleEmailAttribute}
                  updateEmailReadStatus={updateEmailReadStatus}
                  category={category ?? ''}
                  restoreEmailsToCategory={restoreEmailsToCategory}
                  deleteEmailsPermanently={deleteEmailsPermanently}
                  activeAction={activeAction}
                  setActiveAction={setActiveAction}
                  isReplyVisible={isReplyVisible}
                  setIsReplyVisible={setIsReplyVisible}
                  handleSetActive={handleSetActive}
                  onSetActiveActionFalse={onSetActiveActionFalse}
                  toggleReplyAttribute={toggleReplyAttribute}
                  isReplySingleAction={isReplySingleAction}
                  setIsReplySingleAction={setIsReplySingleAction}
                  setIsComposing={setIsComposing}
                />
              </div>
            )}
          </>
        )}
      </div>

      {(isComposing.isCompose || isComposing.isForward) && (
        <EmailCompose
          addOrUpdateEmailInSent={addOrUpdateEmailInSent}
          onClose={handleCloseCompose}
          selectedEmail={selectedEmail}
          isComposing={isComposing}
        />
      )}
    </>
  );
};
