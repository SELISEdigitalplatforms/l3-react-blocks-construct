import { EmailView } from 'features/email/component/email-view/email-view';
import { EmailList } from 'features/email/component/email-list/email-list';
import { EmailSidebar } from 'features/email/component/email-sidebar/email-sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { emailData } from 'features/email/services/email-data';
import { TActiveAction, TEmail, TReply } from 'features/email/types/email.types';
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
import { useTranslation } from 'react-i18next';
import { Input } from 'components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { EmailCompose } from 'features/email';
import { useDebounce } from 'features/email/services/use-debounce';
import { makeFirstLetterUpperCase } from 'features/email/services/email';

import EmailTooltipConfirmAction from 'features/email/component/email-ui/email-tooltip-confirm-action';

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
 * @returns {JSX.Element} The email management component
 *
 * @example
 * // Basic usage
 * <Email />
 */

// Helper function to update a single reply's attribute
const updateReplyAttribute = (reply: TReply, replyId: string, attribute: keyof TReply): TReply => {
  if (reply.id !== replyId) return reply;
  return { ...reply, [attribute]: !reply[attribute] };
};

// Helper function to update replies within a single email
const updateSingleEmailReplies = (
  email: TEmail,
  replyId: string,
  attribute: keyof TReply
): TEmail => {
  const updatedReplies =
    email.reply?.map((reply) => updateReplyAttribute(reply, replyId, attribute)) || [];
  return { ...email, reply: updatedReplies };
};

