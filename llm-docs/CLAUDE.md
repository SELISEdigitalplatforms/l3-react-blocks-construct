# CLAUDE.md

**MUST DO: READ LLM DOCS: llm-docs/ as per the usage guidelines in this file. Don't implement or do anything without following this step. if you fail to find it, do a full directory search first. dont just start path guidance: ~/Desktop/selise-demo via ❯ ls CLAUDE.md llm-docs selise_mcp_server.py user-info.txt**
**MUST DO: READ LLM DOCS: llm-docs/ as per the usage guidelines in this file. Don't implement or do anything without following this step. if you fail to find it, do a full directory search first. dont just start path guidance: ~/Desktop/selise-demo via ❯ ls CLAUDE.md llm-docs selise_mcp_server.py user-info.txt**

This file provides guidance to Claude Code (claude.ai/code) when working with Selise Blocks applications.

## 🚨 CRITICAL: MCP Server Integration

This project uses a FastMCP (Model Context Protocol) server for automating Selise Cloud operations. The MCP tools MUST be used for all project setup and schema management.

### Available MCP Tools

**Authentication (Required First):**

- `login`: Authenticate with Selise Blocks API (ask for username, password, GitHub username, repo name)
- `get_auth_status`: Check authentication status

**Project Management:**

- `create_project`: Create new Selise Cloud project (ALWAYS use for new projects)
- `get_projects`: List existing projects

**Schema Management:**


- `create_schema`: Create new schemas in Selise Cloud
- `list_schemas`: List all schemas
- `get_schema_details`: Get schema field information
- `update_schema_fields`: Update existing schema fields
- `finalize_schema`: Finalize schema changes

**Translation Management:**

- `get_translation_languages`: Get available languages for translation
- `get_translation_modules`: List all translation modules
- `create_module`: Create a new translation module
- `get_module_keys`: Get all translation keys in a module
- `save_module_keys_with_translations`: Save translation keys with their translations

**Translation Management:**

- `get_translation_languages`: Get available languages for translation
- `get_translation_modules`: List all translation modules
- `create_module`: Create a new translation module
- `get_module_keys`: Get all translation keys in a module
- `save_module_keys_with_translations`: Save translation keys with their translations

**Other Tools:**

- `activate_social_login`: Enable social authentication
- `get_authentication_config`: Check auth configuration
- `get_global_state`: Get current system state

## 🔑 Project Key Configuration

**CRITICAL: Always get the project key from environment variables before using MCP tools.**

- **Default**: Read `VITE_X_BLOCKS_KEY` from `.env` file
- **Environment-specific**: If an environment is specified (dev, prod, test, etc.), read from `.env.{environment}` instead
- **Usage**: Pass this value as `project_key` parameter to MCP tools that require it

Example:

```bash
# For default environment
PROJECT_KEY=$(grep VITE_X_BLOCKS_KEY .env | cut -d '=' -f2)

# For specific environment (e.g., dev)
PROJECT_KEY=$(grep VITE_X_BLOCKS_KEY .env.dev | cut -d '=' -f2)
```

## 📋 Project Setup Workflow (MCP-First)

### Vibecoding Experience Flow (MUST FOLLOW IN ORDER):

**When User Wants to Create Any Webapp/Website:**

1. **FIRST: Read Documentation** (Before talking to user):
   - Read `workflows/user-interaction.md`
   - Read `workflows/feature-planning.md`
   - Read `agent-instructions/selise-development-agent.md`

2. **User Interaction & Requirements Gathering:**

   - Follow patterns from `user-interaction.md`
   - Create tracking files: `FEATURELIST.md`, `TASKS.md`, `SCRATCHPAD.md`, `CLOUD.md`
   - Ask clarifying questions about features
   - Document everything in FEATURELIST.md
   - Get user confirmation before proceeding

3. **Project Setup** (After user confirms features):
   - Get project name from user
   - Authentication Flow (Ask one by one if NOT IN user-info.txt):
     ```
     - Username/email for Selise Blocks
     - Password for Selise Blocks
     - GitHub username
     - GitHub repository name to connect
     ```
   - Project Creation Flow:

     ```python
     # ALWAYS create new project - don't look for existing domains
     create_project(
         project_name="UserProvidedName",
         github_username="from_step_1",
         repository_name="from_step_1"
     )

     # If user wants local setup:
     create_local_repository(project_name="UserProvidedName")
     ```

