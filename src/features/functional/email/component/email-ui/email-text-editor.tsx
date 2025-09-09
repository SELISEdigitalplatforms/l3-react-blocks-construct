import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'components/ui/button';
import { Paperclip, Smile, Image, X } from 'lucide-react';
import 'quill/dist/quill.snow.css';
import { TFormData, TFormProps } from '../../types/email.types';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

/**
 * EmailTextEditor Component
 *
 * A rich text editor component built using Quill with extended features for:
 * - Emoji insertion
 * - Image and attachment uploads
 * - Inline rendering and deletion of uploaded files
 *
 * Features:
 * - Rich text formatting with Quill.js
 * - Custom toolbar configuration
 * - File/image input with preview and delete capability
 * - Emoji picker with click-to-insert functionality
 * - Controlled editor value via props
 *
 * Props:
 * @param {string} value - Current HTML content of the editor
 * @param {(content: string) => void} onChange - Callback when the content changes
 * @param {string} submitName - Label text for the submit button
 * @param {string} cancelButton - Label text for the cancel button
 * @param {boolean} [showIcons=true] - Toggle to show or hide image, attachment, and emoji buttons
 * @param {() => void} [onSubmit] - Optional submit handler
 * @param {() => void} [onCancel] - Optional cancel handler
 * @param {React.Dispatch<React.SetStateAction<TFormData | TFormProps>>} [setFormData] - State updater for form data
 * @param {TFormData | TFormProps} [formData] - Current form data including attachments and images
 *
 * @returns {JSX.Element} A fully featured email composition editor
 *
 * @example
 * <EmailTextEditor
 *   value={emailBody}
 *   onChange={setEmailBody}
 *   submitName="Send"
 *   cancelButton="Discard"
 *   onSubmit={handleSend}
 *   onCancel={handleDiscard}
 *   showIcons={true}
 *   setFormData={setData}
 *   formData={data}
 * />
 */

interface EmailTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  submitName: string;
  cancelButton: string;
  showIcons?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  setFormData?: React.Dispatch<React.SetStateAction<TFormData | TFormProps>>;
  formData?: TFormData | TFormProps;
}

const EmailTextEditor = ({
  value,
  onChange,
  submitName,
  onSubmit,
  onCancel,
  cancelButton,
  showIcons = true,
  setFormData,
  formData,
}: Readonly<EmailTextEditorProps>) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Quill | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['link'],
            ['clean'],
          ],
        },
      });

      editorRef.current.on('text-change', () => {
        if (onChange) {
          if (editorRef.current) {
            onChange(editorRef.current.root.innerHTML);
          }
        }
      });
    }

    if (value && editorRef.current && editorRef.current.root.innerHTML !== value) {
      editorRef.current.root.innerHTML = value;
    }
  }, [value, onChange]);

  const handleAddImages = (newImages: string[]) => {
    setFormData?.((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageNames = Array.from(files).map((file) => file.name);
    handleAddImages(imageNames);
    e.target.value = '';
  };

  const handleDeleteImage = (imageName: string) => {
    setFormData?.((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageName),
    }));
  };

  const handleAddAttachments = (newAttachments: string[]) => {
    setFormData?.((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  const handleAttachmentClick = () => {
    attachmentInputRef.current?.click();
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const attachmentNames = Array.from(files).map((file) => file.name);
    handleAddAttachments(attachmentNames);
    e.target.value = '';
  };

  const handleDeleteAttachment = (fileName: string) => {
    setFormData?.((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att !== fileName),
    }));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;

    if (editorRef.current) {
      const quill = editorRef.current;
      const range = quill.getSelection(true);

      if (range) {
        quill.insertText(range.index, emoji, 'user');
        quill.setSelection(range.index + emoji.length, 0, 'user');
      }
    }

    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="">
      <div className="pb-1">
        <div className="min-h-40" ref={quillRef} />
      </div>
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 top-0 left-0 mt-2 bg-white shadow-lg rounded-lg"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {formData && (formData?.images?.length > 0 || formData?.attachments?.length > 0) && (
        <div className="mt-2 text-sm">
          <ul className="grid grid-cols-1 md:grid-cols-2 justify-center gap-2  md:gap-4">
            {formData?.images.map((name) => (
              <li className=" bg-surface p-1.5 rounded" key={name}>
                <div className="flex justify-between items-center ">
                  <div className="flex flex-1">
                    <p className=" line-clamp-1 text-high-emphasis text-xs">
                      {name.length <= 20
                        ? name
                        : `${name.slice(0, Math.max(0, 20 - (name.split('.').pop()?.length ?? 0) - 3))}...${name.split('.').pop()}`}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center text-medium-emphasis">
                    <p className="text-[10px]">{`(200.00 kb)`}</p>
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-high-emphasis"
                      onClick={() => handleDeleteImage(name)}
                    />
                  </div>
                </div>
              </li>
            ))}
            {formData.attachments.map((name) => (
              <li className="bg-surface p-1.5 rounded" key={name}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-1">
                    <p className="line-clamp-1 text-high-emphasis text-xs">
                      {name.length <= 20
                        ? name
                        : `${name.slice(0, Math.max(0, 20 - (name.split('.').pop()?.length ?? 0) - 3))}...${name.split('.').pop()}`}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center text-medium-emphasis">
                    <p className="text-[10px] ">(100.00 kb)</p>
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-high-emphasis"
                      onClick={() => handleDeleteAttachment(name)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={attachmentInputRef}
        className="hidden"
        multiple
        onChange={handleAttachmentChange}
      />
      <div
        className={`sticky bottom-0 bg-white flex flex-row py-4  gap-4 ${showIcons ? 'justify-between' : 'justify-end'}`}
      >
        {showIcons && (
          <div className="flex gap-4">
            <Image className="h-4 w-4 cursor-pointer" onClick={handleImageClick} />
            <Paperclip className="h-4 w-4 cursor-pointer" onClick={handleAttachmentClick} />
            <Smile className="h-4 w-4 cursor-pointer" onClick={() => setShowPicker(!showPicker)} />
          </div>
        )}
        <div className="flex gap-4">
          <Button onClick={onCancel} variant={'outline'}>
            {cancelButton}
          </Button>
          <Button onClick={onSubmit}>{submitName}</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailTextEditor;
