export interface ChatContact {
  id: string;
  avatarSrc: string;
  avatarFallback: string;
  name: string;
  email: string;
  lastMessage?: string;
  date: string;
  isOnline?: boolean;
  isUnread?: boolean;
  isGroup?: boolean;
  isMuted?: boolean;
}

export interface UserProfile {
  name: string;
  avatarSrc: string;
  avatarFallback: string;
  isOnline: boolean;
}
