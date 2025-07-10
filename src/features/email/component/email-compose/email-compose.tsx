import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from 'hooks/use-toast';
import { EmailComposeHeader } from './email-compose-header';
import { EmailInput } from '../email-ui/email-input';
import EmailTextEditor from '../email-ui/email-text-editor';
import { TEmail, TFormData, TFormProps, TIsComposing } from '../../types/email.types';
import { EmailTagInput } from '../email-ui/email-tag-input';

/**
 * EmailCompose Component
 *
 * A reusable component for composing and sending emails.
 * This component supports:
 * - Minimizing, maximizing, and closing the email compose modal
 * - Adding recipients (To, Cc, Bcc) and attachments
 * - Writing email content with a rich text editor
 * - Sending emails with validation
 *
 * Features:
 * - Dynamic state management for To, Cc, Bcc, and email content
 * - Supports forwarding and replying to emails
 * - Provides a responsive UI for both desktop and mobile views
 *
 * Props:
 * @param {() => void} onClose - Callback triggered when the email compose modal is closed
 * @param {(email: TEmail) => void} addOrUpdateEmailInSent - Callback to add or update the email in the sent folder
 * @param {TEmail | null} selectedEmail - The currently selected email for forwarding or replying
 * @param {TIsComposing} isComposing - State indicating whether the email is being composed or forwarded
 *
 * @returns {JSX.Element} The email compose component
 *
 * @example
 * // Basic usage
 * <EmailCompose
 *   onClose={() => console.log('Closed')}
 *   addOrUpdateEmailInSent={(email) => console.log('Email sent:', email)}
 *   selectedEmail={null}
 *   isComposing={{ isCompose: true, isForward: false }}
 * />
 */

interface EmailComposeProps {
  onClose: () => void;
  addOrUpdateEmailInSent: (email: TEmail) => void;
  selectedEmail: TEmail | null;
  isComposing: TIsComposing;
}

