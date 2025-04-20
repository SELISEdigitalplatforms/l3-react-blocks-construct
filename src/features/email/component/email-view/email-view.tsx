import React, { useState, useEffect } from 'react';
import {
  TActiveAction,
  TEmail,
  TEmailData,
  TIsComposing,
  TViewState,
} from '../../types/email.types';
import { useNavigate } from 'react-router-dom';
import { EmailViewGrid } from './email-view-grid/email-view-grid';
import { EmailViewMobile } from './email-view-mobile/email-view-mobile';
import { format, parseISO } from 'date-fns';

/**
 * EmailView component displays the content of a selected email, allows for viewing and replying to emails,
 * and provides options for email status, such as marking as unread, spam, or moving to trash.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {TEmail | null} props.selectedEmail - The selected email object that contains email details like subject, content, date, etc.
 * @param {boolean} props.isComposing - A flag indicating whether the user is composing a new email.
 * @param {Function} props.handleCloseCompose - A function to close the email composition window.
 *
 * @returns {JSX.Element} - The EmailView component displaying the selected email, its content, and options for replying or composing.
 *
 * @example
 * return (
 *   <EmailView
 *     selectedEmail={selectedEmail}
 *     isComposing={isComposing}
 *     handleCloseCompose={handleCloseCompose}
 *   />
 * )
 */

interface EmailViewProps {
  selectedEmail: TEmail | null;
  isComposing: TIsComposing;
  handleCloseCompose: () => void;
  updateEmail: (emailId: string, updates: Partial<TEmail>) => void;
  moveEmailToCategory: (emailId: string, destination: 'spam' | 'trash') => void;
  setSelectedEmail: (email: TEmail | null) => void;
  isAllSelected: boolean;
  addOrUpdateEmailInSent: (email: TEmail) => void;
  checkedEmailIds: string[];
  emails: Partial<TEmailData>;
  setEmails: React.Dispatch<React.SetStateAction<Record<string, TEmail[]>>>;
  handleComposeEmailForward: () => void;
  toggleEmailAttribute: (emailId: string, destination: 'isStarred' | 'isImportant') => void;
  updateEmailReadStatus: (emailId: string, category: string, isRead: boolean) => void;
  category: string;
  deleteEmailsPermanently: (emailIds: string[]) => void;
  restoreEmailsToCategory: (emailIds: string[]) => void;
}

const statusLabels: Record<string, { label: string; border: string; text: string }> = {
  personal: { label: 'Personal', border: 'border-purple-500', text: 'text-purple-500' },
  work: { label: 'Work', border: 'border-secondary-400', text: 'text-secondary-400' },
  payments: { label: 'Payments', border: 'border-green-500', text: 'text-green-500' },
  invoices: { label: 'Invoices', border: 'border-blue-500', text: 'text-blue-500' },
};

