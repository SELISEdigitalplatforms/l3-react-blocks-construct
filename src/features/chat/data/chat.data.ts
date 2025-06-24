import { ChatContact, UserProfile, Message, GroupMember } from '../types/chat.types';

const createMessage = (
  id: string,
  sender: 'me' | 'other',
  content: string,
  timestamp: string
): Message => ({
  id,
  sender,
  content,
  timestamp,
});

const createContact = (
  id: string,
  name: string,
  email: string,
  phoneNo: string,
  avatarSrc: string,
  avatarFallback: string,
  date: string,
  status: {
    isOnline?: boolean;
    isUnread?: boolean;
    isGroup?: boolean;
    isMuted?: boolean;
  },
  messages: Message[],
  members?: GroupMember[]
): ChatContact => ({
  id,
  name,
  email,
  phoneNo,
  avatarSrc,
  avatarFallback,
  date,
  status,
  messages,
  ...(members && { members }),
});

export const mockUserProfile: UserProfile = {
  name: 'Block Smith',
  avatarSrc: 'https://github.com/shadcn.png',
  avatarFallback: 'BS',
  status: {
    isOnline: true,
  },
};

const adrianMessages = [
  createMessage(
    'MSG-1283239',
    'other',
    'Hi there! I was reviewing the project updates. Do you have time for a quick call tomorrow?',
    '2024-12-24T10:00:00.000Z'
  ),
  createMessage(
    'MSG-1283240',
    'me',
    "Hi Adrian! Yes, I'm available after 2 PM. What would you like to discuss?",
    '2024-12-24T11:00:00.000Z'
  ),
  createMessage(
    'MSG-1283241',
    'other',
    "Perfect! Let's discuss the new feature requirements and the timeline. I'll send you the meeting invite shortly.",
    '2024-12-24T11:10:00.000Z'
  ),
  createMessage(
    'MSG-1283242',
    'me',
    "Looking forward to it. I'll prepare some mockups to share during our call.",
    '2024-12-24T11:15:00.000Z'
  ),
  createMessage(
    'MSG-1283243',
    'other',
    "Thanks! Please include the mobile views too, as we'll prioritize them for the MVP.",
    '2024-12-24T11:18:00.000Z'
  ),
  createMessage(
    'MSG-1283244',
    'me',
    "Got it! I'll include both mobile and tablet layouts. Anything else to prepare?",
    '2024-12-24T11:22:00.000Z'
  ),
  createMessage(
    'MSG-1283245',
    'other',
    "That's all for now. I'll see you at 2 PM tomorrow. Thanks again!",
    '2024-12-24T11:25:00.000Z'
  ),
];

const aaronMessages = [
  createMessage(
    'MSG-1283243',
    'other',
    'The aroma of freshly brewed coffee filled the room.',
    '2024-12-25T09:00:00.000Z'
  ),
  createMessage(
    'MSG-1283244',
    'me',
    "That's a great way to start the day! How's your morning going?",
    '2024-12-25T09:30:00.000Z'
  ),
  createMessage(
    'MSG-1283245',
    'other',
    "It's going well! Just preparing for our afternoon meeting.",
    '2024-12-25T10:00:00.000Z'
  ),
];

const rotundMessages = [
  createMessage(
    'MSG-1283246',
    'other',
    'Not sure if you guys caught onto it during the meeting, but we need to revise the timeline.',
    '2024-12-25T08:00:00.000Z'
  ),
  createMessage(
    'MSG-1283247',
    'me',
    "I noticed that too. What's your suggested adjustment?",
    '2024-12-25T08:30:00.000Z'
  ),
  createMessage(
    'MSG-1283248',
    'other',
    'I think we need at least two more weeks for the testing phase.',
    '2024-12-25T09:00:00.000Z'
  ),
];

const lucaMessages = [
  createMessage(
    'MSG-1283249',
    'other',
    "The introduction to the fact that the project is behind schedule was handled very well in today's meeting.",
    '2024-12-25T07:00:00.000Z'
  ),
  createMessage(
    'MSG-1283250',
    'me',
    'Thanks, Luca. I tried to be as transparent as possible while keeping the team motivated.',
    '2024-12-25T07:30:00.000Z'
  ),
  createMessage(
    'MSG-1283251',
    'other',
    "It worked. The team seems more aligned now. Let's keep this momentum going.",
    '2024-12-25T08:00:00.000Z'
  ),
];

const sarahMessages = [
  createMessage(
    'MSG-1283252',
    'other',
    'I think we should consider a different approach to the user interface.',
    '2024-12-25T06:00:00.000Z'
  ),
  createMessage(
    'MSG-1283253',
    'me',
    "What's your suggestion for the alternative approach?",
    '2024-12-25T06:30:00.000Z'
  ),
  createMessage(
    'MSG-1283254',
    'other',
    "Let's try a more minimalist design with better whitespace utilization.",
    '2024-12-25T07:00:00.000Z'
  ),
];

const blocksTeamMessages = [
  createMessage(
    'MSG-1283255',
    'other',
    'Team, I think we need a compilation video of all the best moments from our meetings.',
    '2024-12-25T12:00:00.000Z'
  ),
  createMessage(
    'MSG-1283256',
    'me',
    "That's a great idea! It would be perfect for our year-end review.",
    '2024-12-25T12:30:00.000Z'
  ),
  createMessage(
    'MSG-1283257',
    'other',
    "I'll start collecting the clips. Everyone, please send me your favorite moments.",
    '2024-12-25T13:00:00.000Z'
  ),
  createMessage(
    'MSG-1283258',
    'me',
    "I'll go through the recordings and pick some highlights.",
    '2024-12-25T13:30:00.000Z'
  ),
];