4. **Feature Planning & Schema Design** (AFTER user confirmation):
   - Break down confirmed features into technical requirements
   - Analyze what schemas are needed based on FEATURELIST.md
   - Document schema plan in CLOUD.md
   - Create schemas using MCP:
     ```python
     # For each entity the app needs:
     create_schema(
         schema_name="Tasks",
         fields=[
             {"name": "Title", "type": "String"},
             {"name": "Status", "type": "String"},
             {"name": "Point", "type": "Float"},
             {"name": "Priority", "type": "Int"}
         ]
     )
     ```
   - Document all MCP operations and results in CLOUD.md

## 🌐 Static Content Translation Workflow

**AFTER implementing new features with static text, you MUST translate all user-facing strings using MCP translation tools.**

**📖 Complete Translation Instructions:** See `llm-docs/recipes/translation-integration.md`

### Quick Translation Checklist:

- [ ] Extract ALL hardcoded strings to translation keys
- [ ] Add route mapping in `src/i18n/route-module-map.ts`
- [ ] Create translation module using MCP `create_module()`
- [ ] Add translations for all supported languages using MCP `save_module_keys_with_translations()`
- [ ] Test translation loading on the route
- [ ] Document keys in TASKS.md

## 📚 FIRST: Read All Documentation

**BEFORE any implementation, you MUST read these files IN ORDER:**

```
llm-docs/
├── workflows/                  # 🚨 READ FIRST - User interaction patterns
│   ├── user-interaction.md    # How to talk to users, gather requirements
│   └── feature-planning.md     # How to break down tasks and plan
├── recipes/                    # Implementation patterns (MUST FOLLOW)
│   ├── graphql-crud.md         # 🚨 CRITICAL: Only source for data operations!
│   ├── translation-integration.md # 🚨 CRITICAL: Translation process and route mapping
│   ├── react-hook-form-integration.md
│   └── confirmation-modal-patterns.md
├── component-catalog/          # Component hierarchy (3-layer rule)
│   ├── component-quick-reference.md
│   └── selise-component-hierarchy.md
├── agent-instructions/         # Development workflows
└── llms.txt                   # Project context
```

**MANDATORY READING ORDER:**

1. `workflows/user-interaction.md` - BEFORE talking to user
2. `workflows/feature-planning.md` - BEFORE creating tasks
3. `recipes/graphql-crud.md` - BEFORE any data operations (NOT inventory!)
4. `recipes/translation-integration.md` - BEFORE implementing any UI with text
5. `agent-instructions/selise-development-agent.md` - Development patterns
6. Other recipes as needed

## 🔄 Development Workflow

**FOLLOW THE VIBECODING EXPERIENCE FLOW ABOVE FIRST!**

After completing steps 1-4 of the Vibecoding Experience Flow, continue with implementation:

### 5. Implementation Process (Using Your Tracking Files)

#### Step 1: Work from TASKS.md

- Reference TASKS.md for your implementation plan
- Update task status as you work: `[ ]` → `[🔄]` → `[x]`
- Break down each feature from FEATURELIST.md into specific tasks
- Document progress and decisions in SCRATCHPAD.md

#### Step 2: Frontend Implementation

- Follow recipes from llm-docs/recipes/
- Use 3-layer hierarchy: Feature → Block → UI
- Reference graphql-crud.md for data operations (with MCP schema names from CLOUD.md)
- Update TASKS.md as you complete each component

#### Step 3: Testing & Quality

- Use existing test patterns
- Run linting and type checking
- Test all CRUD operations
- Mark testing tasks complete in TASKS.md

#### Step 4: Sidebar Management (CRITICAL)

**🚨 DEFAULT: Hide ALL sidebar items - start with clean slate!**

```typescript
// By default, REMOVE or HIDE all existing sidebar items
// Only add navigation if the app actually needs it

// Option 1: No sidebar at all (most apps)
// Just remove AppSidebar component entirely

// Option 2: Custom sidebar (only if needed)
// If user's app needs navigation:
// 1. Hide ALL default items (inventory, IAM, etc.)
// 2. Add ONLY items for user's features
// 3. Example for task management app:
const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'home' },
  { label: 'Tasks', path: '/tasks', icon: 'list' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];
// Remove ALL demo/template items!
```

**Never show irrelevant items like inventory, invoices, IAM unless the user specifically requested those features!**

#### Step 5: Git Workflow (Update Tracking Files)

