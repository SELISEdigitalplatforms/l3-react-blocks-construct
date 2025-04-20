interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low' | string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };

  const style =
    priorityStyles[priority.toLowerCase() as 'high' | 'medium' | 'low'] ||
    'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex h-[22px] items-center px-2  text-xs font-medium rounded-lg ${style}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
