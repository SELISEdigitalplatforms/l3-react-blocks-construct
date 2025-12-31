import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, ChevronDown, ChevronUp, Link, Users, X } from 'lucide-react';
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
import { CalendarEvent } from '../../../types/calendar-event.types';
import { MEMBER_STATUS } from '../../../enums/calendar.enum';

interface EventInvitationProps {
  event: CalendarEvent;
  onClose: () => void;
  currentUserId: string;
  onRespond: (eventId: string, status: MEMBER_STATUS.ACCEPTED | MEMBER_STATUS.DECLINED) => void;
}

// Extracted constants to avoid duplication
const ICON_SIZE_CLASS = 'w-5 h-5';
const ICON_SIZE_SM_CLASS = 'w-4 h-4';
const TEXT_BASE_CLASS = 'text-base';
const TEXT_HIGH_EMPHASIS = 'text-high-emphasis';
const TEXT_MEDIUM_EMPHASIS = 'text-medium-emphasis';
const TEXT_LOW_EMPHASIS = 'text-low-emphasis';
const FONT_SEMIBOLD = 'font-semibold';
const FONT_NORMAL = 'font-normal';

/**
 * EventInvitation
 *
 * Dialog for viewing and responding to a calendar event invitation.
 *
 * Displays event title, date/time (or all-day), meeting link, participant summary,
 * and rich HTML description with "Show more/less" toggling.
 *
 * Shows current user's response status and lets them Accept, Decline,
 * or Change their response, with toast notifications on action.
 *
 * @param props.event - CalendarEvent object with id, title, start/end, allDay, and resource:
 *   - meetingLink: optional URL string.
 *   - description: optional HTML string.
 *   - members: array of { id, name, status }.
 * @param props.currentUserId - ID of the current user to track their member status.
 * @param props.onClose - Callback fired when the dialog is closed.
 * @param props.onRespond - Callback fired when user responds; receives (eventId, status).
 * @returns JSX.Element - Rendered EventInvitation dialog.
 */
export const EventInvitation = ({
  event,
  onClose,
  currentUserId,
  onRespond,
}: Readonly<EventInvitationProps>) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggleButton, setShowToggleButton] = useState(false);

  const members = event.resource?.members || [];
  const currentMember = members.find((m) => m.id === currentUserId);
  const [responseStatus, setResponseStatus] = useState<MEMBER_STATUS>(
    currentMember?.status ?? MEMBER_STATUS.NORESPONSE
  );

  // Extracted member count calculations to avoid duplication
  const getMemberCounts = () => {
    const acceptedCount = members.filter((m) => m.status === MEMBER_STATUS.ACCEPTED).length;
    const declinedCount = members.filter((m) => m.status === MEMBER_STATUS.DECLINED).length;
    const noResponseCount = members.filter((m) => m.status === MEMBER_STATUS.NORESPONSE).length;

    return { acceptedCount, declinedCount, noResponseCount };
  };

  const { acceptedCount, declinedCount, noResponseCount } = getMemberCounts();

  const showResponseToast = (status: MEMBER_STATUS.ACCEPTED | MEMBER_STATUS.DECLINED) => {
    const statusText =
      status === MEMBER_STATUS.ACCEPTED ? t('YOU_ACCEPTED_INVITATION') : t('DECLINED');

    toast({
      variant: 'success',
      title: `${t('INVITATION')} ${statusText}`,
      description:
        status === MEMBER_STATUS.ACCEPTED
          ? t('YOU_ACCEPTED_INVITATION')
          : t('YOU_DECLINED_INVITATION'),
    });
  };

  const showMeetingLinkToast = () => {
    toast({
      variant: 'success',
      title: t('OPENING_MEETING_LINK'),
      description: t('REDIRECTING_MEETING_LINK'),
    });
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

  const handleRespond = (status: MEMBER_STATUS.ACCEPTED | MEMBER_STATUS.DECLINED) => {
    if (!event.eventId) return;

    onRespond(event.eventId, status);
    setResponseStatus(status);
    showResponseToast(status);
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
          onClick={showMeetingLinkToast}
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
          <p className={`${FONT_SEMIBOLD} ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
            {members.length} invited
          </p>
          <p className={`${FONT_NORMAL} text-xs ${TEXT_MEDIUM_EMPHASIS}`}>
            {t('ACCEPTED')} {acceptedCount}, {t('DIDNT_RESPOND')} {noResponseCount}, &{' '}
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
        <p className={`${FONT_SEMIBOLD} ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
          {t('DESCRIPTION')}
        </p>
        <div className="flex-1" style={{ minHeight: '60px' }}>
          <p
            ref={descriptionRef}
            className={`${FONT_NORMAL} text-sm ${TEXT_HIGH_EMPHASIS} transition-all ${
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
              className={`text-sm ${FONT_SEMIBOLD} ${TEXT_HIGH_EMPHASIS} mt-2`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className={`${ICON_SIZE_SM_CLASS} mr-1`} />
              ) : (
                <ChevronDown className={`${ICON_SIZE_SM_CLASS} mr-1`} />
              )}
              {isExpanded ? t('SHOW_LESS') : t('SHOW_MORE')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Extracted response buttons rendering
  const renderResponseButtons = () => {
    if (responseStatus === MEMBER_STATUS.NORESPONSE) {
      return (
        <>
          <Button
            variant="destructive"
            className="mr-3"
            onClick={() => handleRespond(MEMBER_STATUS.DECLINED)}
          >
            <X className={`${ICON_SIZE_SM_CLASS} mr-1`} />
            {t('DECLINE')}
          </Button>
          <Button onClick={() => handleRespond(MEMBER_STATUS.ACCEPTED)}>
            <Check className={`${ICON_SIZE_SM_CLASS} mr-1`} />
            {t('ACCEPT')}
          </Button>
        </>
      );
    }

    const statusText = responseStatus === MEMBER_STATUS.ACCEPTED ? t('ACCEPTED') : t('DECLINED');

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Check className={`${ICON_SIZE_SM_CLASS} text-primary`} />
          <p className={`${TEXT_BASE_CLASS} ${FONT_SEMIBOLD} ${TEXT_HIGH_EMPHASIS}`}>
            {statusText}
          </p>
        </div>
        <Button variant="outline" onClick={() => setResponseStatus(MEMBER_STATUS.NORESPONSE)}>
          {t('CHANGE')}
        </Button>
      </div>
    );
  };

  return (
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
            <p className={`${FONT_SEMIBOLD} ${TEXT_BASE_CLASS} ${TEXT_HIGH_EMPHASIS}`}>
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

        <DialogFooter className="flex !flex-row w-full !justify-end items-center mt-6">
          {renderResponseButtons()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