export function Email() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { category, emailId } = useParams<{
    category: string;
    emailId?: string;
  }>();
  const [emails, setEmails] = useState<Record<string, TEmail[]>>(
    Object.fromEntries(
      Object.entries(emailData)
        .filter(([, value]) => Array.isArray(value))
        .map(([key, value]) => [key, (value as TEmail[]).filter((email) => !email.isDeleted)])
    ) as Record<string, TEmail[]>
  );

  const [selectedEmail, setSelectedEmail] = useState<TEmail | null>(null);
  const [filteredEmails, setFilteredEmails] = useState<Array<TEmail>>([]);
  const [isComposing, setIsComposing] = useState({
    isCompose: false,
    isForward: false,
    replyData: {} as TReply | null,
  });
  const [activeAction, setActiveAction] = useState<TActiveAction>({
    reply: false,
    replyAll: false,
    forward: false,
  });
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [checkedEmailIds, setCheckedEmailIds] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [hasUnreadSelected, setHasUnreadSelected] = useState(false);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [isCollapsedEmailSidebar, setIsCollapsedEmailSidebar] = useState(false);
  const [isReplySingleAction, setIsReplySingleAction] = useState({
    isReplyEditor: false,
    replyId: '',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  const sortEmailsByTime = (emailsToSort: TEmail[]): TEmail[] => {
    return [...emailsToSort].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  useEffect(() => {
    if (category) {
      if (category === 'labels' && emailId) {
        const emailDataToSort = emails[emailId];
        setFilteredEmails(Array.isArray(emailDataToSort) ? sortEmailsByTime(emailDataToSort) : []);
      } else if (Object.hasOwn(emails, category)) {
        const emailDataToSort = emails[category];
        setFilteredEmails(Array.isArray(emailDataToSort) ? sortEmailsByTime(emailDataToSort) : []);
      } else {
        setFilteredEmails([]);
      }
      setCheckedEmailIds([]);
    }
  }, [category, emailId, emails]);

  useEffect(() => {
    if (emailId && filteredEmails.length > 0) {
      const foundEmail = filteredEmails.find((email) => email.id === emailId) || null;
      setSelectedEmail(foundEmail);
    }
  }, [emailId, filteredEmails]);

  const handleComposeEmail = () => {
    setIsComposing({
      isCompose: true,
      isForward: false,
      replyData: {} as TReply | null,
    });
    onSetActiveActionFalse();
  };
  const handleComposeEmailForward = (replyData?: TReply) => {
    setIsComposing({
      isCompose: false,
      isForward: true,
      replyData: replyData ?? ({} as TReply),
    });
    onSetActiveActionFalse();
  };
  const handleCloseCompose = () => {
    setIsComposing({
      isCompose: false,
      isForward: false,
      replyData: {} as TReply,
    });
    setIsReplySingleAction({ isReplyEditor: false, replyId: '' });
  };

  const updateEmail = (emailId: string, updates: Partial<TEmail>) => {
    setEmails((prevEmails) => {
      const updatedEmails = { ...prevEmails };

      let targetEmail: TEmail | undefined;

      for (const cat in updatedEmails) {
        const found = updatedEmails[cat]?.find((email) => email.id === emailId);
        if (found) {
          targetEmail = found;
          break;
        }
      }

      if (!targetEmail) return prevEmails;

      const updatedEmail = { ...targetEmail, ...updates };

      for (const cat in updatedEmails) {
        updatedEmails[cat] = updatedEmails[cat]?.map((email) =>
          email.id === emailId ? updatedEmail : email
        );
      }

      if (updatedEmail.isStarred) {
        if (!updatedEmails.starred?.some((email) => email.id === emailId)) {
          updatedEmails.starred = [...(updatedEmails.starred || []), updatedEmail];
        }
      } else {
        updatedEmails.starred = (updatedEmails.starred || []).filter(
          (email) => email.id !== emailId
        );
      }

      return updatedEmails;
    });

    if (selectedEmail?.id === emailId) {
      setSelectedEmail((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const moveEmailToCategory = (
    emailIds: string | string[],
    destination: 'spam' | 'trash' | 'inbox' | 'sent'
  ) => {
    const idsToMove = Array.isArray(emailIds) ? emailIds : [emailIds];

    setEmails((prevEmails) => {
      const updatedEmails: { [key: string]: TEmail[] } = {};
      const movedEmailMap: { [id: string]: TEmail } = {};

      for (const category in prevEmails) {
        const emailsInCategory = prevEmails[category] || [];
        const remainingEmails = emailsInCategory.filter((email) => {
          if (idsToMove.includes(email.id)) {
            if (!movedEmailMap[email.id]) {
              movedEmailMap[email.id] = { ...email, [destination]: true };
            }
            return false;
          }
          return true;
        });
        updatedEmails[category] = remainingEmails;
      }

      updatedEmails[destination] = [
        ...(updatedEmails[destination] || []),
        ...Object.values(movedEmailMap),
      ];

      setCheckedEmailIds([]);

      return updatedEmails;
    });

    if (selectedEmail && idsToMove.includes(selectedEmail.id)) {
      setSelectedEmail(null);
    }
  };

  const addOrUpdateEmailInSent = (newEmail: TEmail) => {
    setEmails((prevEmails) => {
      const updatedEmails = { ...prevEmails };
      const sentEmails = updatedEmails.sent || [];

      const existingIndex = sentEmails.findIndex((email) => email.id === newEmail.id);

      if (existingIndex !== -1) {
        sentEmails[existingIndex] = { ...sentEmails[existingIndex], ...newEmail };
      } else {
        sentEmails.unshift(newEmail);
      }

      updatedEmails.sent = sentEmails;
      return updatedEmails;
    });
  };

  const updateEmailsByTags = () => {
    setEmails((prevEmails) => {
      const inbox = prevEmails.inbox || [];
      return {
        ...prevEmails,
        personal: inbox.filter((email: TEmail) => email?.tags?.personal),
        work: inbox.filter((email: TEmail) => email?.tags?.work),
        payments: inbox.filter((email: TEmail) => email?.tags?.payments),
        invoices: inbox.filter((email: TEmail) => email?.tags?.invoices),
      };
    });
  };

  const toggleEmailAttribute = (emailId: string, attribute: 'isStarred') => {
    setEmails((prevEmails) => {
      const updatedEmails: Record<string, TEmail[]> = {};
      let toggledEmail: TEmail | null = null;

      for (const category in prevEmails) {
        const emailsInCategory = prevEmails[category] || [];

        updatedEmails[category] = emailsInCategory.map((email) => {
          if (email.id === emailId) {
            const updated = { ...email, [attribute]: !email[attribute] };
            toggledEmail = updated;
            return updated;
          }
          return email;
        });
      }

      if (!toggledEmail) return prevEmails;

      const targetCategory = 'starred';
      const targetList = updatedEmails[targetCategory] ?? [];

      if (toggledEmail['isStarred']) {
        if (!targetList.some((email) => email.id === emailId)) {
          updatedEmails[targetCategory] = [...targetList, toggledEmail];
        }
      } else {
        updatedEmails[targetCategory] = targetList.filter((email) => email.id !== emailId);
      }

      return updatedEmails;
    });

    if (category === 'starred' && selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    } else if (selectedEmail?.id === emailId) {
      setSelectedEmail((prev) => (prev ? { ...prev, [attribute]: !prev[attribute] } : prev));
    }
  };

  const toggleReplyAttribute = (emailId: string, replyId: string, attribute: 'isStarred') => {
    setEmails((prevEmails) => {
      const updatedEmails: Record<string, TEmail[]> = { ...prevEmails };

      for (const category in prevEmails) {
        const emailsInCategory = prevEmails[category] || [];

        updatedEmails[category] = emailsInCategory.map((email: TEmail) =>
          updateSingleEmailReplies(email, replyId, attribute)
        );
      }

      return updatedEmails;
    });
  };

  useEffect(() => {
    updateEmailsByTags();
  }, [emails.inbox]);

  useEffect(() => {
    if (!category || category === 'labels') return;

    const allEmails = emails[category] || [];
    const sortedEmails = sortEmailsByTime(allEmails);

    if (!debouncedSearch.trim()) {
      setFilteredEmails(sortedEmails);
      return;
    }

    setSelectedEmail(null);

    const lowerSearch = debouncedSearch.toLowerCase();

    const filtered = sortedEmails.filter((email) => {
      return (
        email.subject?.toLowerCase().includes(lowerSearch) ||
        email.sender?.join(' ').toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredEmails(filtered);
  }, [debouncedSearch, category, emails]);

  const onGoBack = () => {
    setCheckedEmailIds([]);
    navigate(-1);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isSearching && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearching, searchRef]);

  const updateEmailReadStatus = (emailId: string, category: string, isRead: boolean) => {
    setEmails((prevEmails) => {
      const updatedEmails = { ...prevEmails };
      if (updatedEmails[category]) {
        updatedEmails[category] = updatedEmails[category].map((email) => {
          if (email.id === emailId) {
            return { ...email, isRead: isRead };
          }
          return email;
        });
      }
      return updatedEmails;
    });

    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${emailId}`, '');
    navigate(newPath, { replace: true });

    setSelectedEmail(null);
  };

  const handleClearInput = () => {
    setSearchTerm('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  useEffect(() => {
    const allUnread = checkedEmailIds.every((id) => {
      const foundEmail = Object.values(emails)
        .flat()
        .find((email) => email.id === id);
      return foundEmail?.isRead === true;
    });

    setHasUnreadSelected(allUnread);
  }, [checkedEmailIds, emails]);

  const updateReadStatus = (status: boolean) => {
    const updatedEmails = Object.fromEntries(
      Object.entries(emails).map(([category, emailList]) => [
        category,
        emailList.map((email) =>
          checkedEmailIds.includes(email.id) ? { ...email, isRead: status } : email
        ),
      ])
    );

    setEmails(updatedEmails);
  };

  const restoreEmailsToCategory = (emailIds: string | string[]) => {
    const idsToRestore = Array.isArray(emailIds) ? emailIds : [emailIds];

    idsToRestore.forEach((id) => {
      for (const category in emails) {
        const email = emails[category]?.find((e) => e.id === id);

        if (
          email?.sectionCategory &&
          ['inbox', 'trash', 'spam', 'sent'].includes(email.sectionCategory)
        ) {
          moveEmailToCategory(id, email.sectionCategory as 'inbox' | 'trash' | 'spam' | 'sent');
          break;
        }
      }
    });

    if (emailId && idsToRestore.includes(emailId)) {
      setSelectedEmail(null);
      if (category) {
        navigate(`/mail/${category}`, { replace: true });
      }
    }
  };

  const deleteEmailsPermanently = (emailIds: string | string[]) => {
    const idsToDelete = Array.isArray(emailIds) ? emailIds : [emailIds];

    setEmails((prevEmails) => {
      const updatedEmails: Record<string, TEmail[]> = {};

      for (const category in prevEmails) {
        const updatedCategoryEmails = prevEmails[category]
          .map((email) => (idsToDelete.includes(email.id) ? { ...email, isDeleted: true } : email))
          .filter((email) => !email.isDeleted);

        updatedEmails[category] = updatedCategoryEmails;
      }

      return updatedEmails;
    });
    setCheckedEmailIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    if (selectedEmail && idsToDelete.includes(selectedEmail?.id)) {
      setSelectedEmail(null);
      if (emailId && category) {
        navigate(`/mail/${category}`, { replace: true });
      }
    }
  };

  const handleEmailSelection = (email: TEmail) => {
    setSelectedEmail(email);

    setEmails((prev) => {
      if (category && Object.hasOwn(prev, category)) {
        return {
          ...prev,
          [category]: prev[category]?.map((e) => (e.id === email.id ? { ...e, isRead: true } : e)),
        };
      }
      return prev;
    });

    onSetActiveActionFalse();
    setIsReplyVisible(false);
    setCheckedEmailIds([]);
    setIsComposing({
      isCompose: false,
      isForward: false,
      replyData: {} as TReply,
    });
    navigate(`/mail/${category}/${email.id}`);
  };

  const handleSetActive = (actionType: keyof TActiveAction) => {
    setActiveAction((prevState) => {
      const newState: TActiveAction = {
        reply: false,
        replyAll: false,
        forward: false,
      };
      newState[actionType] = !prevState[actionType];
      handleCloseCompose();
      return newState;
    });
  };

  const onSetActiveActionFalse = () => {
    setActiveAction({
      reply: false,
      replyAll: false,
      forward: false,
    });
    setIsReplySingleAction({ isReplyEditor: false, replyId: '' });
  };

  return (
    <>
      {/* Grid View */}
      <div className="hidden md:block w-full ">
        <div className="flex bg-white ">
          <div
            className={`p-4 transition-all duration-300 ${
              isCollapsedEmailSidebar
                ? 'md:min-w-[70px] md:max-w-[70px]'
                : 'md:min-w-[280px] md:max-w-[280px]'
            }

        `}
          >
            <h2 className="text-2xl font-bold tracking-tight">
              {!isCollapsedEmailSidebar && t('MAIL')}
            </h2>
          </div>
          <div className="hidden md:flex border-l justify-between w-full px-4 py-3">
            <div className="flex items-center gap-4">
              <Menu
                className="w-6 h-6 text-medium-emphasis cursor-pointer"
                onClick={() => setIsCollapsedEmailSidebar(!isCollapsedEmailSidebar)}
              />
              {makeFirstLetterUpperCase(t(category?.toUpperCase() ?? ''))}
            </div>
            <div className="flex items-center  gap-4">
              {checkedEmailIds.length > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-xs text-medium-emphasis text-center">
                    {checkedEmailIds.length} {t('SELECTED')}
                  </p>
                  <div className="h-4 w-px bg-low-emphasis" />
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
                          className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
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
                  {(category === 'trash' || category === 'spam') && (
                    <>
                      <EmailTooltipConfirmAction
                        tooltipLabel={`${t('RESTORE')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                        confirmTitle={t('RESTORE_EMAILS')}
                        confirmDescription={`${t('ARE_YOU_SURE_WANT_RESTORE')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}?`}
                        onConfirm={() => restoreEmailsToCategory(checkedEmailIds)}
                        toastDescription={`${t('RESTORED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                      >
                        <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                      </EmailTooltipConfirmAction>

                      <EmailTooltipConfirmAction
                        tooltipLabel={`${t('DELETE')} ${checkedEmailIds.length} ${t('ITEMS_PERMANENTLY')}`}
                        confirmTitle={t('DELETE_EMAILS_PERMANENTLY')}
                        confirmDescription={`${t('ARE_YOU_SURE_WANT_DELETE_PERMANENTLY')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}? ${t('THIS_ACTION_CANNOT_BE_UNDONE')}`}
                        onConfirm={() => deleteEmailsPermanently(checkedEmailIds)}
                        toastDescription={`${t('Deleted')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                      >
                        <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                      </EmailTooltipConfirmAction>
                    </>
                  )}
                  {category !== 'trash' && category !== 'spam' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
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
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-emphasis bg-surface" />
                <Input
                  placeholder={t('SEARCH_BY_NAME_AND_SUBJECT')}
                  ref={searchRef}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-9 bg-surface w-80"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearInput}
                    type="button"
                    aria-label={t('CLEAR_SEARCH')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-medium-emphasis p-1 rounded-sm hover:bg-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <X className="h-4 w-4 text-low-emphasis transition delay-150 hover:text-destructive" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

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
                  emails={filteredEmails}
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
                        <EmailTooltipConfirmAction
                          tooltipLabel={`${t('RESTORE')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                          confirmTitle={t('RESTORE_EMAILS')}
                          confirmDescription={`${t('ARE_YOU_SURE_WANT_RESTORE')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}?`}
                          onConfirm={() => restoreEmailsToCategory(checkedEmailIds)}
                          toastDescription={`${t('RESTORED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                        >
                          <History className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                        </EmailTooltipConfirmAction>

                        <EmailTooltipConfirmAction
                          tooltipLabel={`${t('DELETE')} ${checkedEmailIds.length} ${t('ITEMS_PERMANENTLY')}`}
                          confirmTitle={t('DELETE_EMAILS_PERMANENTLY')}
                          confirmDescription={`${t('ARE_YOU_SURE_WANT_DELETE_PERMANENTLY')} ${checkedEmailIds.length} ${t('SELECTED_ITEMS')}? ${t('THIS_ACTION_CANNOT_BE_UNDONE')}`}
                          onConfirm={() => deleteEmailsPermanently(checkedEmailIds)}
                          toastDescription={`${t('DELETED')} ${checkedEmailIds.length} ${t('ITEMS')}`}
                        >
                          <Trash2 className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis" />
                        </EmailTooltipConfirmAction>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {!selectedEmail && (
              <div className="flex flex-1 flex-col border-x w-full border-Low-Emphasis">
                <EmailList
                  emails={filteredEmails}
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
