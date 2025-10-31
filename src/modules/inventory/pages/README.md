# AdvanceDataTable Component

`AdvanceDataTable` is a reusable and customizable table component built with TypeScript, leveraging TanStack Table for powerful table management. It provides advanced features like pagination, row expansion, toolbar customization, and etc.

### `AdvanceDataTableProps<TData, TValue>`

| Prop                  | Type                                                            | Description                                                                                     |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `columns`             | `ColumnDef<TData, TValue>[]`                                    | Defines the column structure of the table.                                                      |
| `data`                | `TData[]`                                                       | The dataset to be displayed in the table.                                                       |
| `onRowClick?`         | `(data: TData) => void`                                         | Callback function triggered when a row is clicked.                                              |
| `isLoading?`          | `boolean`                                                       | Displays a loading state when `true`.                                                           |
| `error?`              | `Error \| null`                                                 | Displays an error message if provided.                                                          |
| `columnsToolbar?`     | `(table: TableInstance<TData>) => React.ReactNode`              | Function to render a custom column toolbar.                                                     |
| `filterToolbar?`      | `(table: TableInstance<TData>) => React.ReactNode`              | Function to render a custom filter toolbar.                                                     |
| `isExpandRowContent?` | `boolean`                                                       | Enables expandable row content when `true`.                                                     |
| `expandRowContent?`   | `(rowId: string, colSpan: number) => React.ReactNode`           | Function to render expandable row content.                                                      |
| `pagination`          | `{ pageIndex: number; pageSize: number; totalCount: number; }`  | Controls pagination state.                                                                      |
| `onPaginationChange?` | `(pagination: { pageIndex: number; pageSize: number }) => void` | Callback function for pagination changes.                                                       |
| `manualPagination?`   | `boolean`                                                       | Enables manual pagination when `true`.                                                          |
| `columnPinningConfig` | `columnPinningConfig: ColumnPinningState`                       | Used to configure which columns should be pinned to either the left or right side of the table. |
