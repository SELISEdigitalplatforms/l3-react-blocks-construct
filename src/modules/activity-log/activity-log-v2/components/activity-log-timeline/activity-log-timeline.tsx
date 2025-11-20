import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui-kit/card';
import type { ActivityGroup } from '../../types/activity-log.types';
import no_activity from '@/assets/images/Illustration.svg';
import { ActivityLogGroup } from '../activity-log-group/activity-log-group';
import { useInfiniteScroll } from '@/modules/activity-log/hooks/use-infinite-scroll';

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
 * @example
 * // Basic usage
 * <ActivityLogTimeline activities={userActivities} />
 *
 * // With dynamic data
 * const activities = fetchActivitiesFromAPI();
 * <ActivityLogTimeline activities={activities} />
 */

export const ActivityLogTimeline = ({ activities }: { activities: ActivityGroup[] }) => {
  const { t } = useTranslation();
  const { visibleCount, containerRef } = useInfiniteScroll(activities.length);

  const visibleActivities = activities.slice(0, visibleCount);

  return (
    <>
      {visibleActivities.length === 0 ? (
        <div className="flex h-full w-full flex-col gap-6 items-center justify-center p-8 text-center">
          <img src={no_activity} alt="" className="h-[160px] w-[240px]" />
          <h3 className="text-xl font-medium">{t('COULDNT_FIND_ANYTHING_MATCHING')}</h3>
        </div>
      ) : (
        <Card className="w-full border-none rounded-[8px] shadow-sm">
          <div
            ref={containerRef}
            className="px-2 py-6 md:px-12 md:py-8 h-[800px] overflow-y-auto scrollbar-hide"
          >
            <div className="relative">
              {visibleActivities.length > 0 && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-low-emphasis top-[60px] h-[calc(100%-110px)] z-0`}
                />
              )}

              {visibleActivities.map((group, index) => (
                <ActivityLogGroup
                  key={`${group.date}-${index}`}
                  isLastIndex={index === visibleActivities.length - 1}
                  isFirstIndex={index === 0}
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
