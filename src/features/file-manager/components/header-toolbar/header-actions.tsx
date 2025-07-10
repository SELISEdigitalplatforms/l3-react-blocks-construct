import React from 'react';

import { useTranslation } from 'react-i18next';
import { ActionConfig } from '../../types/header-toolbar.type';
import { Button } from 'components/ui/button';

interface HeaderActionsProps {
  actions: ActionConfig[];
  selectedItems: string[];
  isMobile?: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  actions,
  selectedItems,
  isMobile = false,
}) => {
  const { t } = useTranslation();

  const visibleActions = actions.filter(
    (action) => !action.showWhen || action.showWhen(selectedItems)
  );

  if (visibleActions.length === 0) return null;

  return (
    <div className="flex gap-2">
      {visibleActions.map((action) => {
        const Icon = action.icon;
        const showCount = selectedItems.length > 0 && action.key.includes('selected');

        return (
          <Button
            key={action.key}
            size={isMobile ? 'sm' : (action.size ?? 'sm')}
            variant={action.variant ?? 'outline'}
            className={isMobile ? 'h-8' : 'h-10 text-sm font-bold'}
            onClick={action.onClick}
          >
            <Icon className="h-4 w-4 mr-1" />
            {t(action.label)}
            {showCount && ` (${selectedItems.length})`}
          </Button>
        );
      })}
    </div>
  );
};
