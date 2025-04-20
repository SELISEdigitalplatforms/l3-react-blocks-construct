import { useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useTaskBoard } from 'features/task-manager/hooks/use-task-board';
import { AddColumnDialog } from 'features/task-manager/components/card-view/add-column-dialog';
import { TaskDragOverlay } from 'features/task-manager/components/card-view/tag-drag-overlay';
import { AddTaskDialog } from 'features/task-manager/components/card-view/add-task-dialog';
import { TaskColumn } from 'features/task-manager/components/card-view/task-column';
import { Dialog } from 'components/ui/dialog';
import TaskDetailsView from 'features/task-manager/components/task-details-view/task-details-view';

interface TaskCardViewProps {
  task?: any;
  taskService?: any;
  isNewTaskModalOpen?: boolean;
  setNewTaskModalOpen: (isOpen: boolean) => void;
  onTaskAdded?: () => void;
}

export function TaskCardView({
  taskService,
  isNewTaskModalOpen,
  setNewTaskModalOpen,
  onTaskAdded,
}: TaskCardViewProps) {
  const handleTasksUpdated = () => {
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  const {
    columns,
    activeColumn,
    activeTask,
    sensors,
    setActiveColumn,
    addColumn,
    renameColumn,
    deleteColumn,
    addTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useTaskBoard(taskService, handleTasksUpdated);

  useEffect(() => {
    const handleSetActiveColumn = (event: Event) => {
      const customEvent = event as CustomEvent;
      const columnId = customEvent.detail;
      setActiveColumn(columnId);
    };

    document.addEventListener('setActiveColumn', handleSetActiveColumn);

    return () => {
      document.removeEventListener('setActiveColumn', handleSetActiveColumn);
    };
  }, [setActiveColumn]);

  const handleDeleteTask = (taskId: string) => {
    taskService.deleteTask(taskId);
  };

  return (
    <div className="h-full w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto p-4 h-full">
          <div className="flex space-x-4 min-h-full">
            {columns.map((column) => (
              <TaskColumn
                taskService={taskService}
                key={column.id}
                column={column}
                tasks={column.tasks || []}
                setActiveColumn={setActiveColumn}
                onAddTask={(columnId, content) => addTask(columnId, content)}
                onRenameColumn={(columnId, newTitle) => renameColumn(columnId, newTitle)}
                onDeleteColumn={(columnId) => deleteColumn(columnId)}
                onTaskAdded={onTaskAdded}
              />
            ))}

            <div className="flex items-start pt-10 px-2">
              <AddColumnDialog onAddColumn={(title) => addColumn(title)} />
            </div>
          </div>
        </div>

        <DragOverlay>{activeTask && <TaskDragOverlay activeTask={activeTask} />}</DragOverlay>
      </DndContext>

      <AddTaskDialog
        activeColumn={activeColumn}
        columns={columns}
        onAddTask={(columnId, content) => addTask(columnId, content)}
      />

      <Dialog open={isNewTaskModalOpen} onOpenChange={setNewTaskModalOpen}>
        {isNewTaskModalOpen && (
          <TaskDetailsView
            taskService={taskService}
            onClose={() => setNewTaskModalOpen(false)}
            handleDeleteTask={handleDeleteTask}
            isNewTaskModalOpen={isNewTaskModalOpen}
            onTaskAddedList={onTaskAdded}
            onTaskAddedCard={(columnId, content) => addTask(columnId, content)}
            setActiveColumn={setActiveColumn}
          />
        )}
      </Dialog>
    </div>
  );
}

export default TaskCardView;
