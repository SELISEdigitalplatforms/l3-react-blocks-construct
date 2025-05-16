import { TPriority } from '../../types/task';

/**
 * TaskManagerBadge Component
 *
 * A reusable badge component for displaying task priority levels.
 * This component supports:
 * - Customizable styles based on priority levels (e.g., High, Medium, Low)
 * - Optional border styling
 * - Clickable functionality for interactive use cases
 *
 * Features:
 * - Dynamically adjusts background, text, and border colors based on priority
 * - Supports additional custom styles via the `className` prop
 * - Allows optional click handling with the `onClick` prop
 *
 * Props:
 * @param {TPriority} [priority='normal'] - The priority level of the task (e.g., 'High', 'Medium', 'Low')
 * @param {boolean} [withBorder=false] - Whether the badge should have a border
 * @param {React.ReactNode} [children] - The content to display inside the badge
 * @param {() => void} [onClick] - Callback triggered when the badge is clicked
 * @param {string} [className] - Additional CSS classes for styling
 *
 * @returns {JSX.Element} The task manager badge component
 *
 * @example
 * // Basic usage
 * <TaskManagerBadge priority="High">High Priority</TaskManagerBadge>
 *
 * // With border and click handling
 * <TaskManagerBadge priority="Medium" withBorder onClick={() => console.log('Badge clicked')}>
 *   Medium Priority
 * </TaskManagerBadge>
 */

interface TaskManagerBadgeProps {
  priority?: TPriority;
  withBorder?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TaskManagerBadge: React.FC<TaskManagerBadgeProps> = ({
  priority = 'normal',
  withBorder = false,
  className,
  children,
  onClick,
}) => {
  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  let borderStyle = 'none';

  switch (priority) {
    case 'High':
      bgColor = 'bg-error-background';
      textColor = 'text-error';
      borderColor = 'border-error';
      break;
    case 'Medium':
      bgColor = 'bg-warning-background';
      textColor = 'text-[#A66200]';
      borderColor = 'border-[#A66200]';
      break;
    case 'Low':
      bgColor = 'bg-secondary-50';
      textColor = 'text-secondary';
      borderColor = 'border-secondary';
      break;

    default: // normal
      bgColor = 'bg-surface';
      textColor = 'text-high-emphasis';
      borderColor = 'border-low-emphasis';
      break;
  }

  if (withBorder) {
    borderStyle = 'border';
  }

  const classStyle = `text-xs font-normal rounded  ${bgColor} ${textColor} ${borderStyle} ${borderColor} ${className}`;

  return (
    <span className={classStyle} onClick={onClick}>
      {children}
    </span>
  );
};
