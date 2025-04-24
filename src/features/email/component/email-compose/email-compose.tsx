import { useEffect, useState } from 'react';
import { EmailComposeHeader } from './email-compose-header';
import { EmailInput } from '../email-ui/email-input';
import EmailTextEditor from '../email-ui/email-text-editor';
import { TEmail, TFormProps, TIsComposing } from '../../types/email.types';
import { ArrowLeft } from 'lucide-react';
import { useToast } from 'hooks/use-toast';
import { EmailTagInput } from '../email-ui/email-tag-input';

/**
 * EmailCompose component allows users to compose and send an email. It includes options to minimize, maximize,
 * and send the email, with fields for To, Cc, Bcc, Subject, and email content. It also features a text editor
 * for the email content and supports showing and hiding the Cc and Bcc fields.
 *
 * @component
 *
 * @param {Object} props - The props for the component.
 * @param {function} props.onClose - A callback function that is triggered when the email compose modal is closed.
 *
 * @returns {JSX.Element} - The EmailCompose component displaying the email compose interface.
 *
 * @example
 * const handleClose = () => { console.log('Email compose closed'); };
 * <EmailCompose onClose={handleClose} />
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

  useEffect(() => {
    if (isComposing.isForward && selectedEmail?.subject !== undefined) {
      setFormData((prev) => ({
        ...prev,
        subject: 'fw: ' + selectedEmail.subject,
        images: selectedEmail.images || [],
        attachments: selectedEmail.attachments || [],
        cc: Array.isArray(selectedEmail.cc)
          ? selectedEmail.cc
          : selectedEmail.cc
            ? [selectedEmail.cc]
            : undefined,
        bcc: Array.isArray(selectedEmail.bcc)
          ? selectedEmail.bcc
          : selectedEmail.bcc
            ? [selectedEmail.bcc]
            : undefined,
      }));

      setContent(
        `<div className="bg-low-emphasis "></div><p>from: ${selectedEmail.sender} &lt;${selectedEmail.email}&gt;</p><p>date: ${selectedEmail.date}</p><p>subject: ${selectedEmail.subject}</p><p>to: me &lt;demo@blocks.construct&gt;</p><p>${selectedEmail.content ?? selectedEmail.preview}</p>`
      );
    }
  }, [isComposing.isForward, selectedEmail]);

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
        title: 'Error',
        description: 'All fields are required.',
      });
      return;
    }

    addOrUpdateEmailInSent(emailData);
    onClose();
    toast({
      variant: 'success',
      title: 'Success',
      description: 'Your email has been sent.',
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
        className={`hidden md:flex fixed  ${
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
            <EmailTagInput value={toTags} type="email" onChange={setToTags} placeholder="To" />
            <p
              className="absolute right-12 bottom-2 -translate-y-1/2   cursor-pointer text-primary-400 hover:underline "
              onClick={() => setShowCc(!showCc)}
            >
              Cc
            </p>
            <p
              className="absolute right-2 bottom-2 -translate-y-1/2 text-primary-400 hover:underline cursor-pointer"
              onClick={() => setShowBcc(!showBcc)}
            >
              Bcc
            </p>
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
            placeholder="Subject"
          />

          <div className="flex flex-col flex-1">
            <EmailTextEditor
              value={content}
              onChange={handleContentChange}
              onSubmit={handleSendEmail}
              onCancel={onClose}
              submitName="Send"
              cancelButton="Discard"
              setFormData={setFormData}
              formData={formData}
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
            <EmailTagInput type="email" value={toTags} onChange={setToTags} placeholder="To" />
            <p
              className="absolute right-12 bottom-2 -translate-y-1/2   cursor-pointer text-primary-400 hover:underline "
              onClick={() => setShowCc(!showCc)}
            >
              Cc
            </p>
            <p
              className="absolute right-2 bottom-2 -translate-y-1/2 text-primary-400 hover:underline cursor-pointer"
              onClick={() => setShowBcc(!showBcc)}
            >
              Bcc
            </p>
          </div>

          {showCc && (
            <EmailTagInput type="email" value={ccTags} onChange={setCcTags} placeholder="Cc" />
          )}
          {showBcc && (
            <EmailTagInput type="email" value={bccTags} onChange={setBccTags} placeholder="Bcc" />
          )}
          <EmailInput
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          />

          <div className="flex flex-col flex-1">
            <EmailTextEditor
              value={content}
              onChange={handleContentChange}
              onSubmit={handleSendEmail}
              onCancel={onClose}
              submitName="Send"
              cancelButton="Discard"
              setFormData={setFormData}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
