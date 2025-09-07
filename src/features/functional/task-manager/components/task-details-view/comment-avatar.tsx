import { useState } from 'react';

/**
 * CommentAvatar Component
 *
 * A reusable component for displaying user avatars in a circular format.
 * This component supports:
 * - Customizable dimensions (width and height)
 * - A grid background for visual enhancement
 * - Smooth image loading with a fade-in effect
 * - A fallback placeholder image when no source is provided
 *
 * Features:
 * - Displays a circular avatar with optional grid background
 * - Handles image loading with a smooth opacity transition
 * - Supports customizable width and height
 * - Provides a fallback image when the source is missing
 *
 * Props:
 * @param {string} src - The source URL of the avatar image
 * @param {string} alt - The alt text for the avatar image
 * @param {number} [width=50] - The width of the avatar (default: 50px)
 * @param {number} [height=50] - The height of the avatar (default: 50px)
 * @param {boolean} [showGrid=true] - Whether to display the grid background (default: true)
 *
 * @returns {JSX.Element} The comment avatar component
 *
 * @example
 * // Basic usage
 * <CommentAvatar src="https://example.com/avatar.jpg" alt="User Avatar" />
 *
 * // Custom dimensions
 * <CommentAvatar src="https://example.com/avatar.jpg" alt="User Avatar" width={100} height={100} />
 *
 * // Without grid background
 * <CommentAvatar src="https://example.com/avatar.jpg" alt="User Avatar" showGrid={false} />
 */

interface CommentAvatarProps {
  src: string;
  alt: string;
  width?: number;
  showGrid?: boolean;
  height?: number;
}

export default function CommentAvatar({
  src,
  alt,
  width = 50,
  height = 50,
  showGrid = true,
}: Readonly<CommentAvatarProps>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {showGrid && (
        <div className="absolute inset-0 z-0 rounded-full bg-[length:100%_100%] bg-[linear-gradient(to_right,_#e5e7eb_1px,_transparent_1px),_linear-gradient(to_bottom,_#e5e7eb_1px,_transparent_1px)]" />
      )}
      <div className="absolute inset-0 rounded-full border-4 z-10" />
      <div className="absolute inset-0 rounded-full overflow-hidden z-5">
        <img
          src={src || '/placeholder.svg'}
          alt={alt}
          className={`rounded-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full`}
          onLoad={() => setIsLoaded(true)}
        />
        {src}
      </div>
    </div>
  );
}
