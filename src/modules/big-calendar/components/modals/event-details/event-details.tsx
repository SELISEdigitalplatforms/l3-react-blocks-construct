import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp, Link, Trash, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from '@/components/ui-kit/dialog';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/core';
import { CalendarEvent, DeleteUpdateEventOption } from '../../../types/calendar-event.types';
import { MEMBER_STATUS } from '../../../enums/calendar.enum';
import { DeleteRecurringEvent } from '../delete-recurring-event/delete-recurring-event';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onNext: () => void;
  onDelete: (eventId: string, deleteOption?: DeleteUpdateEventOption) => void;
  onRestore?: () => boolean;
}

// Extracted constants to avoid duplication
const ICON_SIZE_CLASS = 'w-5 h-5';
const TEXT_BASE_CLASS = 'text-base';
const TEXT_HIGH_EMPHASIS = 'text-high-emphasis';
const TEXT_MEDIUM_EMPHASIS = 'text-medium-emphasis';
const TEXT_LOW_EMPHASIS = 'text-low-emphasis';

/**
 * EventDetails Component
 *
 * A dialog-based component for displaying detailed information about a calendar event.
 * It shows event details such as title, date/time, meeting link, participants, and description.
 * Additionally, it provides options to edit or delete the event and supports toggling the visibility of long descriptions.
 *
 * Features:
 * - Displays event details like title, start/end time, meeting link, and participant status.
 * - Handles truncation of long descriptions with a "Show more/less" toggle button.
 * - Provides buttons to edit or delete the event.
 * - Displays a confirmation modal before deleting the event.
 *
 * Props:
 * - `event`: `{CalendarEvent}` – The event object containing details like title, start/end time, meeting link, members, and description.
 * - `onClose`: `{Function}` – Callback triggered when the dialog is closed.
 * - `onNext`: `{Function}` – Callback triggered when the "Edit" button is clicked.
 * - `onDelete`: `{Function}` – Callback triggered when the event is deleted. Receives the event ID as an argument.
 *
 * @param {EventDetailsProps} props - The props for configuring the event details dialog.
 */
