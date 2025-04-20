import { useEffect, useState } from 'react';
import TaskManagerToolbar from 'features/task-manager/components/task-manager-toolbar/task-manager-toolbar';
import TaskListView from './task-list-view';
import { TaskDetails, TaskService } from 'features/task-manager/services/task-service';
import TaskCardView from './task-card-view';
import { TaskProvider } from 'features/task-manager/hooks/use-task-context';

const taskService = new TaskService();


export default function TaskManager() {
  const [viewMode, setViewMode] = useState('board');

  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskDetails[]>([]);


  useEffect(() => {
    setTasks(taskService.getTasks());
  }, []);

  const onOpen = () => {
    setNewTaskModalOpen(true);
  };

  const handleViewMode = (view: string) => {
    setViewMode(view === 'list' ? 'list' : 'board');
  };

  const handleTaskAdded = () => {
    setTasks(taskService.getTasks());
  };

  return (
    <TaskProvider>
      <div className="flex w-full flex-col">
        <div className="mb-4 flex items-center justify-between md:mb-8">
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">Task Manager</h3>
          <TaskManagerToolbar viewMode={viewMode} handleViewMode={handleViewMode} onOpen={onOpen} />
        </div>

        {viewMode === 'board' && (
          <TaskCardView
            isNewTaskModalOpen={isNewTaskModalOpen}
            setNewTaskModalOpen={setNewTaskModalOpen}
            task={tasks}
            taskService={taskService}
            onTaskAdded={handleTaskAdded}
          />
        )}
        {viewMode === 'list' && <TaskListView task={tasks} taskService={taskService} />}
      </div>
    </TaskProvider>
  );
}
