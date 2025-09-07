import { useTranslation } from 'react-i18next';
import { ChartNoAxesCombined, CreditCard, FileText, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';

const monthsOfYear = [
  { value: 'january', label: 'JANUARY' },
  { value: 'february', label: 'FEBRUARY' },
  { value: 'march', label: 'MARCH' },
  { value: 'april', label: 'APRIL' },
  { value: 'may', label: 'MAY' },
  { value: 'june', label: 'JUNE' },
  { value: 'july', label: 'JULY' },
  { value: 'august', label: 'AUGUST' },
  { value: 'september', label: 'SEPTEMBER' },
  { value: 'october', label: 'OCTOBER' },
  { value: 'november', label: 'NOVEMBER' },
  { value: 'december', label: 'DECEMBER' },
];

export default function FinanceOverview() {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t('THIS_MONTH')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOfYear.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {t(month.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2">
            <div className="flex h-14 w-14 items-center justify-center">
              <ChartNoAxesCombined className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">{t('NET_PROFIT')}</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">{t('CHF')} 44,450.00</h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-semibold">+8%</span>
                <span className="text-sm text-medium-emphasis">{t('FROM_LAST_MONTH')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2">
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <Wallet className="h-7 w-7 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">{t('TOTAL_REVENUE')}</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">
                {t('CHF')} 142,300.00
              </h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-semibold">+10.2%</span>
                <span className="text-sm text-medium-emphasis">{t('FROM_LAST_MONTH')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2">
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <CreditCard className="h-7 w-7 text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">{t('TOTAL_EXPENSES')}</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">{t('CHF')} 97,850.00</h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-error" />
                <span className="text-sm text-error font-semibold">+2.5%</span>
                <span className="text-sm text-medium-emphasis">{t('FROM_LAST_MONTH')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2">
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <FileText className="h-7 w-7 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">
                {t('OUTSTANDING_INVOICES')}
              </h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">{t('CHF')} 11,200.00</h1>
              <div className="flex gap-1 items-center">
                <span className="text-sm text-error font-semibold">2</span>
                <span className="text-sm text-medium-emphasis">{t('OVERDUE')}</span>
                <span className="text-sm text-warning font-semibold">3</span>
                <span className="text-sm text-medium-emphasis">{t('PENDING')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
