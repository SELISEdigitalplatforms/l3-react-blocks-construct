interface SharedByCellProps {
  name?: string;
  avatar?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const SharedByCell = ({ name, avatar }: Readonly<SharedByCellProps>) => {
  if (!name) {
    return (
      <div className="flex items-center">
        <span className="text-muted-foreground text-sm">-</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-xs font-medium text-gray-600">${getInitials(
                  name
                )}</span>`;
              }
            }}
          />
        ) : (
          <span className="text-xs font-medium text-gray-600">{getInitials(name)}</span>
        )}
      </div>
      <span className="text-sm truncate" title={name}>
        {name}
      </span>
    </div>
  );
};