const watchpartyMessages = [
  createMessage(
    'MSG-1283259',
    'other',
    'Excellent storytelling again. Their ability to engage the audience is remarkable.',
    '2024-12-25T05:00:00.000Z'
  ),
  createMessage(
    'MSG-1283260',
    'me',
    'I agree! The way they build up the narrative is really impressive.',
    '2024-12-25T05:30:00.000Z'
  ),
  createMessage(
    'MSG-1283261',
    'other',
    "Let's try to incorporate some of these techniques in our next presentation.",
    '2024-12-25T06:00:00.000Z'
  ),
];

const taylorMessages = [
  createMessage(
    'MSG-1283262',
    'other',
    "I've reviewed the design mockups and have some feedback on the color scheme.",
    '2024-12-27T11:15:00.000Z'
  ),
  createMessage(
    'MSG-1283263',
    'me',
    "I'm all ears. What do you think needs adjustment?",
    '2024-12-27T11:20:00.000Z'
  ),
  createMessage(
    'MSG-1283264',
    'other',
    'The primary blue feels a bit too corporate. Maybe something more vibrant?',
    '2024-12-27T11:25:00.000Z'
  ),
  createMessage(
    'MSG-1283265',
    'me',
    "I see your point. I'll work on some alternatives and share them with you.",
    '2024-12-27T11:30:00.000Z'
  ),
];

const dhanvirMessages = [
  createMessage(
    'MSG-1283266',
    'other',
    'The latest build has been deployed to the staging environment for testing.',
    '2024-12-27T14:30:00.000Z'
  ),
  createMessage(
    'MSG-1283267',
    'me',
    "Great! I'll run through the test cases and let you know if I find any issues.",
    '2024-12-27T14:35:00.000Z'
  ),
  createMessage(
    'MSG-1283268',
    'other',
    'Thanks! Also, we fixed the login issue that was reported yesterday.',
    '2024-12-27T14:40:00.000Z'
  ),
  createMessage(
    'MSG-1283269',
    'me',
    "That's great news! I'll verify that as well.",
    '2024-12-27T14:45:00.000Z'
  ),
];

const blockSmithMember: GroupMember = {
  id: 'USR-12829540',
  name: 'Block Smith',
  avatarSrc: 'https://github.com/shadcn.png',
  avatarFallback: 'BS',
  isMe: true,
  email: 'block.smith@example.com',
};

const teamMembers: GroupMember[] = [
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
  blockSmithMember,
];

export const mockChatContacts: ChatContact[] = [
  createContact(
    'USR-1282912',
    'Adrian Müller',
    'adrian.mueller@example.com',
    '+43 123 456 7890',
    'https://i.pravatar.cc/150?img=1',
    'AM',
    '2024-12-26T00:00:00.000Z',
    { isOnline: true },
    adrianMessages
  ),
  createContact(
    'USR-1282913',
    'Aaron Green',
    'aaron.green@example.com',
    '+43 148 492 023',
    'https://i.pravatar.cc/150?img=2',
    'AG',
    '2024-12-26T00:00:00.000Z',
    { isOnline: true },
    aaronMessages
  ),
  createContact(
    'USR-1282914',
    'The Rotund Tableur',
    'rotund.tableur@example.com',
    '+44 574 393 3930',
    '',
    'RT',
    '2024-12-26T00:00:00.000Z',
    { isOnline: false },
    rotundMessages
  ),
  createContact(
    'USR-1282915',
    'Luca Fischer',
    'luca.fischer@example.com',
    '+49 170 123 4567',
    '',
    'LF',
    '2024-12-26T00:00:00.000Z',
    { isOnline: false, isUnread: true, isMuted: true },
    lucaMessages
  ),
  createContact(
    'USR-1282916',
    'Sarah Pavan',
    'sarah.pavan@example.com',
    '+1 555 123 4567',
    'https://i.pravatar.cc/150?img=3',
    'SP',
    '2024-12-26T00:00:00.000Z',
    { isOnline: true },
    sarahMessages
  ),
  createContact(
    'USR-1282917',
    'Blocks Team',
    'blocks.team@example.com',
    '+1 800 555 1234',
    '',
    'NH',
    '2024-12-26T00:00:00.000Z',
    { isOnline: false, isUnread: true, isGroup: true },
    blocksTeamMessages,
    teamMembers
  ),
  createContact(
    'USR-1282918',
    'Watchparty',
    'watchparty@example.com',
    '+44 20 7123 4567',
    '',
    'W',
    '2024-12-26T00:00:00.000Z',
    { isOnline: false },
    watchpartyMessages
  ),
  createContact(
    'USR-1282919',
    'Taylor Morgan',
    'taylor.morgan@example.com',
    '+1 415 555 6789',
    'https://i.pravatar.cc/150?img=4',
    'TM',
    '2024-12-27T11:45:00.000Z',
    { isOnline: true, isUnread: false },
    taylorMessages
  ),
  createContact(
    'USR-1282920',
    'Dhanvir Johnny',
    'dhan-johnny@example.com',
    '+1 650 555 4321',
    '',
    'DJ',
    '2024-12-27T15:30:00.000Z',
    { isOnline: true, isUnread: true },
    dhanvirMessages
  ),
];
