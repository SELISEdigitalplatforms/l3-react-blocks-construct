# Selise Component Hierarchy & Import Guide

## The 3-Layer Architecture

Selise follows a strict 3-layer hierarchy for components. **Always start at the top and work your way down.**

### Layer 1: Feature Components (src/modules/\*/components/)

**Most Specific → Least Work**

These are complete, business-ready components that solve entire use cases.

#### Key Feature Components

**AdvanceDataTable** - Complete table system

```typescript
// Path: modules/inventory/component/advance-data-table/advance-data-table.tsx
import { AdvanceDataTable } from 'modules/inventory/component/advance-data-table/advance-data-table'

// What you get:
// - Full TanStack Table integration
// - Column visibility management
// - Sorting, filtering, pagination
// - Row selection and expansion
// - Loading and error states
// - Custom toolbars support

// Usage:
<AdvanceDataTable
  data={yourData}
  columns={yourColumns}
  onRowClick={handleRowClick}
  isLoading={isLoading}
  columnsToolbar={renderColumnsToolbar}
  filterToolbar={renderFilterToolbar}
  pagination={paginationState}
  manualPagination={true}
/>
```

**AdvancedTableColumnsToolbar** - Column management

```typescript
// Path: modules/inventory/component/advance-table-columns-toolbar/
import { AdvancedTableColumnsToolbar } from 'modules/inventory/component/advance-table-columns-toolbar/advance-table-columns-toolbar'

// What you get:
// - Column visibility toggles
// - Column pinning controls
// - Reset functionality

// Usage:
const renderColumnsToolbar = (table) => (
  <AdvancedTableColumnsToolbar table={table} />
);
```

### Layer 2: Block Components (src/components/core/)

**Medium Specificity → Medium Work**

These are business patterns and reusable compound components.

#### Key Block Components

**ConfirmationModal** - All confirmation dialogs

```typescript
// Path: components/core/confirmation-modal/confirmation-modal.tsx
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'

// What you get:
// - Accessible dialog with ARIA attributes
// - Customizable title and description
// - Internationalization support
// - Auto-close or manual close options
// - Consistent styling

// Usage:
<ConfirmationModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Item"
  description="Are you sure? This cannot be undone."
  onConfirm={handleDelete}
  confirmText="Delete"
  cancelText="Cancel"
/>
```

**DataTableColumnHeader** - Sortable column headers

```typescript
// Path: components/core/data-table/data-table-column-header.tsx
import { DataTableColumnHeader } from 'components/core/data-table/data-table-column-header'

// What you get:
// - Sortable column headers
// - Sort indicators (arrows)
// - Click handling for sorting
// - Consistent styling

// Usage in column definitions:
{
  accessorKey: 'name',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Name" />
  ),
}
```

**CustomAvatar** - User avatars

```typescript
// Path: components/core/custom-avatar/custom-avatar.tsx
import CustomAvatar from 'components/core/custom-avatar/custom-avatar'

// What you get:
// - Image avatars with fallbacks
// - Initial-based avatars
// - Consistent sizing
// - Loading states

// Usage:
<CustomAvatar
  src={user.avatar}
  alt={user.name}
  fallback={user.initials}
/>
```

**DataTablePagination** - Table pagination

```typescript
// Path: components/core/data-table/data-table-pagination.tsx
import { DataTablePagination } from 'components/core/data-table/data-table-pagination'

// What you get:
// - Page navigation controls
// - Rows per page selector
// - Total count display
// - Consistent styling

// Usage:
<DataTablePagination
  table={table}
  totalCount={totalCount}
  pageSizeOptions={[10, 25, 50, 100]}
/>
```

### Layer 3: UI Components (src/components/ui/)

**Most Generic → Most Work**

These are the foundational design system components.

#### Essential UI Components

**Button** - All button variations

```typescript
// Path: components/ui/button.tsx
import { Button } from 'components/ui/button'

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
// Props: loading, disabled, asChild

// Usage:
<Button variant="destructive" size="sm" loading={isLoading}>
  Delete
</Button>
```

