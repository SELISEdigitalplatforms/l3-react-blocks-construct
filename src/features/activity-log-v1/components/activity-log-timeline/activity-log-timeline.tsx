import { Card } from 'components/ui/card';
import ActivityLogGroup from '../activity-log-group/activity-log-group';
import { ActivityGroup } from '../../services/activity-log.types';
import './activity-log-timeline.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import no_activity from 'assets/images/Illustration.svg';
import { debounce } from 'lodash';

/**
 * ActivityLogTimeline Component
 *
 * A reusable component for rendering a timeline of activity logs.
 * This component supports:
 * - Displaying activity groups with a scrollable timeline
 * - Dynamically loading more activity groups as the user scrolls
 * - Showing a placeholder when no activities are available
 *
 * Features:
 * - Infinite scrolling with debounce for performance optimization
 * - Displays activity groups with a vertical timeline indicator
 * - Handles empty states with a user-friendly message and illustration
 *
 * Props:
 * @param {ActivityGroup[]} activities - The list of activity groups to display
 *
 * @returns {JSX.Element} The activity log timeline component
 *
 * @example
 * // Basic usage
 * <ActivityLogTimeline activities={activityGroups} />
 */

const ActivityLogTimeline = ({ activities }: { activities: ActivityGroup[] }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container && container.scrollHeight - container.scrollTop <= container.clientHeight + 200) {
      setVisibleCount((prev) => Math.min(prev + 5, activities.length));
    }
  }, [activities.length]);

  useEffect(() => {
    const container = containerRef.current;
    const debouncedHandleScroll = debounce(handleScroll, 200);

    if (container) {
      container.addEventListener('scroll', debouncedHandleScroll);
    }

    return () => {
      debouncedHandleScroll.cancel();
      if (container) {
        container.removeEventListener('scroll', debouncedHandleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <>
      {activities.length === 0 ? (
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={no_activity} className="h-[160px] w-[240px]" />
          <h3 className="text-xl font-medium">We couldn’t find anything matching your search.</h3>
        </div>
      ) : (
        <Card className="w-full border-none rounded-[8px] shadow-sm">
          <div ref={containerRef} className="px-12 py-8 h-[800px] overflow-y-auto scrollbar-hide">
            <div className="relative">
              <div className="absolute left-1.5 -ml-6 top-0 bottom-0 w-0.5 bg-gray-200">
                <div className="absolute top-0 h-12 w-0.5 bg-white"></div>
                <div className="absolute bottom-0 h-8 w-0.5 bg-white"></div>
              </div>

              {activities.slice(0, visibleCount).map((group, index) => (
                <ActivityLogGroup
                  key={index}
                  isLastIndex={index === activities.length - 1}
                  {...group}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ActivityLogTimeline;
