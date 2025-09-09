import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PlusCircle, X, Check, Search } from 'lucide-react';
import { Input } from 'components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Badge } from 'components/ui/badge';
import { DateRange } from '../types/file-manager.type';
import { IFileDataWithSharing } from '../utils/file-manager';

export interface BasicFilters {
  name?: string;
  fileType?: string;
}

export interface SharedFilters extends BasicFilters {
  sharedBy?: string;
  sharedDate?: { from?: Date; to?: Date };
  modifiedDate?: { from?: Date; to?: Date };
}

export const createBasicFileFilter = () => {
  return (files: IFileDataWithSharing[], filters: BasicFilters) => {
    return files.filter((file) => {
      const matchesName =
        !filters.name || file.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.fileType || file.fileType === filters.fileType;
      return matchesName && matchesType;
    });
  };
};

export const createSharedFileFilter = () => {
  const validateFilter = (file: IFileDataWithSharing, filters: SharedFilters) => {
    if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.fileType && file.fileType !== filters.fileType) {
      return false;
    }
    if (filters.sharedBy && file.sharedBy?.id !== filters.sharedBy) {
      return false;
    }
    return true;
  };

  return (files: IFileDataWithSharing[], filters: Record<string, any>) => {
    const sharedFilters = filters as SharedFilters;
    return files.filter((file) => validateFilter(file, sharedFilters));
  };
};

interface User {
  id: string;
  name: string;
}

export interface FileFilters {
  name: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  lastModified?: DateRange;
  sharedBy?: string;
}

interface BaseFilterPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  displayValue: string;
  onClear?: () => void;
  showClearInHeader?: boolean;
  children: React.ReactNode;
}

const BaseFilterPopover: React.FC<BaseFilterPopoverProps> = ({
  isOpen,
  onOpenChange,
  title,
  displayValue,
  onClear,
  showClearInHeader = false,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 px-3 justify-start">
          <PlusCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">{t(title)}</div>
            <div className="flex gap-2">
              {showClearInHeader && onClear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onClear();
                    onOpenChange(false);
                  }}
                >
                  Clear filter
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface DateRangeFilterProps {
  date?: DateRange;
  onDateChange: (date?: DateRange) => void;
  title: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ date, onDateChange, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleDateSelect = (selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (!selectedDate) return;

    const cleanDate = new Date(selectedDate);

    if (type === 'from') {
      cleanDate.setHours(0, 0, 0, 0);
    } else {
      cleanDate.setHours(23, 59, 59, 999);
    }

    const newRange = {
      from: type === 'from' ? cleanDate : date?.from,
      to: type === 'to' ? cleanDate : date?.to,
    };

    onDateChange(newRange);
  };

  const clearDateRange = () => {
    onDateChange(undefined);
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from && !range?.to) return t(title);
    if (range.from && !range.to) return `From ${range.from.toLocaleDateString()}`;
    if (!range.from && range.to) return `Until ${range.to?.toLocaleDateString()}`;
    return `${range.from?.toLocaleDateString()} - ${range.to?.toLocaleDateString()}`;
  };

  return (
    <BaseFilterPopover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={title}
      displayValue={formatDateRange(date)}
    >
      <div className="space-x-4 flex">
        <div>
          <h3 className="text-xs text-muted-foreground mb-2 block">From</h3>
          <Calendar
            mode="single"
            selected={date?.from}
            onSelect={(date) => handleDateSelect(date, 'from')}
            className="rounded-md border"
          />
        </div>
        <div>
          <h3 className="text-xs text-muted-foreground mb-2 block">To</h3>
          <Calendar
            mode="single"
            selected={date?.to}
            onSelect={(date) => handleDateSelect(date, 'to')}
            className="rounded-md border"
          />
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <Button variant="outline" onClick={clearDateRange} className="w-full">
          Clear filter
        </Button>
      </div>
    </BaseFilterPopover>
  );
};

interface UserFilterProps {
  value?: string;
  onValueChange: (value?: string) => void;
  title: string;
  users: User[];
}

const UserFilter: React.FC<UserFilterProps> = ({ value, onValueChange, title, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const selectedUser = users.find((user) => user.id === value);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <BaseFilterPopover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={title}
      displayValue={selectedUser ? selectedUser.name : t(title)}
      onClear={() => onValueChange()}
      showClearInHeader
    >
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => {
              onValueChange(user.id);
              setIsOpen(false);
            }}
          >
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {getUserInitials(user.name)}
              </span>
            </div>
            <span className="text-sm">{user.name}</span>
            {value === user.id && <Check className="h-4 w-4 text-primary" />}
          </button>
        ))}
      </div>
    </BaseFilterPopover>
  );
};

interface SelectFilterProps {
  value?: string;
  onValueChange: (value: string) => void;
  title: string;
  options: Array<{ value: string; label: string }>;
  allValue?: string;
  allLabel?: string;
  className?: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  onValueChange,
  title,
  options,
  allValue = 'all',
  allLabel = 'All',
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Select value={value ?? allValue} onValueChange={onValueChange}>
      <SelectTrigger className={`h-8 ${className ?? 'w-[140px]'}`}>
        <PlusCircle className="h-4 w-4 mr-1" />
        <SelectValue placeholder={t(title)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>{t(allLabel)}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface ActiveFilterBadgeProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const ActiveFilterBadge: React.FC<ActiveFilterBadgeProps> = ({
  label,
  onRemove,
  variant = 'secondary',
}) => {
  return (
    <Badge variant={variant} className="h-6 text-foreground">
      {label}
      <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={onRemove}>
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};

interface ActiveFiltersContainerProps {
  children: React.ReactNode;
  onResetAll?: () => void;
  resetLabel?: string;
}

const ActiveFiltersContainer: React.FC<ActiveFiltersContainerProps> = ({
  children,
  onResetAll,
  resetLabel = 'RESET',
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-2">{children}</div>
      {onResetAll && (
        <Button variant="ghost" onClick={onResetAll} className="h-8 px-2">
          {t(resetLabel)}
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  onClear,
}) => {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className ?? 'flex-1 max-w-md'}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder={t(placeholder)}
        value={value}
        onChange={handleInputChange}
        className="h-8 w-full rounded-lg bg-background pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

const getDateRangeLabel = (dateRange?: DateRange) => {
  if (!dateRange?.from && !dateRange?.to) return null;

  if (dateRange.from && dateRange.to) {
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  }

  if (dateRange.from) {
    return `From ${dateRange.from.toLocaleDateString()}`;
  }

  if (dateRange.to) {
    return `Until ${dateRange.to.toLocaleDateString()}`;
  }

  return null;
};

const countActiveFilters = (filters: Record<string, any>) => {
  return Object.values(filters).filter((value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      return value.from || value.to;
    }
    return true;
  }).length;
};

export {
  BaseFilterPopover,
  DateRangeFilter,
  UserFilter,
  SelectFilter,
  ActiveFilterBadge,
  ActiveFiltersContainer,
  SearchInput,
  getDateRangeLabel,
  countActiveFilters,
};

export type {
  DateRange,
  User,
  BaseFilterPopoverProps,
  DateRangeFilterProps,
  UserFilterProps,
  SelectFilterProps,
  ActiveFilterBadgeProps,
  ActiveFiltersContainerProps,
  SearchInputProps,
};
