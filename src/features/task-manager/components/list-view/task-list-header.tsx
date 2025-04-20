export function TableHeader() {
  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="flex items-center h-14 font-medium text-sm text-gray-500">
        <div className="w-12"></div>
        <div className="w-6"></div>
        <div className="w-64 pl-2 mr-4">Title</div>
        <div className="w-24 flex-shrink-0">List</div>
        <div className="w-24 flex-shrink-0">Priority</div>
        <div className="w-28 flex-shrink-0">Due date</div>
        <div className="w-32 flex-shrink-0">Assignee</div>
        <div className="w-32 flex-shrink-0">Tags</div>
        <div className="flex-grow"></div>
      </div>
    </div>
  );
}
