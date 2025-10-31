# Feature Planning Workflow

## Overview

This guide explains how to break down user requirements into actionable tasks and maintain organized development.

## Required Files Structure

### 1. FEATURELIST.md - Source of Truth

```markdown
# Feature List for [App Name]

## Version 1.0 (Current Sprint)

- [x] Basic CRUD for [entity]
- [ ] Search and filtering
- [ ] Export functionality

## Version 1.1 (Next Sprint)

- [ ] Advanced permissions
- [ ] Bulk operations
- [ ] Email notifications

## Technical Debt

- [ ] Optimize GraphQL queries
- [ ] Add comprehensive error handling
- [ ] Improve loading states
```

### 2. TASKS.md - Implementation Tracking

```markdown
# Development Tasks

## Current Sprint

### ✅ Setup Project Structure

- Created basic layout
- Setup routing
- Configured GraphQL client

### ⏳ Data Management

- [ ] Create entity list view
- [ ] Add create/edit forms
- [ ] Implement delete with confirmation
- [ ] Add search and filters

### 📋 Backlog

- Performance optimizations
- Additional validations
- Analytics integration
```

### 3. SCRATCHPAD.md - Append-Only Notes (TOP)

```markdown
# Development Notes (Newest First)

---

[2024-01-20 10:30] Completed user authentication

- Used BasePasswordForm for consistency
- Added remember me checkbox
- Need to implement password reset next

---

[2024-01-20 09:15] GraphQL field name issue

- ERROR: Field 'getUsers' not found
- FIXED: Changed to 'users' (Selise convention)
- Remember: queries use plural, mutations use singular

---

[2024-01-20 08:00] Starting authentication feature

- Creating new branch: feature/user-auth
- Will use React Hook Form + Zod
- Need to check existing auth patterns in codebase
```

### 4. CLOUD.md - Selise Cloud Configuration

```markdown
# Selise Cloud Configuration

## Entities Created

### User Entity

- Created: 2024-01-20
- Fields:
  - email (String, required, unique)
  - password (String, required)
  - role (String, enum: admin|user)
  - createdAt (DateTime)
- Screenshot: ![User Entity](./screenshots/user-entity.png)

### Task Entity

- Created: 2024-01-20
- Fields:
  - title (String, required)
  - description (Text)
  - status (String, enum: pending|completed)
  - userId (Reference to User)
- Screenshot: ![Task Entity](./screenshots/task-entity.png)

## Permissions Configured

- Admin: Full access to all entities
- User: CRUD own tasks only
- Screenshot: ![Permissions](./screenshots/permissions.png)

## API Keys

- GraphQL Endpoint: https://api.selise.cloud/data
- API Key: Stored in .env as VITE_API_KEY
```

## Feature Breakdown Process

### Step 0: Schema Analysis & CLOUD.md Setup (FIRST)

After user confirmation, analyze ALL features to determine backend requirements:

```markdown
# Schema Requirements Analysis

Based on confirmed features:

- User Authentication → User entity (email, role, password)
- Task Management → Tasks entity (title, description, status, userId)
- File Attachments → Files entity (filename, url, taskId)
- Categories → Categories entity (name, color)
- Team Management → Teams entity (name, memberIds)

# Required Relationships

- Task belongs to User (userId reference)
- Task can have multiple Files (taskId reference)
- Task belongs to Category (categoryId reference)
- User can belong to Team (teamId reference)

# Permission Requirements

- Admin: Full CRUD on all entities
- Manager: CRUD own team's data
- User: CRUD own data only
```

#### CLOUD.md Population Process

1. **Document schema plan** before any MCP operations
2. **Execute MCP operations** for schema creation
3. **Log all operations** with timestamps and results
4. **Document manual fallbacks** if MCP fails
5. **Validate completion** before proceeding to implementation

See: `docs/llm-docs/cloud-setup.md` for complete CLOUD.md workflow

### Step 1: Analyze Feature Requirements

```typescript
// From FEATURELIST.md entry:
"User Management System"

// Break down into:
1. User list view
2. User creation form
3. User edit form
4. User deletion
5. Role assignment
6. Permissions
```

### Step 2: Create Technical Tasks

```markdown
## User Management System

### Feature Structure (MANDATORY)

- [ ] Create feature folder following src/modules/inventory/ pattern exactly
- [ ] Setup folder structure: components/, hooks/, services/, types/, index.ts
- [ ] Study inventory feature implementation before starting

### Data Layer

- [ ] Create GraphQL queries for users
- [ ] Create GraphQL mutations (create, update, delete)
- [ ] Setup React Query hooks
- [ ] Add error handling

### UI Components

- [ ] User list with AdvanceDataTable
- [ ] User form with validation
- [ ] Role selector component
- [ ] Delete confirmation modal

### Navigation

- [ ] Remove/hide irrelevant sidebar items
- [ ] Add only app-specific navigation items
- [ ] Configure AppSidebar for this app's needs

### Business Logic

- [ ] Permission checking
- [ ] Email validation
- [ ] Password requirements
- [ ] Audit logging
```

