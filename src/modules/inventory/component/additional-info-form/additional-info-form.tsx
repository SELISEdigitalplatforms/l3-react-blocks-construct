import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui-kit/switch';
import { TagsSelector } from '../tags-selector/tags-selector';

/**
 * AdditionalInfoForm component that allows users to configure settings related to warranty, replacement, and discount.
 * It also provides a tag selector for additional categorization.
 *
 * @component
 * @example
 * const [formData, setFormData] = useState({
 *   warranty: false,
 *   replacement: false,
 *   discount: false,
 *   tags: []
 * });
 *
 * const handleInputChange = (field, value) => {
 *   setFormData((prevData) => ({ ...prevData, [field]: value }));
 * };
 *
 * const handleTagToggle = (tag) => {
 *   setFormData((prevData) => ({
 *     ...prevData,
 *     tags: prevData.tags.includes(tag)
 *       ? prevData.tags.filter((t) => t !== tag)
 *       : [...prevData.tags, tag]
 *   }));
 * };
 *
 * return (
 *   <AdditionalInfoForm
 *     formData={formData}
 *     handleInputChange={handleInputChange}
 *     tags={availableTags}
 *     handleTagToggle={handleTagToggle}
 *   />
 * );
 *
 * @param {Object} props - The props for the AdditionalInfoForm component.
 * @param {Object} props.formData - The form data containing the current settings for warranty, replacement, discount, and selected tags.
 * @param {boolean} props.formData.warranty - Indicates if the item is eligible for warranty.
 * @param {boolean} props.formData.replacement - Indicates if the item is eligible for replacement.
 * @param {boolean} props.formData.discount - Indicates if the item is eligible for a discount.
 * @param {string[]} props.formData.tags - The tags selected for the item.
 * @param {function} props.handleInputChange - Callback function to handle changes to the input fields (warranty, replacement, discount).
 * @param {function} props.handleTagToggle - Callback function to handle the toggling of tags.
 * @param {string[]} props.tags - The available tags that can be selected.
 *
 */

interface AdditionalInfoFormProps {
  formData: {
    EligibleWarranty: boolean;
    EligibleReplacement: boolean;
    Discount: boolean;
    Tags: string[];
  };
  handleInputChange: (field: string, value: any) => void;
  tags: string[];
  handleTagToggle: (tag: string) => void;
}

export function AdditionalInfoForm({
  formData,
  handleInputChange,
  tags,
  handleTagToggle,
}: Readonly<AdditionalInfoFormProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-high-emphasis font-semibold h-6">{t('SETTINGS')}</h1>
      <div className="flex items-center justify-between">
        <span className="text-high-emphasis">{t('ELIGIBLE_FOR_WARRANTY')}</span>
        <Switch
          checked={formData.EligibleWarranty}
          onCheckedChange={(checked) => handleInputChange('eligibleWarranty', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-high-emphasis">{t('ELIGIBLE_FOR_REPLACEMENT')}</span>
        <Switch
          checked={formData.EligibleReplacement}
          onCheckedChange={(checked) => handleInputChange('eligibleReplacement', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-high-emphasis">{t('DISCOUNT')}</span>
        <Switch
          checked={formData.Discount}
          onCheckedChange={(checked) => handleInputChange('discount', checked)}
        />
      </div>

      <TagsSelector tags={tags} selectedTags={formData.Tags} handleTagToggle={handleTagToggle} />
    </div>
  );
}
