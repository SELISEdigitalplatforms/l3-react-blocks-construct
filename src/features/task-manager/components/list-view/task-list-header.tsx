/**
 * TaskListHeader Component
 *
 * A reusable component for rendering the header of a task list.
 * This component supports:
 * - Displaying column headers for task properties such as title, status, priority, due date, assignees, and tags
 *
 * Features:
 * - Provides a structured layout for task list headers
 * - Ensures consistent alignment with task rows
 *
 * @returns {JSX.Element} The task list header component
 *
 * @example
 * // Basic usage
 * <TaskListHeader />
 */

export function TableHeader() {
  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="flex items-center h-14 font-medium text-sm text-gray-500">
        <div className="w-12"></div>
        <div className="w-6"></div>
        <div className="w-64 pl-2 mr-4 text-high-emphasis text-sm font-semibold">Title</div>
        <div className="w-24 flex-shrink-0 text-high-emphasis text-sm font-semibold">List</div>
        <div className="w-24 flex-shrink-0 text-high-emphasis text-sm font-semibold">Priority</div>
        <div className="w-28 flex-shrink-0 text-high-emphasis text-sm font-semibold">Due date</div>
        <div className="w-32 flex-shrink-0 text-high-emphasis text-sm font-semibold">Assignee</div>
        <div className="w-32 flex-shrink-0 text-high-emphasis text-sm font-semibold">Tags</div>
        <div className="flex-grow"></div>
      </div>
    </div>
  );
}
