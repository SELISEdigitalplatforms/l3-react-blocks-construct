import { render, screen } from '@testing-library/react';
import { NotificationSkeleton, NotificationSkeletonList } from './notification-skeleton';

describe('NotificationSkeleton', () => {
  it('renders skeleton with correct structure and classes', () => {
    render(<NotificationSkeleton />);

    // Check main container
    const container = screen.getByTestId('notification-skeleton');
    expect(container).toHaveClass(
      'flex',
      'items-start',
      'gap-3',
      'p-4',
      'border-b',
      'border-border'
    );

    // Check circle skeleton
    const circleSkeleton = container.firstChild as HTMLElement;
    expect(circleSkeleton).toHaveClass('w-2', 'h-2', 'rounded-full', 'mt-3', 'bg-muted');

    // Check text skeletons container
    const textContainer = container.lastChild as HTMLElement;
    expect(textContainer).toHaveClass('flex-1', 'space-y-2');

    // Check text skeletons
    const textSkeletons = textContainer.querySelectorAll('[data-testid^="skeleton-"]');
    expect(textSkeletons).toHaveLength(3);

    // Verify each skeleton has correct classes
    expect(textSkeletons[0]).toHaveClass('h-4', 'w-3/4', 'rounded-md', 'bg-muted');
    expect(textSkeletons[1]).toHaveClass('h-3', 'w-full', 'rounded-md', 'bg-muted');
    expect(textSkeletons[2]).toHaveClass('h-3', 'w-1/2', 'rounded-md', 'bg-muted');
  });
});

describe('NotificationSkeletonList', () => {
  it('renders default number of skeleton items (3)', () => {
    render(<NotificationSkeletonList />);
    const skeletonItems = screen.getAllByTestId('notification-skeleton');
    expect(skeletonItems).toHaveLength(3);
  });

  it('renders specified number of skeleton items', () => {
    const count = 5;
    render(<NotificationSkeletonList count={count} />);
    const skeletonItems = screen.getAllByTestId('notification-skeleton');
    expect(skeletonItems).toHaveLength(count);
  });

  it('applies animate-pulse class to the container', () => {
    render(<NotificationSkeletonList />);
    const container = screen.getByTestId('skeleton-list-container');
    expect(container).toHaveClass('animate-pulse');
  });
});
