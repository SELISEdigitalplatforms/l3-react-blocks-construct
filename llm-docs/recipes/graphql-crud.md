# Recipe: GraphQL CRUD Operations

## 🚨 CRITICAL: This is the ONLY Source for Data Operations

**NEVER look at inventory feature for data operations - it uses different patterns!**
**This recipe is based on actual working Selise Cloud GraphQL patterns.**

## GraphQL Naming Patterns You MUST Know

### 1. Correct Schema Name Pattern (Updated)
```typescript
// CRITICAL: Get schema name from MCP first, then apply these patterns:
// Schema: "TodoTask" → Query field: "TodoTasks" (schema name + single 's')
// Schema: "Product" → Query field: "Products" (schema name + single 's')
// Schema: "User" → Query field: "Users" (schema name + single 's')

// QUERIES use schema name + single 's':
query { TodoTasks(input: ...) }     // Schema "TodoTask" + 's'
query { Products(input: ...) }      // Schema "Product" + 's'

// MUTATIONS use operation + original schema name:
mutation { insertTodoTask(...) }    // insert + "TodoTask"
mutation { updateProduct(...) }     // update + "Product"

// INPUT TYPES use schema name + operation + Input:
// TodoTaskInsertInput, TodoTaskUpdateInput, TodoTaskDeleteInput
```

### 2. Schema Discovery with MCP
```typescript
// ALWAYS use MCP to get exact schema names first:
// 1. list_schemas() - Shows all available schemas
// 2. get_schema_details(schema_name) - Shows schema structure

// Example MCP workflow:
// list_schemas() → returns ["TodoTask", "Product", "User"]
// Then apply naming patterns:
// - Query: TodoTasks, Products, Users (add 's')
// - Mutations: insertTodoTask, updateProduct, deleteUser
```

### 3. MongoDB Filter Syntax
```typescript
// ALWAYS use _id field for filtering, NOT ItemId:
const filter = JSON.stringify({ _id: "record-123" });

// Complex filters:
const filter = JSON.stringify({
  $and: [
    { IsDeleted: false },
    { Status: "active" }
  ]
});
```

### 3. Response Structure
```typescript
// graphqlClient returns data directly (no 'data' wrapper):
const result = await graphqlClient.query({...});
// Access: result.[schema]ss.items (note the double s)
```

## Implementation Pattern

### Step 1: Import GraphQL Client (NO Apollo!)

```typescript
// services/[feature].service.ts
import { graphqlClient } from 'lib/graphql-client';  // NEVER use @apollo/client!
```

### Step 2: Define Queries (Double Plural)

```typescript
// List query - schema name + 's' (get schema name from MCP first)
export const GET_ITEMS_QUERY = `
  query GetItems($input: DynamicQueryInput) {
    [SchemaName]s(input: $input) {  // e.g., TodoTasks, Products
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        // Standard Selise fields:
        ItemId
        CreatedDate
        CreatedBy
        LastUpdatedDate
        LastUpdatedBy
        IsDeleted
        Language
        OrganizationIds
        Tags
        DeletedDate
        // Your custom fields from schema
      }
    }
  }
`;
```

### Step 3: Define Mutations (Original Name)