```bash
# Branch for each feature
git checkout -b feature/[task-name]

# After implementation
git add .
git diff --staged  # Review changes

# Update your tracking files before commit:
# - Mark task complete in TASKS.md: [x]
# - Add notes to SCRATCHPAD.md about what was implemented
# - Update FEATURELIST.md if scope changed
# - Document any schema changes in CLOUD.md

# Compliance checklist:
# - Used MCP for schema creation?
# - Followed 3-layer hierarchy?
# - Used AdvanceDataTable for tables?
# - Used ConfirmationModal for confirmations?
# - Followed recipes from llm-docs?
# - Updated TASKS.md with completion status?

git commit -m "feat: implement [task] using MCP and Selise patterns

- Completed: [specific features from FEATURELIST.md]
- Updated: TASKS.md, SCRATCHPAD.md status
- References: [relevant schemas from CLOUD.md]"

git checkout main
git merge feature/[task-name]
```

## 🏗️ Architecture & Patterns

### Core Stack

- **Framework**: React TypeScript with Selise Blocks
- **State**: TanStack Query (server) + Zustand (client)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **GraphQL**: Use recipes/graphql-crud.md (NOT inventory patterns!)

### Feature Structure (MUST FOLLOW)

**Directory Structure - Follow inventory pattern:**

```
src/modules/[modules-name]/
├── components/         # Feature-specific components
├── graphql/           # Queries and mutations (if using GraphQL)
├── hooks/             # Feature-specific hooks
├── services/          # API calls and business logic
├── types/             # TypeScript interfaces
└── index.ts           # Public exports
```

**⚠️ CRITICAL: Inventory is for STRUCTURE ONLY, not data operations!**

- Use `src/modules/inventory/` as template for folder structure
- NEVER copy inventory's GraphQL patterns - they're different
- For data operations, ONLY follow `recipes/graphql-crud.md`

### Component Hierarchy (3-Layer Rule)

```
1. Feature Components (src/modules/*/components/)
2. Block Components (src/components/core/)
3. UI Components (src/components/ui/)
```

### Critical Patterns from Recipes

#### GraphQL Operations (from graphql-crud.md - NOT inventory!)

**🚨 CRITICAL QUIRKS - MUST KNOW:**

- **ALWAYS get schema names from MCP first** using `list_schemas()` and `get_schema_details()`
- **Query fields**: Schema name + single 's' (TodoTask → TodoTasks)
- **Mutations**: operation + schema name (insertTodoTask, updateTodoTask)
- **Input types**: SchemaName + Operation + Input (TodoTaskInsertInput)
- ALWAYS use MongoDB filter: `JSON.stringify({_id: "123"})`
- Use `_id` field for filtering, NEVER `ItemId`
- NEVER use Apollo Client - use `graphqlClient` from `lib/graphql-client`
- Response: `result.[SchemaName]s.items` (no 'data' wrapper)
- **MANDATORY**: Use MCP to verify exact schema names before implementing

#### Data Tables (from data-table-with-crud-operations.md)

- ALWAYS use AdvanceDataTable component
- Never create custom table implementations
- Follow the column definition patterns

#### Forms (from react-hook-form-integration.md)

- Use React Hook Form with Zod schemas
- Follow validation patterns from recipe
- Use Form components from UI layer

#### Confirmations (from confirmation-modal-patterns.md)

- ALWAYS use ConfirmationModal
- Never use browser confirm() or AlertDialog
- Follow async confirmation pattern

## ⚠️ Common Pitfalls to Avoid

1. **DON'T** look for existing domains - always create new project
2. **DON'T** create schemas manually - use MCP tools
3. **DON'T** skip reading recipes before implementation
4. **DON'T** create custom components when Selise components exist
5. **DON'T** use Apollo Client - use graphqlClient from recipes
6. **DON'T** bypass the 3-layer component hierarchy

## 📝 Implementation Checklist

Before ANY implementation:

- [ ] Authenticated with MCP login tool
- [ ] Created project with MCP create_project
- [ ] Read ALL recipes in llm-docs/recipes/
- [ ] Understood 3-layer component hierarchy
- [ ] Created tracking files (TASKS.md, SCRATCHPAD.md, etc.)
- [ ] Created schemas with MCP tools
- [ ] Documented operations in CLOUD.md

## 🚀 Quick Start Commands

```bash
# After MCP project creation
cd [project-name]
npm install
npm start

# Development
npm run lint       # Check code quality
npm test           # Run tests
npm run build      # Production build
```

## 📖 Priority Documentation

When conflicts arise, follow this priority:

1. **MCP tool usage** (this file's MCP section)
2. **Recipes** (llm-docs/recipes/)
3. **Component hierarchy** (llm-docs/component-catalog/)
4. **General patterns** (other docs)

Remember: MCP automation takes precedence over manual processes. Always use MCP tools for project setup, authentication, and schema management.
