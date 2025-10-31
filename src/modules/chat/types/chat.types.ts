export type ChatContact = {
  id: string;
  name: string;
  email: string;
  phoneNo?: string;
  avatarSrc: string;
  avatarFallback: string;
  date: string;
  status?: ChatStatus;
  messages?: Message[];
  members?: GroupMember[];
};

export type GroupMember = {
  id: string;
  name: string;
  email: string;
  isMe?: boolean;
  avatarSrc: string;
  avatarFallback: string;
};

export type ChatStatus = {
  isOnline?: boolean;
  isUnread?: boolean;
  isGroup?: boolean;
  isMuted?: boolean;
};

export type Message = {
  id: string;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
};

export type UserProfile = {
  name: string;
  avatarSrc: string;
  avatarFallback: string;
  status: ChatStatus;
};
