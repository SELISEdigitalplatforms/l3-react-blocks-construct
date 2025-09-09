export interface ChatContact {
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
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  isMe?: boolean;
  avatarSrc: string;
  avatarFallback: string;
}

export interface ChatStatus {
  isOnline?: boolean;
  isUnread?: boolean;
  isGroup?: boolean;
  isMuted?: boolean;
}

export interface Message {
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
}

export interface UserProfile {
  name: string;
  avatarSrc: string;
  avatarFallback: string;
  status: ChatStatus;
}
