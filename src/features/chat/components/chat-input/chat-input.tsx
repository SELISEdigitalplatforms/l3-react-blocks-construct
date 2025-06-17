import { Image, Paperclip, Send, Smile } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

interface ChatInputProps {
  onImageClick?: () => void;
  onAttachmentClick?: () => void;
  onEmojiClick?: () => void;
  onSendClick?: () => void;
}

export function ChatInput({
  onImageClick,
  onAttachmentClick,
  onEmojiClick,
  onSendClick,
}: Readonly<ChatInputProps>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-medium-emphasis rounded-full hover:text-high-emphasis"
        onClick={onImageClick}
      >
        <Image className="w-5 h-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-medium-emphasis rounded-full hover:text-high-emphasis"
        onClick={onAttachmentClick}
      >
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-medium-emphasis rounded-full hover:text-high-emphasis"
        onClick={onEmojiClick}
      >
        <Smile className="w-5 h-5" />
      </Button>
      <Separator orientation="vertical" className="h-5" />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="text-medium-emphasis rounded-full hover:text-high-emphasis"
        onClick={onSendClick}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