**Input** - Text inputs

```typescript
// Path: components/ui/input.tsx
import { Input } from 'components/ui/input'

// Usage:
<Input
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={onChange}
/>
```

**Card** - Container component

```typescript
// Path: components/ui/card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card'

// Usage:
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

**Table** - Basic table elements

```typescript
// Path: components/ui/table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table'

// Usage:
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Form Components** - Form building blocks

```typescript
// Path: components/ui/form.tsx
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form'

// Usage with React Hook Form:
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Select** - Dropdown selections

```typescript
// Path: components/ui/select.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select'

// Usage:
<Select onValueChange={onValueChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Decision Framework

### "What component should I use?"

#### For Data Tables:

1. **Try First**: `AdvanceDataTable` (Feature) - Complete table solution
2. **Try Second**: `DataTable` + `DataTableColumnHeader` (Block) - Custom table with Selise patterns
3. **Last Resort**: `Table` + `TableHeader` + `TableBody` (UI) - Build from scratch

#### For Confirmations:

1. **Always Use**: `ConfirmationModal` (Block) - Never create custom confirmation dialogs

#### For Forms:

1. **Try First**: Look for feature form patterns in existing features
2. **Try Second**: Use `Form` + `FormField` + UI inputs (UI + patterns)
3. **Build Custom**: Create feature-specific forms following established patterns

#### For Navigation/Layout:

1. **Check Features**: See if AppSidebar or similar exists
2. **Use Blocks**: Look for layout block components
3. **Build with UI**: Use Card, Button, etc.

## Import Patterns

### ✅ Always Import These

```typescript
// All UI components - never recreate these
import { Button, Input, Card, Table, Dialog, Badge, Avatar } from 'components/ui/*';

// Proven block patterns - use when applicable
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal';
import { DataTableColumnHeader } from 'components/core/data-table/data-table-column-header';
import CustomAvatar from 'components/core/custom-avatar/custom-avatar';

// Feature components - use if they fit your use case exactly
import { AdvanceDataTable } from 'features/inventory/component/advance-data-table/advance-data-table';
```

### ❌ Never Import These (Create Custom)

```typescript
// Don't import business logic across features
// ❌ import { createAdvanceTableColumns } from 'features/inventory/...'
// ✅ Create your own: createYourTableColumns

// Don't import feature-specific forms
// ❌ import { InventoryForm } from 'features/inventory/...'
// ✅ Create your own: YourFeatureForm

// Don't import feature services/hooks
// ❌ import { useInventory } from 'features/inventory/...'
// ✅ Create your own: useYourFeature
```

## Component Checklist

Before building any component, ask:

- [ ] **Feature Level**: Does `AdvanceDataTable` or another feature component solve this?
- [ ] **Block Level**: Is there a pattern in `components/core/` for this?
- [ ] **UI Level**: Can I build this with existing UI components?
- [ ] **Custom**: Do I need to create feature-specific business logic?

## Real-World Examples

### Building a User Management Table

```typescript
// 1. Try Feature Level First
import { AdvanceDataTable } from 'features/inventory/component/advance-data-table/advance-data-table'

// 2. Use Block Patterns
import { DataTableColumnHeader } from 'components/core/data-table/data-table-column-header'
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal'

// 3. Use UI Foundation
import { Button, Badge } from 'components/ui/button'

// 4. Create Custom Business Logic
export const createUsersTableColumns = ({ t, onEdit, onDelete }) => [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="destructive" onClick={() => onDelete(row.original)}>
        Delete
      </Button>
    ),
  },
];

// 5. Use the Complete Solution
<AdvanceDataTable
  data={users}
  columns={createUsersTableColumns({ t, onEdit, onDelete })}
  // All other features come built-in
/>
```

This hierarchy ensures you get maximum functionality with minimum effort while maintaining consistency across the entire Selise platform.
