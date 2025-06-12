import { ChatEmptyState } from '../chat-empty-state/chat-empty-state';
import { ChatSidebar } from '../chat-sidebar/chat-sidebar';

export const Chat = () => {
  return (
    <div className="flex w-full h-full">
      <div className="flex w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <ChatSidebar />
        <ChatEmptyState />
      </div>
    </div>
  );
};
