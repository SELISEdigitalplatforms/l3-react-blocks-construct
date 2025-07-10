import { useTranslation } from 'react-i18next';
import chatSvg from 'assets/images/chat.svg';
import { Button } from 'components/ui/button';

interface ChatStateContentProps {
  isSearchActive?: boolean;
  onStartNewConversation?: () => void;
}

export const ChatStateContent = ({
  isSearchActive = false,
  onStartNewConversation = undefined,
}: Readonly<ChatStateContentProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-surface">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16">
          <img src={chatSvg} alt="chat svg" className="w-full h-full object-cover" />
        </div>
        {isSearchActive ? (
          <div className="flex flex-col">
            <p className="font-semibold text-high-emphasis text-center">
              {t('LET_GET_CHAT_STARTED')}
            </p>
            <p className="text-medium-emphasis text-center">
              {t('SELECT_PARTICIPANTS_YOUR_CONVERSATION')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="font-semibold text-high-emphasis text-center">
              {t('SELECT_CONVERSATION')}
            </p>
            <p className="font-semibold text-medium-emphasis text-center">
              {t('START_NEW_ONE_BEGIN_CHATTING')}
            </p>
          </div>
        )}
        {!isSearchActive && onStartNewConversation && (
          <Button onClick={onStartNewConversation}>{t('START_NEW_CONVERSATION')}</Button>
        )}
      </div>
    </div>
  );
};
