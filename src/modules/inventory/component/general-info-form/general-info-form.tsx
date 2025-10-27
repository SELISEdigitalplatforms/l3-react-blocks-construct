import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui-kit/input';
import { Label } from '@/components/ui-kit/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui-kit/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui-kit/radio-group';
import { StockSlider } from '../stock-slider/stock-slider';
import { InventoryStatus } from '../../types/inventory.types';

/**
 * GeneralInfoForm component allows users to fill in general information about an item, including its name, category,
 * supplier, location, price, status, and stock. The form is dynamically rendered with available options for categories
 * and locations.
 *
 * @component
 * @example
 * const [formData, setFormData] = useState({
 *   itemName: '',
 *   category: '',
 *   supplier: '',
 *   itemLoc: '',
 *   price: '',
 *   status: 'active',
 *   stock: 0
 * });
 *
 * const categoryOptions = ['Electronics', 'Furniture', 'Clothing'];
 * const locationOptions = ['Warehouse 1', 'Warehouse 2'];
 *
 * const handleInputChange = (field, value) => {
 *   setFormData((prevData) => ({ ...prevData, [field]: value }));
 * };
 *
 * return (
 *   <GeneralInfoForm
 *     formData={formData}
 *     handleInputChange={handleInputChange}
 *     categoryOptions={categoryOptions}
 *     locationOptions={locationOptions}
 *   />
 * );
 *
 * @param {Object} props - The props for the GeneralInfoForm component.
 * @param {Object} props.formData - The form data containing the current values for the item.
 * @param {string} props.formData.itemName - The name of the item.
 * @param {string} props.formData.category - The selected category of the item.
 * @param {string} props.formData.supplier - The supplier of the item.
 * @param {string} props.formData.itemLoc - The location where the item is stored.
 * @param {string} props.formData.price - The price of the item.
 * @param {string} props.formData.status - The current status of the item ('active' or 'discontinued').
 * @param {number} props.formData.stock - The stock level of the item.
 * @param {function} props.handleInputChange - Callback function to handle changes to the input fields.
 * @param {string[]} props.categoryOptions - The available options for categories.
 * @param {string[]} props.locationOptions - The available options for locations.
 *
 */

interface GeneralInfoFormProps {
  formData: {
    ItemName: string;
    Category: string;
    Supplier: string;
    ItemLoc: string;
    Price: number;
    Status: InventoryStatus;
    Stock: number;
  };
  handleInputChange: (field: string, value: any) => void;
  categoryOptions: string[];
  locationOptions: string[];
}

export function GeneralInfoForm({
  formData,
  handleInputChange,
  categoryOptions,
  locationOptions,
}: Readonly<GeneralInfoFormProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="itemName">{t('ITEM_NAME')}</Label>
          <Input
            id="itemName"
            value={formData.ItemName}
            onChange={(e) => handleInputChange('itemName', e.target.value)}
            placeholder={t('ENTER_ITEM_NAME')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">{t('CATEGORY')}</Label>
          <Select
            value={formData.Category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={t('SELECT_CATEGORY')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="supplier">{t('SUPPLIER')}</Label>
          <Input
            id="supplier"
            value={formData.Supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            placeholder={t('ENTER_SUPPLIER')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="itemLoc">{t('ITEM_LOCATION')}</Label>
          <Select
            value={formData.ItemLoc}
            onValueChange={(value) => handleInputChange('itemLoc', value)}
          >
            <SelectTrigger id="itemLoc">
              <SelectValue placeholder={t('SELECT_LOCATION')} />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">{`${t('PRICE')} (CHF)`}</Label>
          <Input
            id="price"
            value={formData.Price}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
              handleInputChange('price', numericValue);
            }}
            placeholder={t('ENTER_PRICE')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>{t('STATUS')}</Label>
          <RadioGroup
            value={formData.Status.toLowerCase()}
            onValueChange={(value) =>
              handleInputChange(
                'status',
                value === 'active' ? InventoryStatus.ACTIVE : InventoryStatus.DISCONTINUED
              )
            }
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="status-active" />
              <Label htmlFor="status-active" className="cursor-pointer">
                {t('ACTIVE')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="discontinued" id="status-discontinued" />
              <Label htmlFor="status-discontinued" className="cursor-pointer">
                {t('DISCONTINUED')}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="w-full">
        <StockSlider
          value={formData.Stock}
          onChange={(value) => handleInputChange('stock', value)}
          max={1000}
        />
      </div>
    </div>
  );
}
