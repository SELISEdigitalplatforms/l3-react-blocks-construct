import { Mail, Star, Send, AlertTriangle, Trash2, File } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmailCounts, NavItem } from '../types/email.types';

export const useNavItems = (
  emails: EmailCounts,
  location: { pathname: string },
  navigate: (path: string) => void,
  setSelectedEmail: (email: any) => void
): NavItem[] => {
  const { t } = useTranslation();

  const items: NavItem[] = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: t('INBOX'),
      href: '/mail/inbox',
      count: emails['inbox']?.length ?? 0,
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: t('STARRED'),
      href: '/mail/starred',
      count: emails['starred']?.length ?? 0,
    },

    {
      icon: <Send className="h-4 w-4" />,
      label: t('SENT'),
      href: '/mail/sent',
      count: emails['sent']?.length ?? 0,
    },
    {
      icon: <File className="h-4 w-4" />,
      label: t('DRAFT'),
      href: '/mail/draft',
      count: emails['draft']?.length ?? 0,
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: t('SPAM'),
      href: '/mail/spam',
      count: emails['spam']?.length ?? 0,
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: t('TRASH'),
      href: '/mail/trash',
      count: emails['trash']?.length ?? 0,
    },
  ];

  return items.map((item) => ({
    ...item,
    isActive: location.pathname === item.href || location.pathname.startsWith(`${item.href}/`),
    onClick: () => {
      navigate(item.href);
      setSelectedEmail(null);
    },
  }));
};
