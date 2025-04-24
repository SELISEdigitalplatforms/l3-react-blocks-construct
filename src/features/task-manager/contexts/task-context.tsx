import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

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

export interface ITask {
  id: string;
  content: string;
  priority?: string;
  tags?: string[];
  dueDate?: string;
  comments?: number;
  attachments?: number;
  assignees?: string[];
  status?: string;
  isCompleted: boolean;
}

export interface ITaskManagerColumn {
  id: string;
  title: string;
  tasks: ITask[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB');
}

const initialTasks: TaskDetails[] = [
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
    section: 'In Progress',
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
    section: 'Done',
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
    section: 'Done',
    priority: 'High',
    dueDate: new Date('2025-04-01'),
    assignees: [{ id: '10', name: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/150?img=10' }],
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
    section: 'In Progress',
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

interface TaskContextType {
  taskDetails: TaskDetails[];
  listTasks: ITask[];
  columnTasks: ITaskManagerColumn[];
  setColumnTasks: React.Dispatch<React.SetStateAction<ITaskManagerColumn[]>>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  updateFilter: (filters: {
    searchQuery?: string;
    priorities?: string[];
    statuses?: string[];
    assignees?: string[];
    tags?: string[];
    dueDate?: { from: Date | null; to: Date | null };
  }) => void;
  resetFilters: () => void;

  addTask: (task: Partial<TaskDetails>) => string;
  updateTask: (taskId: string, updates: Partial<TaskDetails>) => void;
  deleteTask: (taskId: string) => void;

  updateTaskStatus: (taskId: string, isCompleted: boolean) => void;
  moveTask: (taskId: string, newStatus: string) => void;

  addColumn: (title: string) => string;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;

  reorderTasks: (sourceIndex: number, destinationIndex: number, status?: string) => void;

  addComment: (taskId: string, author: string, text: string) => void;
  addAttachment: (
    taskId: string,
    name: string,
    size: string,
    type: 'pdf' | 'image' | 'other'
  ) => void;
  addAssignee: (taskId: string, name: string, avatar: string) => void;
  addTag: (taskId: string, label: string) => void;

  removeComment: (taskId: string, commentId: string) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  removeAssignee: (taskId: string, assigneeId: string) => void;
  removeTag: (taskId: string, tagId: string) => void;

  priorities: string[];
  assignees: Assignee[];
  tags: Tag[];
  statuses: string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [originalTasks, setOrginalTasks] = useState<TaskDetails[]>(initialTasks);
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>(initialTasks);
  const [nextTaskId, setNextTaskId] = useState<number>(
    Math.max(...initialTasks.map((task) => parseInt(task.id))) + 1
  );
  const [nextColumnId, setNextColumnId] = useState<number>(4);

  const [listTasks, setListTasks] = useState<ITask[]>([]);

  const [columnTasks, setColumnTasks] = useState<ITaskManagerColumn[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDueDate, setSelectedDueDate] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const updateFilter = (filters: {
    searchQuery?: string;
    priorities?: string[];
    statuses?: string[];
    assignees?: string[];
    tags?: string[];
    dueDate?: { from: Date | null; to: Date | null };
  }) => {
    if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
    if (filters.priorities !== undefined) setSelectedPriorities(filters.priorities);
    if (filters.statuses !== undefined) setSelectedStatuses(filters.statuses);
    if (filters.assignees !== undefined) setSelectedAssignees(filters.assignees);
    if (filters.tags !== undefined) setSelectedTags(filters.tags);
    if (filters.dueDate !== undefined) setSelectedDueDate(filters.dueDate);
  };

  useEffect(() => {
    const filteredTasks = originalTasks.filter((task) => {
      const matchesSearchQuery =
        !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(task.section);

      const matchesAssignee =
        selectedAssignees.length === 0 ||
        task.assignees.some((assignee) => selectedAssignees.includes(assignee.id));

      const matchesTags =
        selectedTags.length === 0 || task.tags.some((tag) => selectedTags.includes(tag.id));

      const matchesDueDate =
        (!selectedDueDate.from && !selectedDueDate.to) ||
        (task.dueDate &&
          (!selectedDueDate.from || task.dueDate >= selectedDueDate.from) &&
          (!selectedDueDate.to || task.dueDate <= selectedDueDate.to));

      return (
        matchesSearchQuery &&
        matchesPriority &&
        matchesStatus &&
        matchesAssignee &&
        matchesTags &&
        matchesDueDate
      );
    });

    setTaskDetails(filteredTasks);
  }, [
    searchQuery,
    selectedPriorities,
    selectedStatuses,
    selectedAssignees,
    selectedTags,
    selectedDueDate,
    originalTasks,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setSelectedTags([]);
    setSelectedDueDate({ from: null, to: null });
    setTaskDetails(originalTasks);
  };

  useEffect(() => {
    const newListTasks = taskDetails.map((task) => ({
      id: task.id,
      content: task.title,
      priority: task.priority,
      tags: task.tags.map((tag) => tag.label),
      dueDate: task.dueDate ? formatDate(task.dueDate) : undefined,
      comments: task.comments.length,
      attachments: task.attachments.length,
      assignees: task.assignees.map((assignee) => assignee.name),
      status: task.section,
      isCompleted: task.isCompleted,
    }));

    setListTasks(newListTasks);
  }, [taskDetails]);

  useEffect(() => {
    const uniqueStatuses = Array.from(new Set(listTasks.map((task) => task.status)));

    const newColumnTasks: ITaskManagerColumn[] = columnTasks.map((column) => ({
      ...column,
      tasks: listTasks.filter((task) => task.status === column.title),
    }));

    uniqueStatuses.forEach((status) => {
      if (!newColumnTasks.find((col) => col.title === status)) {
        newColumnTasks.push({
          id: (newColumnTasks.length + 1).toString(),
          title: status || 'Unknown',
          tasks: listTasks.filter((task) => task.status === status),
        });
      }
    });

    setColumnTasks(newColumnTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTasks]);

  const addTask = (task: Partial<TaskDetails>): string => {
    const id = nextTaskId.toString();
    const newTask: TaskDetails = {
      id,
      title: task.title || 'New Task',
      mark: task.mark || false,
      section: task.section || 'To Do',
      priority: task.priority || '',
      dueDate: task.dueDate || null,
      assignees: task.assignees || [],
      description: task.description || '',
      tags: task.tags || [],
      attachments: task.attachments || [],
      comments: task.comments || [],
      isCompleted: task.isCompleted || false,
    };

    setTaskDetails((prev) => [...prev, newTask]);
    setOrginalTasks((prev) => [...prev, newTask]);
    setNextTaskId((prev) => prev + 1);
    return id;
  };

  const updateTask = (taskId: string, updates: Partial<TaskDetails>): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    setOrginalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId: string): void => {
    setTaskDetails((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, isCompleted: boolean): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, isCompleted } : task))
    );
  };

  const moveTask = (taskId: string, newStatus: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, section: newStatus } : task))
    );
    setOrginalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, section: newStatus } : task))
    );
  };

  const addColumn = (title: string): string => {
    const id = nextColumnId.toString();

    setColumnTasks((prev) => [
      ...prev,
      {
        id,
        title,
        tasks: [],
      },
    ]);

    setNextColumnId((prev) => prev + 1);

    return id;
  };

  const updateColumn = (columnId: string, title: string): void => {
    setColumnTasks((prev) =>
      prev.map((column) => (column.id === columnId ? { ...column, title } : column))
    );

    setTaskDetails((prev) =>
      prev.map((task) =>
        task.section === columnTasks.find((col) => col.id === columnId)?.title
          ? { ...task, section: title }
          : task
      )
    );
    setOrginalTasks((prev) =>
      prev.map((task) =>
        task.section === columnTasks.find((col) => col.id === columnId)?.title
          ? { ...task, section: title }
          : task
      )
    );
  };

  const deleteColumn = (columnId: string): void => {
    const columnTitle = columnTasks.find((col) => col.id === columnId)?.title;

    setColumnTasks((prev) => prev.filter((column) => column.id !== columnId));

    if (columnTitle) {
      setTaskDetails((prev) => prev.filter((task) => task.section !== columnTitle));
      setOrginalTasks((prev) => prev.filter((task) => task.section !== columnTitle));
    }
  };

  const reorderTasks = (sourceIndex: number, destinationIndex: number, status?: string): void => {
    const tasksToReorder = status
      ? [...listTasks].filter((task) => task.status === status)
      : [...listTasks];

    const reorderedTasks = arrayMove(tasksToReorder, sourceIndex, destinationIndex);

    if (status) {
      const otherTasks = listTasks.filter((task) => task.status !== status);
      setListTasks([...reorderedTasks, ...otherTasks]);
    } else {
      setListTasks(reorderedTasks);
    }
  };

  const addComment = (taskId: string, author: string, text: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author,
            timestamp: new Date().toLocaleString('en-GB'),
            text,
          };
          return {
            ...task,
            comments: [...task.comments, newComment],
          };
        }
        return task;
      })
    );
  };

  const addAttachment = (
    taskId: string,
    name: string,
    size: string,
    type: 'pdf' | 'image' | 'other'
  ): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newAttachment = {
            id: `attachment-${Date.now()}`,
            name,
            size,
            type,
          };
          return {
            ...task,
            attachments: [...task.attachments, newAttachment],
          };
        }
        return task;
      })
    );
  };

  const addAssignee = (taskId: string, name: string, avatar: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newAssignee = {
            id: `assignee-${Date.now()}`,
            name,
            avatar,
          };
          return {
            ...task,
            assignees: [...task.assignees, newAssignee],
          };
        }
        return task;
      })
    );
  };

  const addTag = (taskId: string, label: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newTag = {
            id: `tag-${Date.now()}`,
            label,
          };
          return {
            ...task,
            tags: [...task.tags, newTag],
          };
        }
        return task;
      })
    );
  };

  const removeComment = (taskId: string, commentId: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments.filter((comment) => comment.id !== commentId),
          };
        }
        return task;
      })
    );
  };

  const removeAttachment = (taskId: string, attachmentId: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            attachments: task.attachments.filter((attachment) => attachment.id !== attachmentId),
          };
        }
        return task;
      })
    );
  };

  const removeAssignee = (taskId: string, assigneeId: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: task.assignees.filter((assignee) => assignee.id !== assigneeId),
          };
        }
        return task;
      })
    );
  };

  const removeTag = (taskId: string, tagId: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            tags: task.tags.filter((tag) => tag.id !== tagId),
          };
        }
        return task;
      })
    );
  };

  const priorities = Array.from(new Set(originalTasks.map((task) => task.priority))).filter(
    Boolean
  );

  const assignees = Array.from(
    new Map(
      originalTasks.flatMap((task) => task.assignees).map((assignee) => [assignee.id, assignee])
    ).values()
  );

  const tags = Array.from(
    new Map(originalTasks.flatMap((task) => task.tags).map((tag) => [tag.id, tag])).values()
  );

  const statuses = Array.from(new Set(originalTasks.map((task) => task.section))).filter(Boolean);

  const value: TaskContextType = {
    taskDetails,
    listTasks,
    columnTasks,
    searchQuery,
    setSearchQuery,
    updateFilter,
    resetFilters,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderTasks,
    addComment,
    addAttachment,
    addAssignee,
    addTag,
    removeComment,
    removeAttachment,
    removeAssignee,
    removeTag,
    setColumnTasks,
    priorities,
    assignees,
    tags,
    statuses,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
};
