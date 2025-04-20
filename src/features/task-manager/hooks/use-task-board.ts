import { useState } from 'react';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ITask, ITaskManagerColumn } from '../types/task';
import { TaskService } from '../services/task-service';

export function useTaskBoard(taskService: TaskService, onTasksUpdated?: () => void) {
  const initialColumns: ITaskManagerColumn[] = [
    {
      id: '1',
      title: 'To Do',
      tasks: taskService
        .convertTasksToITaskFormat(taskService.getTasks())
        .filter((task) => task.status === 'todo'),
    },
    {
      id: '2',
      title: 'In Progress',
      tasks: taskService
        .convertTasksToITaskFormat(taskService.getTasks())
        .filter((task) => task.status === 'inprogress'),
    },
    {
      id: '3',
      title: 'Done',
      tasks: taskService
        .convertTasksToITaskFormat(taskService.getTasks())
        .filter((task) => task.status === 'done'),
    },
  ];

  const [columns, setColumns] = useState<ITaskManagerColumn[]>(initialColumns);

  const [nextColumnId, setNextColumnId] = useState<number>(4);
  const [nextTaskId, setNextTaskId] = useState<number>(
    13
  );
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

  const addColumn = (title: string) => {
    if (title.trim()) {
      setColumns([...columns, { id: nextColumnId.toString(), title, tasks: [] }]);
      setNextColumnId(nextColumnId + 1);
    }
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    if (newTitle.trim()) {
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return { ...column, title: newTitle };
        }
        return column;
      });
      setColumns(newColumns);
    }
  };

  const deleteColumn = (columnId: string) => {
    const columnToDelete = columns.find((col) => col.id === columnId);
    if (!columnToDelete) return;

    const firstColumnId = columns[0].id;
    if (firstColumnId === columnId && columns.length === 1) {
      setColumns([]);
      return;
    }

    const targetColumnId = columnId === firstColumnId ? columns[1].id : firstColumnId;

    const newColumns = columns.filter((col) => col.id !== columnId);

    if (columnToDelete.tasks.length > 0) {
      const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
        '1': 'todo',
        '2': 'inprogress',
        '3': 'done',
      };

      const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId);
      if (targetColumnIndex !== -1) {
        const tasksToMove = columnToDelete.tasks.map((task) => ({
          ...task,
          status: statusMap[targetColumnId] || task.status,
        }));

        newColumns[targetColumnIndex].tasks = [
          ...newColumns[targetColumnIndex].tasks,
          ...tasksToMove,
        ];
      }
    }

    setColumns(newColumns);
  };

  const addTask = (columnId: string, content: string) => {
    if (content.trim()) {
      const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
        '1': 'todo',
        '2': 'inprogress',
        '3': 'done',
      };

      const newTask: ITask = {
        id: nextTaskId.toString(),
        content,
        status: statusMap[columnId] || 'todo',
        priority: '',
        tags: [],
        assignees: [],
        isCompleted: false,
      };

      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      });

      setColumns(newColumns);
      setNextTaskId(nextTaskId + 1);

      // Trigger the callback to notify the parent component
      if (onTasksUpdated) {
        onTasksUpdated();
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id.toString();

    if (typeof activeId === 'string' && activeId.startsWith('task-')) {
      const taskId = activeId.replace('task-', '');

      for (const column of columns) {
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

    const sourceColumnIndex = columns.findIndex((col) =>
      col.tasks.some((task) => task.id === activeTaskId)
    );

    if (sourceColumnIndex === -1) return;

    if (typeof overId === 'string' && overId.startsWith('column-')) {
      const targetColumnId = overId.replace('column-', '');
      const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId);

      if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) return;

      const newColumns = [...columns];
      const activeTaskIndex = newColumns[sourceColumnIndex].tasks.findIndex(
        (task) => task.id === activeTaskId
      );

      if (activeTaskIndex === -1) return;

      const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(activeTaskIndex, 1);

      const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
        '1': 'todo',
        '2': 'inprogress',
        '3': 'done',
      };

      newColumns[targetColumnIndex].tasks.push({
        ...movedTask,
        status: statusMap[targetColumnId] || movedTask.status,
      });

      setColumns(newColumns);
    } else if (typeof overId === 'string' && overId.startsWith('task-')) {
      const overTaskId = overId.replace('task-', '');

      const targetColumnIndex = columns.findIndex((col) =>
        col.tasks.some((task) => task.id === overTaskId)
      );

      if (targetColumnIndex === -1) return;

      const sourceTaskIndex = columns[sourceColumnIndex].tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const targetTaskIndex = columns[targetColumnIndex].tasks.findIndex(
        (task) => task.id === overTaskId
      );

      if (sourceTaskIndex === -1 || targetTaskIndex === -1) return;

      const newColumns = [...columns];

      if (sourceColumnIndex === targetColumnIndex) {
        newColumns[sourceColumnIndex].tasks = arrayMove(
          newColumns[sourceColumnIndex].tasks,
          sourceTaskIndex,
          targetTaskIndex
        );
      } else {
        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);

        const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
          '1': 'todo',
          '2': 'inprogress',
          '3': 'done',
        };

        newColumns[targetColumnIndex].tasks.splice(targetTaskIndex, 0, {
          ...movedTask,
          status: statusMap[columns[targetColumnIndex].id] || movedTask.status,
        });
      }

      setColumns(newColumns);
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

        for (let i = 0; i < columns.length; i++) {
          const taskIndex = columns[i].tasks.findIndex((t) => t.id === taskId);
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

        const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId);

        if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
          setActiveTask(null);
          return;
        }

        const newColumns = [...columns];

        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1);

        const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
          '1': 'todo',
          '2': 'inprogress',
          '3': 'done',
        };

        newColumns[targetColumnIndex].tasks.push({
          ...movedTask,
          status: statusMap[targetColumnId] || movedTask.status,
        });

        setColumns(newColumns);
      }
    }

    setActiveTask(null);
  };

  const updateTaskStatus = (taskId: string | undefined, isCompleted: boolean) => {
    const newColumns = columns.map((column) => {
      const updatedTasks = column.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isCompleted };
        }
        return task;
      });

      return { ...column, tasks: updatedTasks };
    });
    setColumns(newColumns);

  };

  return {
    columns,
    activeColumn,
    activeTask,
    sensors,
    setActiveColumn,
    addColumn,
    renameColumn,
    deleteColumn,
    addTask,
    updateTaskStatus,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
