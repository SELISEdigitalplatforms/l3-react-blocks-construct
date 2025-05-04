import React from 'react';
import { ITask } from '../../types/task';
import { StatusCircle } from '../status-circle/status-circle';

/**
 * DragOverlayItem Component
 *
 * A reusable component for rendering a draggable task item overlay.
 * This component supports:
 * - Displaying the task's status and content
 *
 * Features:
 * - Provides a visual representation of the task during drag-and-drop operations
 * - Displays the task's status circle and content
 *
 * Props:
 * @param {ITask} task - The task object to display in the overlay
 *
 * @returns {JSX.Element} The drag overlay item component
 *
 * @example
 * // Basic usage
 * <DragOverlayItem task={task} />
 */

interface DragOverlayItemProps {
  task: ITask;
}

export function DragOverlayItem({ task }: DragOverlayItemProps) {
  return (
    <div className="flex items-center bg-white shadow-lg border border-gray-200 p-4 rounded-lg w-full">
      <div className="flex-shrink-0 mr-3">
        <StatusCircle isCompleted={task.isCompleted} />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-900">{task.content}</p>
      </div>
    </div>
  );
}
