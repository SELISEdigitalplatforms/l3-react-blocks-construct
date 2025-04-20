import { useState } from 'react';

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