### Step 3: Prioritize and Sequence

```markdown
## Implementation Order

1. **Foundation** (Do First)
   - GraphQL setup
   - Basic list view
   - Route configuration

2. **Core Features** (Do Second)
   - Create functionality
   - Edit functionality
   - Delete functionality

3. **Enhancements** (Do Last)
   - Advanced filtering
   - Bulk operations
   - Export features
```

## Task Status Management

### Status Indicators

- `[ ]` - Not started
- `[🔄]` - In progress
- `[x]` - Completed
- `[⚠️]` - Blocked
- `[🔍]` - In review

### Progress Tracking Example

```markdown
### Current Task: User List View [🔄]

- [x] Create component structure
- [x] Setup AdvanceDataTable
- [🔄] Connect GraphQL query
- [ ] Add loading states
- [ ] Add error handling

**Blockers**: Waiting for API endpoint from backend
**Notes**: Using inventory feature as reference
```

## Git Workflow Integration

### Branch per Feature

```bash
# For each major feature
git checkout -b feature/user-management

# For sub-tasks if needed
git checkout -b feature/user-management-list-view
```

### Commit Messages Tied to Tasks

```bash
# Reference task in commit
git commit -m "feat: implement user list view with AdvanceDataTable

- Added GraphQL query for users
- Setup AdvanceDataTable with sorting
- Added loading and error states

Task: User Management System - List View"
```

## Common Task Patterns

### CRUD Feature Tasks

```markdown
## [Entity] Management

### Backend Setup

- [ ] Create entity in Selise Cloud
- [ ] Configure permissions
- [ ] Test GraphQL queries

### List View

- [ ] Setup AdvanceDataTable
- [ ] Add column definitions
- [ ] Implement sorting/filtering
- [ ] Add pagination

### Create/Edit

- [ ] Build form with React Hook Form
- [ ] Add Zod validation
- [ ] Connect mutations
- [ ] Handle success/error

### Delete

- [ ] Add delete button
- [ ] Setup ConfirmationModal
- [ ] Connect delete mutation
- [ ] Refresh list after delete
```

### Authentication Tasks

```markdown
## Authentication System

### Login

- [ ] Create login page
- [ ] Setup auth context
- [ ] Token management
- [ ] Redirect logic

### Registration

- [ ] Registration form
- [ ] Email verification
- [ ] Password requirements
- [ ] Terms acceptance

### Security

- [ ] Protected routes
- [ ] Token refresh
- [ ] Logout functionality
- [ ] Session management
```

## Decision Documentation

Always document key decisions in SCRATCHPAD.md:

```markdown
---

[Date Time] Architecture Decision: State Management

- Considered: Redux, Zustand, Context
- Chose: Zustand
- Reason: Simpler than Redux, better than Context for complex state
- Reference: Used in inventory feature
```

## Review Checklist

Before marking a task complete:

```markdown
## Task Completion Checklist

- [ ] Feature works as specified
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Responsive design verified
- [ ] Code follows patterns from existing features
- [ ] GraphQL queries optimized
- [ ] Permissions checked (if applicable)
- [ ] Tests written (if applicable)
```

## MANDATORY: Inventory Pattern Following

### Before Creating Any Feature

```bash
# ALWAYS study inventory structure first
ls -la src/modules/inventory/

# Required folder structure to replicate:
src/modules/[your-module]/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── services/            # API calls and business logic
├── types/               # TypeScript interfaces
└── index.ts            # Clean exports
```

### Pattern Analysis Checklist

- [ ] **Component organization** - How are components grouped?
- [ ] **Service layer structure** - How are API calls organized?
- [ ] **Type definitions** - What naming conventions are used?
- [ ] **Hook patterns** - How are React Query hooks structured?
- [ ] **Export strategy** - What gets exported in index.ts?

### Implementation Rules

1. **Never deviate** from inventory folder structure
2. **Mirror naming conventions** exactly
3. **Follow service patterns** for consistency
4. **Use same export approach** in index.ts

## Best Practices

1. **Study inventory first** - MANDATORY before any feature work
2. **One task at a time** - Focus prevents context switching
3. **Document blockers** immediately in SCRATCHPAD.md
4. **Update status** as you work, not after
5. **Reference existing code** - Check src/modules/ for patterns
6. **Test incrementally** - Don't wait until end
7. **Commit frequently** - Small, logical commits
8. **Screenshot Selise Cloud** configs for CLOUD.md
