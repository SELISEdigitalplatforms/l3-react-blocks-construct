import { useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { AddColumnDialog } from 'features/task-manager/components/card-view/add-column-dialog';
import { TaskDragOverlay } from 'features/task-manager/components/card-view/task-drag-overlay';
import { AddTaskDialog } from 'features/task-manager/components/card-view/add-task-dialog';
import { TaskColumn } from 'features/task-manager/components/card-view/task-column';
import { Dialog } from 'components/ui/dialog';
import TaskDetailsView from 'features/task-manager/components/task-details-view/task-details-view';
import { useCardTasks } from 'features/task-manager/hooks/use-card-tasks';
import { useDeviceCapabilities } from 'hooks/use-device-capabilities';

/**
 * TaskCardView Component
 *
 * A card-based (Kanban-style) task board for managing tasks within draggable columns.
 * Built using `@dnd-kit/core` for drag-and-drop and internal task management
 * via the `useCardTasks` hook. Supports adaptive drag sensitivity based on device.
 *
 * Features:
 * - Drag-and-drop columns and tasks
 * - Touch & mouse sensor adaptation using `useDeviceCapabilities`
 * - Inline task and column creation
 * - Modal support for task details
 * - External "Add Task" dialog support
 *
 * Props:
 * @param {any} task - (Unused) legacy prop
 * @param {any} taskService - Service for interacting with task details
 * @param {boolean} isNewTaskModalOpen - Controls visibility of the task details modal
 * @param {(isOpen: boolean) => void} setNewTaskModalOpen - Handler to toggle task modal state
 * @param {() => void} [onTaskAdded] - Optional callback triggered after task creation
 *
 * @returns {JSX.Element} A drag-and-drop-enabled Kanban board for tasks
 *
 * @example
 * <TaskCardView
 *   taskService={myTaskService}
 *   isNewTaskModalOpen={isModalOpen}
 *   setNewTaskModalOpen={setModalOpen}
 *   onTaskAdded={() => refreshTasks()}
 * />
 */

interface TaskCardViewProps {
  isNewTaskModalOpen?: boolean;
  setNewTaskModalOpen: (isOpen: boolean) => void;
}

export function TaskCardView({
  isNewTaskModalOpen,
  setNewTaskModalOpen,
}: Readonly<TaskCardViewProps>) {
  const { touchEnabled, screenSize } = useDeviceCapabilities();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: screenSize === 'tablet' ? 5 : 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: screenSize === 'mobile' ? 250 : 150,
      tolerance: screenSize === 'mobile' ? 5 : 3,
    },
  });

  const dndSensors = useSensors(touchSensor, mouseSensor);

  const {
    columns,
    activeColumn,
    activeTask,
    setActiveColumn,
    addColumn,
    renameColumn,
    deleteColumn,
    addTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useCardTasks();

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

  return (
    <div className="h-full w-full">
      <DndContext
        sensors={dndSensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll={{
          threshold: {
            x: 0.2,
            y: 0.2,
          },
        }}
        measuring={{
          draggable: {
            measure: (element) => element.getBoundingClientRect(),
          },
        }}
      >
        <div
          className={`flex overflow-x-auto p-4 h-full ${touchEnabled ? 'touch-pan-x' : ''}`}
          style={{
            touchAction: touchEnabled ? 'pan-x' : 'auto',
          }}
        >
          <div className="flex space-x-4 min-h-full">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={column.tasks || []}
                setActiveColumn={setActiveColumn}
                onAddTask={(columnId, content) => addTask(columnId, content)}
                onRenameColumn={(columnId, newTitle) => renameColumn(columnId, newTitle)}
                onDeleteColumn={(columnId) => deleteColumn(columnId)}
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
            onClose={() => setNewTaskModalOpen(false)}
            isNewTaskModalOpen={isNewTaskModalOpen}
          />
        )}
      </Dialog>
    </div>
  );
}

export default TaskCardView;
