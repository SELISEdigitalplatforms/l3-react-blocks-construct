import React from 'react';
import { Row } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { IamData } from '../../services/user-service';

interface DataTableRowActionsProps {
  row: Row<IamData>;
  onViewDetails: (user: IamData) => void;
  onResetPassword: (user: IamData) => void;
  onResendActivation?: (user: IamData) => void;
}

export function DataTableRowActions({
  row,
  onViewDetails,
  onResetPassword,
  onResendActivation,
}: DataTableRowActionsProps) {
  const user = row.original;

  const handleItemClick = (action: (user: IamData) => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action(user);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="text-medium-emphasis"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={(e) => handleItemClick(onViewDetails, e)}>
          View details
        </DropdownMenuItem>

        {user.active ? (
          <>
            <DropdownMenuItem onClick={(e) => handleItemClick(onResetPassword, e)}>
              Reset password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => e.stopPropagation()}
              disabled
              className="text-error cursor-not-allowed opacity-50"
            >
              Deactivate user
            </DropdownMenuItem>
          </>
        ) : (
          onResendActivation && (
            <DropdownMenuItem onClick={(e) => handleItemClick(onResendActivation, e)}>
              Resend activation link
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