export function EmailView({
  selectedEmail,
  isComposing,
  handleCloseCompose,
  updateEmail,
  moveEmailToCategory,
  setSelectedEmail,
  addOrUpdateEmailInSent,
  checkedEmailIds,
  emails,
  setEmails,
  handleComposeEmailForward,
  toggleEmailAttribute,
  updateEmailReadStatus,
  category,
  restoreEmailsToCategory,
  deleteEmailsPermanently,
}: Readonly<EmailViewProps>) {
  const [activeAction, setActiveAction] = useState<TActiveAction>({
    reply: false,
    replyAll: false,
    forward: false,
  });
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<TViewState>({});

  const [content, setContent] = useState('');
  const [isReplyVisible, setIsReplyVisible] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  function formatDateTime(dateString: string) {
    const formattedDate = format(parseISO(dateString), 'EEE, dd.MM.yyyy, HH:mm');
    return formattedDate;
  }

  useEffect(() => {
    if (selectedEmail && selectedEmail?.tags) {
      setViewState((selectedEmail.tags as TViewState) || {});
    } else {
      setViewState({});
    }
  }, [selectedEmail]);

  const handleTagChange = (tag: string, checked: boolean) => {
    setViewState((prev) => ({
      ...prev,
      [tag]: checked,
    }));

    if (selectedEmail) {
      updateEmail(selectedEmail.id, {
        tags: { ...selectedEmail.tags, [tag]: checked },
      });
    }
  };

  const handleSetActive = (actionType: keyof TActiveAction) => {
    setActiveAction((prevState) => {
      const newState: TActiveAction = {
        reply: false,
        replyAll: false,
        forward: false,
      };
      newState[actionType] = !prevState[actionType];
      return newState;
    });
  };

  const handleSendEmail = (emailId: string) => {
    if (activeAction.reply || activeAction.replyAll) {
      const email = (emails.inbox ?? []).find((email) => email.id === emailId);

      if (!email) {
        console.warn(`Email with id '${emailId}' not found.`);
        return;
      }

      const updatedReply = [...(email.reply ?? []), content];

      const updatedInbox = (emails.inbox ?? []).map((email) => {
        if (email.id === emailId) {
          return {
            ...email,
            reply: updatedReply,
          };
        }
        return email;
      });

      setEmails((prev) => ({
        ...prev,
        inbox: updatedInbox,
      }));

      setSelectedEmail({
        ...email,
        reply: updatedReply,
      });
      setContent('');

      setActiveAction({ reply: false, replyAll: false, forward: false });
    }
  };

  const onGoBack = () => {
    setSelectedEmail(null);
    navigate(-1);
  };

  const handleToggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  return (
    <>
      <EmailViewGrid
        selectedEmail={selectedEmail}
        statusLabels={statusLabels}
        viewState={viewState}
        handleTagChange={handleTagChange}
        toggleEmailAttribute={toggleEmailAttribute}
        checkedEmailIds={checkedEmailIds}
        setSelectedEmail={setSelectedEmail}
        formatDateTime={formatDateTime}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        handleSetActive={handleSetActive}
        handleComposeEmailForward={handleComposeEmailForward}
        content={content}
        handleContentChange={handleContentChange}
        handleSendEmail={handleSendEmail}
        isComposing={isComposing}
        addOrUpdateEmailInSent={addOrUpdateEmailInSent}
        moveEmailToCategory={moveEmailToCategory}
        handleCloseCompose={handleCloseCompose}
        updateEmailReadStatus={updateEmailReadStatus}
        category={category}
        handleToggleReplyVisibility={handleToggleReplyVisibility}
        isReplyVisible={isReplyVisible}
        restoreEmailsToCategory={restoreEmailsToCategory}
        deleteEmailsPermanently={deleteEmailsPermanently}
      />

      <EmailViewMobile
        selectedEmail={selectedEmail}
        statusLabels={statusLabels}
        viewState={viewState}
        checkedEmailIds={checkedEmailIds}
        handleTagChange={handleTagChange}
        toggleEmailAttribute={toggleEmailAttribute}
        setSelectedEmail={setSelectedEmail}
        formatDateTime={formatDateTime}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        handleSetActive={handleSetActive}
        handleComposeEmailForward={handleComposeEmailForward}
        content={content}
        category={category}
        handleContentChange={handleContentChange}
        handleSendEmail={handleSendEmail}
        isComposing={isComposing}
        addOrUpdateEmailInSent={addOrUpdateEmailInSent}
        moveEmailToCategory={moveEmailToCategory}
        handleCloseCompose={handleCloseCompose}
        updateEmailReadStatus={updateEmailReadStatus}
        handleToggleReplyVisibility={handleToggleReplyVisibility}
        isReplyVisible={isReplyVisible}
        onGoBack={onGoBack}
        restoreEmailsToCategory={restoreEmailsToCategory}
        deleteEmailsPermanently={deleteEmailsPermanently}
      />
    </>
  );
}
