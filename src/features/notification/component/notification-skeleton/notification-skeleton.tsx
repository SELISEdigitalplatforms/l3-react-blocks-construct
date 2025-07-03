import { Skeleton } from 'components/ui/skeleton';

export const NotificationSkeleton = () => (
  <div
    data-testid="notification-skeleton"
    className="flex items-start gap-3 p-4 border-b border-border"
  >
    <Skeleton className="w-2 h-2 rounded-full mt-3 bg-muted" />
    <div className="flex-1 space-y-2">
      <Skeleton data-testid="skeleton-1" className="h-4 w-3/4 rounded-md bg-muted" />
      <Skeleton data-testid="skeleton-2" className="h-3 w-full rounded-md bg-muted" />
      <Skeleton data-testid="skeleton-3" className="h-3 w-1/2 rounded-md bg-muted" />
    </div>
  </div>
);

export const NotificationSkeletonList = ({ count = 3 }: { count?: number }) => (
  <div data-testid="skeleton-list-container" className="animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <NotificationSkeleton key={`notification-skeleton-${i}`} />
    ))}
  </div>
);
