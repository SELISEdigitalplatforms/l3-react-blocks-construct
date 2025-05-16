import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from 'components/ui/table';
import { Input } from 'components/ui/input';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { Separator } from 'components/ui/separator';
import { checkedTags, images, InventoryData, tags } from '../../services/inventory-service';

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
 * @returns {JSX.Element} - The expanded row UI with detailed product information.
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
  data: InventoryData[];
}

export const AdvanceExpandRowContent = ({ rowId, colSpan, data }: AdvanceExpandRowContentProps) => {
  const [searchTags, setSearchTags] = useState('');
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [warranty, setWarranty] = useState(true);
  const [replacement, setReplacement] = useState(true);
  const [discount, setDiscount] = useState(false);
  const [stock, setStock] = useState(30);
  const [selectedTags, setSelectedTags] = useState(checkedTags);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filterSearchTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  );

  const handleInventoryDetails = () => {
    const index = Number(rowId);
    if (isNaN(index)) {
      return null;
    }
    const rowData = data[index];
    navigate(`/inventory/${rowData?.itemId || ''}`);
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
              <img
                src={selectedImage}
                alt="Product"
                className="w-44 h-44 object-cover rounded-lg border"
              />
              <div className="flex w-full items-center justify-between">
                {images.map((img) => (
                  <Button
                    variant="ghost"
                    key={img}
                    className="p-0 rounded-md focus:outline-none"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className={`w-12 h-12 object-cover rounded-md border ${
                        selectedImage === img ? 'border-[1.5px] border-primary' : ''
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-[40%]">
              <div className="flex items-center gap-2 justify-between">
                <span>{t('ELIGIBLE_FOR_WARRANTY')}</span>
                <Switch checked={warranty} onCheckedChange={setWarranty} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>{t('ELIGIBLE_FOR_REPLACEMENT')}</span>
                <Switch checked={replacement} onCheckedChange={setReplacement} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>{t('DISCOUNT')}</span>
                <Switch checked={discount} onCheckedChange={setDiscount} />
              </div>
              <div className="flex flex-col gap-1">
                <span>{t('STOCK')}</span>
                <Input value={stock} onChange={(e) => setStock(Number(e.target.value))} />
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
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
                  />
                </div>
                <div className="flex p-2 gap-2 flex-col border-t">
                  {filterSearchTags.length > 0 ? (
                    filterSearchTags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <span>{tag}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-low-emphasis">{t('NO_TAGS_FOUND')}</p>
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
          <Button disabled>{t('UPDATE')}</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
