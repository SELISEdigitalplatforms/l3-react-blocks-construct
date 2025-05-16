import { ITask } from '../types/task';
import { TaskDetails } from './task-service';

export function convertTasksToSampleTasks(tasks: TaskDetails[]): ITask[] {
  return tasks.map((task) => ({
    id: task.id,
    content: task.title,
    priority: task.priority,
    tags: task.tags.map((tag) => tag.label),
    dueDate: task.dueDate ? formatDate(task.dueDate) : undefined,
    comments: task.comments.length,
    attachments: task.attachments.length,
    assignees: task.assignees.map((_, i) => `user${i + 1}`),
    status: mapSectionToStatus(task.section),
    isCompleted: task.isCompleted,
  }));
}

function mapSectionToStatus(section: string): 'todo' | 'inprogress' | 'done' {
  switch (section.toLowerCase()) {
    case 'to do':
      return 'todo';
    case 'in progress':
      return 'inprogress';
    case 'done':
      return 'done';
    default:
      return 'todo';
  }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
