import { TEmailData } from '../types/email.types';

export const emailData: TEmailData = {
  inbox: [
    {
      id: 'i1',
      sender: ['Adrian Müller'],
      subject: 'Meeting Tomorrow',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-05-01T09:31:25.000Z',
      isRead: false,

      email: 'adrian.mueller@gmail.com',
      tags: {
        personal: true,
        work: true,
        payments: false,
        invoices: false,
      },
      images: ['Screenshot 2025-04-07 101041.png', 'Screenshot 2025-03-10 111918.png'],
      attachments: ['random.pdf'],

      reply: [
        {
          id: 'r1',
          reply:
            '<p>Best regards,</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>As per our last meeting, we aimed to achieve.</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p>Dear,</p>',
          isStarred: true,
          prevData:
            '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
          date: '2025-03-23T09:39:25.000Z',
          images: [],
          attachments: [],
        },
        {
          id: 'r2',
          reply:
            '<p>Sincerely,</p><p><br></p><p>Awaiting your response.</p><p><br></p><p>Furthermore, should any difficulties arise or modifications be needed, please do not hesitate to inform me, and I will gladly offer my support.</p><p><br></p><p>Could you please share the current standing? Furthermore, should any difficulties arise or modifications be needed, please do not hesitate to inform me, and I will gladly offer my support.</p><p><br></p><p>Following our previous conversation, our objective was to accomplish.</p><p>Hello,</p><p>I trust this email finds you in good health. I am reaching out to inquire about the advancement of [designated undertaking/assignment] and to deliberate on the subsequent actions. Following our previous conversation, our objective was to accomplish.</p>',
          isStarred: false,
          prevData:
            '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
          date: '2025-03-23T10:33:25.000Z',
          images: [],
          attachments: [],
        },
        {
          id: 'r3',
          reply:
            '<p>Sincerely,</p><p><br></p><p>Awaiting your response.</p><p><br></p><p>Furthermore, should any difficulties arise or modifications be needed, please do not hesitate to inform me, and I will gladly offer my support.</p><p><br></p><p>Could you please share the current standing? Furthermore, should any difficulties arise or modifications be needed, please do not hesitate to inform me, and I will gladly offer my support.</p><p><br></p><p>Following our previous conversation, our objective was to accomplish.</p><p>Hello,</p><p>I trust this email finds you in good health. I am reaching out to inquire about the advancement of [designated undertaking/assignment] and to deliberate on the subsequent actions. Following our previous conversation, our objective was to accomplish.</p>',
          isStarred: false,
          prevData:
            '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
          date: '2025-03-23T10:51:25.000Z',
          images: [],
          attachments: [],
        },
      ],
      trash: false,
      spam: false,
      isStarred: false,
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i2',
      sender: ['Ethan Golds dash'],
      subject:
        'Attention: Please Be Advised That the Previously Scheduled Meeting Has Been Officially Rescheduled to a New Date and Time Due to Unforeseen Circumstances; We Apologize for Any Inconvenience This May Cause and Kindly Request That You Update Your Calendars Accordingly to Reflect This Change',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: `2025-04-27T09:31:25.000Z`,
      isRead: false,
      isStarred: false,
      images: ['Screenshot 2025-03-10 111918.png'],
      attachments: ['random.pdf'],
      email: 'ethangolds@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: true,
        work: true,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i3',
      sender: ['Sophie Meier'],
      subject:
        'Attention: Please Be Advised That the Previously Scheduled Meeting Has Been Officially Rescheduled to a New Date and Time Due to Unforeseen Circumstances;',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-29T09:31:25.000Z',
      isRead: true,
      isStarred: false,
      images: ['Screenshot 2025-03-10 111918.png'],
      attachments: ['random.pdf', 'random2.pdf'],
      email: 'sophiemeier@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i4',
      sender: ['Adrian Müller'],
      subject: 'Meeting Tomorrow',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-23T09:31:25.000Z',
      isRead: false,
      isStarred: false,
      attachments: ['random.pdf'],
      images: [],
      email: 'adrian.mueller@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: true,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i5',
      sender: ['Ethan Gold'],
      subject: 'Meeting Rescheduled',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: `2025-03-27T09:31:25.000Z`,
      isRead: false,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'ethangolds@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: true,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i6',
      sender: ['Sophie Meier'],
      subject: 'Reminder: Submit Your Report',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-23T09:31:25.000Z',
      isRead: true,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'sophiemeier@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i7',
      sender: ['Adrian Müller'],
      subject: 'Meeting Tomorrow',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-23T09:31:25.000Z',
      isRead: false,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'adrian.mueller@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i8',
      sender: ['Ethan Gold'],
      subject: 'Meeting Rescheduled',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: `2025-03-27T09:31:25.000Z`,
      isRead: false,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'ethangolds@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i9',
      sender: ['Sophie Meier'],
      subject: 'Reminder: Submit Your Report',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-23T09:31:25.000Z',
      isRead: true,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'sophiemeier@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i10',
      sender: ['Adrian Müller'],
      subject: 'Meeting Tomorrow',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-03-23T09:31:25.000Z',
      isRead: false,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'adrian.mueller@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i11',
      sender: ['Ethan Gold'],
      subject: 'Meeting Rescheduled',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: `2025-03-27T09:31:25.000Z`,
      email: 'ethangolds@gmail.com',
      isRead: false,
      isStarred: false,
      attachments: [],
      images: [],
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
    {
      id: 'i12',
      sender: ['Sophie Meier'],
      subject: 'Reminder: Submit Your Report',
      preview:
        '<p>Dear,</p><p>I hope this message finds you well. I am writing to follow up on the progress of [specific project/task] and to discuss the next steps. As per our last meeting, we aimed to achieve.</p><p><br></p><p>Could you please provide an update on the current status? Additionally, if there are any challenges or adjustments required, I would be happy to assist in addressing them.</p><p><br></p><p>Looking forward to your reply.</p><p><br></p><p>Best regards, Md</p>',
      date: '2025-04-30T09:31:25.000Z',
      isRead: true,
      isStarred: false,
      attachments: [],
      images: [],
      email: 'sophiemeier@gmail.com',
      trash: false,
      spam: false,
      tags: {
        personal: false,
        work: false,
        payments: false,
        invoices: false,
      },
      sectionCategory: 'inbox',
      isDeleted: false,
    },
  ],
  starred: [],
  sent: [],
  drafts: [],
  spam: [],
  trash: [],

  personal: [],
  work: [],
};
