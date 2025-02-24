// import { Column } from '@tanstack/react-table';
// import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

// import { cn } from 'lib/utils';
// import { Button } from 'components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from 'components/ui/dropdown-menu';

// interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
//   column: Column<TData, TValue>;
//   title: string;
// }

// export function DataTableColumnHeader<TData, TValue>({
//   column,
//   title,
//   className,
// }: DataTableColumnHeaderProps<TData, TValue>) {
//   if (!column.getCanSort()) {
//     return <div className={cn(className)}>{title}</div>;
//   }

//   return (
//     <div className={cn('flex items-center space-x-2', className)}>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
//             <span>{title}</span>
//             {column.getIsSorted() === 'desc' ? (
//               <ArrowDown />
//             ) : column.getIsSorted() === 'asc' ? (
//               <ArrowUp />
//             ) : (
//               <ChevronsUpDown />
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start">
//           <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
//             <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
//             Asc
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
//             <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
//             Desc
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = () => {
    const currentSort = column.getIsSorted();
    if (currentSort === false) {
      column.toggleSorting(false); // Set to ascending
    } else if (currentSort === 'asc') {
      column.toggleSorting(true); // Set to descending
    } else {
      column.clearSorting(); // Clear sorting
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button variant="ghost" size="sm" onClick={handleSort} className="-ml-3 h-8 hover:bg-accent">
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
