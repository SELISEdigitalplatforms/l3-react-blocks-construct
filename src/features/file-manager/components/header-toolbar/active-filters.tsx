/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import { useTranslation } from 'react-i18next';
import { FilterConfig, FilterType } from '../../types/header-toolbar.type';
import { ActiveFilterBadge, ActiveFiltersContainer, getDateRangeLabel } from '../common-filters';

interface ActiveFiltersProps<T extends FilterType> {
  filters: T;
  filterConfigs: FilterConfig[];
  onFiltersChange: (filters: T) => void;
  onResetAll: () => void;
}

export const ActiveFilters = <T extends FilterType>({
  filters,
  filterConfigs,
  onFiltersChange,
  onResetAll,
}: ActiveFiltersProps<T>) => {
  const { t } = useTranslation();

  const createFilterBadges = () => {
    const badges: React.ReactElement[] = [];

    filterConfigs.forEach((config) => {
      const filterValue = (filters as any)[config.key];

      if (!filterValue) return;

      let label = '';
      let onRemove = () => {};

      switch (config.type) {
        case 'select':
          if (filterValue) {
            label = t(filterValue.toUpperCase());
            onRemove = () =>
              onFiltersChange({
                ...filters,
                [config.key]: undefined,
              } as T);
          }
          break;

        case 'dateRange':
          if (filterValue?.from || filterValue?.to) {
            const dateLabel = getDateRangeLabel(filterValue);
            if (dateLabel) {
              label = `${t(config.label)}: ${dateLabel}`;
              onRemove = () =>
                onFiltersChange({
                  ...filters,
                  [config.key]: undefined,
                } as T);
            }
          }
          break;

        case 'user':
          if (filterValue && config.users) {
            const selectedUser = config.users.find((user) => user.id === filterValue);
            if (selectedUser) {
              label = `${t(config.label)}: ${selectedUser.name}`;
              onRemove = () =>
                onFiltersChange({
                  ...filters,
                  [config.key]: undefined,
                } as T);
            }
          }
          break;
      }

      if (label) {
        badges.push(<ActiveFilterBadge key={config.key} label={label} onRemove={onRemove} />);
      }
    });

    return badges;
  };

  const activeFilters = createFilterBadges();

  return activeFilters.length > 0 ? (
    <ActiveFiltersContainer onResetAll={onResetAll}>{activeFilters}</ActiveFiltersContainer>
  ) : null;
};
