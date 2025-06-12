import { MessageSquareText } from 'lucide-react';
import { Button } from 'components/ui/button';

export const ChatEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full h-full p-6 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gray-50">
        <MessageSquareText className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Select a conversation</h2>
      <p className="mb-6 text-sm text-gray-500">or start a new one to begin chatting</p>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-md shadow-sm"
        tabIndex={0}
        aria-label="Start New Conversation"
      >
        Start New Conversation
      </Button>
    </div>
  );
};
