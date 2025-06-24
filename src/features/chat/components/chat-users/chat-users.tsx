import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BellOff,
  EllipsisVertical,
  Info,
  Phone,
  Reply,
  Smile,
  Trash,
  Users,
  Video,
  Bell,
  FileText,
  Download,
} from 'lucide-react';
import { cn } from 'lib/utils';
import { Separator } from 'components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { ForwardMessage } from '../modals/forward-message/forward-message';
import { ChatProfile } from '../chat-profile/chat-profile';
import { ChatInput } from '../chat-input/chat-input';
import { ChatContact, Message } from '../../types/chat.types';

const MessageMenu = ({
  msg,
  openDropdownId,
  setOpenDropdownId,
  handleOpenForwardModal,
  handleDeleteMessage,
  t,
}: {
  msg: Message;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  handleOpenForwardModal: (msg: Message) => void;
  handleDeleteMessage: (id: string) => void;
  t: (key: string) => string;
}) => (
  <DropdownMenu
    open={openDropdownId === msg.id}
    onOpenChange={(open) => setOpenDropdownId(open ? msg.id : null)}
  >
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
        <EllipsisVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-40" align="end">
      <DropdownMenuItem
        onClick={() => handleOpenForwardModal(msg)}
        data-testid={`msg-${msg.id}-forward-btn`}
      >
        <Reply className="w-4 h-4 mr-2" />
        {t('FORWARD')}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleDeleteMessage(msg.id)}
        data-testid={`msg-${msg.id}-delete-btn`}
      >
        <Trash className="w-4 h-4 mr-2" />
        {t('DELETE')}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MessageContent = ({
  msg,
  formatFileSize,
  handleDownload,
}: {
  msg: Message;
  formatFileSize: (size: number) => string;
  handleDownload: (file: { url: string; name: string }) => void;
}) => (
  <>
    <p className="text-sm text-high-emphasis">{msg.content}</p>
    {msg.attachment && (
      <div className="mt-2">
        {msg.attachment.type.startsWith('image/') ? (
          <img
            src={msg.attachment.url}
            alt={msg.attachment.name}
            className="max-w-full max-h-64 rounded-lg border border-border"
          />
        ) : (
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[4px]">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-medium-emphasis truncate">{msg.attachment.name}</div>
              <div className="text-xs text-low-emphasis">{formatFileSize(msg.attachment.size)}</div>
            </div>
            {msg.attachment &&
              (() => {
                const { url, name } = msg.attachment;
                return (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleDownload({ url, name })}
                    aria-label="Download"
                  >
                    <Download className="w-5 h-5 text-medium-emphasis" />
                  </Button>
                );
              })()}
          </div>
        )}
      </div>
    )}
  </>
);

