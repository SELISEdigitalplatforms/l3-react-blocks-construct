import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from 'components/ui/table';
import { Input } from 'components/ui/input';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';
import { Switch } from 'components/ui/switch';
import { Separator } from 'components/ui/separator';
import { checkedTags, images, InventoryData, tags } from '../../services/inventory-service';
import { useSidebar } from 'components/ui/sidebar';

interface AdvanceExpandRowContentProps {
  rowId?: string;
  columnLength?: number;
  data: InventoryData[];
}

export const AdvanceExpandRowContent = ({
  rowId,
  columnLength,
  data,
}: AdvanceExpandRowContentProps) => {
  const [searchTags, setSearchTags] = useState('');
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [warranty, setWarranty] = useState(true);
  const [replacement, setReplacement] = useState(true);
  const [discount, setDiscount] = useState(false);
  const [stock, setStock] = useState(30);
  const [selectedTags, setSelectedTags] = useState(checkedTags);
  const navigate = useNavigate();
  const { open, isMobile } = useSidebar();

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
    navigate(`/inventory-details/${rowData?.itemId || ''}`);
  };

  return (
    <TableRow key={`expanded-${rowId}`} className="hover:bg-transparent">
      <TableCell colSpan={columnLength} className="!p-0 bg-neutral-25">
        <div
          className={`flex flex-col ${open && !isMobile ? 'max-w-[72.2%]' : 'max-w-[40%] md:max-w-[88.6%]'}`}
        >
          <div className="flex gap-6 justify-between pt-4 px-4">
            <div className="flex gap-2 flex-col">
              <img
                src={selectedImage}
                alt="Product"
                className="w-44 h-44 object-cover rounded-lg border"
              />
              <div className="flex w-full items-center justify-between">
                {images.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt="Thumbnail"
                    className={`w-12 h-12 object-cover rounded-md cursor-pointer border ${
                      selectedImage === img ? 'border-[1.5px] border-primary' : ''
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-[40%]">
              <div className="flex items-center gap-2 justify-between">
                <span>Eligible for warranty</span>
                <Switch checked={warranty} onCheckedChange={setWarranty} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>Eligible for replacement</span>
                <Switch checked={replacement} onCheckedChange={setReplacement} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>Discount</span>
                <Switch checked={discount} onCheckedChange={setDiscount} />
              </div>
              <div className="flex flex-col gap-1">
                <span>Stock</span>
                <Input value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex flex-col w-[30%]">
              <span className="mb-2">Tags</span>
              <div className="w-full border rounded-lg">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
                  <Input
                    className="w-full pl-10 border-none shadow-none outline-none focus-visible:ring-0"
                    placeholder="Enter tag name"
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
                    <p className="text-low-emphasis">No tags found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Separator className="mt-6" />
          <div className="flex justify-end gap-4 p-6 bg-card">
            <Button variant="outline" onClick={handleInventoryDetails}>
              View Details
            </Button>
            <Button disabled>Update</Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
