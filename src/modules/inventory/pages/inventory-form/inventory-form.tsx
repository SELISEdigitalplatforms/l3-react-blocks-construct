import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft } from 'lucide-react';
import { useGetPreSignedUrlForUpload } from '@/lib/api/hooks/use-storage';
import API_CONFIG from '@/config/api';
import { Button } from '@/components/ui-kit/button';
import { Card, CardContent } from '@/components/ui-kit/card';
import { GeneralInfoForm } from '../../component/general-info-form/general-info-form';
import { ImageUploader } from '../../component/image-uploader/image-uploader';
import {
  categoryOptions,
  InventoryStatus,
  itemLocOptions,
  tags,
} from '../../types/inventory.types';
import { useAddInventoryItem } from '../../hooks/use-inventory';
import { AdditionalInfoForm } from '../../component/additional-info-form/additional-info-form';

/**
 * Stepper component provides a multi-step navigation interface, displaying the steps and allowing the user to
 * navigate through them by clicking on steps that are prior to the current step.
 *
 * @component
 * @example
 * const steps = ['General info', 'Additional info'];
 * const [currentStep, setCurrentStep] = useState(0);
 *c
 * return (
 *   <Stepper
 *     steps={steps}
 *     currentStep={currentStep}
 *     onStepChange={setCurrentStep}
 *   />
 * );
 *
 * @param {Object} props - The props for the Stepper component.
 * @param {string[]} props.steps - List of step labels.
 * @param {number} props.currentStep - The current active step.
 * @param {function} props.onStepChange - Callback function to change the current step.
 *
 */

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepChange }: Readonly<StepperProps>) {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-96">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-base font-semibold mb-2 ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-card text-black'
                  } ${index < currentStep ? 'cursor-pointer' : ''}`}
                  onClick={() => index < currentStep && onStepChange(index)}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </button>
                <span className="text-base font-semibold text-center">{step}</span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 -mt-8">
                  <div className={`h-full ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * InventoryForm component is a multi-step form that allows users to add a new inventory item. It includes steps for
 * entering general information (name, category, price, etc.) and additional information (tags, warranty, etc.). It
 * handles form validation, image uploading, and navigating through the steps.
 *
 * @component
 * @example
 * return (
 *   <InventoryForm />
 * );
 */

interface InventoryFormData {
  itemName: string;
  category: string;
  supplier: string;
  itemLoc: string;
  price: number;
  status: InventoryStatus;
  stock: number;
  tags: string[];
  eligibleWarranty: boolean;
  eligibleReplacement: boolean;
  discount: boolean;
  images: string[];
  itemImageUrl: string;
  itemImageUrls: string[];
}

