import { Paperclip, Star, Bookmark, SquarePen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { TEmail, TIsComposing } from '../../types/email.types';
import { useState } from 'react';
import { Checkbox } from 'components/ui/checkbox';
import { parseISO, format } from 'date-fns';
import { Label } from 'components/ui/label';
import CustomPaginationEmail from 'components/blocks/custom-pagination-email/custom-pagination-email';
import { Button } from 'components/ui/button';
import { htmlToPlainText } from '../../services/email';

/**
 * EmailList component displays a list of emails with pagination, filtering options (All and Unread),
 * and allows users to select an email. It renders email data with additional information such as sender,
 * subject, preview, and metadata like attachments or starred status.
 *
 * @component
 *
 * @param {Object} props - The props for the component.
 * @param {function} props.onSelectEmail - A callback function that is triggered when an email is selected.
 * @param {TEmail | null} props.selectedEmail - The currently selected email, if any.
 *
 * @returns {JSX.Element} - The EmailList component displaying a list of emails with filtering and pagination.
 *
 * @example
 * const onSelectEmail = (email) => { console.log(email); };
 * <EmailList onSelectEmail={onSelectEmail} selectedEmail={null} />
 */

interface EmailListProps {
  onSelectEmail: (email: TEmail | null) => void;
  selectedEmail: TEmail | null;
  emails: TEmail[];
  setEmails: React.Dispatch<React.SetStateAction<Record<string, TEmail[]>>>;
  category: string;
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckedEmailIds: React.Dispatch<React.SetStateAction<string[]>>;
  checkedEmailIds: string[];
  isComposing: TIsComposing;
  handleComposeEmail: () => void;
  handleEmailSelection: (email: TEmail) => void;
}

export function EmailList({
  selectedEmail,
  emails,
  setIsAllSelected,
  setCheckedEmailIds,
  checkedEmailIds,
  handleComposeEmail,
  handleEmailSelection
}: Readonly<EmailListProps>) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmails = filter === 'unread' ? emails.filter((email) => !email.isRead) : emails;
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatReceivedDate = (dateString: string) => format(parseISO(dateString), 'dd.MM.yy');

  

  const isAllChecked =
    paginatedEmails.length > 0 &&
    paginatedEmails.every((email) => checkedEmailIds.includes(email.id));

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const newIds = paginatedEmails
        .map((email) => email.id)
        .filter((id) => !checkedEmailIds.includes(id));
      setCheckedEmailIds((prev) => [...prev, ...newIds]);
    } else {
      const paginatedIds = paginatedEmails.map((email) => email.id);
      setCheckedEmailIds((prev) => prev.filter((id) => !paginatedIds.includes(id)));
    }
    setIsAllSelected(checked);
  };

  return (
    <>
      {/* Grid view */}
      <Tabs
        defaultValue="all"
        className="hidden md:flex min-w-[307px] h-[calc(100vh-130px)] flex-col gap-3"
      >
        <div className="flex items-center  justify-between px-4 py-3 gap-4 border-b">
          <div className="flex items-center space-x-2 ">
            <Checkbox
              id="select-all"
              checked={isAllChecked}
              onCheckedChange={(checked) => handleSelectAllChange(!!checked)}
            />

            <Label className="text-sm font-medium ">Select All</Label>
          </div>
          <TabsList className="grid grid-cols-2 min-w-[124px] text-sm p-1 bg-surface">
            <TabsTrigger
              className="[&[data-state=active]]:bg-white rounded"
              value="all"
              onClick={() => setFilter('all')}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className="[&[data-state=active]]:bg-white rounded"
              value="unread"
              onClick={() => setFilter('unread')}
            >
              Unread
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter} className="flex-1 overflow-auto p-0">
          {paginatedEmails?.length > 0 ? (
            <div className="flex flex-col">
              {paginatedEmails?.map((email) => (
                <div
                  key={email.id}
                  className={`cursor-pointer p-4  transition-colors hover:bg-surface flex flex-col gap-1 ${selectedEmail?.id === email.id && 'bg-surface'} ${checkedEmailIds?.includes(email?.id) && 'bg-primary-50'} `}
                  onClick={() => handleEmailSelection(email)}
                >
                  <div className="flex flex-row gap-2 ">
                    <div className="flex space-x-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checkedEmailIds?.includes(email?.id)}
                        onCheckedChange={(checked) => {
                          setCheckedEmailIds((prev) =>
                            checked ? [...prev, email.id] : prev.filter((id) => id !== email.id)
                          );
                        }} 
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between ">
                        <h3
                          className={`text-high-emphasis ${email.isRead ? 'font-normal' : 'font-bold'}`}
                        >
                          {email?.sender ?? email?.recipient}
                        </h3>
                        <p className="text-xs text-medium-emphasis">
                          {formatReceivedDate(email.date)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${email.isRead ? 'font-normal' : 'font-bold'}`}>
                          {email.subject}
                        </p>
                        <div className="flex gap-2 items-center">
                          {(email.images.length > 0 || email.attachments?.length > 0) && (
                            <Paperclip className="h-4 w-4 text-medium-emphasis" />
                          )}
                          {email.isImportant && <Bookmark className="h-4 w-4 text-secondary-400" />}
                          {email.isStarred && <Star className="h-4 w-4 text-warning" />}
                        </div>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: htmlToPlainText(email?.preview),
                        }}
                        className="line-clamp-2 text-sm text-medium-emphasis"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-medium-emphasis">
              No data found
            </div>
          )}
        </TabsContent>

        {paginatedEmails.length > 0 && (
          <div className="flex justify-center border-t p-2">
            <CustomPaginationEmail
              totalItems={filteredEmails.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Tabs>

      {/* Mobile View */}
      <div>
        <Tabs
          defaultValue="all"
          className="flex md:hidden  min-w-[307px] h-[calc(100vh-130px)] flex-col gap-3"
        >
          <div className="flex flex-col items-center  justify-between px-4 py-3 gap-4 border-b">
            {checkedEmailIds?.length === 0 && (
              <TabsList className="grid grid-cols-2 w-full text-sm p-1 bg-surface">
                <TabsTrigger
                  className="[&[data-state=active]]:bg-white rounded"
                  value="all"
                  onClick={() => setFilter('all')}
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  className="[&[data-state=active]]:bg-white rounded"
                  value="unread"
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            )}
            {checkedEmailIds?.length > 0 && (
              <div className="flex justify-start items-start  w-full space-x-2 ">
                <Checkbox
                  id="select-all"
                  checked={isAllChecked}
                  onCheckedChange={(checked) => handleSelectAllChange(!!checked)}
                />

                <Label className="text-sm font-medium ">Select All</Label>
              </div>
            )}
          </div>

          <TabsContent value={filter} className="flex-1 overflow-hidden p-0">
            {paginatedEmails?.length > 0 ? (
              <div className="relative h-full">
                <div className="flex flex-col overflow-auto h-full">
                  {paginatedEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`cursor-pointer p-4 transition-colors  flex flex-col gap-1  ${checkedEmailIds?.includes(email.id) && 'bg-primary-50'}`}
                      onClick={() => handleEmailSelection(email)}
                    >
                      <div className="flex flex-row gap-2">
                        <div className="flex space-x-2 pt-1" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={checkedEmailIds?.includes(email.id)}
                            onCheckedChange={(checked) => {
                              setCheckedEmailIds((prev) =>
                                checked ? [...prev, email.id] : prev.filter((id) => id !== email.id)
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`text-high-emphasis ${email.isRead ? 'font-normal' : 'font-bold'}`}
                            >
                              {email?.sender ?? email?.recipient}
                            </h3>
                            <p className="text-xs text-medium-emphasis">
                              {formatReceivedDate(email.date)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={`text-sm ${email.isRead ? 'font-normal' : 'font-bold'}`}>
                              {email.subject}
                            </p>
                            <div className="flex gap-2 items-center">
                              {(email.images.length > 0 || email.attachments?.length > 0) && (
                                <Paperclip className="h-4 w-4 text-medium-emphasis" />
                              )}
                              {email.isImportant && (
                                <Bookmark className="h-4 w-4 text-secondary-400" />
                              )}
                              {email.isStarred && <Star className="h-4 w-4 text-warning" />}
                            </div>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{ __html: email?.preview }}
                            className="line-clamp-2 text-sm text-medium-emphasis"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="absolute bottom-4 right-4 p-4 shadow-lg"
                  onClick={handleComposeEmail}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-medium-emphasis">
                No data found
              </div>
            )}
          </TabsContent>

          {paginatedEmails.length > 0 && (
            <div className="flex justify-center border-t p-4">
              <CustomPaginationEmail
                totalItems={filteredEmails.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Tabs>
      </div>
    </>
  );
}
