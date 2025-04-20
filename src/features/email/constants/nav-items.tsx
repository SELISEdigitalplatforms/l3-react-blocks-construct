import { Mail, Star, Send, AlertTriangle, Trash2, Bookmark, File } from 'lucide-react';

export const getNavItems = (emails: any, location: any, navigate: any, setSelectedEmail: any) => {
  return [
    {
      icon: <Mail className="h-4 w-4" />,
      label: 'Inbox',
      href: '/mail/inbox',
      count: emails['inbox']?.length ?? 0,
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: 'Starred',
      href: '/mail/starred',
      count: emails['starred']?.length ?? 0,
    },
    {
      icon: <Bookmark className="h-4 w-4" />,
      label: 'Important',
      href: '/mail/important',
      count: emails['important']?.length ?? 0,
    },
    {
      icon: <Send className="h-4 w-4" />,
      label: 'Sent',
      href: '/mail/sent',
      count: emails['sent']?.length ?? 0,
    },
    {
      icon: <File className="h-4 w-4" />,
      label: 'Draft',
      href: '/mail/drafts',
      count: emails['drafts']?.length ?? 0,
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: 'Spam',
      href: '/mail/spam',
      count: emails['spam']?.length ?? 0,
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: 'Trash',
      href: '/mail/trash',
      count: emails['trash']?.length ?? 0,
    },
  ].map((item) => ({
    ...item,
    isActive: location.pathname === item.href || location.pathname.startsWith(`${item.href}/`),
    onClick: () => {
      navigate(item.href), setSelectedEmail(null);
    },
  }));
};
