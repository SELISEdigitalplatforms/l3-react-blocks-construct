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

export interface ITaskColumnProps {
  column: {
    id: string;
    title: string;
    tasks: any[];
  };
  tasks: any[];
  setActiveColumn: (columnId: string) => void;
  onAddTask: (columnId: string, taskTitle: string) => string | null;
}

export const statusDisplay = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

export type TPriority = 'normal' | 'High' | 'Medium' | 'Low';
