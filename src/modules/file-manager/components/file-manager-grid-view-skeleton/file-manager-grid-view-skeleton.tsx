import { FileSkeletonCard } from '../file-skeleton-card/file-skeleton-card';
import { FolderSkeletonCard } from '../folder-skeleton-card/folder-skeleton-card';
import { Skeleton } from '@/components/ui-kit/skeleton';

export const SkeletonGrid = ({
  count = 6,
  title,
  type = 'file',
}: {
  count?: number;
  title: string;
  type?: 'file' | 'folder';
}) => (
  <div>
    <div className="flex items-center space-x-2 mb-4 py-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-8" />
    </div>
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) =>
        type === 'folder' ? (
          <FolderSkeletonCard key={`${title}-folder-skeleton-${index}`} />
        ) : (
          <FileSkeletonCard key={`${title}-file-skeleton-${index}`} />
        )
      )}
    </div>
  </div>
);
