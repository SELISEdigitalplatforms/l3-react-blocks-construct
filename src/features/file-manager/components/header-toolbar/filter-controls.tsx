import { useTranslation } from 'react-i18next';
import { FilterConfig, FilterType } from '../../types/header-toolbar.type';
import { DateRangeFilter, SelectFilter, UserFilter } from '../common-filters';

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
}: FilterControlsProps<T>) => {
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
          key: config.key,
          title: config.label,
          className: isMobile ? 'w-full' : config.width,
        };

        if (isMobile) {
          return (
            <div key={config.key} className="w-full">
              <label className="text-sm font-medium block mb-2">{t(config.label)}</label>
              {renderFilterComponent(config, filters, handleFilterChange, commonProps)}
            </div>
          );
        }

        return renderFilterComponent(config, filters, handleFilterChange, commonProps);
      })}
    </div>
  );
};

const renderFilterComponent = (
  config: FilterConfig,
  filters: FilterType,
  handleFilterChange: (key: string, value: any) => void,
  commonProps: any
) => {
  const filterValue = (filters as any)[config.key];

  switch (config.type) {
    case 'select':
      return (
        <SelectFilter
          {...commonProps}
          value={filterValue}
          onValueChange={(value) => {
            const newValue = value === 'all' ? undefined : value;
            handleFilterChange(config.key, newValue);
          }}
          options={config.options || []}
          allLabel="ALL_TYPES"
        />
      );

    case 'dateRange':
      return (
        <DateRangeFilter
          {...commonProps}
          date={filterValue}
          onDateChange={(dateRange) => handleFilterChange(config.key, dateRange)}
        />
      );

    case 'user':
      return (
        <UserFilter
          {...commonProps}
          value={filterValue}
          onValueChange={(userId) => handleFilterChange(config.key, userId)}
          users={config.users || []}
        />
      );

    default:
      return null;
  }
};
