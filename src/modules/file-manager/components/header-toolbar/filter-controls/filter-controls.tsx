import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterConfig, FilterType } from '@/modules/file-manager/types/header-toolbar.type';
import { DateRangeFilter, SelectFilter, UserFilter } from '../../common-filters/common-filters';

interface FilterControlsProps<T extends FilterType> {
  filters: T;
  filterConfigs: FilterConfig[];
  onFiltersChange: (filters: T) => void;
  isMobile?: boolean;
}

export const FilterControls = <T extends FilterType>({
  filters,
  filterConfigs,
  onFiltersChange,
  isMobile = false,
}: Readonly<FilterControlsProps<T>>) => {
  const { t } = useTranslation();

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    } as T);
  };

  const visibleConfigs = filterConfigs.filter((config) =>
    isMobile ? config.showInMobile !== false : config.showInDesktop !== false
  );

  return (
    <div className={`${isMobile ? 'space-y-4' : 'flex items-center gap-2'}`}>
      {visibleConfigs.map((config) => {
        const commonProps = {
          title: config.label,
          className: isMobile ? 'w-full' : config.width,
        };

        const filterComponent = renderFilterComponent(
          config,
          filters,
          handleFilterChange,
          commonProps
        );

        if (isMobile) {
          return (
            <div key={config.key} className="w-full">
              <label className="text-sm font-medium block mb-2">{t(config.label)}</label>
              {filterComponent}
            </div>
          );
        }

        return <React.Fragment key={config.key}>{filterComponent}</React.Fragment>;
      })}
    </div>
  );
};

type CommonFilterProps = {
  title: string;
  className?: string;
};

const renderFilterComponent = (
  config: FilterConfig,
  filters: FilterType,
  handleFilterChange: (key: string, value: any) => void,
  commonProps: CommonFilterProps
) => {
  const filterValue = (filters as any)[config.key];

  switch (config.type) {
    case 'select':
      return (
        <div className={commonProps.className}>
          <SelectFilter
            title={commonProps.title}
            value={filterValue}
            onValueChange={(value) => {
              const newValue = value === 'all' ? undefined : value;
              handleFilterChange(config.key, newValue);
            }}
            options={config.options || []}
            allLabel="ALL_TYPES"
          />
        </div>
      );

    case 'dateRange':
      return (
        <div className={commonProps.className}>
          <DateRangeFilter
            title={commonProps.title}
            date={filterValue}
            onDateChange={(dateRange) => handleFilterChange(config.key, dateRange)}
          />
        </div>
      );

    case 'user':
      return (
        <div className={commonProps.className}>
          <UserFilter
            title={commonProps.title}
            value={filterValue}
            onValueChange={(userId) => handleFilterChange(config.key, userId)}
            users={config.users || []}
          />
        </div>
      );

    default:
      return null;
  }
};