export const EventDetails = ({
  event,
  onClose,
  onNext,
  onDelete,
  onRestore,
}: Readonly<EventDetailsProps>) => {
  const { toast, dismiss } = useToast();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRecurringDeleteDialog, setShowRecurringDeleteDialog] = useState(false);

  const members = event.resource?.members || [];

  // Extracted member count calculations to avoid duplication
  const getMemberCounts = () => {
    const acceptedCount = members.filter((m) => m.status === MEMBER_STATUS.ACCEPTED).length;
    const declinedCount = members.filter((m) => m.status === MEMBER_STATUS.DECLINED).length;
    const noResponseCount = members.filter((m) => m.status === MEMBER_STATUS.NORESPONSE).length;

    return { acceptedCount, declinedCount, noResponseCount };
  };

  const { acceptedCount, declinedCount, noResponseCount } = getMemberCounts();

  // Extracted common dialog close logic
  const closeDialogsAndParent = () => {
    onClose();
    setShowDeleteDialog(false);
    setShowRecurringDeleteDialog(false);
  };

  // Extracted event deletion success toast
  const showDeletionSuccessToast = () => {
    toast({
      variant: 'success',
      title: t('EVENT_DELETED'),
      description: t('EVENT_SUCCESSFULLY_REMOVE_CALENDAR'),
      action: onRestore ? (
        <Button variant="link" size="sm" onClick={handleUndoDelete}>
          {t('UNDO')}
        </Button>
      ) : undefined,
    });
  };

  // Handle undo delete action
  const handleUndoDelete = () => {
    if (onRestore) {
      onRestore();
      dismiss();
    }
  };

  useEffect(() => {
    const checkTruncation = () => {
      const el = descriptionRef.current;
      if (el) {
        const isTruncated = el.scrollHeight > el.clientHeight;
        setShowToggleButton(isTruncated);
      }
    };

    const timeout = setTimeout(checkTruncation, 0);
    return () => clearTimeout(timeout);
  }, [event.resource?.description]);

  const handleDeleteClick = () => {
    if (event.resource?.recurring) {
      setShowRecurringDeleteDialog(true);
    } else {
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(event.eventId ?? '');
    closeDialogsAndParent();
    showDeletionSuccessToast();
  };

  const handleRecurringDeleteConfirm = (deleteOption: DeleteUpdateEventOption) => {
    onDelete(event.eventId ?? '', deleteOption);
    closeDialogsAndParent();
    showDeletionSuccessToast();
  };

  const handleMeetingLinkClick = () => {
    toast({
      variant: 'success',
      title: t('OPENING_MEETING_LINK'),
      description: t('REDIRECTING_MEETING_LINK'),
    });
  };

  // Extracted date formatting logic
  const getFormattedDateTimeString = () => {
    return event?.allDay
      ? `${format(event.start, 'dd.MM.yyyy')}, ${t('WHOLE_DAY')}`
      : `${format(event.start, 'dd.MM.yyyy, HH:mm')} - ${format(event.end, 'HH:mm')}`;
  };

  // Extracted meeting link rendering logic
  const renderMeetingLink = () => {
    if (event.resource?.meetingLink) {
      return (
        <button
          type="button"
          onClick={handleMeetingLinkClick}
          className="bg-transparent border-none p-0 text-base font-normal underline text-primary leading-6 break-all hover:text-primary-800 cursor-pointer w-[90%] text-left"
        >
          {event.resource.meetingLink}
        </button>
      );
    }

    return (
      <span className={`${TEXT_BASE_CLASS} leading-6 ${TEXT_LOW_EMPHASIS}`}>
        {t('NO_MEETING_LINK')}
      </span>
    );
  };

  // Extracted members section rendering
  const renderMembersSection = () => {
    if (members.length === 0) return null;

    return (
      <div className="flex gap-2">
        <Users className={`${ICON_SIZE_CLASS} ${TEXT_MEDIUM_EMPHASIS}`} />
        <div className="flex flex-col gap-1">
          <p className={`font-semibold ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
            {members.length} {t('INVITED')}
          </p>
          <p className={`font-normal text-xs ${TEXT_MEDIUM_EMPHASIS}`}>
            {t('ACCEPTED')} {acceptedCount}, {t('DIDNT_RESPOND')} {noResponseCount}, &
            {t('DECLINED')} {declinedCount}
          </p>
        </div>
      </div>
    );
  };

  // Extracted description section rendering
  const renderDescriptionSection = () => {
    if (!event.resource?.description) return null;

    return (
      <div className="flex flex-col items-start gap-3">
        <p className={`font-semibold ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
          {t('DESCRIPTION')}
        </p>
        <div className="flex-1" style={{ minHeight: '60px' }}>
          <p
            ref={descriptionRef}
            className={`font-normal text-sm ${TEXT_HIGH_EMPHASIS} transition-all ${
              !isExpanded && 'line-clamp-3'
            }`}
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: isExpanded ? 'unset' : 3,
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: event.resource.description }}
          />
          {showToggleButton && (
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm font-semibold ${TEXT_HIGH_EMPHASIS} mt-2`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              {isExpanded ? t('SHOW_LESS') : t('SHOW_MORE')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col w-full gap-4">
            {/* Date/Time Section */}
            <div className="flex items-center gap-2">
              <Calendar className={`${ICON_SIZE_CLASS} ${TEXT_MEDIUM_EMPHASIS}`} />
              <p className={`font-semibold ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
                {getFormattedDateTimeString()}
              </p>
            </div>

            {/* Meeting Link Section */}
            <div className="flex gap-2">
              <Link
                className={`${ICON_SIZE_CLASS} mt-1 ${
                  event.resource?.meetingLink ? TEXT_MEDIUM_EMPHASIS : TEXT_LOW_EMPHASIS
                }`}
              />
              {renderMeetingLink()}
            </div>

            {/* Members Section */}
            {renderMembersSection()}

            {/* Description Section */}
            {renderDescriptionSection()}
          </div>

          <DialogFooter className="flex !flex-row w-full !justify-between items-center mt-6">
            <Button variant="outline" size="icon" onClick={handleDeleteClick}>
              <Trash className="w-5 h-4 text-destructive" />
            </Button>
            <Button variant="outline" onClick={onNext}>
              {t('EDIT')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('DELETE_EVENT')}
        description={
          <>
            {t('ARE_YOU_SURE_WANT_DELETE_EVENT')}{' '}
            <span className={`font-semibold ${TEXT_HIGH_EMPHASIS}`}>{event.title}</span>?{' '}
            {t('THIS_ACTION_CANNOT_UNDONE')}
          </>
        }
        onConfirm={handleDeleteConfirm}
      />

      <DeleteRecurringEvent
        open={showRecurringDeleteDialog}
        onOpenChange={setShowRecurringDeleteDialog}
        eventTitle={event.title}
        onConfirm={handleRecurringDeleteConfirm}
      />
    </>
  );
};
