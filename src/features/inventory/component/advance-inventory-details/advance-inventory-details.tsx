import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pen, Plus, Search, Trash } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
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
import { Checkbox } from 'components/ui/checkbox';
import {
  categoryOptions,
  checkedTags,
  images,
  inventoryData,
  InventoryStatus,
  locationOptions,
  statusColors,
  tags,
} from '../../services/inventory-service';

/**
 * A detailed view and editing interface for an individual inventory item.
 * This component allows the user to view and edit general and additional information
 * about an inventory item, including image management, tags, warranty, replacement eligibility, and discounts.
 *
 * @returns {JSX.Element} The rendered inventory detail view with the following features:
 * - A button to navigate back to the previous page.
 * - Editable fields for general information (e.g., item name, category, price, stock, etc.).
 * - Image selection and management with a limit of 5 images.
 * - Toggle switches for warranty, replacement eligibility, and discount status.
 * - Tag management with search and selection functionality.
 * - A button to edit the inventory item details, with options to cancel or save updates.
 *
 * @example
 * // Example usage:
 * <AdvanceInventoryDetails />
 */

export function AdvanceInventoryDetails() {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [editDetails, setEditDetails] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [selectedTags, setSelectedTags] = useState(checkedTags);
  const [warranty, setWarranty] = useState(true);
  const [replacement, setReplacement] = useState(true);
  const [discount, setDiscount] = useState(false);
  const [thumbnail, setThumbnail] = useState(images);
  const [editedFields, setEditedFields] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { itemId } = useParams();
  const initialInventory = inventoryData.find((item) => item.itemId === itemId);
  const [selectedInventory, setSelectedInventory] = useState(initialInventory);

  const handleEditDetails = () => setEditDetails(true);
  const handleCancelEdit = () => {
    setEditDetails(false);
    setEditedFields({});
  };

  const handleUpdateDetails = () => {
    if (selectedInventory) {
      const updatedInventory = { ...selectedInventory, ...editedFields };
      setSelectedInventory(updatedInventory);
      setEditDetails(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filterSearchTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  );

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (
    label: string,
    field: string,
    value: string | number,
    editable: boolean,
    isSelect = false,
    options: string[] = []
  ) => {
    const renderContent = () => {
      if (!editable) {
        return (
          <span className={`text-base text-${statusColors[value as InventoryStatus]}`}>
            {t(String(value).toUpperCase())}
          </span>
        );
      }

      if (isSelect) {
        return (
          <Select
            defaultValue={value as string}
            onValueChange={(newValue) => handleFieldChange(field, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {field === 'status' ? t(option.toUpperCase()) : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Input
          placeholder={`${t('ENTER')} ${label.toLowerCase()}`}
          defaultValue={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      );
    };

    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        {renderContent()}
      </div>
    );
  };

  const statusOptions = Object.values(InventoryStatus);

  const handleDeleteImage = (img: string) => {
    const updatedImages = thumbnail.filter((image) => image !== img);
    setThumbnail(updatedImages);
    if (selectedImage === img && updatedImages.length > 0) {
      setSelectedImage(updatedImages[0]);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const remainingSlots = 5 - thumbnail.length;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    if (filesToAdd.length > 0) {
      const newImages = filesToAdd.map((file) => URL.createObjectURL(file));
      const newThumbnailArray = [...thumbnail, ...newImages];
      setThumbnail(newThumbnailArray);
      setSelectedImage(newThumbnailArray[newThumbnailArray.length - 1]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

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
        <h3 className="text-2xl font-bold tracking-tight">{t('INVENTORY')}</h3>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('GENERAL_INFO')}</CardTitle>
              {!editDetails ? (
                <Button size="sm" variant="ghost" onClick={handleEditDetails}>
                  <Pen className="w-3 h-3 text-primary" />
                  <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t('EDIT')}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    {t('CANCEL')}
                  </Button>
                  <Button size="sm" onClick={handleUpdateDetails}>
                    {t('UPDATE')}
                  </Button>
                </div>
              )}
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="w-full !pt-0">
            <div className="flex flex-col md:flex-row gap-14">
              <div className="flex w-full gap-6 flex-col md:w-[30%]">
                <div className="flex p-3 items-center justify-center w-full h-64 rounded-lg border">
                  <img src={selectedImage} alt="Product" className="w-full h-full object-contain" />
                </div>
                <div className="flex w-full items-center justify-between">
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
                        <Button
                          variant="ghost"
                          key={img}
                          className="p-0 hover:bg-transparent focus:outline-none"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {editDetails && thumbnail.length < 5 && (
                    <div
                      {...getRootProps()}
                      className="border border-dashed rounded-md w-12 h-12 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <Plus className="text-high-emphasis" />
                    </div>
                  )}
                </div>
              </div>
              {selectedInventory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                  {renderField(t('ITEM_NAME'), 'itemName', selectedInventory.itemName, editDetails)}
                  {renderField(
                    t('CATEGORY'),
                    'category',
                    selectedInventory.category,
                    editDetails,
                    true,
                    categoryOptions
                  )}
                  {renderField(t('SUPPLIER'), 'supplier', selectedInventory.supplier, editDetails)}
                  {renderField(
                    t('ITEM_LOCATION'),
                    'itemLoc',
                    selectedInventory.itemLoc,
                    editDetails,
                    true,
                    locationOptions
                  )}
                  {renderField(
                    `${t('PRICE')} (CHF)`,
                    'price',
                    selectedInventory.price,
                    editDetails
                  )}
                  {renderField(t('STOCK'), 'stock', selectedInventory.stock ?? 0, editDetails)}
                  {renderField(
                    t('STATUS'),
                    'status',
                    selectedInventory.status,
                    editDetails,
                    true,
                    statusOptions
                  )}
                </div>
              ) : (
                <p>{t('ITEM_NOT_FOUND')}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <CardTitle>{t('ADDITIONAL_INFO')}</CardTitle>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row w-full gap-10 !pt-0">
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
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
            </div>
            <div className="flex flex-col w-full md:w-[50%]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
