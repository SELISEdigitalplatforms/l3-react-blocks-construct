import { v4 as uuidv4 } from 'uuid';

/**
 * Tag Component
 *
 * A reusable component for rendering a single tag badge.
 * This component supports:
 * - Customizable styles via the `className` prop
 * - Clickable functionality for interactive use cases
 *
 * Features:
 * - Displays a tag with default or custom styles
 * - Allows optional click handling with the `onClick` prop
 *
 * Props:
 * @param {string} name - The name of the tag to display
 * @param {string} [className=''] - Additional CSS classes for styling
 * @param {(name: string) => void} [onClick] - Callback triggered when the tag is clicked
 *
 * @returns {JSX.Element} The tag badge component
 *
 * @example
 * // Basic usage
 * <Tag name="Frontend" />
 *
 * // With custom styles
 * <Tag name="Backend" className="bg-blue-500 text-white" />
 *
 * // With click handling
 * <Tag name="DevOps" onClick={(name) => console.log('Tag clicked:', name)} />
 */

interface TagProps {
  name: string;
  className?: string;
  onClick?: (name: string) => void;
}

/**
 * A single tag badge component
 */
export function Tag({ name, className = '', onClick }: Readonly<TagProps>) {
  const defaultClasses =
    'inline-flex px-2 h-[22px] items-center bg-surface text-xs text-high-emphasis font-normal border rounded-lg';

  return (
    <button
      className={`${defaultClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? () => onClick(name) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                onClick(name);
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
    >
      {name}
    </button>
  );
}

/**
 * TagBadges Component
 *
 * A reusable component for rendering a collection of tag badges.
 * This component supports:
 * - Customizable container and tag styles
 * - Clickable functionality for individual tags
 *
 * Features:
 * - Displays a list of tags with default or custom styles
 * - Allows optional click handling for each tag
 * - Automatically hides if no tags are provided
 *
 * Props:
 * @param {string[]} [tags=[]] - The list of tag names to display
 * @param {string} [className=''] - Additional CSS classes for the container
 * @param {string} [tagClassName=''] - Additional CSS classes for individual tags
 * @param {(name: string) => void} [onTagClick] - Callback triggered when a tag is clicked
 *
 * @returns {JSX.Element|null} The tag badges component, or null if no tags are provided
 *
 * @example
 * // Basic usage
 * <TagBadges tags={['Frontend', 'Backend', 'DevOps']} />
 *
 * // With custom styles
 * <TagBadges
 *   tags={['Frontend', 'Backend']}
 *   className="gap-2"
 *   tagClassName="bg-blue-500 text-white"
 * />
 *
 * // With click handling
 * <TagBadges
 *   tags={['Frontend', 'Backend']}
 *   onTagClick={(name) => console.log('Tag clicked:', name)}
 * />
 */

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
}: Readonly<TagBadgesProps>) {
  if (!tags || tags.length === 0) return null;

  const defaultContainerClasses = 'flex flex-wrap gap-1 mt-0.5';

  return (
    <div className={`${defaultContainerClasses} ${className}`}>
      {tags.map((tag) => (
        <Tag key={uuidv4()} name={tag} className={tagClassName} onClick={onTagClick} />
      ))}
    </div>
  );
}

export default TagBadges;
