import { useTranslation } from 'react-i18next';

export function Storage() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center text-base text-high-emphasis md:mb-[24px]">
        <h3 className="text-2xl font-bold tracking-tight">{t('STORAGE')}</h3>
      </div>
    </div>
  );
}
