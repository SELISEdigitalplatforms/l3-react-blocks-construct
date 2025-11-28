import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui-kit/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';

interface DashboardCardProps<T> {
  titleKey: string;
  placeholderKey: string;
  dropdownItems: { label: string; value: string }[];
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}

/**
 * Generic DashboardCard used to display a section with a title, select dropdown, and content grid.
 * Reusable for Overview, System Usage, and similar dashboard cards.
 */
export const DashboardCard = <T,>({
  titleKey,
  placeholderKey,
  dropdownItems,
  data,
  renderItem,
}: Readonly<DashboardCardProps<T>>) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t(titleKey)}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t(placeholderKey)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dropdownItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(item.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(renderItem)}
        </div>
      </CardContent>
    </Card>
  );
};
