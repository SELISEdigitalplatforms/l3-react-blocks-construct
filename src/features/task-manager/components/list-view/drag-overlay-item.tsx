import React from 'react';
import { ITask } from '../../types/task';
import { StatusCircle } from '../status-circle/status-circle';

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
