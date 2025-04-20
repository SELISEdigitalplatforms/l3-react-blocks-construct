import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ITask } from '../types/task';
import { TaskDetails, TaskService } from '../services/task-service';

interface TaskContextType {
  tasks: TaskDetails[];
  iTasks: ITask[];
  addTask: (task: TaskDetails) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: TaskDetails) => void;
  mark: boolean;
  toggleMark: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskService] = useState(() => new TaskService());
  const [tasks, setTasks] = useState<TaskDetails[]>([]);
  const [iTasks, setITasks] = useState<ITask[]>([]);
  const [mark, setMark] = useState(false);

  useEffect(() => {
    const currentTasks = taskService.getTasks();
    setTasks(currentTasks);
    setITasks(taskService.convertTasksToITaskFormat(currentTasks));
  }, [taskService]);

  const toggleMark = () => {
    setMark((prev) => !prev); // Toggle the mark state
  };

  const addTask = (task: TaskDetails) => {
    taskService.addTask(task);
    const updatedTasks = taskService.getTasks();
    setTasks(updatedTasks);
    setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
  };

  const deleteTask = (taskId: string) => {
    taskService.deleteTask(taskId);
    const updatedTasks = taskService.getTasks();
    setTasks(updatedTasks);
    setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
  };

  const updateTask = (updatedTask: TaskDetails) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));


    taskService['tasks'] = updatedTasks;

    setTasks(updatedTasks);
    setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
  };

  return (
    <TaskContext.Provider value={{ tasks, iTasks, addTask, deleteTask, updateTask, mark, toggleMark }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
