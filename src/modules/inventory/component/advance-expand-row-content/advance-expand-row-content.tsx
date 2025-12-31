import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { tags } from '../../types/inventory.types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from '@/components/ui-kit/table';
import { Input } from '@/components/ui-kit/input';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Button } from '@/components/ui-kit/button';
import { Label } from '@/components/ui-kit/label';
import { Switch } from '@/components/ui-kit/switch';
import { Separator } from '@/components/ui-kit/separator';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { cn } from '@/lib/utils';
import { InventoryItem } from '../../types/inventory.types';
import PlaceHolderImage from '@/assets/images/image_off_placeholder.webp';

/**
 * AdvanceExpandRowContent component renders expanded row content for an inventory item in a table.
 * It includes details such as product image, warranty eligibility, replacement eligibility, discount, stock, and tags.
 *
 * @component
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.rowId - The ID of the row to expand.
 * @param {number} props.colSpan - The number of columns the expanded row will span.
 * @param {Array} props.data - The data associated with the inventory item.
 *
 * @example
 * const data = [
 *   { itemId: '123', ...otherData },
 *   ...
 * ];
 * <AdvanceExpandRowContent rowId="0" colSpan={4} data={data} />
 */

interface AdvanceExpandRowContentProps {
  rowId?: string;
  colSpan?: number;
  data: InventoryItem[];
}

