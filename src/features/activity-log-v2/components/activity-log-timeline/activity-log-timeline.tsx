import { Card } from 'components/ui/card';
import ActivityLogGroup from '../activity-log-group/activity-log-group';
import type { ActivityGroup } from '../../services/activity-log.types';
import './activity-log-timeline.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import no_activity from 'assets/images/Illustration.svg';
import { debounce } from 'lodash';

/**
 * ActivityLogTimeline Component
 *
 * A timeline component that displays activity logs in a scrollable vertical timeline with infinite scroll functionality.
 * Activities are grouped and rendered with a vertical timeline indicator, loading more items as the user scrolls.
 *
 * Features:
 * - Infinite scroll loading with debounced scroll handler
 * - Vertical timeline visualization with connector line
 * - Progressive loading of activity groups (5 at a time)
 * - Scroll indicator when more content is available
 * - Clean UI with card-based container and custom scrollbar
 *
 * @param {Object} props - Component props
 * @param {ActivityGroup[]} props.activities - Array of activity groups to display in the timeline
 *
 * @returns {JSX.Element} The rendered timeline component with activity groups
 *
 * @example
 * // Basic usage
 * <ActivityLogTimeline activities={userActivities} />
 *
 * // With dynamic data
 * const activities = fetchActivitiesFromAPI();
 * <ActivityLogTimeline activities={activities} />
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

  const visibleActivities = activities.slice(0, visibleCount);

  const isShowingAllActivities = visibleCount >= activities.length;

  return (
    <>
      {visibleActivities.length === 0 ? (
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={no_activity} className='h-[160px] w-[240px]'/>
          <h3 className="text-xl font-medium">We couldn’t find anything matching your search.</h3>
        </div>
      ) : (
        <Card className="w-full border-none rounded-[8px] shadow-sm">
          <div ref={containerRef} className="px-12 py-8 h-[800px] overflow-y-auto scrollbar-hide">
            <div className="relative">
              {visibleActivities.length > 0 && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-low-emphasis top-[60px] ${
                    isShowingAllActivities ? 'h-[calc(100%-110px)]' : 'h-[calc(100%-20px)]'
                  } z-0`}
                />
              )}

              {visibleActivities.map((group, index) => (
                <ActivityLogGroup
                  key={group.date}
                  isLastIndex={index === visibleActivities.length - 1}
                  isFirstIndex={index === 0}
                  {...group}
                />
              ))}

              {visibleCount < activities.length && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Scroll for more activities...
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ActivityLogTimeline;
