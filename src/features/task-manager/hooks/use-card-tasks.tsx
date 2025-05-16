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

/**
 * useCardTasks Hook
 *
 * A custom hook for managing tasks and columns in a Kanban-style task manager.
 * This hook supports:
 * - Adding, renaming, and deleting columns
 * - Adding tasks to columns
 * - Drag-and-drop functionality for reordering tasks and moving them between columns
 *
 * Features:
 * - Integrates with the `@dnd-kit` library for drag-and-drop functionality
 * - Provides sensors for touch, pointer, and mouse interactions
 * - Manages active tasks and columns during drag-and-drop operations
 *
 * @returns {Object} An object containing task and column management functions, sensors, and state
 *
 * @example
 * // Basic usage
 * const {
 *   columns,
 *   addColumn,
 *   renameColumn,
 *   deleteColumn,
 *   addTask,
 *   handleDragStart,
 *   handleDragOver,
 *   handleDragEnd,
 * } = useCardTasks();
 */

// testing from own branch

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
  const setNextColumnId = useState<number>(4)[1];
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const getColumnCount = (size: string) => {
    return size === 'tablet' ? 5 : 3;
  };

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: screenSize === 'mobile' ? 300 : 200,
      tolerance: screenSize === 'mobile' ? 8 : 5,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: screenSize === 'mobile' ? 8 : getColumnCount(screenSize),
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

  const getSourceColumnIndex = (taskId: string) =>
    columnTasks.findIndex(col => col.tasks.some(task => task.id === taskId));

  const getTaskIndex = (columnIndex: number, taskId: string) =>
    columnTasks[columnIndex].tasks.findIndex(task => task.id === taskId);

  const handleDropOnColumn = (activeTaskId: string, overId: string, sourceColumnIndex: number) => {
    const targetColumnId = overId.replace('column-', '');
    const targetColumnIndex = columnTasks.findIndex(col => col.id === targetColumnId);

    if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) return;

    const newColumns = [...columnTasks];
    const activeTaskIndex = getTaskIndex(sourceColumnIndex, activeTaskId);
    if (activeTaskIndex === -1) return;

    const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(activeTaskIndex, 1);
    newColumns[targetColumnIndex].tasks.push({ ...movedTask, status: movedTask.status });

    moveTask(movedTask.id, newColumns[targetColumnIndex].title);
    setColumnTasks(newColumns);
  };

  const handleDropOnTask = (activeTaskId: string, overId: string, sourceColumnIndex: number) => {
    const overTaskId = overId.replace('task-', '');
    const targetColumnIndex = getSourceColumnIndex(overTaskId);
    if (targetColumnIndex === -1) return;

    const sourceTaskIndex = getTaskIndex(sourceColumnIndex, activeTaskId);
    const targetTaskIndex = getTaskIndex(targetColumnIndex, overTaskId);
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
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (!activeId.startsWith('task-')) return;
    const activeTaskId = activeId.replace('task-', '');

    const sourceColumnIndex = getSourceColumnIndex(activeTaskId);
    if (sourceColumnIndex === -1) return;

    if (overId.startsWith('column-')) {
      handleDropOnColumn(activeTaskId, overId, sourceColumnIndex);
    } else if (overId.startsWith('task-')) {
      handleDropOnTask(activeTaskId, overId, sourceColumnIndex);
    }
  };

  const extractTaskPosition = (taskId: string) => {
    for (let i = 0; i < columnTasks.length; i++) {
      const taskIndex = columnTasks[i].tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) return { columnIndex: i, taskIndex };
    }
    return null;
  };

  const moveTaskToColumn = (
    sourceColumnIndex: number,
    sourceTaskIndex: number,
    targetColumnIndex: number
  ) => {
    const newColumns = [...columnTasks];
    const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);
    newColumns[targetColumnIndex].tasks.push({
      ...movedTask,
      status: movedTask.status,
    });
    moveTask(movedTask.id, newColumns[targetColumnIndex].title);
    setColumnTasks(newColumns);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (!activeId.startsWith('task-') || !overId.startsWith('column-')) {
      setActiveTask(null);
      return;
    }

    const taskId = activeId.replace('task-', '');
    const targetColumnId = overId.replace('column-', '');

    const taskPosition = extractTaskPosition(taskId);
    if (!taskPosition) {
      setActiveTask(null);
      return;
    }

    const { columnIndex: sourceColumnIndex, taskIndex: sourceTaskIndex } = taskPosition;
    const targetColumnIndex = columnTasks.findIndex((col) => col.id === targetColumnId);

    if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
      setActiveTask(null);
      return;
    }

    moveTaskToColumn(sourceColumnIndex, sourceTaskIndex, targetColumnIndex);
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
