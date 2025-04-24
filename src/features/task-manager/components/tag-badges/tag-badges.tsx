interface TagProps {
  name: string;
  className?: string;
  onClick?: (name: string) => void;
}

/**
 * A single tag badge component
 */
export function Tag({ name, className = '', onClick }: TagProps) {
  const defaultClasses = 'inline-flex px-2 h-[22px] items-center bg-surface text-xs text-high-emphasis font-normal border rounded-lg';

  return (
    <span
      className={`${defaultClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? () => onClick(name) : undefined}
    >
      {name}
    </span>
  );
}

interface TagBadgesProps {
  tags?: string[];
  className?: string;
  tagClassName?: string;
  onTagClick?: (name: string) => void;
}

/**
 * Renders a collection of tag badges
 */
export function TagBadges({
  tags = [],
  className = '',
  tagClassName = '',
  onTagClick,
}: TagBadgesProps) {
  if (!tags || tags.length === 0) return null;

  const defaultContainerClasses = 'flex flex-wrap gap-1 mt-0.5';

  return (
    <div className={`${defaultContainerClasses} ${className}`}>
      {tags.map((tag, index) => (
        <Tag key={index} name={tag} className={tagClassName} onClick={onTagClick} />
      ))}
    </div>
  );
}

export default TagBadges;
