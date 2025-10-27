import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Minus, Plus, Move } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import { Button } from '@/components/ui-kit/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui-kit/dialog';
import { Slider } from '@/components/ui-kit/slider';
import { Separator } from '@/components/ui-kit/separator';

/**
 * Props for the ImageCropper component
 * @typedef {Object} ImageCropperProps
 * @property {string} image - The source URL of the image to be cropped
 * @property {() => void} onClose - Callback function called when the dialog is closed
 * @property {(croppedImage: string) => void} onCropComplete - Callback function called with the cropped image data URL
 * @property {number} [aspect=1] - The aspect ratio (width/height) for the crop area (default: 1 for square)
 */

/**
 * A modal dialog component for cropping and resizing profile images.
 * @component
 * @example
 * ```tsx
 * <ImageCropper
 *   image="https://example.com/profile.jpg"
 *   onClose={() => setShowCropper(false)}
 *   onCropComplete={(croppedImage) => handleCropComplete(croppedImage)}
 *   aspect={1}
 * />
 * ```
 */

interface ImageCropperProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  aspect?: number;
}

export const ImageCropper = ({
  image,
  onClose,
  onCropComplete,
  aspect = 1,
}: Readonly<ImageCropperProps>) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<string>('');

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (value: number) => {
    setZoom(value);
  };

  const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    if (croppedAreaPixels.width > 0 && croppedAreaPixels.height > 0) {
      setCroppedAreaPixels(croppedAreaPixels);
    }
  }, []);

  const createImage = useCallback(
    (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) =>
          reject(new Error(`Failed to load image: ${error.message || 'Unknown error'}`))
        );
        image.src = url;
      }),
    []
  );

  /**
   * Converts a Blob to a data URL string
   */
  const createCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  const getCanvasContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    return ctx;
  };

  const drawImageOnCanvas = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, Math.max(0, x), Math.max(0, y), width, height, 0, 0, width, height);
  };

  const canvasToDataURL = (canvas: HTMLCanvasElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      const handleBlob = (blob: Blob | null) => {
        if (!blob) {
          try {
            resolve(canvas.toDataURL('image/jpeg', 0.92));
          } catch (e) {
            reject(new Error('Failed to create image from canvas'));
          }
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read blob'));
        reader.readAsDataURL(blob);
      };

      canvas.toBlob(handleBlob, 'image/jpeg', 0.92);
    });
  };

  /**
   * Creates a cropped image from the source image and crop area
   */
  const getCroppedImg = useCallback(
    async (imageSrc: string, pixelCrop: Area): Promise<string> => {
      const width = Math.max(1, Math.floor(pixelCrop.width || 1));
      const height = Math.max(1, Math.floor(pixelCrop.height || 1));

      try {
        const image = await createImage(imageSrc);
        const canvas = createCanvas(width, height);
        const ctx = getCanvasContext(canvas);

        drawImageOnCanvas(ctx, image, pixelCrop.x || 0, pixelCrop.y || 0, width, height);
        return await canvasToDataURL(canvas);
      } catch (error) {
        console.error('Error in getCroppedImg:', error);
        throw error;
      }
    },
    [createImage]
  );

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error('Error cropping image', e);
    }
  }, [croppedAreaPixels, getCroppedImg, image, onClose, onCropComplete]);

  useEffect(() => {
    let isMounted = true;

    const updatePreview = async () => {
      if (!croppedAreaPixels?.width || !croppedAreaPixels?.height) {
        if (isMounted) setPreview('');
        return;
      }

      try {
        const croppedPreview = await getCroppedImg(image, croppedAreaPixels);
        if (isMounted) {
          setPreview(croppedPreview);
        }
      } catch (e) {
        console.error('Error generating preview', e);
        if (isMounted) {
          setPreview('');
        }
      }
    };

    updatePreview();

    return () => {
      isMounted = false;
    };
  }, [croppedAreaPixels, image, getCroppedImg]);

  return (
    <DialogContent className="rounded-md sm:max-w-[750px] overflow-y-auto max-h-screen">
      <DialogHeader>
        <DialogTitle className="text-lg font-medium">{t('EDIT_PROFILE_PICTURE')}</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div className="flex flex-col md:flex-row w-full gap-6">
        <div className="w-full items-center justify-center md:items-start md:justify-start md:w-1/2 flex flex-col">
          <h3 className="text-sm font-semibold text-high-emphasis mb-4">{t('RESIZE_THUMBNAIL')}</h3>
          <button
            ref={containerRef}
            className="relative w-[200px] h-[200px] md:w-[312px] md:h-[312px] overflow-hidden"
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              cropShape="round"
              showGrid={false}
              objectFit="contain"
              classes={{
                containerClassName: 'bg-transparent',
                mediaClassName: 'max-h-full max-w-full',
                cropAreaClassName: 'rounded-full border-2 border-white shadow-md',
              }}
            />
            {isDragging && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none ">
                <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-[4px]">
                  <Move className="h-4 w-4 text-white" />
                  <span className="text-xs text-white">{t('DRAG_TO_REPOSITION')}</span>
                </div>
              </div>
            )}
          </button>
          <div className="mt-6 flex w-full items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-12"
              onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={([value]) => onZoomChange(value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-12"
              onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator orientation="vertical" className="h-full hidden md:block" />
        <div className="w-full items-center justify-center md:items-start md:justify-start md:w-1/2 flex flex-col">
          <h3 className="text-sm font-semibold text-high-emphasis mb-4">{t('PREVIEW')}</h3>
          <div className="w-[200px] h-[200px] md:w-[312px] md:h-[312px] rounded-full overflow-hidden border-2 border-border">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-100" />
            )}
          </div>
        </div>
      </div>
      <DialogFooter className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {t('CANCEL')}
        </Button>
        <Button onClick={handleSave}>{t('SAVE')}</Button>
      </DialogFooter>
    </DialogContent>
  );
};
