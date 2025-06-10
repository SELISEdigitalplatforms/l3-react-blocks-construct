import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';

function Chat() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full gap-5">
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="!pb-0">
          <CardTitle className="text-xl text-high-emphasis">{t('CHAT')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p>Hello chat</p>
        </CardContent>
      </Card>
    </div>
  );
}

export { Chat };
