import { ITask, useTaskContext } from "../contexts/task-context";

export function useListTasks() {
    const {
      listTasks,
      addTask,
      deleteTask,
      updateTaskStatus,
      reorderTasks,
      moveTask,
      updateTask
    } = useTaskContext();

    const createTask = (title: string, status: 'todo' | 'inprogress' | 'done' = 'todo') => {
      const section = status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done';

      return addTask({
        title,
        section,
        priority: '',
        dueDate: null,
        isCompleted: false
      });
    };

    const removeTask = (id: string) => {
      deleteTask(id);
    };

    const toggleTaskCompletion = (id: string, isCompleted: boolean) => {
      updateTaskStatus(id, isCompleted);
    };

    const updateTaskOrder = (activeIndex: number, overIndex: number, status?: 'todo' | 'inprogress' | 'done') => {
      reorderTasks(activeIndex, overIndex, status);
    };

    const getFilteredTasks = (statusFilter: 'todo' | 'inprogress' | 'done' | null) => {
      return statusFilter ? listTasks.filter((task) => task.status === statusFilter) : listTasks;
    };

    const changeTaskStatus = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
      moveTask(taskId, newStatus);
    };

    const updateTaskProperties = (taskId: string, updates: Partial<ITask>) => {
      const detailsUpdates: Record<string, any> = {};

      if (updates.content) detailsUpdates.title = updates.content;
      if (updates.priority) detailsUpdates.priority = updates.priority;
      if (updates.isCompleted !== undefined) detailsUpdates.isCompleted = updates.isCompleted;


      updateTask(taskId, detailsUpdates);
    };

    return {
      tasks: listTasks,
      createTask,
      removeTask,
      toggleTaskCompletion,
      updateTaskOrder,
      getFilteredTasks,
      changeTaskStatus,
      updateTaskProperties
    };
  }