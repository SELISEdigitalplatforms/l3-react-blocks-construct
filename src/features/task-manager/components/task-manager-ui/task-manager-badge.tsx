import { TPriority } from '../../types/task';

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

  const classStyle = `  text-xs font-normal rounded  ${bgColor} ${textColor} ${borderStyle} ${borderColor} ${className}`;

  return (
    <span className={classStyle} onClick={onClick}>
      {children}
    </span>
  );
};
