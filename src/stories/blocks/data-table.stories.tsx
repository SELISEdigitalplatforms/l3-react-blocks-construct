import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

// Mock simplified DataTable component to demonstrate functionality
const MockDataTable = ({
  data = [] as any[],
  isLoading = false,
  columns = [] as any[],
  showPagination = true,
  showActions = true,
}: {
  data?: any[];
  isLoading?: boolean;
  columns?: any[];
  showPagination?: boolean;
  showActions?: boolean;
}) => {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
    console.log('Sort:', columnKey, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleSort(column.key)}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id ?? row.email ?? row.name} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof MockDataTable> = {
  title: 'DataTable',
  component: MockDataTable,
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A reusable and customizable table component that supports column-based filtering, sorting, visibility toggles, pagination, and expandable rows.',
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    showPagination: { control: 'boolean' },
    showActions: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof MockDataTable>;

const sampleColumns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: false,
    render: (value: string) => (
      <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
    ),
  },
  { key: 'role', header: 'Role', sortable: true },
];

const sampleData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'Active', role: 'Editor' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', status: 'Active', role: 'User' },
  { id: '6', name: 'Diana Wilson', email: 'diana@example.com', status: 'Inactive', role: 'User' },
  { id: '7', name: 'Frank Miller', email: 'frank@example.com', status: 'Active', role: 'Admin' },
  { id: '8', name: 'Grace Lee', email: 'grace@example.com', status: 'Active', role: 'Editor' },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    isLoading: false,
    showPagination: true,
    showActions: true,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: sampleColumns,
    isLoading: true,
    showPagination: true,
    showActions: true,
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns: sampleColumns,
    isLoading: false,
    showPagination: true,
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    isLoading: false,
    showPagination: true,
    showActions: false,
  },
};

export const WithoutPagination: Story = {
  args: {
    data: sampleData.slice(0, 3),
    columns: sampleColumns,
    isLoading: false,
    showPagination: false,
    showActions: true,
  },
};

export const SimpleTable: Story = {
  args: {
    data: [
      { id: '1', name: 'Product A', price: '$29.99', category: 'Electronics' },
      { id: '2', name: 'Product B', price: '$19.99', category: 'Books' },
      { id: '3', name: 'Product C', price: '$39.99', category: 'Clothing' },
    ],
    columns: [
      { key: 'name', header: 'Product Name', sortable: true },
      { key: 'price', header: 'Price', sortable: true },
      { key: 'category', header: 'Category', sortable: true },
    ],
    isLoading: false,
    showPagination: false,
    showActions: true,
  },
};
