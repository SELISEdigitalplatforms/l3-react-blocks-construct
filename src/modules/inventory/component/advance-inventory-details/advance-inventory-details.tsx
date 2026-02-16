import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pen, Plus, Search, Trash } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Separator } from '@/components/ui-kit/separator';
import { Label } from '@/components/ui-kit/label';
import { Input } from '@/components/ui-kit/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui-kit/select';
import { Switch } from '@/components/ui-kit/switch';
import { Checkbox } from '@/components/ui-kit/checkbox';
import {
  categoryOptions,
  InventoryStatus,
  itemLocOptions,
  statusColors,
  tags,
} from '../../types/inventory.types';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { useGetPreSignedUrlForUpload } from '@/lib/api/hooks/use-storage';
import { GetPreSignedUrlForUploadResponse } from '@/lib/api/types/storage.types';
import PlaceHolderImage from '@/assets/images/image_off_placeholder.webp';
import {
  useDeleteInventoryItem,
  useGetInventories,
  useUpdateInventoryItem,
} from '../../hooks/use-inventory';
import { ModuleName } from '@/constant/modules.constants';

/**
 * A detailed view and editing interface for an individual inventory item.
 * This component allows the user to view and edit general and additional information
 * about an inventory item, including image management, tags, warranty, replacement eligibility, and discounts.
 *
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

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

export function AdvanceInventoryDetails() {
  const [selectedImage, setSelectedImage] = useState('');
  const [editDetails, setEditDetails] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [warranty, setWarranty] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [thumbnail, setThumbnail] = useState<string[]>([]);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { mutate: getPreSignedUrl } = useGetPreSignedUrlForUpload();
  const { t } = useTranslation();
  const { itemId } = useParams();
  const { data, isLoading } = useGetInventories({ pageNo: 1, pageSize: 1000 });
  const inventoryData = data as { getInventoryItems?: { items: any[] } };
  const items = inventoryData?.getInventoryItems?.items ?? [];
  const selectedInventory = items.find(
    (item: any) => String(item.ItemId).trim() === String(itemId).trim()
  );
  const { mutate: updateInventoryItem, isPending: isUpdatePending } = useUpdateInventoryItem();
  const { mutate: deleteItem, isPending } = useDeleteInventoryItem();

  useEffect(() => {
    if (selectedInventory) {
      setWarranty(selectedInventory.EligibleWarranty || false);
      setReplacement(selectedInventory.EligibleReplacement || false);
      setDiscount(selectedInventory.Discount || false);
      setSelectedTags(selectedInventory.Tags || []);

      const getImages = () => {
        if (Array.isArray(selectedInventory.ItemImageFileIds)) {
          return selectedInventory.ItemImageFileIds;
        }
        if (selectedInventory.ItemImageFileId) {
          return [selectedInventory.ItemImageFileId];
        }
        return [];
      };

      const itemImages = getImages().filter((img: any): img is string => Boolean(img));

      setThumbnail(itemImages);
      setSelectedImage(itemImages[0] || PlaceHolderImage);
    }
  }, [selectedInventory]);

  const handleEditDetails = () => setEditDetails(true);
  const handleCancelEdit = () => {
    setEditDetails(false);
    setEditedFields({});
  };

  const uploadFile = async (file: File): Promise<{ uploadUrl: string; fileId: string } | null> => {
    try {
      const data = await new Promise<GetPreSignedUrlForUploadResponse>((resolve, reject) => {
        getPreSignedUrl(
          {
            name: file.name,
            projectKey: projectKey,
            itemId: '',
            metaData: '',
            accessModifier: 'Public',
            configurationName: 'Default',
            parentDirectoryId: '',
            tags: '',
            moduleName: ModuleName.DefaultConstruct,
          },
          {
            onSuccess: (responseData) => resolve(responseData),
            onError: (error) => reject(error),
          }
        );
      });

      if (data?.isSuccess && data.uploadUrl) {
        const uploadResponse = await fetch(data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
            'x-ms-blob-type': 'BlockBlob',
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        return {
          fileId: data.fileId ?? '',
          uploadUrl: data.uploadUrl.split('?')[0],
        };
      }

      console.error('Failed to get pre-signed URL:', data?.errors);
      return null;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  };

  const uploadImages = async (files: File[]): Promise<{ uploadUrl: string; fileId: string }[]> => {
    const results = await Promise.all(files.map((file) => uploadFile(file)));

    return results.filter(
      (result): result is { uploadUrl: string; fileId: string } =>
        result !== null && Boolean(result.fileId) && Boolean(result.uploadUrl)
    );
  };

  const handleUpdateDetails = async () => {
    if (!selectedInventory) return;

    try {
      setIsUploading(true);

      const editedInput: any = {
        ...(editedFields.itemName && { ItemName: editedFields.itemName }),
        ...(editedFields.category && { Category: editedFields.category }),
        ...(editedFields.supplier && { Supplier: editedFields.supplier }),
        ...(editedFields.itemLoc && { ItemLoc: editedFields.itemLoc }),
        ...(editedFields.price !== undefined && { Price: Number(editedFields.price) }),
        Status: editedFields.status ?? inventoryToShow.Status ?? InventoryStatus.ACTIVE,
        ...(editedFields.stock !== undefined && { Stock: Number(editedFields.stock) }),
        ...(selectedTags.length > 0 && { Tags: selectedTags }),
        EligibleWarranty: warranty,
        EligibleReplacement: replacement,
        Discount: discount,
        ...(editedFields.itemImageFileId && { ItemImageFileId: editedFields.itemImageFileId }),
        ...(editedFields.itemImageFileIds && { ItemImageFileIds: editedFields.itemImageFileIds }),
      };

      updateInventoryItem(
        {
          filter: `{_id: "${selectedInventory.ItemId}"}`,
          input: editedInput,
        },
        {
          onSuccess: () => {
            setEditDetails(false);
            setEditedFields({});
            setIsUploading(false);

            thumbnail.forEach((url) => {
              if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
              }
            });
          },
          onError: (error) => {
            console.error('Error updating inventory:', error);
            setIsUploading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error in handleUpdateDetails:', error);
    }
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setEditedFields((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const filteredTags = searchTags
    ? tags.filter((tag) => tag.toLowerCase().includes(searchTags.toLowerCase()))
    : tags;

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
    const safeOptions = options.filter((option) => !!option && option !== '');
    const safeValue = value && value !== '' ? value : safeOptions[0] || '';

    const renderContent = () => {
      if (!editable) {
        return (
          <span className={`text-base text-${statusColors[value as InventoryStatus]}`}>
            {field === 'status' ? t(String(value).toUpperCase()) : value}
          </span>
        );
      }

      if (isSelect) {
        return (
          <Select
            defaultValue={String(safeValue)}
            onValueChange={(newValue) => handleFieldChange(field, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {safeOptions.map((option) => (
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

    if (selectedImage === img) {
      setSelectedImage(updatedImages[0] || '');
    }
    setEditedFields((prev) => ({
      ...prev,
      itemImageFileId: updatedImages[0] || '',
      itemImageFileIds: updatedImages,
    }));

    if (!thumbnail.includes(img) && img.startsWith('blob:')) {
      URL.revokeObjectURL(img);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const handleUpload = async () => {
      const remainingSlots = 5 - thumbnail.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        try {
          setIsUploading(true);

          const successfulUploads = await uploadImages(filesToAdd);

          if (successfulUploads.length > 0) {
            const uploadUrls = successfulUploads.map((upload) => upload.uploadUrl);
            const updatedThumbnails = [...thumbnail, ...uploadUrls];

            setThumbnail(updatedThumbnails);
            setSelectedImage(uploadUrls[0] || selectedImage);

            setEditedFields((prev) => ({
              ...prev,
              itemImageFileId: uploadUrls[0] || prev.itemImageFileId,
              itemImageFileIds: updatedThumbnails,
            }));
          }
        } catch (error) {
          console.error('Error uploading images:', error);
        } finally {
          setIsUploading(false);
        }
      }
    };
    void handleUpload();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const inventoryToShow = selectedInventory;

  const handleDelete = () => {
    if (itemId) {
      deleteItem(
        { filter: `{_id: "${itemId}"}`, input: { isHardDelete: true } },
        {
          onSuccess: () => {
            navigate('/inventory');
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-[18px] flex items-center justify-between md:mb-[24px]">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-card hover:bg-card/60 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          <h3 className="text-2xl font-bold tracking-tight">
            {inventoryToShow?.ItemName || t('INVENTORY')}
          </h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={isPending || !itemId}
          aria-label={t('DELETE')}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDelete();
            }
          }}
        >
          <Trash className="w-3 h-3 text-destructive" />
          <span className="text-destructive text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t('DELETE')}
          </span>
        </Button>
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
                  <Button size="sm" onClick={handleUpdateDetails} disabled={isUpdatePending}>
                    {t('UPDATE')}
                  </Button>
                </div>
              )}
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="w-full !pt-0">
            {isLoading ? (
              <div className="flex flex-col md:flex-row gap-14">
                <div className="flex w-full gap-6 flex-col md:w-[30%]">
                  <Skeleton className="flex p-3 items-center justify-center w-full h-64 rounded-lg border bg-muted" />
                  <div className="flex w-full items-center justify-between mt-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={`thumbnail-skeleton-${i}`} className="w-12 h-12 rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                  {[...Array(7)].map((_, i) => (
                    <div key={`field-skeleton-${i}`} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-10 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-14">
                <div className="flex w-full gap-6 flex-col md:w-[30%]">
                  <div className="flex p-3 items-center justify-center w-full h-64 rounded-lg border">
                    <img
                      src={selectedImage || PlaceHolderImage}
                      alt="Product"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = PlaceHolderImage;
                      }}
                    />
                  </div>
                  <div className={`flex w-full items-center ${!editDetails ? 'gap-2' : 'gap-4'}`}>
                    {thumbnail.map((img) => (
                      <div key={img} className="relative">
                        {editDetails && (
                          <Button
                            onClick={() => handleDeleteImage(img)}
                            variant="ghost"
                            size="icon"
                            className="bg-surface absolute -top-3 -right-3 text-white border border-white rounded-full w-6 h-6"
                          >
                            <Trash className="text-destructive !w-3 !h-3" />
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
                            <img
                              src={img || PlaceHolderImage}
                              alt="Thumbnail"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = PlaceHolderImage;
                              }}
                            />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {isUploading && !isUpdatePending && (
                      <Skeleton className="w-10 h-10 rounded-md" />
                    )}
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
                {inventoryToShow ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[70%]">
                    {renderField(t('ITEM_NAME'), 'itemName', inventoryToShow.ItemName, editDetails)}
                    {renderField(
                      t('CATEGORY'),
                      'category',
                      inventoryToShow.Category,
                      editDetails,
                      true,
                      categoryOptions
                    )}
                    {renderField(t('SUPPLIER'), 'supplier', inventoryToShow.Supplier, editDetails)}
                    {renderField(
                      t('ITEM_LOCATION'),
                      'itemLoc',
                      inventoryToShow.ItemLoc,
                      editDetails,
                      true,
                      itemLocOptions
                    )}
                    {renderField(
                      `${t('PRICE')} (CHF)`,
                      'price',
                      inventoryToShow.Price,
                      editDetails
                    )}
                    {renderField(t('STOCK'), 'stock', inventoryToShow.Stock ?? 0, editDetails)}
                    {renderField(
                      t('STATUS'),
                      'status',
                      inventoryToShow.Status,
                      editDetails,
                      true,
                      statusOptions
                    )}
                  </div>
                ) : (
                  <p>{t('ITEM_NOT_FOUND')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader>
            <CardTitle>{t('ADDITIONAL_INFO')}</CardTitle>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row w-full gap-10 !pt-0">
            {isLoading ? (
              <>
                <div className="flex flex-col gap-4 w-full md:w-[50%]">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={`additional-info-skeleton-${i}`}
                      className="h-10 w-full rounded"
                    />
                  ))}
                </div>
                <div className="flex flex-col w-full md:w-[50%]">
                  <Skeleton className="h-4 w-24 rounded mb-2" />
                  <div className="w-full border rounded-lg p-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={`tags-skeleton-${i}`} className="h-6 w-full rounded mb-2" />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full md:w-[50%]">
                  <div className="flex items-center gap-2 justify-between">
                    <span>{t('ELIGIBLE_FOR_WARRANTY')}</span>
                    <div
                      className={`flex items-center ${!editDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Switch
                        checked={warranty}
                        onCheckedChange={(checked) => {
                          setWarranty(checked);
                          setEditedFields((prev) => ({
                            ...prev,
                            eligibleWarranty: checked,
                          }));
                        }}
                        disabled={!editDetails}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <span>{t('ELIGIBLE_FOR_REPLACEMENT')}</span>
                    <div
                      className={`flex items-center ${!editDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Switch
                        checked={replacement}
                        onCheckedChange={(checked) => {
                          setReplacement(checked);
                          setEditedFields((prev) => ({
                            ...prev,
                            eligibleReplacement: checked,
                          }));
                        }}
                        disabled={!editDetails}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <span>{t('DISCOUNT')}</span>
                    <div
                      className={`flex items-center ${!editDetails ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Switch
                        checked={discount}
                        onCheckedChange={(checked) => {
                          setDiscount(checked);
                          setEditedFields((prev) => ({
                            ...prev,
                            discount: checked,
                          }));
                        }}
                        disabled={!editDetails}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-[50%]">
                  <div className="mb-2">
                    <span>{t('TAGS')}</span>
                  </div>
                  <div className="w-full border rounded-lg">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-emphasis w-4 h-4" />
                      <Input
                        className="w-full pl-10 border-none shadow-none outline-none focus-visible:ring-0"
                        placeholder={t('ENTER_TAG_NAME')}
                        value={searchTags}
                        onChange={(e) => setSearchTags(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editDetails) {
                            e.preventDefault();
                            const newTag = searchTags.trim();
                            if (newTag && !selectedTags.includes(newTag)) {
                              const newTags = [...selectedTags, newTag];
                              setSelectedTags(newTags);
                              setSearchTags('');
                              setEditedFields((prev) => ({
                                ...prev,
                                tags: newTags,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex p-2 gap-2 flex-col border-t max-h-40 overflow-y-auto">
                      {filteredTags.length > 0 ? (
                        <div className="space-y-2 mb-2">
                          {filteredTags.map((tag) => (
                            <div key={tag} className="flex items-center gap-2">
                              <Checkbox
                                id={`tag-${tag}`}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => handleTagToggle(tag)}
                                disabled={!editDetails}
                              />
                              <Label
                                htmlFor={`tag-${tag}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {tag}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm py-2 text-center">
                          {t('NO_TAGS_FOUND')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
