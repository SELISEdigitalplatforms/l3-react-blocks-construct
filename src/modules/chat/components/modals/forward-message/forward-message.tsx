import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Forward } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Textarea } from '@/components/ui-kit/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui-kit/avatar';
import { Label } from '@/components/ui-kit/label';

interface ForwardMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: any;
  onForward: (recipient: string, note: string, message: any) => void;
}

export const ForwardMessage = ({
  open,
  onOpenChange,
  message,
  onForward,
}: Readonly<ForwardMessageProps>) => {
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const { t } = useTranslation();

  const handleForward = () => {
    onForward(recipient, note, message);
    onOpenChange(false);
    setRecipient('');
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('FORWARD_THIS_MESSAGE')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <Input
            placeholder={t('ENTER_NAME_EMAIL_GROUP')}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="bg-surface"
          />
          <div className="flex flex-col gap-2">
            <Label className="block text-sm font-medium mb-1">{t('MESSAGE')}</Label>
            <div className="flex flex-col border border-border rounded-[6px]">
              <Textarea
                placeholder={t('WRITE_MESSAGE_HERE_OPTIONAL')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border-none resize-none shadow-none p-3 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring "
              />
              <div className="rounded-[6px] border p-3 m-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Forward className="w-5 h-5 text-medium-emphasis" />
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={message?.avatarSrc} alt={message?.senderName} />
                    <AvatarFallback className="text-[10px]">
                      {message?.senderName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xsm text-high-emphasis">{message?.senderName}</p>
                  <div className="h-2 w-2 rounded-full bg-neutral-200" />
                  <p className="text-xs text-low-emphasis">
                    {message?.timestamp && new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {message?.content && (
                    <div className="text-xs text-high-emphasis">{message.content}</div>
                  )}
                  {message?.attachment?.type?.startsWith('image/') && (
                    <div className="w-full h-40">
                      <img
                        src={message.attachment.url}
                        alt={message.attachment.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {message?.attachment && !message.attachment.type.startsWith('image/') && (
                    <div className="flex items-center gap-4 p-2 rounded-[6px] w-full bg-surface">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[4px]">
                        <FileText className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-medium-emphasis truncate">
                          {message.attachment.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('CANCEL')}
          </Button>
          <Button onClick={handleForward} disabled={!recipient} className="mb-4 md:mb-0">
            {t('FORWARD')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
