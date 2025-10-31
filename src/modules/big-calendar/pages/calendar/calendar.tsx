import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from '@/components/core';
import { useCalendarEvents } from '../../hooks/use-calendar-events';
import { CalendarSettingsProvider } from '../../contexts/calendar-settings.context';
import { BigCalendarHeader } from '../../components/big-calendar-header/big-calendar-header';
import { BigCalendar } from '../../components/big-calendar/big-calendar';
import { CalendarModalState } from '../../enums/calendar.enum';
import { EventInvitation } from '../../components/modals/event-invitation/event-invitation';
import { EventDetails } from '../../components/modals/event-details/event-details';
import { EditEvent } from '../../components/modals/edit-event/edit-event';
import { EditRecurrence } from '../../components/modals/edit-recurrence/edit-recurrence';
import { useCalendarUI } from '../../hooks/use-calendar-ui';

/**
 * CalendarPage Component
 *
 * A page component that integrates a calendar interface with event management functionality.
 * It provides features for adding, editing, deleting, and filtering events, as well as viewing event details.
 * The component uses the `react-big-calendar` library for the calendar view and supports modals for managing events.
 *
 */
export const CalendarPage = () => {
  const { t } = useTranslation();
  const {
    events,
    currentUserId,
    handleRespond,
    handleSearch: handleSearchChange,
    addEvent,
    deleteEvent: handleDelete,
    updateEvent: handleEventUpdate,
    filterEvents: onFilterEvents,
    restoreEvent,
  } = useCalendarEvents();

  const {
    selectedSlot,
    setSelectedSlot,
    currentDialog,
    selectedEvent,
    tempEvent,
    showConfirmModal,
    setShowConfirmModal,
    closeAllModals,
    createDefaultSlot,
    handleSelectEvent,
    handleEventInteraction,
    navigateToEditEvent,
    navigateToRecurrence,
    updateSelectedEventRecurring,
    updateSelectedEventWithRecurringEvents,
  } = useCalendarUI();

  return (
    <CalendarSettingsProvider>
      <div className="flex w-full flex-col gap-5">
        <BigCalendarHeader
          title={t('CALENDAR')}
          onAddEvent={() => setSelectedSlot(createDefaultSlot())}
          selectedSlot={selectedSlot}
          onEventSubmit={(data) => {
            const success = addEvent(data);
            if (success) setSelectedSlot(null);
          }}
          onDialogClose={() => setSelectedSlot(null)}
          onApplyFilters={onFilterEvents}
          onSearchChange={handleSearchChange}
        />

        <BigCalendar
          eventList={events}
          onSelectSlot={setSelectedSlot}
          onSelectEvent={(event) => handleSelectEvent(event)}
          onEventDrop={handleEventInteraction}
          onEventResize={handleEventInteraction}
        />

        {currentDialog === CalendarModalState.EVENT_DETAIL &&
          selectedEvent &&
          (selectedEvent.resource?.invitationAccepted === false ? (
            <EventInvitation
              event={selectedEvent}
              onClose={closeAllModals}
              currentUserId={currentUserId}
              onRespond={handleRespond}
            />
          ) : (
            <EventDetails
              event={selectedEvent}
              onClose={closeAllModals}
              onNext={navigateToEditEvent}
              onDelete={handleDelete}
              onRestore={restoreEvent}
            />
          ))}

        {currentDialog === CalendarModalState.EDIT_EVENT && selectedEvent && (
          <EditEvent
            event={selectedEvent}
            onDelete={handleDelete}
            onClose={closeAllModals}
            onUpdate={handleEventUpdate}
            onNext={navigateToRecurrence}
            onRestore={restoreEvent}
          />
        )}

        {currentDialog === CalendarModalState.EVENT_RECURRENCE && selectedEvent && (
          <EditRecurrence
            event={selectedEvent}
            onNext={updateSelectedEventRecurring}
            setEvents={(events) => {
              if (Array.isArray(events)) {
                updateSelectedEventWithRecurringEvents(events);
              }
            }}
          />
        )}

        {tempEvent && (
          <ConfirmationModal
            open={showConfirmModal}
            onOpenChange={setShowConfirmModal}
            title={t('WANT_TO_RESCHEDULE_THIS_EVENT')}
            description={
              <div>
                <p>
                  {t('NEW_DATE')}: {format(tempEvent.start, 'yyyy-MM-dd')}
                </p>
                <p>
                  {t('NEW_TIME')}: {format(tempEvent.start, 'HH:mm')} -{' '}
                  {format(tempEvent.end, 'HH:mm')}
                </p>
              </div>
            }
            confirmText={t('EDIT_EVENT')}
            cancelText={t('DISCARD')}
            onConfirm={() => {
              setShowConfirmModal(false);
              handleSelectEvent(tempEvent);
              navigateToEditEvent();
            }}
          />
        )}
      </div>
    </CalendarSettingsProvider>
  );
};
