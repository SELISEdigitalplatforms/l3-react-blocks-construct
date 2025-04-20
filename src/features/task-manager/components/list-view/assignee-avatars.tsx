interface AssigneeAvatarsProps {
  assignees?: string[];
}

export function AssigneeAvatars({ assignees }: AssigneeAvatarsProps) {
  if (!assignees || assignees.length === 0) return null;

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {assignees.slice(0, 3).map((user, index) => (
        <div
          key={index}
          className="h-8 w-8 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white"
        >
          {user[0]}
        </div>
      ))}
      {assignees.length > 3 && (
        <div className="h-8 w-8 rounded-full bg-gray-200 text-xs flex items-center justify-center border-2 border-white">
          +{assignees.length - 3}
        </div>
      )}
    </div>
  );
}
