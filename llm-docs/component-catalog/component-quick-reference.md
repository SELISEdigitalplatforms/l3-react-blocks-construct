# Selise Components Quick Reference

## Quick Component Lookup

### "I need a..."

#### Data Table

- **Complete table**: `AdvanceDataTable` from `features/inventory/component/advance-data-table`
- **Custom table**: `DataTableColumnHeader` from `components/core/data-table`
- **Basic table**: `Table`, `TableHeader`, `TableBody` from `components/ui/table`

#### Confirmation Dialog

- **Always use**: `ConfirmationModal` from `components/core/confirmation-modal`
- **Never create custom confirmation dialogs**

#### Form

- **Form wrapper**: `Form` from `components/ui/form`
- **Form fields**: `FormField`, `FormItem`, `FormLabel` from `components/ui/form`
- **Inputs**: `Input`, `Textarea`, `Select`, `Checkbox` from `components/ui/*`

#### Button

- **All buttons**: `Button` from `components/ui/button`
- **Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Sizes**: `default`, `sm`, `lg`, `icon`

#### User Avatar

- **Avatar with fallbacks**: `CustomAvatar` from `components/core/custom-avatar`
- **Basic avatar**: `Avatar` from `components/ui/avatar`

#### Cards/Containers

- **Content cards**: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `components/ui/card`

#### Navigation/Sidebar

- **Complete sidebar**: Check `AppSidebar` in `components/core/`
- **Menu items**: `SidebarMenuItem` from blocks if available

## Component Import Patterns

### Always Use These Exact Imports

```typescript
// Feature Components (Try First)
import { AdvanceDataTable } from 'features/inventory/component/advance-data-table/advance-data-table';
import { AdvancedTableColumnsToolbar } from 'features/inventory/component/advance-table-columns-toolbar/advance-table-columns-toolbar';

// Block Components (Proven Patterns)
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal';
import { DataTableColumnHeader } from 'components/core/data-table/data-table-column-header';
import { DataTablePagination } from 'components/core/data-table/data-table-pagination';
import CustomAvatar from 'components/core/custom-avatar/custom-avatar';

// UI Components (Foundation)
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Textarea } from 'components/ui/textarea';
import { Checkbox } from 'components/ui/checkbox';
import { Badge } from 'components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from 'components/ui/dialog';
import { Skeleton } from 'components/ui/skeleton';
```

## Common Component Combinations

### Data Table with Actions

```typescript
import { AdvanceDataTable } from 'features/inventory/component/advance-data-table/advance-data-table';
import { DataTableColumnHeader } from 'components/core/data-table/data-table-column-header';
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal';
import { Button } from 'components/ui/button';

// Usage: Complete table with delete confirmation
```

### Form with Validation

```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';

// Usage: Complete form with React Hook Form + Zod
```

### Modal Dialog

```typescript
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal';
// OR for custom modals:
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';

// Usage: Use ConfirmationModal for confirmations, Dialog for custom content
```

### User Interface Elements

```typescript
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import CustomAvatar from 'components/core/custom-avatar/custom-avatar';
import { Card, CardContent } from 'components/ui/card';

// Usage: Standard UI patterns throughout the app
```

## Props Quick Reference

### AdvanceDataTable

```typescript
interface AdvanceDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
  error?: Error | null;
  columnsToolbar?: (table: Table<TData>) => React.ReactNode;
  filterToolbar?: (table: Table<TData>) => React.ReactNode;
  expandRowContent?: (row: Row<TData>) => React.ReactNode;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  manualPagination?: boolean;
  onPaginationChange?: (pagination: any) => void;
}
```

### ConfirmationModal

```typescript
interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  onConfirm: () => void;
  confirmText?: string; // Default: "CONFIRM"
  cancelText?: string; // Default: "CANCEL"
  preventAutoClose?: boolean; // Default: false
}
```

### Button

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
```

### DataTableColumnHeader

```typescript
interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}
```

## Component States & Variants

### Button States

```typescript
// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Badge Variants

```typescript
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Form Field States

```typescript
// With validation
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

## Integration Hooks

### React Query Integration

```typescript
// Always use these patterns with Selise components
import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';

// Standard data fetching
const { data, isLoading, error } = useGlobalQuery({
  queryKey: ['your-data', params],
  queryFn: yourServiceFunction,
});

// Standard mutations
const { mutate, isPending } = useGlobalMutation({
  mutationFn: yourMutationFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['your-data'] });
    toast({ title: 'Success' });
  },
});
```

## Common Patterns

### Table Column Definition

```typescript
export const createYourTableColumns = ({ t, onEdit, onDelete }) => [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('Name')} />,
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('Status')} />,
    cell: ({ row }) => <Badge variant="default">{row.getValue('status')}</Badge>,
  },
  {
    id: 'actions',
    header: t('Actions'),
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
          {t('Edit')}
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
          {t('Delete')}
        </Button>
      </div>
    ),
  },
];
```

### Modal State Management

```typescript
const [modal, setModal] = useState({
  open: false,
  item: null,
  action: null,
});

// Open modal
const openModal = (item, action) => setModal({ open: true, item, action });

// Close modal
const closeModal = () => setModal({ open: false, item: null, action: null });
```

This reference covers the most commonly used Selise components and their standard usage patterns.
