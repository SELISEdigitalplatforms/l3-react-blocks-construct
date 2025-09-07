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

  const createRemoveHandler = (config: any) => () =>
    onFiltersChange({
      ...filters,
      [config.key]: undefined,
    } as T);

  const createSelectBadge = (config: any, filterValue: any) => {
    if (!filterValue) return null;

    return {
      label: t(filterValue.toUpperCase()),
      onRemove: createRemoveHandler(config),
    };
  };

  const createDateRangeBadge = (config: any, filterValue: any) => {
    if (!filterValue?.from && !filterValue?.to) return null;

    const dateLabel = getDateRangeLabel(filterValue);
    if (!dateLabel) return null;

    return {
      label: `${t(config.label)}: ${dateLabel}`,
      onRemove: createRemoveHandler(config),
    };
  };

  const createUserBadge = (config: any, filterValue: any) => {
    if (!filterValue || !config.users) return null;

    const selectedUser = config.users.find((user: any) => user.id === filterValue);
    if (!selectedUser) return null;

    return {
      label: `${t(config.label)}: ${selectedUser.name}`,
      onRemove: createRemoveHandler(config),
    };
  };

  const getBadgeData = (config: any, filterValue: any) => {
    switch (config.type) {
      case 'select':
        return createSelectBadge(config, filterValue);
      case 'dateRange':
        return createDateRangeBadge(config, filterValue);
      case 'user':
        return createUserBadge(config, filterValue);
      default:
        return null;
    }
  };

  const createFilterBadges = () => {
    const badges: React.ReactElement[] = [];

    filterConfigs.forEach((config) => {
      const filterValue = (filters as any)[config.key];
      if (!filterValue) return;

      const badgeData = getBadgeData(config, filterValue);
      if (badgeData) {
        badges.push(
          <ActiveFilterBadge
            key={config.key}
            label={badgeData.label}
            onRemove={badgeData.onRemove}
          />
        );
      }
    });

    return badges;
  };

  const activeFilters = createFilterBadges();

  return activeFilters.length > 0 ? (
    <ActiveFiltersContainer onResetAll={onResetAll}>{activeFilters}</ActiveFiltersContainer>
  ) : null;
};
