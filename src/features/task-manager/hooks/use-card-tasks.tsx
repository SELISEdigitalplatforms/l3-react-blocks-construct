import { useState } from 'react';
import { ITask, useTaskContext } from '../contexts/task-context';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useDeviceCapabilities } from 'hooks/use-device-capabilities';

export function useCardTasks() {
  const {
    columnTasks,
    setColumnTasks,
    addTask,
    moveTask,
    updateTask,
    addColumn,
    updateColumn,
    deleteColumn,
  } = useTaskContext();

  const { touchEnabled, screenSize } = useDeviceCapabilities();
  const [, setNextColumnId] = useState<number>(4);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: screenSize === 'mobile' ? 300 : 200,
      tolerance: screenSize === 'mobile' ? 8 : 5,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: screenSize === 'mobile' ? 8 : screenSize === 'tablet' ? 5 : 3,
    },
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: screenSize === 'tablet' ? 5 : 10,
    },
  });

  const sensors = useSensors(
    touchEnabled ? touchSensor : null,
    screenSize === 'tablet' ? mouseSensor : null,
    pointerSensor
  );

  const createColumn = (title: string) => {
    if (title.trim()) {
      const id = addColumn(title);
      setNextColumnId((prev) => prev + 1);
      return id;
    }
    return null;
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    if (newTitle.trim()) {
      updateColumn(columnId, newTitle);
    }
  };

  const removeColumn = (columnId: string) => {
    deleteColumn(columnId);
  };

  const addTaskToColumn = (columnId: string, content: string) => {
    if (content.trim()) {
      const column = columnTasks.find((col) => col.id === columnId);

      if (!column) {
        console.error(`Column with ID ${columnId} not found.`);
        return null;
      }

      const section = column.title;

      const taskId = addTask({
        title: content,
        section,
        isCompleted: false,
      });

      return taskId;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    // Skip if scrolling
    if (event.active.data.current?.isScrolling) {
      return;
    }

    const { active } = event;
    const activeId = active.id.toString();

    if (typeof activeId === 'string' && activeId.startsWith('task-')) {
      const taskId = activeId.replace('task-', '');

      for (const column of columnTasks) {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          setActiveTask(task);
          break;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (typeof activeId !== 'string' || !activeId.startsWith('task-')) return;

    const activeTaskId = activeId.replace('task-', '');

    const sourceColumnIndex = columnTasks.findIndex((col) =>
      col.tasks.some((task) => task.id === activeTaskId)
    );

    if (sourceColumnIndex === -1) return;

    if (typeof overId === 'string' && overId.startsWith('column-')) {
      const targetColumnId = overId.replace('column-', '');
      const targetColumnIndex = columnTasks.findIndex((col) => col.id === targetColumnId);

      if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) return;

      const newColumns = [...columnTasks];
      const activeTaskIndex = newColumns[sourceColumnIndex].tasks.findIndex(
        (task) => task.id === activeTaskId
      );

      if (activeTaskIndex === -1) return;

      const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(activeTaskIndex, 1);

      newColumns[targetColumnIndex].tasks.push({
        ...movedTask,
        status: movedTask.status,
      });
      moveTask(movedTask.id, newColumns[targetColumnIndex].title);
      setColumnTasks(newColumns);
    } else if (typeof overId === 'string' && overId.startsWith('task-')) {
      const overTaskId = overId.replace('task-', '');

      const targetColumnIndex = columnTasks.findIndex((col) =>
        col.tasks.some((task) => task.id === overTaskId)
      );

      if (targetColumnIndex === -1) return;

      const sourceTaskIndex = columnTasks[sourceColumnIndex].tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const targetTaskIndex = columnTasks[targetColumnIndex].tasks.findIndex(
        (task) => task.id === overTaskId
      );

      if (sourceTaskIndex === -1 || targetTaskIndex === -1) return;

      const newColumns = [...columnTasks];

      if (sourceColumnIndex === targetColumnIndex) {
        newColumns[sourceColumnIndex].tasks = arrayMove(
          newColumns[sourceColumnIndex].tasks,
          sourceTaskIndex,
          targetTaskIndex
        );
      } else {
        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);

        newColumns[targetColumnIndex].tasks.splice(targetTaskIndex, 0, {
          ...movedTask,
          status: movedTask.status,
        });
        moveTask(movedTask.id, newColumns[targetColumnIndex].title);
      }

      setColumnTasks(newColumns);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (typeof activeId === 'string' && activeId.startsWith('task-')) {
      const taskId = activeId.replace('task-', '');

      if (typeof overId === 'string' && overId.startsWith('column-')) {
        const targetColumnId = overId.replace('column-', '');

        let sourceColumnIndex = -1;
        let sourceTaskIndex = -1;

        for (let i = 0; i < columnTasks.length; i++) {
          const taskIndex = columnTasks[i].tasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            sourceColumnIndex = i;
            sourceTaskIndex = taskIndex;
            break;
          }
        }

        if (sourceColumnIndex === -1) {
          setActiveTask(null);
          return;
        }

        const targetColumnIndex = columnTasks.findIndex((col) => col.id === targetColumnId);

        if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
          setActiveTask(null);
          return;
        }

        const newColumns = [...columnTasks];

        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);

        newColumns[targetColumnIndex].tasks.push({
          ...movedTask,
          status: movedTask.status,
        });
        moveTask(movedTask.id, newColumns[targetColumnIndex].title);

        setColumnTasks(newColumns);
      }
    }

    setActiveTask(null);
  };

  const updateTaskCompletion = (taskId: string, isCompleted: boolean) => {
    updateTask(taskId, { isCompleted });
  };

  return {
    columns: columnTasks,
    activeColumn,
    activeTask,
    sensors,
    setActiveColumn,
    addColumn: createColumn,
    renameColumn,
    deleteColumn: removeColumn,
    addTask: addTaskToColumn,
    updateTaskStatus: updateTaskCompletion,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
