import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Phone, Mail, User, Bell, Download, FileText, Image, Music, Video } from 'lucide-react';
import { ScrollArea } from 'components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';

export const ChatProfile = () => {
  const profile = {
    name: 'Adrian Müller',
    avatarSrc: '/assets/images/avatar.png',
    avatarFallback: 'AM',
    phone: '+41 75 744 2538',
    email: 'luca.meier@gmail.com',
    attachments: [
      { id: '1', name: 'acceptance criteria final.pdf', size: '600.00 KB', type: 'pdf' },
      { id: '2', name: 'Sunset_View_Image.jpg', size: '600.00 KB', type: 'image' },
      { id: '3', name: 'acceptance criteria preview vers...', size: '600.00 KB', type: 'pdf' },
      { id: '4', name: 'Discussion.mp3', size: '600.00 KB', type: 'audio' },
      { id: '5', name: 'meeting_notes.mp4', size: '500.00 MB', type: 'video' },
    ],
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-info" />;
      case 'image':
        return <Image className="w-5 h-5 text-error" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-success" />;
      default:
        return <FileText className="w-5 h-5 text-medium-emphasis" />;
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-white">
      <div className="flex flex-col items-center border-b border-border py-5 px-3 gap-3">
        <Avatar className="w-20 h-20 bg-neutral-100">
          <AvatarImage src={profile.avatarSrc} alt={profile.name} />
          <AvatarFallback className="text-primary text-xl">{profile.avatarFallback}</AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg text-high-emphasis">{profile.name}</h3>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex flex-col items-center gap-0 py-3">
            <User className="w-5 h-5 text-medium-emphasis" />
            <span className="text-xs text-medium-emphasis">Profile</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-0 py-3">
            <Bell className="w-5 h-5 text-medium-emphasis" />
            <span className="text-xs text-medium-emphasis">Mute</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={['general-info', 'attachments']}
          className="w-full"
        >
          <AccordionItem value="general-info" className="border-b border-border">
            <AccordionTrigger className="px-3 py-4 font-semibold text-high-emphasis bg-surface hover:no-underline">
              General info
            </AccordionTrigger>
            <AccordionContent className="py-4 px-3">
              <div className="flex items-center gap-4 mb-4">
                <Phone className="w-4 h-4 text-medium-emphasis" />
                <span className="text-sm text-high-emphasis">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-medium-emphasis" />
                <span className="text-sm text-high-emphasis">{profile.email}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="attachments" className="border-b border-border">
            <AccordionTrigger className="px-3 py-4 font-semibold text-high-emphasis bg-surface hover:no-underline">
              Attachments
            </AccordionTrigger>
            <AccordionContent className="py-4 px-3">
              <div className="flex flex-col gap-3">
                {profile.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-high-emphasis truncate">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-low-emphasis">{attachment.size}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Download className="w-5 h-5 text-medium-emphasis" />
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
};