const MessageActions = ({
  isMe,
  msg,
  openDropdownId,
  setOpenDropdownId,
  handleOpenForwardModal,
  handleDeleteMessage,
  t,
}: {
  isMe: boolean;
  msg: Message;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  handleOpenForwardModal: (msg: Message) => void;
  handleDeleteMessage: (id: string) => void;
  t: (key: string) => string;
}) => {
  const actions = [
    <Button key="smile" variant="ghost" size="icon" className="h-6 w-6 p-0.5 rounded-full">
      <Smile className="w-4 h-4" />
    </Button>,
    <Button
      key="reply"
      variant="ghost"
      size="icon"
      className="h-6 w-6 p-0.5 rounded-full"
      onClick={() => handleOpenForwardModal(msg)}
    >
      <Reply className="w-4 h-4" />
    </Button>,
    <MessageMenu
      key="menu"
      msg={msg}
      openDropdownId={openDropdownId}
      setOpenDropdownId={setOpenDropdownId}
      handleOpenForwardModal={handleOpenForwardModal}
      handleDeleteMessage={handleDeleteMessage}
      t={t}
    />,
  ];

  return (
    <div
      className={cn(
        'flex items-center gap-1 transition-opacity duration-200',
        openDropdownId === msg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}
    >
      {isMe ? actions.slice().reverse() : actions}
    </div>
  );
};

interface ChatUsersProps {
  contact: ChatContact;
  onContactNameUpdate?: (contactId: string, newName: string) => void;
  onMuteToggle?: (contactId: string) => void;
  onDeleteContact?: (contactId: string) => void;
  onDeleteMember?: (contactId: string, memberId: string) => void;
  onLeaveGroup?: (contactId: string) => void;
  hideProfile?: boolean;
  onOpenProfileSheet?: () => void;
}

const ChatUserAvatar = ({ contact }: { contact: any }) => {
  if (contact.status?.isMuted) {
    return <BellOff className="w-5 h-5 text-low-emphasis" />;
  }
  if (contact.status?.isGroup) {
    return <Users className="w-5 h-5 text-secondary" />;
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
  return <span className="text-xs font-medium text-medium-emphasis">{contact.avatarFallback}</span>;
};

export const ChatUsers = ({
  contact: initialContact,
  onContactNameUpdate,
  onMuteToggle,
  onDeleteContact,
  onDeleteMember,
  onLeaveGroup,
  hideProfile = false,
  onOpenProfileSheet,
}: Readonly<ChatUsersProps>) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState(initialContact);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<Message | null>(null);

  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  const handleGroupNameUpdate = async (newName: string) => {
    if (newName === contact.name) return;

    try {
      if (onContactNameUpdate) {
        onContactNameUpdate(contact.id, newName);
        setContact((prev) => ({
          ...prev,
          name: newName,
        }));
      }
    } catch (error) {
      console.error('Failed to update contact name:', error);
    }
  };
  const [messages, setMessages] = useState<Message[]>(contact.messages || []);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setMessages(contact.messages || []);
    setTimeout(scrollToBottom, 0);
  }, [contact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      sender: 'me',
      content: message,
      timestamp: new Date().toISOString(),
      ...(selectedFiles.length > 0 && {
        attachment: {
          name: selectedFiles[0].name,
          type: selectedFiles[0].type,
          size: selectedFiles[0].size,
          url: URL.createObjectURL(selectedFiles[0]),
        },
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    setSelectedFiles([]);
  };

  const handleFileUpload = (files: File[]) => {
    setSelectedFiles(files);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = (file: { url: string; name: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenForwardModal = (msg: Message) => {
    setForwardMessage(msg);
    setIsForwardModalOpen(true);
  };
  const handleCloseForwardModal = () => {
    setIsForwardModalOpen(false);
    setForwardMessage(null);
  };
  const handleForward = () => {
    setIsForwardModalOpen(false);
    setForwardMessage(null);
  };

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          'flex flex-col h-full bg-white',
          isProfileOpen ? 'w-full lg:w-[60%]' : 'w-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center',
                  contact.status?.isGroup ? 'bg-secondary-50' : 'bg-neutral-100'
                )}
              >
                <ChatUserAvatar contact={contact} />
              </div>
              {contact.status?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-high-emphasis">{contact.name}</h3>
              {contact.status?.isGroup && (
                <p className="text-xs text-medium-emphasis">
                  {contact?.members?.length} {t('MEMBERS')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                if (hideProfile && onOpenProfileSheet) {
                  onOpenProfileSheet();
                } else {
                  setIsProfileOpen(!isProfileOpen);
                }
              }}
            >
              <Info className="h-5 w-5 text-medium-emphasis" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <EllipsisVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-40" align="end">
                <DropdownMenuItem
                  onClick={() => onMuteToggle?.(contact.id)}
                  data-testid="header-mute-btn"
                >
                  {contact.status?.isMuted ? (
                    <Bell className="w-4 h-4 mr-2 text-medium-emphasis" />
                  ) : (
                    <BellOff className="w-4 h-4 mr-2 text-medium-emphasis" />
                  )}
                  <span>
                    {contact.status?.isMuted ? t('UNMUTE_NOTIFICATIONS') : t('MUTE_NOTIFICATIONS')}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteContact?.(contact.id)}
                  data-testid="header-delete-btn"
                >
                  <Trash className="w-4 h-4 mr-2 text-medium-emphasis" />
                  <span>{t('DELETE')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-4">
            <p className="text-sm text-low-emphasis">
              Start of your conversation with {contact.name}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {messages.map((msg) =>
              msg.sender === 'me' ? (
                <div key={msg.id} className="group flex w-full justify-end">
                  <div className="flex w-[70%] gap-2 justify-end">
                    <MessageActions
                      isMe={true}
                      msg={msg}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      handleOpenForwardModal={handleOpenForwardModal}
                      handleDeleteMessage={handleDeleteMessage}
                      t={t}
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-end">
                        <p className="text-xs text-low-emphasis">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                      <div className="relative group">
                        <div className="rounded-xl px-4 py-2 bg-primary-50 rounded-tr-[2px]">
                          <MessageContent
                            msg={msg}
                            formatFileSize={formatFileSize}
                            handleDownload={handleDownload}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="group flex w-full justify-start">
                  <div className="relative mr-3">
                    <Avatar className="w-6 h-6 bg-neutral-100">
                      <AvatarImage src={contact.avatarSrc} alt={contact.name} />
                      <AvatarFallback className="text-primary text-[10px] md:text-sm">
                        {contact.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex w-[70%] gap-2 justify-start">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-low-emphasis">{contact.name}</p>
                        <p className="text-xs text-low-emphasis">
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                      <div className="relative group">
                        <div className="rounded-xl px-4 py-2 bg-surface rounded-tl-[2px]">
                          <MessageContent
                            msg={msg}
                            formatFileSize={formatFileSize}
                            handleDownload={handleDownload}
                          />
                        </div>
                      </div>
                    </div>
                    <MessageActions
                      isMe={false}
                      msg={msg}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      handleOpenForwardModal={handleOpenForwardModal}
                      handleDeleteMessage={handleDeleteMessage}
                      t={t}
                    />
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSendMessage}
          onFileUpload={handleFileUpload}
          selectedFiles={selectedFiles}
          onRemoveFile={(index) => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
        />
      </div>
      {isProfileOpen && !hideProfile && (
        <div className="hidden lg:flex flex-col w-[40%] h-full">
          <ChatProfile
            contact={contact}
            onGroupNameUpdate={handleGroupNameUpdate}
            onMuteToggle={() => onMuteToggle?.(contact.id)}
            onDeleteMember={(contactId, memberId) => onDeleteMember?.(contactId, memberId)}
            onLeaveGroup={() => onLeaveGroup?.(contact.id)}
          />
        </div>
      )}
      <ForwardMessage
        open={isForwardModalOpen}
        onOpenChange={(open) => (open ? setIsForwardModalOpen(true) : handleCloseForwardModal())}
        message={
          forwardMessage
            ? {
                ...forwardMessage,
                senderName: contact.name,
                avatarSrc: contact.avatarSrc,
              }
            : null
        }
        onForward={handleForward}
      />
    </div>
  );
};
