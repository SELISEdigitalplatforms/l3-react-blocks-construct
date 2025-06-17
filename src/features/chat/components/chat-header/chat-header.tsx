import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';

export const ChatHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block w-full border-b border-border">
      <div className="flex bg-white">
        <div className="p-4 transition-all duration-300 md:min-w-[325px]">
          <h2 className="text-2xl font-bold">{t('CHAT')}</h2>
        </div>
        <div className="flex border-l items-center w-full px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="w-6 h-6 text-medium-emphasis cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
};
