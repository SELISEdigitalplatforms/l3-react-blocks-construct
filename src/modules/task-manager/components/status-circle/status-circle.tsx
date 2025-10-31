/**
 * StatusCircle Component
 *
 * A reusable component for visually representing the status of a task.
 * This component supports:
 * - Displaying a checkmark inside a circle for completed tasks
 * - Displaying a dashed border circle for incomplete tasks
 *
 * Features:
 * - Dynamically adjusts styles based on the `isCompleted` prop
 * - Provides a simple and intuitive visual indicator for task status
 *
 * Props:
 * @param {boolean} isCompleted - Whether the task is completed
 *
 * @example
 * // Completed task
 * <StatusCircle isCompleted={true} />
 *
 * // Incomplete task
 * <StatusCircle isCompleted={false} />
 */

interface StatusCircleProps {
  isCompleted: boolean;
}

export function StatusCircle({ isCompleted }: Readonly<StatusCircleProps>) {
  if (isCompleted) {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center">
        <svg
          className="w-3 h-3 text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
    );
  }

  return <div className="w-4 h-4 rounded-full border-2 border-dashed border-secondary"></div>;
}
