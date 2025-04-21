import { useState } from "react";
import { ITask, useTaskContext } from "../contexts/task-context";
import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

export function useCardTasks() {
    const {
      columnTasks,
      addTask,
      updateTask,
      moveTask,
      addColumn,
      updateColumn,
      deleteColumn
    } = useTaskContext();

    const [ , setNextColumnId] = useState<number>(4);
    const [activeColumn, setActiveColumn] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      })
    );

    const createColumn = (title: string) => {
      if (title.trim()) {
        const id = addColumn(title);
        setNextColumnId(prev => prev + 1);
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
        const sectionMap: Record<string, string> = {
          '1': 'To Do',
          '2': 'In Progress',
          '3': 'Done',
        };

        const section = sectionMap[columnId] || 'To Do';

        const taskId = addTask({
          title: content,
          section,
          isCompleted: false
        });

        return taskId;
      }
      return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
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

      if (typeof overId === 'string' && overId.startsWith('column-')) {
        const targetColumnId = overId.replace('column-', '');

        const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
          '1': 'todo',
          '2': 'inprogress',
          '3': 'done',
        };

        const newStatus = statusMap[targetColumnId];
        if (newStatus) {
          moveTask(activeTaskId, newStatus);
        }
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

          const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
            '1': 'todo',
            '2': 'inprogress',
            '3': 'done',
          };

          const newStatus = statusMap[targetColumnId];
          if (newStatus) {
            moveTask(taskId, newStatus);
          }
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