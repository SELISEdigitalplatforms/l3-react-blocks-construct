import { EmailView } from 'features/email/component/email-view/email-view';
import { EmailList } from 'features/email/component/email-list/email-list';
import { EmailSidebar } from 'features/email/component/email-sidebar/email-sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { emailData } from 'features/email/services/email-data';
import { TEmail } from 'features/email/types/email.types';
import {
  ArchiveRestore,
  ArrowLeft,
  Mail,
  MailOpen,
  Menu,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Input } from 'components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { EmailCompose } from 'features/email';
import { useDebounce } from 'features/email/services/use-debounce';
import { makeFirstLetterUpperCase } from 'features/email/services/email';

export function Email() {
  const navigate = useNavigate();
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
  });
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [checkedEmailIds, setCheckedEmailIds] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [hasUnreadSelected, setHasUnreadSelected] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (category) {
      if (category === 'labels' && emailId) {
        const emailData = emails[emailId as keyof typeof emails];
        setFilteredEmails(Array.isArray(emailData) ? emailData : []);
      } else if (Object.prototype.hasOwnProperty.call(emails, category)) {
        const emailData = emails[category as keyof typeof emails];
        setFilteredEmails(Array.isArray(emailData) ? emailData : []);
      } else {
        setFilteredEmails([]);
      }
    }
  }, [category, emailId, emails]);

  useEffect(() => {
    if (emailId && filteredEmails.length > 0) {
      const foundEmail = filteredEmails.find((email) => email.id === emailId) || null;
      setSelectedEmail(foundEmail);
    }
  }, [emailId, filteredEmails]);

  const handleComposeEmail = () => setIsComposing({ isCompose: true, isForward: false });
  const handleComposeEmailForward = () => setIsComposing({ isCompose: false, isForward: true });
  const handleCloseCompose = () => setIsComposing({ isCompose: false, isForward: false });

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

      if (updatedEmail.isImportant) {
        if (!updatedEmails.important?.some((email) => email.id === emailId)) {
          updatedEmails.important = [...(updatedEmails.important || []), updatedEmail];
        }
      } else {
        updatedEmails.important = (updatedEmails.important || []).filter(
          (email) => email.id !== emailId
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

      if (updatedEmail.isImportant) {
        if (!updatedEmails.isImportant?.some((email) => email.id === emailId)) {
          updatedEmails.isImportant = [...(updatedEmails.isImportant || []), updatedEmail];
        }
      } else {
        updatedEmails.isImportant = (updatedEmails.isImportant || []).filter(
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

  const toggleEmailAttribute = (emailId: string, attribute: 'isStarred' | 'isImportant') => {
    setEmails((prevEmails) => {
      const updatedEmails: { [key: string]: TEmail[] } = {};
      let toggledEmail: TEmail | null = null;
      let currentValue: boolean | undefined;

      for (const category in prevEmails) {
        const emailsInCategory = prevEmails[category] || [];

        updatedEmails[category] = emailsInCategory.map((email) => {
          if (email.id === emailId) {
            currentValue = email[attribute];
            const updated = { ...email, [attribute]: !currentValue };
            toggledEmail = updated;
            return updated;
          }
          return email;
        });
      }

      if (!toggledEmail) return prevEmails;

      const targetCategory = attribute === 'isStarred' ? 'starred' : 'important';
      const targetList = updatedEmails[targetCategory] || [];

      const alreadyInCategory = targetList.some((email) => email.id === emailId);

      if (!currentValue && !alreadyInCategory) {
        updatedEmails[targetCategory] = [...targetList, toggledEmail];
      } else if (currentValue && alreadyInCategory) {
        updatedEmails[targetCategory] = targetList.filter((email) => email.id !== emailId);
      }

      return updatedEmails;
    });

    if (category && ['starred', 'important'].includes(category) && selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    } else {
      if (selectedEmail?.id === emailId) {
        setSelectedEmail((prev) => (prev ? { ...prev, [attribute]: !prev[attribute] } : prev));
      }
    }
  };

  useEffect(() => {
    updateEmailsByTags();
  }, [emails.inbox]);

  useEffect(() => {
    if (!category || category === 'labels') return;

    const allEmails = emails[category] || [];

    if (!debouncedSearch.trim()) {
      setFilteredEmails(allEmails);

      return;
    }

    setSelectedEmail(null);

    const lowerSearch = debouncedSearch.toLowerCase();

    const filtered = allEmails.filter((email) => {
      return (
        email.subject?.toLowerCase().includes(lowerSearch) ||
        email.sender?.toLowerCase().includes(lowerSearch)
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

        if (email && email.sectionCategory) {
          if (['inbox', 'trash', 'spam', 'sent'].includes(email.sectionCategory)) {
            moveEmailToCategory(id, email.sectionCategory as 'inbox' | 'trash' | 'spam' | 'sent');
          }
          break;
        }
      }
    });
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
    if (selectedEmail && idsToDelete.includes(selectedEmail.id)) {
      setSelectedEmail(null);
    }
  };

  return (
    <>
      {/* Grid View */}
      <div className="hidden md:block w-full ">
        <div className="flex bg-white ">
          <div className=" p-4 md:min-w-[280px] md:max-w-[280px] ">
            <h2 className="text-2xl font-bold tracking-tight">Mail</h2>
          </div>
          <div className="hidden md:flex   border-l justify-between w-full  px-4 py-3 border-b border-Low-Emphasis">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-medium-emphasis" />
              {makeFirstLetterUpperCase(category || '')}
            </div>
            <div className="flex items-center  gap-4">
              {checkedEmailIds.length > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-xs text-medium-emphasis text-center">
                    {checkedEmailIds.length} selected
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
                        <p>Mark as unread</p>
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
                        <p>Mark as read</p>
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
                        <p>Spam {checkedEmailIds.length} items</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {(category === 'trash' || category === 'spam') && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ArchiveRestore
                            className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                            onClick={() => restoreEmailsToCategory(checkedEmailIds)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis"
                          side="top"
                          align="center"
                        >
                          <p>Restore {checkedEmailIds.length} items</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                            onClick={() => {
                              deleteEmailsPermanently(checkedEmailIds);
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-surface text-medium-emphasis"
                          side="top"
                          align="center"
                        >
                          <p>Delete {checkedEmailIds.length} items Permanently</p>
                        </TooltipContent>
                      </Tooltip>
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
                        <p>Trash {checkedEmailIds.length} items</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-emphasis bg-surface" />
                <Input
                  placeholder="Search by name and subject"
                  ref={searchRef}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-9 bg-surface w-80"
                />
                {searchTerm && (
                  <div
                    onClick={handleClearInput}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-medium-emphasis cursor-pointer focus:outline-none"
                  >
                    <X className="h-4 w-4 text-low-emphasis transition delay-150 hover:text-destructive" />
                  </div>
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
                isComposing={isComposing}
                handleComposeEmail={handleComposeEmail}
                handleCloseCompose={handleCloseCompose}
              />
            </div>

            <div className="flex w-full">
              <div className="flex flex-1 flex-col border-x w-full border-Low-Emphasis">
                <EmailList
                  emails={filteredEmails}
                  setEmails={setEmails}
                  onSelectEmail={setSelectedEmail}
                  selectedEmail={selectedEmail}
                  category={category || ''}
                  setIsAllSelected={setIsAllSelected}
                  setCheckedEmailIds={setCheckedEmailIds}
                  checkedEmailIds={checkedEmailIds}
                  isComposing={isComposing}
                  handleComposeEmail={handleComposeEmail}
                />
              </div>
              <div className=" flex w-full border-x border-Low-Emphasis">
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
                  category={category || ''}
                  restoreEmailsToCategory={restoreEmailsToCategory}
                  deleteEmailsPermanently={deleteEmailsPermanently}
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
              <h2 className="text-2xl font-bold tracking-tight">Mail</h2>
            </div>

            <div className="flex flex-1 bg-background ">
              <EmailSidebar
                emails={emails}
                setSelectedEmail={setSelectedEmail}
                isComposing={isComposing}
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
                    <Menu className="h-4 w-4 cursor-pointer" onClick={() => onGoBack()} />
                    <div className="text-xl font-semibold">{category}</div>
                  </div>
                  <div className="flex items-center justify-end gap-2 flex-1 ">
                    {isSearching ? (
                      <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <Input
                          placeholder="Search"
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
                      {checkedEmailIds.length} selected
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
                          <p>Mark as unread</p>
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
                          <p>Mark as read</p>
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
                          <p>Spam {checkedEmailIds.length} items</p>
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
                          <p>Trash All</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {(category === 'trash' || category === 'spam') && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ArchiveRestore
                              className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                              onClick={() => restoreEmailsToCategory(checkedEmailIds)}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-surface text-medium-emphasis"
                            side="top"
                            align="center"
                          >
                            <p>Restore {checkedEmailIds.length} items</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2
                              className="h-5 w-5 cursor-pointer text-medium-emphasis hover:text-high-emphasis"
                              onClick={() => {
                                deleteEmailsPermanently(checkedEmailIds);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-surface text-medium-emphasis"
                            side="top"
                            align="center"
                          >
                            <p>Delete {checkedEmailIds.length} items Permanently</p>
                          </TooltipContent>
                        </Tooltip>
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
                  category={category || ''}
                  setIsAllSelected={setIsAllSelected}
                  setCheckedEmailIds={setCheckedEmailIds}
                  checkedEmailIds={checkedEmailIds}
                  isComposing={isComposing}
                  handleComposeEmail={handleComposeEmail}
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
                  category={category || ''}
                  restoreEmailsToCategory={restoreEmailsToCategory}
                  deleteEmailsPermanently={deleteEmailsPermanently}
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
