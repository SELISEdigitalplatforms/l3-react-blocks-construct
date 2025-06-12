import { MessageSquareText } from 'lucide-react';
import { Button } from 'components/ui/button';

export const ChatEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-surface">
      <div className="flex flex-col items-center justify-center gap-4">
        <MessageSquareText className="w-10 h-10 text-success" />
        <div className="flex flex-col">
          <p className="font-semibold text-high-emphasis text-center">Select a conversation</p>
          <p className="font-semibold text-medium-emphasis text-center">
            or start a new one to begin chatting
          </p>
        </div>
        <Button>Start New Conversation</Button>
      </div>
    </div>
  );
};
