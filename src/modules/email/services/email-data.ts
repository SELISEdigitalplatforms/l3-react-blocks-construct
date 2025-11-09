import { Forward, PictureInPicture2, Reply, ReplyAll } from 'lucide-react';
import { MenuAction, TEmailData, TReply } from '../types/email.types';
import {
  COMMON_PREVIEW_CONTENT,
  REPLY_CONTENT_1,
  REPLY_CONTENT_2,
} from '../constants/email.constants';

const DEFAULT_TAGS = {
  personal: false,
  work: false,
  payments: false,
  invoices: false,
};

const DEFAULT_EMAIL_PROPS = {
  isRead: false,
  isStarred: false,
  trash: false,
  spam: false,
  sectionCategory: 'inbox' as const,
  isDeleted: false,
  attachments: [] as string[],
  images: [] as string[],
};

const createEmailTags = (overrides: Partial<typeof DEFAULT_TAGS> = {}) => ({
  ...DEFAULT_TAGS,
  ...overrides,
});

const createReply = (
  id: string,
  reply: string,
  date: string,
  isStarred = false,
  images: string[] = [],
  attachments: string[] = []
) => ({
  id,
  reply,
  isStarred,
  prevData: COMMON_PREVIEW_CONTENT,
  date,
  images,
  attachments,
});

const createEmailBase = (
  id: string,
  sender: string[],
  subject: string,
  date: string,
  email: string,
  overrides: Partial<any> = {}
) => ({
  id,
  sender,
  subject,
  preview: COMMON_PREVIEW_CONTENT,
  date,
  email,
  ...DEFAULT_EMAIL_PROPS,
  tags: createEmailTags(),
  ...overrides,
});

const EMAIL_CONFIGS = {
  ADRIAN_MULLER: {
    sender: ['Adrian Müller'],
    email: 'adrian.mueller@gmail.com',
  },
  ETHAN_GOLD: {
    sender: ['Ethan Gold'],
    email: 'ethangolds@gmail.com',
  },
  ETHAN_GOLDS_DASH: {
    sender: ['Ethan Golds dash'],
    email: 'ethangolds@gmail.com',
  },
  SOPHIE_MEIER: {
    sender: ['Sophie Meier'],
    email: 'sophiemeier@gmail.com',
  },
};

const createAdrianEmail = (
  id: string,
  subject: string,
  date: string,
  overrides: Partial<any> = {}
) =>
  createEmailBase(
    id,
    EMAIL_CONFIGS.ADRIAN_MULLER.sender,
    subject,
    date,
    EMAIL_CONFIGS.ADRIAN_MULLER.email,
    overrides
  );

const createEthanEmail = (
  id: string,
  subject: string,
  date: string,
  overrides: Partial<any> = {}
) =>
  createEmailBase(
    id,
    EMAIL_CONFIGS.ETHAN_GOLD.sender,
    subject,
    date,
    EMAIL_CONFIGS.ETHAN_GOLD.email,
    overrides
  );

const createEthanDashEmail = (
  id: string,
  subject: string,
  date: string,
  overrides: Partial<any> = {}
) =>
  createEmailBase(
    id,
    EMAIL_CONFIGS.ETHAN_GOLDS_DASH.sender,
    subject,
    date,
    EMAIL_CONFIGS.ETHAN_GOLDS_DASH.email,
    overrides
  );

const createSophieEmail = (
  id: string,
  subject: string,
  date: string,
  overrides: Partial<any> = {}
) =>
  createEmailBase(
    id,
    EMAIL_CONFIGS.SOPHIE_MEIER.sender,
    subject,
    date,
    EMAIL_CONFIGS.SOPHIE_MEIER.email,
    overrides
  );

