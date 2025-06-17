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

  // Separate handlers for dropdown menu
  const handleDropdownImageClick = () => {
    dropdownImageInputRef.current?.click();
  };

  const handleDropdownAttachmentClick = () => {
    dropdownAttachmentInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload?.(Array.from(e.target.files));
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload?.(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex-none border-t border-border px-4 py-3 bg-white">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-surface px-2 py-1 rounded-md">
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => onRemoveFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 w-full max-w-full overflow-hidden"
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
              >
                <Image className="w-5 h-5 text-medium-emphasis" />
              </Button>

              <input {...getAttachmentInputProps()} ref={attachmentInputRef} hidden />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleAttachmentClick}
              >
                <Paperclip className="w-5 h-5 text-medium-emphasis" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onEmojiClick}
              >
                <Smile className="w-5 h-5 text-medium-emphasis" />
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                  <CirclePlus className="w-5 h-5 text-medium-emphasis" />
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
          <Button type="submit" variant="ghost" size="icon" className="rounded-full">
            <Send className="w-5 h-5 text-medium-emphasis" />
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