export function EmailCompose({
  onClose,
  addOrUpdateEmailInSent,
  selectedEmail,
  isComposing,
}: Readonly<EmailComposeProps>) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [toTags, setToTags] = useState<string[]>([]);
  const [ccTags, setCcTags] = useState<string[]>([]);
  const [bccTags, setBccTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<TFormProps>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    images: [],
    attachments: [],
  });

  const [content, setContent] = useState('');

  const formatRecipients = (recipients: string | string[] | undefined): string[] | undefined => {
    if (!recipients) return undefined;
    if (Array.isArray(recipients)) return recipients;
    return [recipients];
  };

  useEffect(() => {
    if (isComposing.isForward && selectedEmail?.subject !== undefined) {
      setFormData((prev) => ({
        ...prev,
        subject: 'fw: ' + selectedEmail.subject,
        images: selectedEmail.images || [],
        attachments: selectedEmail.attachments || [],
        cc: formatRecipients(selectedEmail.cc),
        bcc: formatRecipients(selectedEmail.bcc),
      }));

      setContent(
        `<div className="bg-low-emphasis "></div><p>from: ${selectedEmail.sender || selectedEmail.preview} &lt;${selectedEmail.email}&gt;</p><p>date: ${selectedEmail.date}</p><p>subject: ${selectedEmail.subject}</p><p>to: me &lt;demo@blocks.construct&gt;</p><p>${selectedEmail.content ?? selectedEmail.preview}</p>${
          isComposing?.replyData && Object.keys(isComposing.replyData).length > 0
            ? `${isComposing.replyData.prevData ?? ''} ${isComposing.replyData.reply ?? ''}`
            : ''
        }`
      );
    }
  }, [isComposing, selectedEmail]);

  useEffect(() => {
    if (isComposing.isCompose) {
      setFormData({
        to: [],
        cc: [],
        bcc: [],
        subject: '',
        images: [],
        attachments: [],
      });
      setContent('');
    }
  }, [isComposing.isCompose]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setIsMaximized(!isMaximized);
  };

  const handleSendEmail = () => {
    const emailData = {
      id: Date.now().toString(),
      sender: [toTags[0]],
      cc: ccTags.join(', '),
      bcc: bccTags.join(', '),
      subject: formData.subject || '',
      content: content.trim(),
      preview: '',
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      tags: {
        important: false,
        work: false,
        personal: false,
        spam: false,
      },
      trash: false,
      spam: false,
      isImportant: false,
      images: formData.images,
      attachments: formData.attachments,
      email: 'demo@blocks.construct',
      sectionCategory: 'sent',
      isDeleted: false,
    };

    if (toTags.length === 0 || !emailData.subject.trim()) {
      toast({
        variant: 'destructive',
        title: t('NO_RECIPIENT'),
        description: t('PLEASE_SPECIFY_ONE_RECIPIENT'),
      });
      return;
    }

    addOrUpdateEmailInSent(emailData);
    onClose();
    toast({
      variant: 'success',
      title: t('EMAIL_SENT'),
      description: t('EMAIL_SENT_SUCCESSFULLY'),
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-80 shadow-lg border border-low-emphasis rounded-t overflow-hidden z-50">
        <EmailComposeHeader
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
        />
      </div>
    );
  }

  return (
    <>
      {/* Grid View */}
      <div
        className={`hidden md:flex fixed ${
          isMaximized
            ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] overflow-y-auto'
            : 'bottom-0 right-4 w-[560px] min-h-[480px] max-h-[90vh] scroll-auto'
        } border shadow-md rounded-t overflow-hidden z-50 flex flex-col bg-white`}
      >
        <EmailComposeHeader
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
        />
        <div className="flex flex-col px-4 pt-4 gap-4 flex-1 overflow-auto">
          <div className="relative">
            <EmailTagInput
              value={toTags}
              type="email"
              onChange={setToTags}
              placeholder={t('MAIL_TO')}
            />
            <button
              type="button"
              className="absolute right-12 bottom-2 -translate-y-1/2 text-primary-400 hover:underline"
              onClick={() => setShowCc(!showCc)}
            >
              Cc
            </button>
            <button
              type="button"
              className="absolute right-2 bottom-2 -translate-y-1/2 text-primary-400 hover:underline"
              onClick={() => setShowBcc(!showBcc)}
            >
              Bcc
            </button>
          </div>

          {showCc && (
            <EmailTagInput type="email" value={ccTags} onChange={setCcTags} placeholder="Cc" />
          )}
          {showBcc && (
            <EmailTagInput type="email" value={bccTags} onChange={setBccTags} placeholder="Bcc" />
          )}
          <EmailInput
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            type="text"
            placeholder={t('SUBJECT')}
          />

          <div className="flex flex-col flex-1">
            <EmailTextEditor
              value={content}
              onChange={handleContentChange}
              onSubmit={handleSendEmail}
              onCancel={onClose}
              submitName={t('SEND')}
              cancelButton={t('DISCARD')}
              formData={formData}
              setFormData={
                setFormData as React.Dispatch<React.SetStateAction<TFormProps | TFormData>>
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className={`absolute inset-0 top-16 flex flex-col md:hidden z-10 bg-white`}>
        <div className="px-4">
          <ArrowLeft className="h-4 w-4" onClick={() => onClose()} />
        </div>
        <EmailComposeHeader
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
        />
        <div className="flex flex-col p-4 gap-4 flex-1 overflow-auto">
          <div className="relative">
            <EmailTagInput
              type="email"
              value={toTags}
              onChange={setToTags}
              placeholder={t('MAIL_TO')}
            />
            <button
              type="button"
              className="absolute right-12 bottom-2 -translate-y-1/2 text-primary-400 hover:underline"
              onClick={() => setShowCc(!showCc)}
            >
              Cc
            </button>
            <button
              type="button"
              className="absolute right-2 bottom-2 -translate-y-1/2 text-primary-400 hover:underline"
              onClick={() => setShowBcc(!showBcc)}
            >
              Bcc
            </button>
          </div>

          {showCc && (
            <EmailTagInput type="email" value={ccTags} onChange={setCcTags} placeholder="Cc" />
          )}
          {showBcc && (
            <EmailTagInput type="email" value={bccTags} onChange={setBccTags} placeholder="Bcc" />
          )}
          <EmailInput
            type="text"
            placeholder={t('SUBJECT')}
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          />

          <div className="flex flex-col flex-1">
            <EmailTextEditor
              value={content}
              onChange={handleContentChange}
              onSubmit={handleSendEmail}
              onCancel={onClose}
              submitName={t('SEND')}
              cancelButton={t('DISCARD')}
              setFormData={
                setFormData as React.Dispatch<React.SetStateAction<TFormProps | TFormData>>
              }
              formData={formData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
