import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pen, Plus, Search, Trash } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { Label } from 'components/ui/label';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { inventoryData, InventoryStatus, statusColors } from '../../services/inventory-service';
import { Checkbox } from 'components/ui/checkbox';
import DesktopImage1 from 'assets/images/desktop_1.png';
import DesktopImage2 from 'assets/images/desktop_2.webp';
import DesktopImage3 from 'assets/images/desktop_3.webp';

const images = [DesktopImage1, DesktopImage2, DesktopImage3];

export function AdvanceInventoryDetails() {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [editDetails, setEditDetails] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Electronic', 'Gaming', 'Monitor']);
  const [warranty, setWarranty] = useState(true);
  const [replacement, setReplacement] = useState(true);
  const [discount, setDiscount] = useState(false);
  const [thumbnail, setThumbnail] = useState(images);
  const navigate = useNavigate();

  const { itemId } = useParams();
  const selectedInventory = inventoryData.find((item) => item.itemId === itemId);

  const tags = ['Accessories', 'Electronic', 'Gaming', 'Monitor'];

  const handleEditDetails = () => setEditDetails(true);
  const handleCancelEdit = () => setEditDetails(false);
  const handleUpdateDetails = () => setEditDetails(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filterSearchTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  );

  const renderField = (
    label: string,
    value: string | number,
    editable: boolean,
    isSelect = false,
    options: string[] = []
  ) => (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {!editable ? (
        <span className={`text-base text-${statusColors[value as InventoryStatus]}`}>{value}</span>
      ) : isSelect ? (
        <Select defaultValue={value as string}>
          <SelectTrigger>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input placeholder={`Enter ${label.toLowerCase()}`} defaultValue={value} />
      )}
    </div>
  );

  const categoryOptions = [
    'Supplies',
    'Electronics',
    'Furniture',
    'Apparel',
    'Accessories',
    'Wearables',
  ];
  const locationOptions = ['Warehouse A', 'Warehouse B'];
  const statusOptions = Object.values(InventoryStatus);

  const handleDeleteImage = (img: string) => {
    const updatedImages = thumbnail.filter((image) => image !== img);
    setThumbnail(updatedImages);
    if (selectedImage === img && updatedImages.length > 0) {
      setSelectedImage(updatedImages[0]);
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newThumbnailArray = [...thumbnail, URL.createObjectURL(file)];
      setThumbnail(newThumbnailArray);
      setSelectedImage(newThumbnailArray[newThumbnailArray.length - 1]);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-[18px] flex items-center text-base text-high-emphasis md:mb-[24px] gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="bg-card hover:bg-card/60 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </Button>
        <h3 className="text-2xl font-bold tracking-tight">Inventory</h3>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>General info</CardTitle>
              {!editDetails ? (
                <Button size="sm" variant="ghost" onClick={handleEditDetails}>
                  <Pen className="w-3 h-3 text-primary" />
                  <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Edit
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleUpdateDetails}>
                    Update
                  </Button>
                </div>
              )}
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="w-full !pt-0">
            <div className="flex gap-14">
              <div className="flex gap-6 flex-col w-[30%]">
                <div className="flex p-3 items-center justify-center w-full h-64 rounded-lg border">
                  <img src={selectedImage} alt="Product" className="w-full h-full object-contain" />
                </div>
                <div className={`flex w-full items-center justify-between`}>
                  {thumbnail.map((img) => (
                    <div key={img} className="relative">
                      {editDetails && (
                        <Button
                          onClick={() => handleDeleteImage(img)}
                          variant="ghost"
                          size="icon"
                          className="bg-surface absolute -top-4 -right-4 text-white border border-white rounded-full w-8 h-8"
                        >
                          <Trash className="text-destructive" />
                        </Button>
                      )}
                      <div
                        className={`flex items-center p-1 justify-center rounded-md cursor-pointer border ${
                          selectedImage === img ? 'border-[1.5px] border-primary' : ''
                        } ${editDetails ? 'w-10 h-10' : 'w-16 h-12'}`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-contain"
                          onClick={() => setSelectedImage(img)}
                        />
                      </div>
                    </div>
                  ))}
                  {editDetails && thumbnail.length < 5 && (
                    <div className="border border-dashed rounded-md w-12 h-12 flex items-center justify-center hover:bg-slate-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddImage}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload">
                        <Plus className="text-high-emphasis cursor-pointer" />
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              {selectedInventory ? (
                <div className="grid grid-cols-2 gap-4 w-[70%]">
                  {renderField('Item Name', selectedInventory.itemName, editDetails)}
                  {renderField(
                    'Category',
                    selectedInventory.category,
                    editDetails,
                    true,
                    categoryOptions
                  )}
                  {renderField('Supplier', selectedInventory.supplier, editDetails)}
                  {renderField(
                    'Item location',
                    selectedInventory.itemLoc,
                    editDetails,
                    true,
                    locationOptions
                  )}
                  {renderField('Price(CHF)', selectedInventory.price, editDetails)}
                  {renderField('Stock', selectedInventory.stock || 0, editDetails)}
                  {renderField(
                    'Status',
                    selectedInventory.status,
                    editDetails,
                    true,
                    statusOptions
                  )}
                </div>
              ) : (
                <p>Item not found</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <CardTitle>Additional info</CardTitle>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="flex w-full gap-10 !pt-0">
            <div className="flex flex-col gap-4 w-[50%]">
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
            </div>
            <div className="flex flex-col w-[50%]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
