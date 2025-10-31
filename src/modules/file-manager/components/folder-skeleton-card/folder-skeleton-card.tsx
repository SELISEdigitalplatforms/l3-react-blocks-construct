import { Skeleton } from '@/components/ui-kit/skeleton';

export const FolderSkeletonCard = () => (
  <div className="group relative bg-background rounded-lg border border-border p-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <div className="flex items-center justify-between flex-1">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  </div>
);
