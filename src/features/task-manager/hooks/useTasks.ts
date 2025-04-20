import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { ITask } from '../types/task';

type TaskStatus = 'todo' | 'inprogress' | 'done';

export function useTasks(initialTasks: ITask[]) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [nextTaskId, setNextTaskId] = useState<number>(
    Math.max(...initialTasks.map((t) => parseInt(t.id))) + 1
  );

  const addTask = (title: string, status: TaskStatus) => {
    if (title.trim()) {
      const newTask: ITask = {
        id: nextTaskId.toString(),
        content: title,
        status: status,
        dueDate: '18.03.2025',
        priority: 'Medium',
        tags: [],
        assignees: [],
        isCompleted: false,
      };

      setTasks([newTask, ...tasks]);
      setNextTaskId(nextTaskId + 1);
      return true;
    }
    return false;
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskOrder = (activeIndex: number, overIndex: number) => {
    setTasks(arrayMove(tasks, activeIndex, overIndex));
  };

  const getFilteredTasks = (statusFilter: string | null) => {
    return statusFilter ? tasks.filter((task) => task.status === statusFilter) : tasks;
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTaskOrder,
    getFilteredTasks,
  };
}
