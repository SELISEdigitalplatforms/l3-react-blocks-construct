import { ITask } from '../types/task';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'other';
}

export interface Comment {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface TaskDetails {
  isCompleted: boolean;
  id: string;
  title: string;
  mark: boolean;
  section: string;
  priority: string;
  dueDate: Date | null;
  assignees: Assignee[];
  description: string;
  tags: Tag[];
  attachments: Attachment[];
  comments: Comment[];
}

export class TaskService {
  private tasks: TaskDetails[];

  constructor() {
    this.tasks = [
      {
        id: '1',
        title: 'Update Calendar UI',
        mark: false,
        section: 'To Do',
        priority: 'Medium',
        dueDate: new Date('2025-04-01'),
        assignees: [
          {
            id: '1',
            name: 'Aaron Green',
            avatar:
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
          },
          {
            id: '2',
            name: 'Adrian Müller',
            avatar:
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
          },
        ],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'calendar', label: 'Calendar' },
          { id: 'ui-ux', label: 'UI/UX' },
        ],
        attachments: [
          { id: '1', name: 'design-spec.pdf', size: '2 MB', type: 'pdf' },
          { id: '2', name: 'screenshot.png', size: '1.5 MB', type: 'image' },
        ],
        comments: [
          {
            id: '1',
            author: 'Block Smith',
            timestamp: '20.03.2025, 12:00',
            text: 'Please check, review & verify.',
          },
          {
            id: '2',
            author: 'Jane Doe',
            timestamp: '20.03.2025, 13:15',
            text: 'Looks good to me. Ready for deployment.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Fix Login Bug',
        mark: true,
        section: 'Done',
        priority: 'High',
        dueDate: new Date('2025-04-02'),
        assignees: [
          {
            id: '3',
            name: 'John Doe',
            avatar:
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlInG6sSFJSz2UMlimG.jpeg',
          },
        ],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [
          { id: '1', name: 'design-spec.pdf', size: '2 MB', type: 'pdf' },
          { id: '2', name: 'screenshot.png', size: '1.5 MB', type: 'image' },
        ],
        comments: [
          {
            id: '1',
            author: 'Block Smith',
            timestamp: '20.03.2025, 12:00',
            text: 'Please check, review & verify.',
          },
          {
            id: '2',
            author: 'Jane Doe',
            timestamp: '20.03.2025, 13:15',
            text: 'Looks good to me. Ready for deployment.',
          },
        ],
        isCompleted: true,
      },
      {
        id: '3',
        title: 'Design Dashboard Analytics',
        mark: false,
        section: 'To Do',
        priority: 'High',
        dueDate: new Date('2025-04-03'),
        assignees: [{ id: '4', name: 'Sara Kim', avatar: 'https://i.pravatar.cc/150?img=4' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [{ id: 'design', label: 'Design' }],
        attachments: [
          { id: '1', name: 'dashboard-analytics.fig', size: '3.2 MB', type: 'pdf' },
          { id: '2', name: 'wireframe.png', size: '950 KB', type: 'image' },
        ],
        comments: [
          {
            id: '1',
            author: 'Sara Kim',
            timestamp: '21.03.2025, 10:30',
            text: 'Started working on the visual drafts.',
          },
          {
            id: '2',
            author: 'Jane Doe',
            timestamp: '21.03.2025, 11:45',
            text: 'Add some padding around charts.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '4',
        title: 'Set Up CI/CD Pipeline',
        mark: false,
        section: 'In Progress',
        priority: 'High',
        dueDate: new Date('2025-04-04'),
        assignees: [{ id: '5', name: 'Alex Wang', avatar: 'https://i.pravatar.cc/150?img=5' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [{ id: '1', name: 'ci-cd-pipeline.yml', size: '45 KB', type: 'image' }],
        comments: [
          {
            id: '1',
            author: 'Alex Wang',
            timestamp: '20.03.2025, 14:00',
            text: 'CI pipeline working. CD config in progress.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '5',
        title: 'QA: Profile Update Flow',
        mark: false,
        section: 'Done',
        priority: 'Medium',
        dueDate: new Date('2025-04-06'),
        assignees: [{ id: '6', name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?img=6' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [{ id: '1', name: 'test-cases.xlsx', size: '120 KB', type: 'other' }],
        comments: [
          {
            id: '1',
            author: 'Emily Clark',
            timestamp: '19.03.2025, 15:30',
            text: 'Tested 15/20 edge cases. 5 more pending.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '6',
        title: 'Integrate Stripe Payments',
        mark: false,
        section: 'In Progress',
        priority: 'High',
        dueDate: new Date('2025-04-09'),
        assignees: [{ id: '7', name: 'Leo Chan', avatar: 'https://i.pravatar.cc/150?img=7' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [
          { id: '1', name: 'stripe-docs.pdf', size: '1.1 MB', type: 'pdf' },
          { id: '2', name: 'invoice-template.png', size: '780 KB', type: 'image' },
        ],
        comments: [
          {
            id: '1',
            author: 'Leo Chan',
            timestamp: '22.03.2025, 09:20',
            text: 'Webhook config tested. Awaiting approval.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '7',
        title: 'Update Notification System',
        mark: false,
        section: 'To Do',
        priority: 'Medium',
        dueDate: new Date('2025-04-10'),
        assignees: [
          { id: '8', name: 'Natalie Perez', avatar: 'https://i.pravatar.cc/150?img=8' },
          { id: '8', name: 'Natalie Perez', avatar: 'https://i.pravatar.cc/150?img=8' },
          { id: '8', name: 'Natalie Perez', avatar: 'https://i.pravatar.cc/150?img=8' },
          { id: '8', name: 'Natalie Perez', avatar: 'https://i.pravatar.cc/150?img=8' },
          { id: '8', name: 'Natalie Perez', avatar: 'https://i.pravatar.cc/150?img=8' },
        ],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [{ id: 'frontend', label: 'Frontend' }],
        attachments: [{ id: '1', name: 'notification-flowchart.pdf', size: '550 KB', type: 'pdf' }],
        comments: [
          {
            id: '1',
            author: 'Natalie Perez',
            timestamp: '22.03.2025, 10:10',
            text: 'Need design review for mobile toast layout.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '8',
        title: 'Optimize Landing Page SEO',
        mark: false,
        section: 'In Progress',
        priority: 'Low',
        dueDate: new Date('2025-03-01'),
        assignees: [{ id: '9', name: 'Ivy Thompson', avatar: 'https://i.pravatar.cc/150?img=9' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'accessibility', label: 'Accessibility' },
          { id: 'frontend', label: 'Frontend' },
        ],
        attachments: [{ id: '1', name: 'seo-checklist.txt', size: '40 KB', type: 'pdf' }],
        comments: [
          {
            id: '1',
            author: 'Ivy Thompson',
            timestamp: '21.03.2025, 11:00',
            text: 'Added structured data markup.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '9',
        title: 'Database Migration Plan',
        mark: false,
        section: 'To Do',
        priority: 'High',
        dueDate: new Date('2025-04-01'),
        assignees: [
          { id: '10', name: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/150?img=10' },
        ],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [{ id: '1', name: 'migration-plan.docx', size: '1.2 MB', type: 'image' }],
        comments: [
          {
            id: '1',
            author: 'Carlos Mendes',
            timestamp: '20.03.2025, 17:15',
            text: 'Schema comparison draft ready.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '10',
        title: 'Implement Dark Mode',
        mark: false,
        section: 'To Do',
        priority: 'Medium',
        dueDate: new Date('2025-04-01'),
        assignees: [{ id: '11', name: 'Priya Singh', avatar: 'https://i.pravatar.cc/150?img=11' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'accessibility', label: 'Accessibility' },
        ],
        attachments: [{ id: '1', name: 'theme-guide.md', size: '70 KB', type: 'image' }],
        comments: [
          {
            id: '1',
            author: 'Priya Singh',
            timestamp: '22.03.2025, 09:45',
            text: 'Toggle logic implemented. Testing styles now.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '11',
        title: 'Review Legal Compliance',
        mark: false,
        section: 'Done',
        priority: 'High',
        dueDate: new Date('2025-04-01'),
        assignees: [{ id: '12', name: 'Omar Raza', avatar: 'https://i.pravatar.cc/150?img=12' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [{ id: '1', name: 'compliance-checklist.pdf', size: '300 KB', type: 'pdf' }],
        comments: [
          {
            id: '1',
            author: 'Omar Raza',
            timestamp: '20/03/2025, 14:30',
            text: 'Cookies and consent banner updated.',
          },
        ],
        isCompleted: false,
      },
      {
        id: '12',
        title: 'User Feedback Report',
        mark: true,
        section: 'Done',
        priority: 'Low',
        dueDate: new Date('2025-04-01'),
        assignees: [{ id: '13', name: 'Mina Park', avatar: 'https://i.pravatar.cc/150?img=13' }],
        description: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
        tags: [
          { id: 'ui-ux', label: 'UI/UX' },
          { id: 'usability', label: 'Usability' },
        ],
        attachments: [{ id: '1', name: 'feedback-summary.csv', size: '250 KB', type: 'image' }],
        comments: [
          {
            id: '1',
            author: 'Mina Park',
            timestamp: '18/03/2025, 16:00',
            text: 'Finished compiling user suggestions.',
          },
        ],
        isCompleted: true,
      },
    ];
  }

  getTasks(): TaskDetails[] {
    return this.tasks;
  }

  addTask(newTask: TaskDetails): void {
    this.tasks.push(newTask);
  }

  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  convertTasksToITaskFormat = (tasks: TaskDetails[]): ITask[] => {
    return tasks.map((task) => {
      let status: 'todo' | 'inprogress' | 'done' = 'todo';
      if (task.section === 'To Do') status = 'todo';
      else if (task.section === 'In Progress') status = 'inprogress';
      else if (task.section === 'Done') status = 'done';

      const tagLabels = task.tags.map((tag) => tag.label);

      const assigneeNames = task.assignees.map((assignee) => assignee.name);

      const formattedDate = task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined;

      return {
        id: task.id,
        content: task.title,
        priority: task.priority,
        tags: tagLabels,
        dueDate: formattedDate,
        comments: task.comments.length,
        attachments: task.attachments.length,
        assignees: assigneeNames,
        status,
        isCompleted: task.isCompleted,
      };
    });
  };
}