export const emailData: TEmailData = {
  inbox: [
    createAdrianEmail('i1', 'Meeting Tomorrow', '2025-05-01T09:31:25.000Z', {
      tags: createEmailTags({ personal: true, work: true }),
      images: ['Screenshot 2025-04-07 101041.png', 'Screenshot 2025-03-10 111918.png'],
      attachments: ['random.pdf'],
      reply: [
        createReply('r1', REPLY_CONTENT_1, '2025-03-23T09:39:25.000Z', true),
        createReply('r2', REPLY_CONTENT_2, '2025-03-23T10:33:25.000Z'),
        createReply('r3', REPLY_CONTENT_2, '2025-03-23T10:51:25.000Z'),
      ],
    }),

    createEthanDashEmail(
      'i2',
      'Attention: Please Be Advised That the Previously Scheduled Meeting Has Been Officially Rescheduled to a New Date and Time Due to Unforeseen Circumstances; We Apologize for Any Inconvenience This May Cause and Kindly Request That You Update Your Calendars Accordingly to Reflect This Change',
      '2025-04-27T09:31:25.000Z',
      {
        tags: createEmailTags({ personal: true, work: true }),
        images: ['Screenshot 2025-03-10 111918.png'],
        attachments: ['random.pdf'],
      }
    ),

    createSophieEmail(
      'i3',
      'Attention: Please Be Advised That the Previously Scheduled Meeting Has Been Officially Rescheduled to a New Date and Time Due to Unforeseen Circumstances;',
      '2025-03-29T09:31:25.000Z',
      {
        isRead: true,
        images: ['Screenshot 2025-03-10 111918.png'],
        attachments: ['random.pdf', 'random2.pdf'],
      }
    ),

    createAdrianEmail('i4', 'Meeting Tomorrow', '2025-03-23T09:31:25.000Z', {
      tags: createEmailTags({ personal: true }),
      attachments: ['random.pdf'],
    }),

    createEthanEmail('i5', 'Meeting Rescheduled', '2025-03-27T09:31:25.000Z', {
      tags: createEmailTags({ work: true }),
    }),

    createSophieEmail('i6', 'Reminder: Submit Your Report', '2025-03-23T09:31:25.000Z', {
      isRead: true,
    }),

    createAdrianEmail('i7', 'Meeting Tomorrow', '2025-03-23T09:31:25.000Z'),
    createEthanEmail('i8', 'Meeting Rescheduled', '2025-03-27T09:31:25.000Z'),
    createSophieEmail('i9', 'Reminder: Submit Your Report', '2025-03-23T09:31:25.000Z', {
      isRead: true,
    }),
    createAdrianEmail('i10', 'Meeting Tomorrow', '2025-03-23T09:31:25.000Z'),
    createEthanEmail('i11', 'Meeting Rescheduled', '2025-03-27T09:31:25.000Z'),
    createSophieEmail('i12', 'Reminder: Submit Your Report', '2025-04-30T09:31:25.000Z', {
      isRead: true,
    }),
  ],
  starred: [],
  sent: [],
  draft: [],
  spam: [],
  trash: [],
  personal: [],
  work: [],
};

export const ReplyAllAvatars = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
    alt: 'Profile avatar',
  },
  {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Profile avatar',
  },
  {
    src: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Profile avatar',
  },
];

export const createMenuActions = (handlers: {
  handleSetActive: (action: 'reply' | 'replyAll' | 'forward') => void;
  handleComposeEmailForward: (replyData?: TReply) => void;
}): MenuAction[] => [
  {
    type: 'reply',
    icon: Reply,
    labelKey: 'REPLY',
    onClick: () => handlers.handleSetActive('reply'),
  },
  {
    type: 'replyAll',
    icon: ReplyAll,
    labelKey: 'REPLY_ALL',
    onClick: () => handlers.handleSetActive('replyAll'),
  },
  {
    type: 'forward',
    icon: Forward,
    labelKey: 'FORWARD',
    onClick: () => handlers.handleComposeEmailForward({} as TReply),
  },
  {
    type: 'popOutReply',
    icon: PictureInPicture2,
    labelKey: 'POP_OUT_REPLY',
    onClick: () => handlers.handleComposeEmailForward({} as TReply),
  },
];