```typescript
// Insert - uses insert + original schema name
export const INSERT_ITEM_MUTATION = `
  mutation InsertItem($input: [SchemaName]InsertInput!) {
    insert[SchemaName](input: $input) {  // e.g., insertTodoTask, insertProduct
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

// Update - uses filter + input
export const UPDATE_ITEM_MUTATION = `
  mutation UpdateItem($filter: String!, $input: [SchemaName]UpdateInput!) {
    update[SchemaName](filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

// Delete - filter only
export const DELETE_ITEM_MUTATION = `
  mutation DeleteItem($filter: String!, $input: [SchemaName]DeleteInput!) {
    delete[SchemaName](filter: $filter, input: $input) {
      acknowledged
      totalImpactedData
    }
  }
`;
```

### Step 4: Service Functions

```typescript
// Get paginated list
export const getItems = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number; filter?: string; sort?: string }];
}) => {
  const [, { pageNo, pageSize, filter = '{}', sort = '{}' }] = context.queryKey;
  
  return graphqlClient.query({
    query: GET_ITEMS_QUERY,
    variables: {
      input: {
        filter,
        sort,
        pageNo,
        pageSize,
      },
    },
  });
};

// Get single item by ID (uses MongoDB filter)
export const getItemById = async (itemId: string) => {
  // MongoDB filter with _id field
  const mongoFilter = JSON.stringify({ _id: itemId });
  
  const result = await graphqlClient.query({
    query: GET_ITEMS_QUERY,
    variables: {
      input: {
        filter: mongoFilter,
        sort: '{}',
        pageNo: 1,
        pageSize: 1,
      },
    },
  }) as any;
  
  // Check if found (schema name + 's')
  const queryFieldName = `${schemaName}s`; // e.g., "TodoTasks"
  if (result?.[queryFieldName]?.items?.length > 0) {
    return {
      data: {
        [queryFieldName]: result[queryFieldName]
      }
    };
  }
  
  // Return empty result if not found
  return {
    data: {
      [queryFieldName]: {
        items: [],
        totalCount: 0
      }
    }
  };
};

// Add new item
export const addItem = async (params: { input: any }) => {
  return graphqlClient.mutate({
    query: INSERT_ITEM_MUTATION,
    variables: params,
  });
};

// Update existing item
export const updateItem = async (params: { filter: string; input: any }) => {
  return graphqlClient.mutate({
    query: UPDATE_ITEM_MUTATION,
    variables: params,
  });
};

// Delete item (soft delete by default)
export const deleteItem = async (itemId: string, isHardDelete = false) => {
  const filter = JSON.stringify({ _id: itemId });
  return graphqlClient.mutate({
    query: DELETE_ITEM_MUTATION,
    variables: { 
      filter,
      input: { isHardDelete }
    },
  });
};
```

### Step 5: React Query Hooks

```typescript
// hooks/use-[feature].ts
import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';

export const useGetItems = (params: {
  pageNo: number;
  pageSize: number;
  filter?: string;
}) => {
  return useGlobalQuery({
    queryKey: ['items', params],
    queryFn: getItems,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetItemById = (itemId: string) => {
  return useGlobalQuery({
    queryKey: ['item', itemId],
    queryFn: () => getItemById(itemId),
    enabled: !!itemId,
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useGlobalMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      toast({ title: 'Item added successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error adding item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useGlobalMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      toast({ title: 'Item updated successfully' });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useGlobalMutation({
    mutationFn: ({ itemId }: { itemId: string }) => {
      return deleteItem(itemId, false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      toast({ title: 'Item deleted successfully' });
    },
  });
};
```

## MongoDB Filter Examples

### Basic Filters
```typescript
// By ID
{ "_id": "item-123" }

// By field
{ "Status": "active" }

// Multiple conditions (AND)
{ "Status": "active", "Category": "premium" }

// Exclude deleted
{ "IsDeleted": false }
```

### Advanced Filters
```typescript
// OR condition
{ "$or": [{ "Category": "A" }, { "Category": "B" }] }

// Greater than
{ "Price": { "$gt": 100 } }

// Text search (case-insensitive)
{ "Name": { "$regex": "search", "$options": "i" } }

// Array contains
{ "Tags": { "$in": ["urgent"] } }

// Complex combination
{
  "$and": [
    { "IsDeleted": false },
    { "Price": { "$gt": 0 } },
    { "$or": [
      { "Category": "Electronics" },
      { "Category": "Software" }
    ]}
  ]
}
```

## Common Gotchas & Solutions

### 1. Wrong Schema Names in Queries
```typescript
// ❌ WRONG - Using schema name without 's'
query { TodoTask(input: ...) }  // Missing 's'

// ✅ CORRECT - Schema name + single 's'
query { TodoTasks(input: ...) }

// ALWAYS use MCP to get exact schema names:
list_schemas()  // Shows actual schema names like "TodoTask", "Product"
get_schema_details("TodoTask")  // Shows schema structure
```

### 2. Wrong Filter Field
```typescript
// ❌ WRONG - ItemId doesn't work for filtering
const filter = JSON.stringify({ ItemId: "123" });

// ✅ CORRECT - Use _id for MongoDB
const filter = JSON.stringify({ _id: "123" });
```

### 3. Apollo Client Import
```typescript
// ❌ WRONG - Never use Apollo
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

// ✅ CORRECT - Use Selise's graphqlClient
import { graphqlClient } from 'lib/graphql-client';
```

### 4. Response Structure Confusion
```typescript
// ❌ WRONG - graphqlClient doesn't wrap in 'data'
const items = result.data.TodoTasks.items;

// ✅ CORRECT - Direct access with proper field name
const items = result.TodoTasks.items;
```

### 5. Mutation Response Check
```typescript
// Always check totalImpactedData
const result = await updateItem({...});
if (result.totalImpactedData === 0) {
  // No records were updated - filter didn't match
  throw new Error('Item not found');
}
```

## Testing with curl Requests (MANDATORY Safety Check)

**🚨 CRITICAL: Always test your GraphQL operations with curl BEFORE implementing in code!**

### Building Your App-Specific curl Requests

**The curl examples in this section use "TodoTasks" as a sample schema name from a todo app. You MUST:**

1. **Replace "TodoTasks"** with YOUR actual schema names (e.g., Products, Users, Orders, etc.)
2. **Replace field names** (title, status, description) with YOUR actual schema fields  
3. **Get YOUR schema info** from MCP using `list_schemas()` and `get_schema_details("YourSchemaName")`
4. **Use YOUR bearer token** from MCP `get_global_state()` or `get_auth_status()`
5. **Use YOUR blocks key** from your project setup

**Example transformation:**
- If your app manages Products with fields: name, price, category
- Replace `TodoTasks` → `Products` 
- Replace `insertTodoTasks` → `insertProduct`
- Replace `{"title":"Test","status":"pending"}` → `{"name":"Test Product","price":29.99,"category":"electronics"}`

### Getting Your Bearer Token
```python
# Get bearer token from MCP global state
get_global_state()
# Look for "bearer_token" or "access_token" in the response
# OR check authentication status:
get_auth_status()
```

### Basic curl Request Template
```bash
curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Accept: */*' \
-H 'Authorization: bearer YOUR_BEARER_TOKEN_HERE' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY_HERE' \
--data-raw '{"query":"YOUR_GRAPHQL_QUERY_HERE","variables":{"input":{}}}'
```

### Test Each Operation Type

**⚠️ IMPORTANT: The examples below use "TodoTasks" as a sample schema name. Replace with YOUR actual schema names from your MCP-created schemas!**

#### 1. Test Schema Query (Verify Naming)
```bash
# EXAMPLE: Test if your schema query field name is correct
# Replace "TodoTasks" with YOUR schema name + 's' (e.g., Products, Users, etc.)
# Replace "title, status" with YOUR actual schema fields
curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Authorization: bearer YOUR_TOKEN' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY' \
--data-raw '{"query":"query TestSchema { YOUR_SCHEMA_NAMES(input: {filter: \"{}\", sort: \"{}\", pageNo: 1, pageSize: 10}) { totalCount items { ItemId YOUR_FIELDS_HERE } } }"}'

# Real example with TodoTasks schema:
# --data-raw '{"query":"query TestSchema { TodoTasks(input: {filter: \"{}\", sort: \"{}\", pageNo: 1, pageSize: 10}) { totalCount items { ItemId title status } } }"}'
```

#### 2. Test Insert Mutation
```bash
# EXAMPLE: Test creating new records  
# Replace "TodoTasks" with YOUR schema name
# Replace the input fields with YOUR actual schema fields
curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Authorization: bearer YOUR_TOKEN' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY' \
--data-raw '{"query":"mutation InsertTest($input: YOUR_SCHEMA_NAMEInsertInput!) { insertYOUR_SCHEMA_NAME(input: $input) { itemId totalImpactedData acknowledged } }","variables":{"input":{"YOUR_FIELD_1":"value","YOUR_FIELD_2":"value"}}}'

# Real example with TodoTasks schema:
# --data-raw '{"query":"mutation InsertTest($input: TodoTasksInsertInput!) { insertTodoTasks(input: $input) { itemId totalImpactedData acknowledged } }","variables":{"input":{"title":"Test Task","description":"Testing curl","status":"pending"}}}'
```

#### 3. Test Update Mutation  
```bash
# EXAMPLE: Test updating records (use _id from insert response)
# Replace "TodoTasks" with YOUR schema name and fields
curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Authorization: bearer YOUR_TOKEN' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY' \
--data-raw '{"query":"mutation UpdateTest($filter: String!, $input: YOUR_SCHEMA_NAMEUpdateInput!) { updateYOUR_SCHEMA_NAME(filter: $filter, input: $input) { totalImpactedData acknowledged } }","variables":{"filter":"{\"_id\":\"RECORD_ID_HERE\"}","input":{"YOUR_FIELD":"Updated Value"}}}'

# Real example with TodoTasks schema:
# --data-raw '{"query":"mutation UpdateTest($filter: String!, $input: TodoTasksUpdateInput!) { updateTodoTasks(filter: $filter, input: $input) { totalImpactedData acknowledged } }","variables":{"filter":"{\"_id\":\"RECORD_ID_HERE\"}","input":{"title":"Updated Task"}}}'
```

#### 4. Test Delete Mutation (SAFETY - Always Test Delete!)
```bash
# EXAMPLE: Test deleting records (IMPORTANT: Test this with test data first!)
# Replace "TodoTasks" with YOUR schema name
curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Authorization: bearer YOUR_TOKEN' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY' \
--data-raw '{"query":"mutation DeleteTest($filter: String!, $input: YOUR_SCHEMA_NAMEDeleteInput!) { deleteYOUR_SCHEMA_NAME(filter: $filter, input: $input) { acknowledged totalImpactedData } }","variables":{"filter":"{\"_id\":\"TEST_RECORD_ID\"}","input":{"isHardDelete":false}}}'

# Real example with TodoTasks schema:
# --data-raw '{"query":"mutation DeleteTest($filter: String!, $input: TodoTasksDeleteInput!) { deleteTodoTasks(filter: $filter, input: $input) { acknowledged totalImpactedData } }","variables":{"filter":"{\"_id\":\"TEST_RECORD_ID\"}","input":{"isHardDelete":false}}}'
```

### curl Testing Workflow

**For each schema you create:**
1. **First**: Test the query field name (TodoTasks, Products, etc.)
2. **Second**: Test insert with sample data  
3. **Third**: Test update using the inserted record's _id
4. **Fourth**: Test delete with a test record
5. **MANDATORY**: Delete ALL test records you created using delete curl requests

### 🚨 CRITICAL: Clean Up Test Data

**You MUST delete any records you create during curl testing!**

```bash
# After testing, delete ALL test records you created:
# 1. Save the _id from each insert response
# 2. Use delete curl for each test record

curl 'https://api.seliseblocks.com/graphql/v1/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Authorization: bearer YOUR_TOKEN' \
-H 'x-blocks-key: YOUR_BLOCKS_KEY' \
--data-raw '{"query":"mutation CleanupTest($filter: String!, $input: YOUR_SCHEMA_NAMEDeleteInput!) { deleteYOUR_SCHEMA_NAME(filter: $filter, input: $input) { acknowledged totalImpactedData } }","variables":{"filter":"{\"_id\":\"INSERT_RESPONSE_ID_HERE\"}","input":{"isHardDelete":true}}}'

# This serves dual purpose:
# 1. Tests your delete functionality 
# 2. Cleans up test data from your database
```

### Common curl Errors & Solutions

```bash
# Error: Field 'TodoTask' not found
# ✅ Fix: Use TodoTasks (schema name + 's')

# Error: Unknown argument 'filter' 
# ✅ Fix: Check input structure matches DynamicQueryInput

# Error: 401 Unauthorized
# ✅ Fix: Check bearer token is valid, refresh from MCP if needed

# Error: Variable '$input' not defined
# ✅ Fix: Ensure variables object matches query parameters
```

## Testing Schema Names with MCP

**MANDATORY: Always verify schema names with MCP before implementing:**

```python
# List all schemas first
list_schemas()

# Get schema details for the exact name
get_schema_details(schema_name="TodoTask")
```

This will show:
- Exact schema name: "TodoTask"
- Query field will be: "TodoTasks" (schema name + 's')
- Mutations will use: "insertTodoTask", "updateTodoTask", "deleteTodoTask"
- Input types: "TodoTaskInsertInput", "TodoTaskUpdateInput", "TodoTaskDeleteInput"

## File Structure Pattern

```
src/modules/[module]/
├── components/         # UI components
├── graphql/           # Queries and mutations
│   ├── queries.ts
│   └── mutations.ts
├── hooks/             # React Query hooks
│   └── use-[feature].ts
├── services/          # Service functions
│   └── [feature].service.ts
├── types/             # TypeScript types
│   └── [feature].types.ts
└── index.ts           # Public exports
```

## Summary

1. **ALWAYS get schema names from MCP first** using list_schemas() and get_schema_details()
2. **Query fields**: Schema name + single 's' (TodoTask → TodoTasks)
3. **Mutations**: operation + schema name (insertTodoTask, updateTodoTask)
4. **Input types**: SchemaName + Operation + Input (TodoTaskInsertInput)
5. **Filter with _id**, not ItemId for MongoDB queries
6. **Import graphqlClient**, never Apollo
7. **Follow this recipe**, not inventory feature patterns