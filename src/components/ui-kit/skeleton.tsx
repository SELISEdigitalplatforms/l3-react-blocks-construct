import { cn } from '../../lib/utils';
import * as React from 'react';

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
