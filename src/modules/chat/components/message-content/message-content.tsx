import { Button } from '@/components/ui-kit/button';
import { FileText, Download } from 'lucide-react';
import type { Message } from '../../types/chat.types';

export type MessageContentProps = {
  msg: Message;
  formatFileSize: (size: number) => string;
  handleDownload: (file: { url: string; name: string }) => void;
};

export const MessageContent = ({ msg, formatFileSize, handleDownload }: Readonly<MessageContentProps>) => {
  const attachment = msg.attachment;
  return (
    <>
      <p className="text-sm text-high-emphasis">{msg.content}</p>
      {attachment && (
        <div className="mt-2">
          {attachment.type.startsWith('image/') ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-full max-h-64 rounded-lg border border-border"
            />
          ) : (
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[4px]">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex flex-col">
                <div className="text-sm text-medium-emphasis truncate">{attachment.name}</div>
                <div className="text-xs text-low-emphasis">{formatFileSize(attachment.size)}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => handleDownload({ url: attachment.url, name: attachment.name })}
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-medium-emphasis" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