export const InventoryFormPage = () => {
  const { t } = useTranslation();
  const steps = [t('GENERAL_INFO'), t('ADDITIONAL_INFO')];
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate: addInventoryItem } = useAddInventoryItem();
  const { mutateAsync: getPreSignedUrlAsync } = useGetPreSignedUrlForUpload();

  const [formData, setFormData] = useState<InventoryFormData>({
    itemName: '',
    category: categoryOptions[0],
    supplier: '',
    itemLoc: itemLocOptions[0],
    price: 0,
    status: InventoryStatus.ACTIVE,
    stock: 0,
    tags: [],
    eligibleWarranty: true,
    eligibleReplacement: true,
    discount: false,
    images: [],
    itemImageUrl: '',
    itemImageUrls: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value,
    }));
  };

  const uploadFile = async (url: string, file: File) => {
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-ms-blob-type': 'BlockBlob',
      },
    });
    return { uploadUrl: url.split('?')[0] };
  };

  const getPresignedUrlAndUpload = async (
    file: File
  ): Promise<{ fileId: string; uploadUrl: string } | null> => {
    try {
      const data = await getPreSignedUrlAsync({
        name: file.name,
        projectKey: API_CONFIG.blocksKey,
        itemId: '',
        metaData: '',
        accessModifier: 'Public',
        configurationName: 'Default',
        parentDirectoryId: '',
        tags: '',
      });

      if (!data.isSuccess || !data.uploadUrl) {
        return null;
      }

      try {
        const { uploadUrl } = await uploadFile(data.uploadUrl, file);
        return { fileId: data.fileId ?? '', uploadUrl };
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    } catch {
      return null;
    }
  };

  const handleAddImages = async (files: (File | string)[]) => {
    const fileObjects = files.filter((file): file is File => file instanceof File);
    if (fileObjects.length === 0) return;

    setIsUploading(true);
    try {
      const uploadResults = await Promise.all(fileObjects.map(getPresignedUrlAndUpload));
      const successfulUploads = uploadResults.filter(
        (result): result is { fileId: string; uploadUrl: string } =>
          result !== null && Boolean(result.fileId) && Boolean(result.uploadUrl)
      );

      if (successfulUploads.length > 0) {
        const uploadUrls = successfulUploads.map((upload) => upload.uploadUrl);

        setFormData((prev) => ({
          ...prev,
          itemImageUrl: uploadUrls[0],
          itemImageUrls: [...(prev.itemImageUrls || []), ...uploadUrls],
          images: [...prev.images, ...uploadUrls],
        }));
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
      itemImageUrls: prev.itemImageUrls?.filter((url) => url !== imageUrl) || [],
      itemImageUrl: prev.itemImageUrl === imageUrl ? '' : prev.itemImageUrl,
    }));
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const input = {
      ItemName: formData.itemName,
      Category: formData.category,
      Supplier: formData.supplier,
      ItemLoc: formData.itemLoc,
      Price: formData.price,
      Status:
        formData.status.trim().toUpperCase() === InventoryStatus.ACTIVE.toString().toUpperCase()
          ? InventoryStatus.ACTIVE
          : InventoryStatus.DISCONTINUED,
      Stock: formData.stock,
      Tags: formData.tags,
      EligibleWarranty: formData.eligibleWarranty,
      EligibleReplacement: formData.eligibleReplacement,
      Discount: formData.discount,
      ItemImageFileId: formData.itemImageUrl,
      ItemImageFileIds: formData.itemImageUrls,
    };
    addInventoryItem(
      { input },
      {
        onSuccess: (result: any) => {
          if (result.insertInventoryItem?.acknowledged) {
            navigate(`/inventory/${result.insertInventoryItem.itemId}`);
          }
          setLoading(false);
        },
        onError: () => setLoading(false),
      }
    );
  };

  const isGeneralInfoValid = () => {
    return (
      formData.itemName.trim() !== '' &&
      formData.category.trim() !== '' &&
      formData.supplier.trim() !== '' &&
      formData.itemLoc.trim() !== '' &&
      formData.price > 0 &&
      formData.stock > 0
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-[18px] flex items-center text-base text-high-emphasis md:mb-[24px] gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-card/60 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </Button>
        <h3 className="text-2xl font-bold tracking-tight">{t('ADD_ITEM')}</h3>
      </div>

      <div className="container mx-auto py-6">
        <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />

        <form onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <Card className="w-full border-none rounded-lg justify-center flex shadow-sm mb-6">
              <CardContent className="pt-6 w-[774px]">
                <GeneralInfoForm
                  formData={{
                    ItemName: formData.itemName,
                    Category: formData.category,
                    Supplier: formData.supplier,
                    ItemLoc: formData.itemLoc,
                    Price: formData.price,
                    Status: formData.status,
                    Stock: formData.stock,
                  }}
                  handleInputChange={handleInputChange}
                  categoryOptions={categoryOptions}
                  locationOptions={itemLocOptions}
                />
                <ImageUploader
                  images={formData.images}
                  onAddImages={handleAddImages}
                  onDeleteImage={handleDeleteImage}
                  isPending={isUploading}
                />
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    className="h-10 font-bold"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {t('CANCEL')}
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-primary h-10 font-bold"
                    disabled={!isGeneralInfoValid()}
                  >
                    {t('NEXT')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="w-full border-none rounded-lg flex justify-center shadow-sm mb-6">
              <CardContent className="w-[774px]">
                <AdditionalInfoForm
                  formData={{
                    EligibleWarranty: formData.eligibleWarranty,
                    EligibleReplacement: formData.eligibleReplacement,
                    Discount: formData.discount,
                    Tags: formData.tags,
                  }}
                  handleInputChange={handleInputChange}
                  tags={tags}
                  handleTagToggle={(tag) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter((t: string) => t !== tag)
                        : [...prev.tags, tag],
                    }))
                  }
                />
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    className="h-10 font-bold"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {t('CANCEL')}
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      className="h-10 font-bold"
                      variant="outline"
                      onClick={goToPreviousStep}
                    >
                      {t('PREVIOUS')}
                    </Button>
                    <Button type="submit" className="h-10 bg-primary font-bold" disabled={loading}>
                      {t('FINISH')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};