export const AdvanceExpandRowContent = ({ rowId, colSpan, data }: AdvanceExpandRowContentProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [warranty, setWarranty] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  const displayTags = searchTerm ? filteredTags : tags;

  const currentItem = useMemo(() => {
    if (!rowId || !data || data.length === 0) return null;
    const index = Number(rowId);
    if (isNaN(index)) return null;
    return data[index];
  }, [rowId, data]);

  const handleImageLoad = (imgSrc: string) => {
    setLoadingImages((prev) => ({ ...prev, [imgSrc]: false }));
  };

  const handleImageError = (imgSrc: string) => {
    setImageErrors((prev) => ({ ...prev, [imgSrc]: true }));
    setLoadingImages((prev) => ({ ...prev, [imgSrc]: false }));
  };

  useEffect(() => {
    if (currentItem) {
      setWarranty(currentItem.EligibleWarranty || false);
      setReplacement(currentItem.EligibleReplacement || false);
      setDiscount(currentItem.Discount || false);
      setStock(currentItem.Stock || 0);
      setSelectedTags(currentItem.Tags || []);

      const getImages = () => {
        if (Array.isArray(currentItem.ItemImageFileIds)) {
          return currentItem.ItemImageFileIds;
        }
        if (currentItem.ItemImageFileId) {
          return [currentItem.ItemImageFileId];
        }
        return [];
      };

      const itemImages = getImages().filter((img): img is string => Boolean(img));

      const initialLoadingState = itemImages.reduce(
        (acc, img) => ({
          ...acc,
          [img]: true,
        }),
        {}
      );

      setLoadingImages(initialLoadingState);
      setImageErrors({});
      setImages(itemImages);
      setSelectedImage(itemImages[0] || PlaceHolderImage);
    }
  }, [
    currentItem,
    setWarranty,
    setReplacement,
    setDiscount,
    setStock,
    setSelectedTags,
    setImages,
    setSelectedImage,
  ]);

  const handleInventoryDetails = () => {
    if (currentItem?.ItemId) {
      navigate(`/inventory/${currentItem.ItemId}`);
    }
  };

  useEffect(() => {
    const updateActionRefPosition = () => {
      if (actionRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const bottomValue = window.innerHeight - containerRect.bottom;
        actionRef.current.style.bottom = `${bottomValue}px`;
      }
    };
    updateActionRefPosition();
    window.addEventListener('scroll', updateActionRefPosition);
    return () => {
      window.removeEventListener('scroll', updateActionRefPosition);
    };
  }, []);

  return (
    <TableRow key={`expanded-${rowId}`} className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="!p-0 bg-neutral-25">
        <div ref={containerRef} className="flex flex-col pt-4 px-4 pb-[90px]">
          <div className="flex gap-6 justify-between">
            <div className="flex gap-4 flex-col">
              <div className="relative w-44 h-44">
                {loadingImages[selectedImage] && <Skeleton className="w-full h-full rounded-lg" />}
                <img
                  src={imageErrors[selectedImage] ? PlaceHolderImage : selectedImage}
                  alt="Product"
                  className={cn(
                    'w-full h-full object-cover rounded-lg border',
                    loadingImages[selectedImage] && 'hidden'
                  )}
                  onLoad={() => handleImageLoad(selectedImage)}
                  onError={() => handleImageError(selectedImage)}
                />
              </div>
              {images.length > 0 && (
                <div className="flex w-full items-center gap-2 flex-wrap">
                  {images.map((img) => (
                    <Button
                      variant="ghost"
                      key={img}
                      className="p-0 rounded-md focus:outline-none h-12 w-12 min-w-0 relative"
                      onClick={() => {
                        setSelectedImage(img);
                        if (!loadingImages[img] && !imageErrors[img]) {
                          setLoadingImages((prev) => ({ ...prev, [img]: true }));
                        }
                      }}
                    >
                      {loadingImages[img] && <Skeleton className="absolute inset-0 rounded-md" />}
                      <img
                        src={imageErrors[img] ? PlaceHolderImage : img}
                        alt="Thumbnail"
                        className={cn(
                          'w-full h-full object-cover rounded-md border',
                          selectedImage === img && 'border-[1.5px] border-primary',
                          loadingImages[img] && 'opacity-0'
                        )}
                        onLoad={() => handleImageLoad(img)}
                        onError={() => handleImageError(img)}
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 w-[40%]">
              <div className="flex items-center gap-2 justify-between">
                <span>{t('ELIGIBLE_FOR_WARRANTY')}</span>
                <Switch
                  checked={warranty}
                  onCheckedChange={undefined}
                  disabled={true}
                  className="opacity-70 cursor-not-allowed"
                  aria-disabled="true"
                />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>{t('ELIGIBLE_FOR_REPLACEMENT')}</span>
                <Switch
                  checked={replacement}
                  onCheckedChange={undefined}
                  disabled={true}
                  className="opacity-70 cursor-not-allowed"
                  aria-disabled="true"
                />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>{t('DISCOUNT')}</span>
                <Switch
                  checked={discount}
                  onCheckedChange={undefined}
                  disabled={true}
                  className="opacity-70 cursor-not-allowed"
                  aria-disabled="true"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span>{t('STOCK')}</span>
                <Input
                  value={stock}
                  onChange={undefined}
                  disabled={true}
                  type="number"
                  min="0"
                  className="cursor-not-allowed"
                  aria-disabled="true"
                />
              </div>
            </div>
            <div className="flex flex-col w-[30%]">
              <span className="mb-2">{t('TAGS')}</span>
              <div className="w-full border rounded-lg">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
                  <Input
                    className="w-full pl-10 border-none shadow-none outline-none focus-visible:ring-0"
                    placeholder={t('ENTER_TAG_NAME')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={false}
                  />
                </div>
                <div className="flex p-2 gap-2 flex-col border-t max-h-40 overflow-y-auto">
                  {displayTags.length > 0 ? (
                    <div className="space-y-2">
                      {displayTags.map((tag) => {
                        const isChecked = selectedTags.includes(tag);
                        return (
                          <div key={tag} className="flex items-center gap-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={isChecked}
                              onCheckedChange={undefined}
                              disabled={true}
                              className={`opacity-100 ${isChecked ? 'opacity-100' : 'opacity-50'}`}
                              aria-disabled="true"
                            />
                            <Label
                              htmlFor={`tag-${tag}`}
                              className={`text-sm ${isChecked ? 'font-medium' : 'font-normal'}`}
                            >
                              {tag}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm py-2 text-center">
                      {t('NO_TAGS_FOUND')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Separator className="mt-6" />
        </div>
        <div ref={actionRef} className="flex fixed right-[24px] md:right-[46px] gap-4 py-6">
          <Button variant="outline" onClick={handleInventoryDetails}>
            {t('VIEW_DETAILS')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
