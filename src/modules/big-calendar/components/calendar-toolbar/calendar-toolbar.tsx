import { ToolbarProps, View } from 'react-big-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-kit/tabs';

/**
 * CalendarToolbar Component
 *
 * A toolbar component for managing navigation and view switching in a calendar interface.
 * It provides buttons for navigating to the current day, previous/next time periods, and
 * switching between different calendar views (e.g., day, week, month).
 *
 * Features:
 * - "Today" button to navigate to the current day.
 * - Navigation buttons for moving to the previous or next time period.
 * - A label displaying the current date range or selected period.
 * - Tabs for switching between available calendar views (e.g., day, week, month).
 *
 * Props:
 * - `view`: `{View}` – The currently active calendar view (e.g., 'day', 'week', 'month').
 * - `onNavigate`: `{Function}` – Callback triggered when navigating to a specific time period (e.g., 'TODAY', 'PREV', 'NEXT').
 * - `onView`: `{Function}` – Callback triggered when switching the calendar view.
 * - `label`: `{string}` – The label displaying the current date range or selected period.
 * - `views`: `{View[]}` – An array of available calendar views (e.g., ['day', 'week', 'month']).
 *
 * @param {ToolbarProps} props - The props for configuring the calendar toolbar.
 * @example
 * <CalendarToolbar
 *   view="month"
 *   onNavigate={(action) => handleNavigate(action)}
 *   onView={(view) => handleViewChange(view)}
 *   label="January 2023"
 *   views={['day', 'week', 'month']}
 * />
 */

export const CalendarToolbar = ({
  view,
  onNavigate,
  onView,
  label,
  views,
}: Readonly<ToolbarProps>) => {
  const allViews = views as View[];
  const { t } = useTranslation();

  return (
    <div className="flex justify-between flex-col sm:flex-row items-center border-b border-border py-3 px-3 gap-2 sm:px-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => onNavigate('TODAY')} className="text-sm font-bold">
          {t('TODAY')}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('PREV')}>
            <ChevronLeft className="!h-5 !w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate('NEXT')}>
            <ChevronRight className="!h-5 !w-5" />
          </Button>
        </div>
        <p className="text-high-emphasis text-base sm:text-2xl font-semibold">{label}</p>
      </div>
      <Tabs value={view} onValueChange={(view) => onView(view as View)}>
        <TabsList className="bg-surface rounded-[4px]">
          {allViews.map((view) => (
            <TabsTrigger
              key={view}
              value={view}
              className="capitalize data-[state=active]:bg-white data-[state=active]:rounded-[4px]"
            >
              {t(view.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
