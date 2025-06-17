import { useTranslation } from 'react-i18next';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { CirclePlus, Image, Paperclip, Send, Smile } from 'lucide-react';
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
  onImageClick?: () => void;
  onAttachmentClick?: () => void;
  onEmojiClick?: () => void;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onImageClick,
  onAttachmentClick,
  onEmojiClick,
}: Readonly<ChatInputProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex-none border-t border-border px-4 py-3 bg-white">
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onImageClick}
              >
                <Image className="w-5 h-5 text-medium-emphasis" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onAttachmentClick}
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
                <DropdownMenuItem onClick={onImageClick}>
                  <Image className="w-5 h-5 text-medium-emphasis" />
                  {t('IMAGES')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAttachmentClick}>
                  <Paperclip className="w-5 h-5 text-medium-emphasis" />
                  {t('ATTACHMENT')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEmojiClick}>
                  <Smile className="w-5 h-5 text-medium-emphasis" />
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
      </form>
    </div>
  );
};
