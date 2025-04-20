import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, ChevronDown, ChevronUp, Link, Users, X } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from 'components/ui/dialog';
import { useToast } from 'hooks/use-toast';
import { CalendarEvent } from '../../../types/calendar-event.types';
import { MEMBER_STATUS } from '../../../enums/calendar.enum';

interface EventInvitationProps {
  event: CalendarEvent;
  onClose: () => void;
  currentUserId: string;
  onRespond: (eventId: string, status: MEMBER_STATUS.ACCEPTED | MEMBER_STATUS.DECLINED) => void;
}

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
export function EventInvitation({
  event,
  onClose,
  currentUserId,
  onRespond,
}: Readonly<EventInvitationProps>) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggleButton, setShowToggleButton] = useState(false);

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

  const members = event.resource?.members || [];
  const currentMember = members.find((m) => m.id === currentUserId);
  const [responseStatus, setResponseStatus] = useState<MEMBER_STATUS>(
    currentMember?.status ?? MEMBER_STATUS.NORESPONSE
  );

  const handleRespond = (status: MEMBER_STATUS.ACCEPTED | MEMBER_STATUS.DECLINED) => {
    if (!event.eventId) return;
    onRespond(event.eventId, status);
    setResponseStatus(status);
    toast({
      variant: 'success',
      title: `Invitation ${status === MEMBER_STATUS.ACCEPTED ? 'Accepted' : 'Declined'}`,
      description: (
        <>
          You have successfully {status === MEMBER_STATUS.ACCEPTED ? 'accepted' : 'declined'} the
          invitation for{' '}
          <span className="text-primary-700 text-sm font-semibold">{event.title}</span>.
        </>
      ),
    });
  };

  const acceptedCount = members.filter((m) => m.status === MEMBER_STATUS.ACCEPTED).length;
  const declinedCount = members.filter((m) => m.status === MEMBER_STATUS.DECLINED).length;
  const noResponseCount = members.filter((m) => m.status === MEMBER_STATUS.NORESPONSE).length;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-medium-emphasis" />
              <p className="font-semibold text-base text-high-emphasis">
                {event?.allDay
                  ? `${format(event.start, 'dd.MM.yyyy')}, Whole Day`
                  : `${format(event.start, 'dd.MM.yyyy, HH:mm')} - ${format(event.end, 'HH:mm')}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                className={`w-5 h-5 mt-1 ${event.resource?.meetingLink ? 'text-medium-emphasis' : 'text-low-emphasis'}`}
              />
              {event.resource?.meetingLink ? (
                <a
                  onClick={() => {
                    toast({
                      variant: 'success',
                      title: 'Zoom link clicked',
                      description: 'Opening Zoom. Please note this is a placeholder link.',
                    });
                  }}
                  className="text-base font-normal underline text-primary leading-6 break-all hover:text-primary-800 cursor-pointer w-[90%]"
                >
                  {event.resource?.meetingLink}
                </a>
              ) : (
                <span className="text-base leading-6 text-low-emphasis">No meeting link</span>
              )}
            </div>
            {members.length > 0 && (
              <div className="flex gap-2">
                <Users className="w-5 h-5 text-medium-emphasis" />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-base text-high-emphasis">
                    {members.length} invited
                  </p>
                  <p className="font-normal text-xs text-medium-emphasis">
                    Accepted {acceptedCount}, Didn’t respond {noResponseCount}, & Declined{' '}
                    {`${declinedCount}`}
                  </p>
                </div>
              </div>
            )}
            {event.resource?.description && (
              <div className="flex flex-col items-start gap-3">
                <p className="font-semibold text-base text-high-emphasis">Description</p>
                <div className="flex-1" style={{ minHeight: '60px' }}>
                  <p
                    ref={descriptionRef}
                    className={`font-normal text-sm text-high-emphasis transition-all ${
                      !isExpanded && 'line-clamp-3'
                    }`}
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: isExpanded ? 'unset' : 3,
                      overflow: 'hidden',
                    }}
                    dangerouslySetInnerHTML={{ __html: event.resource?.description }}
                  />
                  {showToggleButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-semibold text-high-emphasis mt-2"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-1" />
                      )}
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex !flex-row w-full items-center mt-6">
            {responseStatus === MEMBER_STATUS.NORESPONSE ? (
              <>
                <Button
                  variant="destructive"
                  className="mr-3"
                  onClick={() => handleRespond(MEMBER_STATUS.DECLINED)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    handleRespond(MEMBER_STATUS.ACCEPTED);
                  }}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <p className="text-base font-semibold text-high-emphasis">
                    {responseStatus === MEMBER_STATUS.ACCEPTED ? 'Accepted' : 'Declined'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setResponseStatus(MEMBER_STATUS.NORESPONSE)}
                >
                  Change
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
