import { Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LabelItem } from '../types/email.types';

export const useLabelItems = (
  location: { pathname: string },
  navigate: (path: string) => void,
  setSelectedEmail: (email: any) => void
): LabelItem[] => {
  const { t } = useTranslation();

  const items: LabelItem[] = [
    {
      icon: <Tag className="h-4 w-4 text-purple-500" />,
      label: t('PERSONAL'),
      href: '/mail/personal',
    },
    {
      icon: <Tag className="h-4 w-4 text-secondary-400" />,
      label: t('WORK'),
      href: '/mail/work',
    },
    {
      icon: <Tag className="h-4 w-4 text-emerald-500" />,
      label: t('PAYMENTS'),
      href: '/mail/payments',
    },
    {
      icon: <Tag className="h-4 w-4 text-rose-500" />,
      label: t('INVOICES'),
      href: '/mail/invoices',
    },
  ];

  return items.map((item) => ({
    ...item,
    isActive: location.pathname === item.href,
    onClick: () => {
      navigate(item.href);
      setSelectedEmail(null);
    },
  }));
};
