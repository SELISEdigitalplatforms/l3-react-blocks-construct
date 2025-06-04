import { TFunction } from 'i18next';
import { CheckCircle, Clock, FileWarning, AlertCircle } from 'lucide-react';

/**
 * Returns an array of status filter options for the invoice table.
 * Each option includes a value, label, and icon.
 * 
 * @param {TFunction} t - Translation function from i18next
 * @returns {Array} Array of status options with value, label, and icon
 */
export const getStatusOptions = (t: TFunction) => [
  {
    value: 'Paid',
    label: t('PAID'),
    icon: CheckCircle,
    className: 'text-success',
  },
  {
    value: 'Pending',
    label: t('PENDING'),
    icon: Clock,
    className: 'text-warning',
  },
  {
    value: 'Overdue',
    label: t('OVERDUE'),
    icon: AlertCircle,
    className: 'text-error',
  },
  {
    value: 'Draft',
    label: t('DRAFT'),
    icon: FileWarning,
    className: 'text-medium-emphasis',
  },
];
