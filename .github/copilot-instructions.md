# Copilot Instructions for SELISE Blocks Construct

## Project Overview

This is a React TypeScript application using the SELISE Blocks ecosystem - a comprehensive component library and cloud platform for rapid enterprise application development. The project follows strict architectural patterns with a 3-layer component hierarchy and MCP (Model Context Protocol) automation.

**Build System**: Migrated from Create React App (CRA) to **Vite** for faster development and better performance. Uses Vite's modern build tooling with ES modules and optimized hot module replacement.

## Essential Architecture

### 3-Layer Component Hierarchy (CRITICAL)

Always follow this order when building features:

1. **Feature Components** (`src/modules/*/components/`) - Complete business solutions
2. **Block Components** (`src/components/core/`) - Reusable business patterns
3. **UI Components** (`src/components/ui/`) - Foundation design system

## Key Development Patterns

### Data Tables

```typescript
// Always use AdvanceDataTable (feature-level solution)
import { AdvanceDataTable } from 'features/inventory/component/advance-data-table/advance-data-table'
import { DataTableColumnHeader } from 'components/core/components/data-table/data-table-column-header'

// Create custom business logic only
export const createTableColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  // ... custom action columns
];
```

### GraphQL Operations (NOT Apollo Client)

```typescript
// CRITICAL: Use graphqlClient, never Apollo
import { graphqlClient } from 'lib/graphql-client';

// Schema naming (get exact names from MCP first):
// - Query fields: SchemaName + 's' (TodoTask → TodoTasks)
// - Mutations: operation + SchemaName (insertTodoTask)
// - Filters: MongoDB syntax with _id field (never ItemId)
```

### Forms & Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormControl } from 'components/ui/form';
// Always use React Hook Form + Zod validation
```

### Confirmations

```typescript
// Never create custom confirmations - always use this
import ConfirmationModal from 'components/core/confirmation-modal/confirmation-modal';
```

## File Structure Pattern

```
src/modules/[modules-name]/
├── components/         # Feature-specific UI
├── graphql/           # Queries/mutations (follow recipes/graphql-crud.md)
├── hooks/             # React Query hooks
├── services/          # API business logic
├── types/             # TypeScript interfaces
└── index.ts           # Public exports
```

## Critical Import Rules

### ✅ Always Import (Never Recreate)

- All UI components: `Button`, `Input`, `Card`, `Table`, etc.
- Block patterns: `ConfirmationModal`, `DataTableColumnHeader`, `CustomAvatar`
- Complete feature solutions when they fit exactly: `AdvanceDataTable`

### ❌ Never Import Across Features

- Business logic: Create custom hooks/services per feature
- Forms: Create feature-specific forms
- Table columns: Create custom column definitions

## Development Workflow Commands

```bash
# Development (Vite-powered)
npm run dev            # Vite dev server (recommended)
npm start              # Alias for dev server with custom host
npm run start:host     # Production domain simulation
npm run preview        # Preview production build locally

# Build & Test
npm run build          # Vite production build
npm run build:dev      # Development environment build
npm run build:stg      # Staging environment build
npm run lint           # ESLint + TypeScript checking
npm test               # Jest test suite

# Storybook (Vite-powered)
# npm run storybook      # Storybook dev server
# npm run build-storybook # Build Storybook
```

## Vite-Specific Patterns

### Environment Variables

```typescript
// Vite uses import.meta.env instead of process.env for client code
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const blocksKey = import.meta.env.VITE_X_BLOCKS_KEY;

// Both REACT_APP_ and VITE_ prefixes are supported during migration
const legacyApiUrl = import.meta.env.REACT_APP_PUBLIC_API_URL;
```

### Hot Module Replacement (HMR)

```typescript
// Vite provides excellent HMR out of the box
// React Fast Refresh is automatically enabled
// CSS changes apply instantly without page reload
```

## State Management

- **Server State**: TanStack Query with `useGlobalQuery`/`useGlobalMutation` hooks
- **Client State**: Zustand stores for complex UI state
- **Forms**: React Hook Form for all form state
- **Auth**: Built-in auth context with permission guards

## Documentation Priority

When implementing features, follow documentation in this order:

1. **MCP automation** (CLAUDE.md) - For project/schema setup
2. **Recipes** (`llm-docs/recipes/`) - For implementation patterns
3. **Component hierarchy** (`llm-docs/component-catalog/`) - For component decisions
4. **Agent instructions** (`llm-docs/agent-instructions/`) - For development workflow

## Common Gotchas

- **Schema Names**: Get exact names from MCP first, then apply naming patterns
- **GraphQL Client**: Never use Apollo - use `graphqlClient` from `lib/graphql-client`
- **Sidebar**: By default, hide ALL existing sidebar items - only show user's features
- **Component Hierarchy**: Always check higher layers before creating custom solutions
- **Import Paths**: Use absolute paths configured in `tsconfig.json` (e.g., `components/ui/button`)

## Quality Standards

- TypeScript strict mode - no `any` types
- Comprehensive error handling with proper loading states
- Accessibility attributes on interactive elements
- Consistent styling with Tailwind CSS and design tokens
- Unit tests for business logic using Jest + Testing Library
