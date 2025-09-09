import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Label } from 'components/ui/label';
import { useToast } from 'hooks/use-toast';
import { useCalendarSettings } from '../../contexts/calendar-settings.context';
import {
  EVENT_DURATIONS_SELECT,
  TIME_SCALES_SELECT,
  WEEK_DAYS_SELECT,
} from '../../constants/calendar.constants';

interface CalendarSettingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * CalendarSettingSheet Component
 *
 * A settings sheet component for managing calendar preferences such as the first day of the week,
 * time scale, and default event duration. It provides a user interface for selecting these preferences
 * and saving or resetting them.
 *
 * Features:
 * - Select the first day of the week (e.g., Monday or Sunday).
 * - Choose a time scale for the calendar view (e.g., 15 mins, 30 mins, etc.).
 * - Set a default event duration for new events.
 * - Save updated settings or reset to default values.
 * - Dynamic control of sheet visibility.
 *
 * Props:
 * - `open`: `{boolean}` – Controls the visibility of the settings sheet.
 * - `onOpenChange`: `{Function}` – Callback triggered when the sheet's visibility changes.
 *
 * @param {CalendarSettingSheetProps} props - The props for configuring the settings sheet.
 * @returns {JSX.Element} The rendered JSX element for the calendar settings sheet.
 *
 * @example
 * <CalendarSettingSheet
 *   open={isSettingsSheetOpen}
 *   onOpenChange={setIsSettingsSheetOpen}
 * />
 */
export const CalendarSettingSheet = ({
  open,
  onOpenChange,
}: Readonly<CalendarSettingSheetProps>) => {
  const { settings, updateSettings, resetSettings } = useCalendarSettings();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(settings.firstDayOfWeek.toString());
  const [timeScale, setTimeScale] = useState(settings.timeScale.toString());
  const [defaultDuration, setDefaultDuration] = useState(settings.defaultDuration.toString());

  useEffect(() => {
    setFirstDayOfWeek(settings.firstDayOfWeek.toString());
    setTimeScale(settings.timeScale.toString());
    setDefaultDuration(settings.defaultDuration.toString());
  }, [settings]);

  const handleReset = () => {
    resetSettings();
    onOpenChange(false);
  };

  const handleSave = () => {
    updateSettings({
      firstDayOfWeek: parseInt(firstDayOfWeek),
      timeScale: parseInt(timeScale),
      defaultDuration: parseInt(defaultDuration),
    });
    toast({
      variant: 'success',
      title: t('UPDATED_SETTINGS'),
      description: t('SUCCESSFULLY_UPDATED_CALENDAR_SETTINGS'),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="flex flex-col h-screen sm:h-[calc(100dvh-48px)] justify-between w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px] sm:fixed sm:top-[57px]">
        <div className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="!text-left">{t('CALENDAR_SETTINGS')}</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-high-emphasis font-normal">
                {t('SHOW_FIRST_DAY_OF_WEEK_AS')}
              </Label>
              <Select value={firstDayOfWeek} onValueChange={setFirstDayOfWeek}>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT_FIRST_DAY')} />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS_SELECT.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {t(day.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-high-emphasis font-normal">{t('TIME_SCALE')}</Label>
              <Select value={timeScale} onValueChange={setTimeScale}>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT_TIME_SCALE')} />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SCALES_SELECT.map((scale) => (
                    <SelectItem key={scale.value} value={scale.value}>
                      {scale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-high-emphasis font-normal">
                {t('DEFAULT_EVENT_DURATION')}
              </Label>
              <Select value={defaultDuration} onValueChange={setDefaultDuration}>
                <SelectTrigger>
                  <SelectValue placeholder={t('SELECT_DEFAULT_DURATION')} />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_DURATIONS_SELECT.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col sm:flex-row gap-4">
          <Button variant="outline" className="w-full sm:w-1/2" onClick={handleReset}>
            {t('RESET_TO_DEFAULT')}
          </Button>
          <Button className="w-full sm:w-1/2" onClick={handleSave}>
            {t('SAVE')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
