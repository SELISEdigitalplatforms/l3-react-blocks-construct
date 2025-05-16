import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Trash, Plus } from 'lucide-react';

/**
 * ImageUploader component for handling image uploads and deletions.
 * Allows users to upload multiple images, with constraints on the number of uploads and file types.
 *
 * @component
 * @example
 * const [images, setImages] = useState([]);
 * const handleAddImages = (newImages) => setImages((prev) => [...prev, ...newImages]);
 * const handleDeleteImage = (image) => setImages((prev) => prev.filter((img) => img !== image));
 *
 * return (
 *   <ImageUploader
 *     images={images}
 *     onAddImages={handleAddImages}
 *     onDeleteImage={handleDeleteImage}
 *   />
 * );
 *
 * @param {Object} props - The props for the ImageUploader component.
 * @param {string[]} props.images - The list of currently uploaded image URLs.
 * @param {function} props.onAddImages - Callback function that is called when new images are added. It receives an array of new image URLs.
 * @param {function} props.onDeleteImage - Callback function that is called when an image is deleted. It receives the image URL to be deleted.
 * @param {number} [props.maxImages=5] - The maximum number of images that can be uploaded. Defaults to 5.
 *
 * @returns {JSX.Element} The rendered ImageUploader component.
 */

interface ImageUploaderProps {
  readonly images: readonly string[];
  readonly onAddImages: (newImages: string[]) => void;
  readonly onDeleteImage: (image: string) => void;
  readonly maxImages?: number;
}

export function ImageUploader({
  images,
  onAddImages,
  onDeleteImage,
  maxImages = 5,
}: ImageUploaderProps) {
  const inputId = 'image-upload-input';
  const { t } = useTranslation();

  const onDrop = (acceptedFiles: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    if (filesToAdd.length > 0) {
      const newImages = filesToAdd.map((file) => URL.createObjectURL(file));
      onAddImages(newImages);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <label htmlFor={inputId} className="text-base font-semibold">
        {t('IMAGE_UPLOAD')}
      </label>
      <div className="text-xs text-gray-500 mb-2">
        {t('FILE_FORMAT_AND_SIZE')}, {t('WITH_MAXIMUM_OF')}: {maxImages} {t('UPLOADS')}
      </div>
      <div className="flex w-full items-center gap-4">
        {images.map((img) => (
          <div key={img} className="relative">
            <Button
              onClick={() => onDeleteImage(img)}
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full w-6 h-6 border"
            >
              <Trash className="w-4 h-4" />
            </Button>
            <div className="border rounded-md w-32 h-12 overflow-hidden">
              <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className="border border-dashed rounded-md w-32 h-12 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
          >
            <input id={inputId} {...getInputProps()} />
            <Plus className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}
