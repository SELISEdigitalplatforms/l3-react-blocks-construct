import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { Search, Edit } from 'lucide-react';
import { ChatContactItem } from '../chat-contact-item/chat-contact-item';

export const ChatSidebar = () => {
  const chatContacts = [
    {
      avatarSrc: 'https://i.pravatar.cc/150?img=1',
      avatarFallback: 'AM',
      name: 'Adrian Müller',
      lastMessage: "Hi, let's have a meeting tomorrow t...",
      date: '26.12.2024',
      isOnline: true,
    },
    {
      avatarSrc: 'https://i.pravatar.cc/150?img=2',
      avatarFallback: 'AG',
      name: 'Aaron Green',
      lastMessage: 'The aroma of freshly brewed coffe...',
      date: '26.12.2024',
      isOnline: true,
    },
    {
      avatarSrc: '',
      avatarFallback: 'RT',
      name: 'The Rotund Tableur',
      lastMessage: 'Not sure if you guys caught onto it...',
      date: '26.12.2024',
      isOnline: false,
    },
    {
      avatarSrc: '',
      avatarFallback: 'LF',
      name: 'Luca Fischer',
      lastMessage: 'The introduction to the fact that the...',
      date: '26.12.2024',
      isOnline: false,
      isNotification: true,
    },
    {
      avatarSrc: 'https://i.pravatar.cc/150?img=3',
      avatarFallback: 'SP',
      name: 'Sarah Pavan',
      lastMessage: 'Sarah again with the correcting "I...',
      date: '26.12.2024',
      isOnline: true,
    },
    {
      avatarSrc: '',
      avatarFallback: 'NH',
      name: 'Noah Huber',
      lastMessage: 'I think i need a compilation video o...',
      date: '26.12.2024',
      isOnline: false,
      isNotification: true,
    },
    {
      avatarSrc: '',
      avatarFallback: 'W',
      name: 'Watchparty',
      lastMessage: 'Excellent storytelling again. Their a...',
      date: '26.12.2024',
      isOnline: false,
    },
  ];

  return (
    <div className="w-[400px] min-w-[400px] border-r border-border bg-white flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="sidebar avatar" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-high-emphasis">Block Smith</p>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
              <span className="text-xs text-medium-emphasis">Online</span>
            </div>
          </div>
        </div>
        <button className="p-1.5 text-medium-emphasis rounded-full hover:bg-gray-100 hover:text-gray-500">
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-medium-emphasis" />
          </div>
          <Input
            type="text"
            className="w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatContacts.map((contact, index) => (
          <ChatContactItem key={index} {...contact} />
        ))}
      </div>
    </div>
  );
};
