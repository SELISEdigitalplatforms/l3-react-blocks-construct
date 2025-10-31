import { BellOff, Users } from 'lucide-react';

interface ChatAvatarContentProps {
  status?: any;
  avatarSrc: string;
  name: string;
  avatarFallback: string;
}

export const ChatAvatarContent = ({
  status,
  avatarSrc,
  name,
  avatarFallback,
}: Readonly<ChatAvatarContentProps>) => {
  if (status?.isMuted) {
    return <BellOff className="w-5 h-5 text-low-emphasis" />;
  }
  if (status?.isGroup) {
    return <Users className="w-5 h-5 text-secondary" />;
  }
  if (avatarSrc) {
    return <img src={avatarSrc} alt={name} className="w-full h-full rounded-full object-cover" />;
  }
  return <span className="text-xs font-medium text-medium-emphasis">{avatarFallback}</span>;
};
