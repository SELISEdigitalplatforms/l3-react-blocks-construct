import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CalendarSettings {
  firstDayOfWeek: number;
  timeScale: number;
  defaultDuration: number;
}

interface CalendarSettingsContextType {
  settings: CalendarSettings;
  updateSettings: (newSettings: Partial<CalendarSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: CalendarSettings = {
  firstDayOfWeek: 1,
  timeScale: 30,
  defaultDuration: 30,
};

const CalendarSettingsContext = createContext<CalendarSettingsContextType | undefined>(undefined);

/**
 * CalendarSettingsProvider Component
 *
 * A context provider component that manages calendar settings such as the first day of the week,
 * time scale, and default event duration. It provides functions to update and reset these settings.
 *
 * Features:
 * - Provides a centralized state for calendar settings.
 * - Allows updating specific settings using `updateSettings`.
 * - Resets settings to their default values using `resetSettings`.
 *
 * Props:
 * - `children`: `{ReactNode}` – The child components that will have access to the calendar settings context.
 *
 * @param {Object} props - The props for the provider component.
 * @param {ReactNode} props.children - The child components wrapped by the provider.
 *
 * @example
 * <CalendarSettingsProvider>
 *   <App />
 * </CalendarSettingsProvider>
 */

/**
 * useCalendarSettings Hook
 *
 * A custom hook to access the calendar settings context. It provides the current settings,
 * a function to update settings, and a function to reset settings to their defaults.
 *
 * Returns:
 * - `settings`: `{CalendarSettings}` – The current calendar settings.
 * - `updateSettings`: `{Function}` – Updates specific settings. Accepts a partial object of `CalendarSettings`.
 * - `resetSettings`: `{Function}` – Resets all settings to their default values.
 *
 * @returns {CalendarSettingsContextType} The calendar settings context value.
 *
 * @example
 * const { settings, updateSettings, resetSettings } = useCalendarSettings();
 * updateSettings({ timeScale: 15 });
 */

/**
 * CalendarSettings Interface
 *
 * Represents the structure of calendar settings.
 *
 * Properties:
 * - `firstDayOfWeek`: `{number}` – The first day of the week (e.g., 0 for Sunday, 1 for Monday).
 * - `timeScale`: `{number}` – The time scale in minutes (e.g., 15, 30, 60).
 * - `defaultDuration`: `{number}` – The default duration of events in minutes.
 */

/**
 * CalendarSettingsContextType Interface
 *
 * Represents the context value provided by the `CalendarSettingsProvider`.
 *
 * Properties:
 * - `settings`: `{CalendarSettings}` – The current calendar settings.
 * - `updateSettings`: `{Function}` – Updates specific settings. Accepts a partial object of `CalendarSettings`.
 * - `resetSettings`: `{Function}` – Resets all settings to their default values.
 */

/**
 * defaultSettings Constant
 *
 * The default calendar settings used when initializing the context or resetting settings.
 *
 * Properties:
 * - `firstDayOfWeek`: `{number}` – Defaults to `1` (Monday).
 * - `timeScale`: `{number}` – Defaults to `30` minutes.
 * - `defaultDuration`: `{number}` – Defaults to `30` minutes.
 */
type CalendarSettingsProviderProps = {
  children: ReactNode;
};

export const CalendarSettingsProvider = ({ children }: Readonly<CalendarSettingsProviderProps>) => {
  const [settings, setSettings] = useState<CalendarSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<CalendarSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
    }),
    [settings]
  );

  return (
    <CalendarSettingsContext.Provider value={contextValue}>
      {children}
    </CalendarSettingsContext.Provider>
  );
};

export function useCalendarSettings() {
  const context = useContext(CalendarSettingsContext);
  if (context === undefined) {
    throw new Error('useCalendarSettings must be used within a CalendarSettingsProvider');
  }
  return context;
}

export { defaultSettings };
