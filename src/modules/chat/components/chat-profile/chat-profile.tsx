import { cn } from '@/lib/utils';
import { useState } from 'react';
import { EditGroupName } from '../modals/edit-group-name/edit-group-name';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  Bell,
  BellOff,
  Download,
  FileText,
  Image,
  Music,
  Users,
  Video,
  CircleUser,
  Pen,
  Trash,
  UserRoundX,
} from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { ScrollArea } from '@/components/ui-kit/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui-kit/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui-kit/avatar';
import { ChatContact } from '../../types/chat.types';
import { ConfirmationModal } from '@/components/core';
import { useToast } from '@/hooks/use-toast';
import { attachments, getAttachmentBackgroundColor } from '../../services/chat.services';

interface ChatProfileProps {
  contact: ChatContact;
  onGroupNameUpdate?: (newName: string) => void;
  onMuteToggle?: (contactId: string) => void;
  onDeleteMember?: (contactId: string, memberId: string) => void;
  onLeaveGroup?: (contactId: string) => void;
}

export const ChatProfile = ({
  contact,
  onGroupNameUpdate,
  onMuteToggle,
  onDeleteMember,
  onLeaveGroup,
}: Readonly<ChatProfileProps>) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditGroupNameOpen, setIsEditGroupNameOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleSaveGroupName = async (newName: string) => {
    if (newName === contact.name) {
      setIsEditGroupNameOpen(false);
      return;
    }

    try {
      setIsSaving(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      if (onGroupNameUpdate) {
        onGroupNameUpdate(newName);
      }

      setIsEditGroupNameOpen(false);
    } catch (error) {
      console.error('Failed to update group name:', error);
    } finally {
      setIsSaving(false);
    }
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

  const handleDeleteMember = (memberId: string, memberName: string) => {
    setMemberToDelete({ id: memberId, name: memberName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete && onDeleteMember) {
      onDeleteMember(contact.id, memberToDelete.id);
      toast({
        variant: 'success',
        title: t('USER_REMOVED'),
        description: t('USER_SUCCESSFULLY_REMOVED_GROUP'),
      });
    }
  };

  const handleLeaveClick = () => {
    if (contact.status?.isGroup) {
      setShowLeaveModal(true);
    }
  };

  const handleConfirmLeave = () => {
    if (onLeaveGroup) {
      onLeaveGroup(contact.id);
      toast({
        variant: 'success',
        title: t('YOU_LEFT_GROUP'),
        description: t('YOU_SUCCESSFULLY_EXITED_GROUP'),
      });
      setShowLeaveModal(false);
    }
  };

  const ProfileAvatar = ({ contact }: { contact: any }) => {
    if (contact.status?.isMuted) {
      return <BellOff className="w-8 h-8 text-low-emphasis" />;
    }
    if (contact.avatarSrc) {
      return (
        <img
          src={contact.avatarSrc}
          alt={contact.name}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    if (contact.status?.isGroup) {
      return <Users className="w-8 h-8 text-secondary" />;
    }
    return (
      <span className="text-2xl font-medium text-medium-emphasis">{contact.avatarFallback}</span>
    );
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-white">
      <EditGroupName
        isOpen={isEditGroupNameOpen}
        currentName={contact.name}
        onClose={() => setIsEditGroupNameOpen(false)}
        onSave={handleSaveGroupName}
        isLoading={isSaving}
      />
      <div className="flex flex-col items-center border-b border-border py-5 px-3 gap-3">
        <div
          className={cn(
            'relative w-20 h-20 rounded-full flex items-center justify-center',
            contact.status?.isGroup ? 'bg-secondary-50' : 'bg-neutral-100'
          )}
        >
          <ProfileAvatar contact={contact} />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-high-emphasis">{contact.name}</h3>
          {contact?.status?.isGroup && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsEditGroupNameOpen(true)}
              data-testid="edit-group-name-btn"
            >
              <Pen className="w-4 h-4 text-primary" />
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-0 py-3"
            onClick={handleLeaveClick}
          >
            {contact.status?.isGroup ? (
              <UserRoundX className="w-5 h-5 text-medium-emphasis" />
            ) : (
              <CircleUser className="w-5 h-5 text-medium-emphasis" />
            )}
            <span className="text-xs text-medium-emphasis">
              {contact.status?.isGroup ? t('LEAVE') : t('PROFILE')}
            </span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-0 py-3"
            onClick={() => onMuteToggle?.(contact.id)}
          >
            {contact.status?.isMuted ? (
              <Bell className="w-5 h-5 text-medium-emphasis" />
            ) : (
              <BellOff className="w-5 h-5 text-medium-emphasis" />
            )}
            <span className="text-xs text-medium-emphasis">
              {contact.status?.isMuted ? t('UNMUTE') : t('MUTE')}
            </span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={['general-info', 'members', 'attachments']}
          className="w-full"
        >
          {contact?.status?.isGroup ? (
            <AccordionItem value="members" className="border-b border-border">
              <AccordionTrigger className="px-3 py-4 font-semibold text-high-emphasis bg-surface hover:no-underline">
                {t('MEMBERS')} ({contact?.members?.length})
              </AccordionTrigger>
              <AccordionContent className="py-4 px-3">
                <div className="flex flex-col gap-3">
                  {contact?.members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-[2px] border-surface">
                          <AvatarImage src={member.avatarSrc} alt={member.name} />
                          <AvatarFallback className="text-primary text-xl">
                            {member.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-high-emphasis">{member.name}</span>
                          {!member?.isMe ? (
                            <span className="text-xs text-medium-emphasis">{member.email}</span>
                          ) : (
                            <span className="text-xs text-medium-emphasis">{t('LABEL_ME')}</span>
                          )}
                        </div>
                      </div>
                      {!member?.isMe && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          data-testid={`delete-member-btn-${member.id}`}
                        >
                          <Trash className="w-5 h-5 text-medium-emphasis" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <AccordionItem value="general-info" className="border-b border-border">
              <AccordionTrigger className="px-3 py-4 font-semibold text-high-emphasis bg-surface hover:no-underline">
                {t('GENERAL_INFO')}
              </AccordionTrigger>
              <AccordionContent className="py-4 px-3">
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="w-4 h-4 text-medium-emphasis" />
                  <span className="text-sm text-high-emphasis">{contact?.phoneNo}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-medium-emphasis" />
                  <span className="text-sm text-high-emphasis">{contact.email}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="attachments" className="border-b border-border">
            <AccordionTrigger className="px-3 py-4 font-semibold text-high-emphasis bg-surface hover:no-underline">
              {t('ATTACHMENTS')}
            </AccordionTrigger>
            <AccordionContent className="py-4 px-3">
              <div className="flex flex-col gap-3">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${getAttachmentBackgroundColor(attachment.type)}`}
                      >
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

      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title={t('REMOVE_MEMBER')}
        description={t('REMOVE_USER_FROM_GROUP')}
        onConfirm={handleConfirmDelete}
        confirmText={t('YES')}
        cancelText={t('LABEL_NO')}
      />
      <ConfirmationModal
        open={showLeaveModal}
        onOpenChange={setShowLeaveModal}
        title={t('LEAVE_GROUP')}
        description={t('LEAVE_GROUP_CONFIRMATION_MESSAGE')}
        onConfirm={handleConfirmLeave}
        confirmText={t('LEAVE')}
        cancelText={t('CANCEL')}
      />
    </div>
  );
};
