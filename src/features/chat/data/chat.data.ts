import { ChatContact, UserProfile } from '../types/chat.types';

export const mockUserProfile: UserProfile = {
  name: 'Block Smith',
  avatarSrc: 'https://github.com/shadcn.png',
  avatarFallback: 'BS',
  status: {
    isOnline: true,
  },
};

export const mockChatContacts: ChatContact[] = [
  {
    id: 'USR-1282912',
    name: 'Adrian Müller',
    email: 'adrian.mueller@example.com',
    phoneNo: '+43 123 456 7890',
    avatarSrc: 'https://i.pravatar.cc/150?img=1',
    avatarFallback: 'AM',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: true,
    },
    messages: [
      {
        id: 'MSG-1283239',
        sender: 'other',
        content:
          'Hi there! I was reviewing the project updates. Do you have time for a quick call tomorrow?',
        timestamp: '2024-12-24T10:00:00.000Z',
      },
      {
        id: 'MSG-1283240',
        sender: 'me',
        content: "Hi Adrian! Yes, I'm available after 2 PM. What would you like to discuss?",
        timestamp: '2024-12-24T11:00:00.000Z',
      },
      {
        id: 'MSG-1283241',
        sender: 'other',
        content:
          "Perfect! Let's discuss the new feature requirements and the timeline. I'll send you the meeting invite shortly.",
        timestamp: '2024-12-24T11:10:00.000Z',
      },
      {
        id: 'MSG-1283242',
        sender: 'me',
        content: "Looking forward to it. I'll prepare some mockups to share during our call.",
        timestamp: '2024-12-24T11:15:00.000Z',
      },
      {
        id: 'MSG-1283243',
        sender: 'other',
        content:
          'Thanks! Please include the mobile views too, as we’ll prioritize them for the MVP.',
        timestamp: '2024-12-24T11:18:00.000Z',
      },
      {
        id: 'MSG-1283244',
        sender: 'me',
        content: 'Got it! I’ll include both mobile and tablet layouts. Anything else to prepare?',
        timestamp: '2024-12-24T11:22:00.000Z',
      },
      {
        id: 'MSG-1283245',
        sender: 'other',
        content: "That's all for now. I'll see you at 2 PM tomorrow. Thanks again!",
        timestamp: '2024-12-24T11:25:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282913',
    name: 'Aaron Green',
    email: 'aaron.green@example.com',
    phoneNo: '+43 148 492 023',
    avatarSrc: 'https://i.pravatar.cc/150?img=2',
    avatarFallback: 'AG',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: true,
    },
    messages: [
      {
        id: 'MSG-1283243',
        sender: 'other',
        content: 'The aroma of freshly brewed coffee filled the room.',
        timestamp: '2024-12-25T09:00:00.000Z',
      },
      {
        id: 'MSG-1283244',
        sender: 'me',
        content: "That's a great way to start the day! How's your morning going?",
        timestamp: '2024-12-25T09:30:00.000Z',
      },
      {
        id: 'MSG-1283245',
        sender: 'other',
        content: "It's going well! Just preparing for our afternoon meeting.",
        timestamp: '2024-12-25T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282914',
    name: 'The Rotund Tableur',
    email: 'rotund.tableur@example.com',
    phoneNo: '+44 574 393 3930',
    avatarSrc: '',
    avatarFallback: 'RT',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: false,
    },
    messages: [
      {
        id: 'MSG-1283246',
        sender: 'other',
        content:
          'Not sure if you guys caught onto it during the meeting, but we need to revise the timeline.',
        timestamp: '2024-12-25T08:00:00.000Z',
      },
      {
        id: 'MSG-1283247',
        sender: 'me',
        content: "I noticed that too. What's your suggested adjustment?",
        timestamp: '2024-12-25T08:30:00.000Z',
      },
      {
        id: 'MSG-1283248',
        sender: 'other',
        content: 'I think we need at least two more weeks for the testing phase.',
        timestamp: '2024-12-25T09:00:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282915',
    avatarSrc: '',
    avatarFallback: 'LF',
    name: 'Luca Fischer',
    email: 'luca.fischer@example.com',
    phoneNo: '+49 170 123 4567',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: false,
      isUnread: true,
      isMuted: true,
    },
    messages: [
      {
        id: 'MSG-1283249',
        sender: 'other',
        content:
          "The introduction to the fact that the project is behind schedule was handled very well in today's meeting.",
        timestamp: '2024-12-25T07:00:00.000Z',
      },
      {
        id: 'MSG-1283250',
        sender: 'me',
        content:
          'Thanks, Luca. I tried to be as transparent as possible while keeping the team motivated.',
        timestamp: '2024-12-25T07:30:00.000Z',
      },
      {
        id: 'MSG-1283251',
        sender: 'other',
        content: "It worked. The team seems more aligned now. Let's keep this momentum going.",
        timestamp: '2024-12-25T08:00:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282916',
    avatarSrc: 'https://i.pravatar.cc/150?img=3',
    avatarFallback: 'SP',
    name: 'Sarah Pavan',
    email: 'sarah.pavan@example.com',
    phoneNo: '+1 555 123 4567',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: true,
    },
    messages: [
      {
        id: 'MSG-1283252',
        sender: 'other',
        content: 'I think we should consider a different approach to the user interface.',
        timestamp: '2024-12-25T06:00:00.000Z',
      },
      {
        id: 'MSG-1283253',
        sender: 'me',
        content: "What's your suggestion for the alternative approach?",
        timestamp: '2024-12-25T06:30:00.000Z',
      },
      {
        id: 'MSG-1283254',
        sender: 'other',
        content: "Let's try a more minimalist design with better whitespace utilization.",
        timestamp: '2024-12-25T07:00:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282917',
    avatarSrc: '',
    avatarFallback: 'NH',
    name: 'Blocks Team',
    email: 'blocks.team@example.com',
    phoneNo: '+1 800 555 1234',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: false,
      isUnread: true,
      isGroup: true,
    },
    members: [
      {
        id: 'USR-1282912',
        name: 'Adrian Müller',
        email: 'adrian.mueller@example.com',
        avatarSrc: 'https://i.pravatar.cc/150?img=1',
        avatarFallback: 'AM',
      },
      {
        id: 'USR-1282913',
        name: 'Aaron Green',
        email: 'aaron.green@example.com',
        avatarSrc: 'https://i.pravatar.cc/150?img=2',
        avatarFallback: 'AG',
      },
      {
        id: 'USR-1282914',
        name: 'Luca Fischer',
        email: 'luca.fischer@example.com',
        avatarSrc: 'https://i.pravatar.cc/150?img=3',
        avatarFallback: 'LF',
      },
      {
        id: 'USR-12829540',
        name: 'Block Smith',
        avatarSrc: 'https://github.com/shadcn.png',
        avatarFallback: 'BS',
        isMe: true,
        email: 'block.smith@example.com',
      },
    ],
    messages: [
      {
        id: 'MSG-1283255',
        sender: 'other',
        content:
          'Team, I think we need a compilation video of all the best moments from our meetings.',
        timestamp: '2024-12-25T12:00:00.000Z', // 12 hours ago
      },
      {
        id: 'MSG-1283256',
        sender: 'me',
        content: "That's a great idea! It would be perfect for our year-end review.",
        timestamp: '2024-12-25T12:30:00.000Z',
      },
      {
        id: 'MSG-1283257',
        sender: 'other',
        content: "I'll start collecting the clips. Everyone, please send me your favorite moments.",
        timestamp: '2024-12-25T13:00:00.000Z',
      },
      {
        id: 'MSG-1283258',
        sender: 'me',
        content: "I'll go through the recordings and pick some highlights.",
        timestamp: '2024-12-25T13:30:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282918',
    avatarSrc: '',
    avatarFallback: 'W',
    name: 'Watchparty',
    email: 'watchparty@example.com',
    phoneNo: '+44 20 7123 4567',
    date: '2024-12-26T00:00:00.000Z',
    status: {
      isOnline: false,
    },
    messages: [
      {
        id: 'MSG-1283259',
        sender: 'other',
        content:
          'Excellent storytelling again. Their ability to engage the audience is remarkable.',
        timestamp: '2024-12-25T05:00:00.000Z',
      },
      {
        id: 'MSG-1283260',
        sender: 'me',
        content: 'I agree! The way they build up the narrative is really impressive.',
        timestamp: '2024-12-25T05:30:00.000Z',
      },
      {
        id: 'MSG-1283261',
        sender: 'other',
        content: "Let's try to incorporate some of these techniques in our next presentation.",
        timestamp: '2024-12-25T06:00:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282919',
    avatarSrc: 'https://i.pravatar.cc/150?img=4',
    avatarFallback: 'TM',
    name: 'Taylor Morgan',
    email: 'taylor.morgan@example.com',
    phoneNo: '+1 415 555 6789',
    date: '2024-12-27T11:45:00.000Z',
    status: {
      isOnline: true,
      isUnread: false,
    },
    messages: [
      {
        id: 'MSG-1283262',
        sender: 'other',
        content: "I've reviewed the design mockups and have some feedback on the color scheme.",
        timestamp: '2024-12-27T11:15:00.000Z', // 30 minutes ago
      },
      {
        id: 'MSG-1283263',
        sender: 'me',
        content: "I'm all ears. What do you think needs adjustment?",
        timestamp: '2024-12-27T11:20:00.000Z',
      },
      {
        id: 'MSG-1283264',
        sender: 'other',
        content: 'The primary blue feels a bit too corporate. Maybe something more vibrant?',
        timestamp: '2024-12-27T11:25:00.000Z',
      },
      {
        id: 'MSG-1283265',
        sender: 'me',
        content: "I see your point. I'll work on some alternatives and share them with you.",
        timestamp: '2024-12-27T11:30:00.000Z',
      },
    ],
  },
  {
    id: 'USR-1282920',
    avatarSrc: '',
    avatarFallback: 'DJ',
    name: 'Development Team',
    email: 'dev-team@example.com',
    phoneNo: '+1 650 555 4321',
    date: '2024-12-27T15:30:00.000Z',
    status: {
      isOnline: true,
      isUnread: true,
    },
    messages: [
      {
        id: 'MSG-1283266',
        sender: 'other',
        content: 'The latest build has been deployed to the staging environment for testing.',
        timestamp: '2024-12-27T14:30:00.000Z', // 1 hour ago
      },
      {
        id: 'MSG-1283267',
        sender: 'me',
        content: "Great! I'll run through the test cases and let you know if I find any issues.",
        timestamp: '2024-12-27T14:35:00.000Z',
      },
      {
        id: 'MSG-1283268',
        sender: 'other',
        content: 'Thanks! Also, we fixed the login issue that was reported yesterday.',
        timestamp: '2024-12-27T14:40:00.000Z',
      },
      {
        id: 'MSG-1283269',
        sender: 'me',
        content: "That's great news! I'll verify that as well.",
        timestamp: '2024-12-27T14:45:00.000Z',
      },
    ],
  },
];
