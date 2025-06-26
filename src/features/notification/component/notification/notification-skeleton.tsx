import { Skeleton } from 'components/ui/skeleton';

export const NotificationSkeleton = () => (
  <div className="flex items-start gap-3 p-4 border-b border-border">
    <Skeleton className="w-2 h-2 rounded-full mt-3 bg-muted" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4 bg-muted" />
      <Skeleton className="h-3 w-full bg-muted" />
      <Skeleton className="h-3 w-1/2 bg-muted" />
    </div>
  </div>
);

export const NotificationSkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <NotificationSkeleton key={i} />
    ))}
  </div>
);
