import { useEffect, useState } from 'react';
import { Search, ListFilter, Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SlotInfo } from 'react-big-calendar';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui-kit/button';
import { Dialog } from '@/components/ui-kit/dialog';
import { Input } from '@/components/ui-kit/input';
import { AddEvent } from '../modals/add-event/add-event';
import { CalendarFilterSheet } from '../calendar-filters-sheet/calendar-filters-sheet';
import { CalendarSettingSheet } from '../calendar-setting-sheet/calendar-setting-sheet';

interface BigCalendarHeaderProps {
  title?: string;
  onAddEvent: () => void;
  selectedSlot: SlotInfo | null;
  onEventSubmit: (data: any) => void;
  onDialogClose: () => void;
  onApplyFilters: (filters: { dateRange: DateRange; color: string | null }) => void;
  searchPlaceholder?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * BigCalendarHeader Component
 *
 * A header component for a calendar interface that provides search, filtering, settings,
 * and event creation functionalities. It dynamically manages interactions with the calendar
 * and supports various user actions such as adding events, applying filters, and managing settings.
 *
 * Features:
 * - Search functionality for filtering calendar content
 * - Buttons for opening filter and settings sheets
 * - Event creation dialog triggered by clicking the "Add Event" button
 * - Dynamic control of overflow behavior when sheets are open
 *
 * Props:
 * - `title`: `{string}` (optional) – The title displayed in the header. Defaults to `'Calendar'`.
 * - `onAddEvent`: `{Function}` – Callback triggered when the "Add Event" button is clicked.
 * - `selectedSlot`: `{SlotInfo | null}` – Information about the currently selected slot in the calendar.
 * - `onEventSubmit`: `{Function}` – Callback to handle event submission with data `{ title: string, start: string, end: string }`.
 * - `onDialogClose`: `{Function}` – Callback to close the event dialog.
 * - `onApplyFilters`: `{Function}` – Callback to apply filters with data `{ dateRange: DateRange, color: string | null }`.
 * - `searchPlaceholder`: `{string}` (optional) – Placeholder text for the search input field. Defaults to `'Search'`.
 * - `onSearchChange`: `{Function}` – Callback triggered when the search input value changes.
 *
 * @param {BigCalendarHeaderProps} props - The props for configuring the calendar header.
 * @example
 * <BigCalendarHeader
 *   title="My Calendar"
 *   onAddEvent={handleAddEvent}
 *   selectedSlot={selectedSlot}
 *   onEventSubmit={handleSubmitEvent}
 *   onDialogClose={handleDialogClose}
 *   onApplyFilters={handleApplyFilters}
 *   searchPlaceholder="Find events..."
 *   onSearchChange={handleSearchChange}
 * />
 */

export const BigCalendarHeader = ({
  title = 'CALENDAR',
  onAddEvent,
  selectedSlot,
  onEventSubmit,
  onDialogClose,
  searchPlaceholder = 'SEARCH',
  onSearchChange,
  onApplyFilters,
}: Readonly<BigCalendarHeaderProps>) => {
  const [openSheet, setOpenSheet] = useState(false);
  const [openSettingsSheet, setOpenSettingsSheet] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (openSheet || openSettingsSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet, openSettingsSheet]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold leading-9">{t(title)}</h1>
        <div className="flex items-center min-w-[82%] gap-2 sm:justify-end">
          <div className="relative w-full sm:w-[45%]">
            <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 bg-background" />
            <Input
              placeholder={t(searchPlaceholder)}
              className="h-8 w-full rounded-lg bg-background pl-8"
              onChange={onSearchChange}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-bold sm:min-w-[116px]"
            onClick={() => setOpenSheet(true)}
          >
            <ListFilter className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only">{t('FILTERS')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-bold sm:min-w-[116px]"
            onClick={() => setOpenSettingsSheet(true)}
          >
            <Settings className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only">{t('SETTINGS')}</span>
          </Button>
          <Button size="sm" onClick={onAddEvent} className="text-sm font-bold sm:min-w-[116px]">
            <Plus className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only">{t('ADD_EVENT')}</span>
          </Button>
        </div>
      </div>
      <Dialog open={!!selectedSlot} onOpenChange={onDialogClose}>
        {selectedSlot && (
          <AddEvent
            start={selectedSlot.start}
            end={selectedSlot.end}
            onSubmit={onEventSubmit}
            onCancel={onDialogClose}
          />
        )}
      </Dialog>
      <CalendarFilterSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        onApplyFilters={(filters) => {
          onApplyFilters?.(filters);
          setOpenSheet(false);
        }}
      />
      <CalendarSettingSheet open={openSettingsSheet} onOpenChange={setOpenSettingsSheet} />
    </>
  );
};
