import { useState } from 'react';

/**
 * EmailAvatar component displays a user's avatar image in a circular frame with optional grid lines
 * and customizable size. It includes a loading state for the image to gradually fade in once loaded.
 * The component uses a default placeholder image if the provided `src` is empty or invalid.
 *
 * @component
 * @param {string} src - The source URL of the avatar image.
 * @param {string} alt - The alt text for the avatar image.
 * @param {number} [width=50] - The width of the avatar, default is 50px.
 * @param {number} [height=50] - The height of the avatar, default is 50px.
 * @param {boolean} [showGrid=true] - Whether to display a grid background inside the avatar frame.
 *
 * @returns {JSX.Element} - The EmailAvatar component, styled with an image and optional grid effect.
 *
 * @example
 * return (
 *   <CustomAvatar
 *     src="https://example.com/avatar.jpg"
 *     alt="User Avatar"
 *     width={60}
 *     height={60}
 *     showGrid={false}
 *   />
 * )
 */

interface CustomAvatarProps {
  src?: string;
  alt: string;
  width?: number;
  showGrid?: boolean;
  name?: string;
  height?: number;
}

export default function CustomAvatar({
  src,
  alt,
  width = 50,
  height = 50,
  showGrid = true,
  name = '',
}: Readonly<CustomAvatarProps>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const showImage = !!src;

  const firstChar = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-primary-300 text-muted-foreground font-semibold overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {showGrid && (
        <div className="absolute inset-0 z-0 rounded-full bg-[length:100%_100%] bg-[linear-gradient(to_right,_#e5e7eb_1px,_transparent_1px),_linear-gradient(to_bottom,_#e5e7eb_1px,_transparent_1px)]" />
      )}
      <div className="absolute inset-0 rounded-full border-4 z-10" />

      {showImage ? (
        <div className="absolute inset-0 z-5">
          <img
            src={src}
            alt={alt}
            className={`rounded-full object-cover w-full h-full transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      ) : (
        <span className="z-10 text-lg text-high-emphasis">{firstChar || '?'}</span>
      )}
    </div>
  );
}
