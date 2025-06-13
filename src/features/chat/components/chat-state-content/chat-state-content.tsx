import { useTranslation } from 'react-i18next';
import { MessageSquareText } from 'lucide-react';
import { Button } from 'components/ui/button';

interface ChatStateContentProps {
  isSearchActive?: boolean;
  onStartNewConversation?: () => void;
}

export const ChatStateContent = ({
  isSearchActive = false,
  onStartNewConversation = undefined
}: Readonly<ChatStateContentProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-surface">
      <div className="flex flex-col items-center justify-center gap-4">
        <MessageSquareText className="w-10 h-10 text-success" />
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
          <Button onClick={onStartNewConversation}>
            {t('START_NEW_CONVERSATION')}
          </Button>
        )}
      </div>
    </div>
  );
};
