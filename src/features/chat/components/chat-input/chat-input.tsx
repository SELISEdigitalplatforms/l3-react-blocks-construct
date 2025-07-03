import { useTranslation } from 'react-i18next';
import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { CirclePlus, Image, Paperclip, Send, Smile, X } from 'lucide-react';
import { Separator } from 'components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEmojiClick?: () => void;
  onFileUpload?: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onEmojiClick,
  onFileUpload,
  selectedFiles,
  onRemoveFile,
}: Readonly<ChatInputProps>) => {
  const { t } = useTranslation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const dropdownImageInputRef = useRef<HTMLInputElement>(null);
  const dropdownAttachmentInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload?.(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getInputProps: getImageInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: true,
    noClick: true,
  });

  const { getInputProps: getAttachmentInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/*': ['.pdf', '.doc', '.docx', '.txt'],
    },
    multiple: true,
    noClick: true,
  });

  const handleImageClick = () => {
    setTimeout(() => {
      imageInputRef.current?.click();
    }, 100);
  };

  const handleAttachmentClick = () => {
    setTimeout(() => {
      attachmentInputRef.current?.click();
    }, 100);
  };

  const handleDropdownImageClick = () => {
    dropdownImageInputRef.current?.click();
  };

  const handleDropdownAttachmentClick = () => {
    dropdownAttachmentInputRef.current?.click();
  };

  const handleFilesFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload?.(Array.from(e.target.files));
    }
  };

  const handleImageChange = handleFilesFromInput;
  const handleAttachmentChange = handleFilesFromInput;

  return (
    <div className="flex-none border-t border-border px-4 py-3 bg-white">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFiles.map((file) => (
            <div
              key={file.name + file.size + file.lastModified}
              className="flex items-center gap-2 bg-surface px-2 py-1 rounded-md"
            >
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 rounded-full"
                onClick={() => {
                  const idx = selectedFiles.findIndex(
                    (f) =>
                      f.name === file.name &&
                      f.size === file.size &&
                      f.lastModified === file.lastModified
                  );
                  if (idx !== -1) onRemoveFile(idx);
                }}
                aria-label={`remove file ${file.name}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 w-full max-w-full overflow-hidden"
        data-testid="chat-form"
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${t('TYPE_MESSAGE')}...`}
          className="border-0 rounded-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-w-[100px] shadow-none"
        />

        <div className="flex items-center gap-2">
          {value.trim() === '' ? (
            <>
              <input {...getImageInputProps()} ref={imageInputRef} hidden />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleImageClick}
                aria-label="upload image"
              >
                <Image className="w-5 h-5 text-medium-emphasis" aria-hidden="true" />
              </Button>

              <input {...getAttachmentInputProps()} ref={attachmentInputRef} hidden />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleAttachmentClick}
                aria-label="attach file"
              >
                <Paperclip className="w-5 h-5 text-medium-emphasis" aria-hidden="true" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onEmojiClick}
                aria-label="open emoji picker"
              >
                <Smile className="w-5 h-5 text-medium-emphasis" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="more options"
                >
                  <CirclePlus className="w-5 h-5 text-medium-emphasis" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-40" align="end">
                <DropdownMenuItem onSelect={handleDropdownImageClick}>
                  <Image className="w-5 h-5 text-medium-emphasis mr-2" />
                  {t('IMAGES')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDropdownAttachmentClick}>
                  <Paperclip className="w-5 h-5 text-medium-emphasis mr-2" />
                  {t('ATTACHMENT')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onEmojiClick}>
                  <Smile className="w-5 h-5 text-medium-emphasis mr-2" />
                  {t('EMOJI')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Separator orientation="vertical" className="h-5" />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="send message"
          >
            <Send className="w-5 h-5 text-medium-emphasis" aria-hidden="true" />
          </Button>
        </div>

        <input
          ref={dropdownImageInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageChange}
        />
        <input
          ref={dropdownAttachmentInputRef}
          type="file"
          accept="application/*,.pdf,.doc,.docx,.txt"
          multiple
          hidden
          onChange={handleAttachmentChange}
        />
      </form>
    </div>
  );
};
