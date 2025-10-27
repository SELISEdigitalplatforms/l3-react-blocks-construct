import { Skeleton } from '@/components/ui-kit/skeleton';

export const FileSkeletonCard = () => (
  <div className="group relative bg-background rounded-lg border border-border p-6">
    <div className="flex flex-col items-center text-center space-y-4">
      <Skeleton className="w-20 h-20 rounded-lg" />
      <div className="flex items-center justify-between space-x-2 mt-2 w-full">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  </div>
);
