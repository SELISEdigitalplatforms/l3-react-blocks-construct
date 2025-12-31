# User Interaction Workflow

## Initial Contact Protocol

When user requests any application, follow this exact flow:

### 1. Create Tracking Files Immediately
```bash
touch FEATURELIST.md TASKS.md SCRATCHPAD.md CLOUD.md
```

### 2. Initial Response Template
```
I'll help you build [what they asked for]. Let me understand your requirements to create the best solution for you.

Let me ask a few questions to ensure I build exactly what you need:
```

## Question Templates by Context

### Universal Questions (Always Ask)
1. "What are the main features you need?"
2. "Who will be using this application?"
3. "Do you need user authentication/login?"
4. "Should data persist between sessions?"
5. "Are there any specific workflows or processes this should follow?"

### Project Setup Questions (For New Projects)
6. "What would you like to name your project?" (e.g., "TaskManager", "InventoryApp")
7. "What's your GitHub username?" (for repository integration)
8. "What would you like to name the repository?" (e.g., "task-manager-app")
9. "Do you want me to set up a local development environment?" (Yes/No)

### For Data Management Apps
- "What information needs to be tracked for each [item]?"
- "Who can create, edit, and delete [items]?"
- "Do you need approval workflows?"
- "Should there be an audit trail of changes?"
- "Any reporting or export features needed?"

### For Task/Project Management
- "Should tasks have categories, tags, or projects?"
- "Do you need due dates and reminders?"
- "Will there be multiple users or teams?"
- "Should tasks have priority levels or status workflows?"
- "Do you need recurring tasks?"

### For E-commerce/Marketplace
- "What types of products/services will be listed?"
- "Do you need shopping cart and checkout?"
- "Payment processing requirements?"
- "Inventory management needed?"
- "Order tracking and fulfillment?"

### For Communication/Social Apps
- "Real-time messaging or async comments?"
- "File/media sharing needed?"
- "Group/channel organization?"
- "Notification preferences?"
- "Moderation features?"

## Creating FEATURELIST.md

Update progressively as you gather requirements:

```markdown
# Feature List for [App Name]

## Core Features (Confirmed)
✅ User authentication with email/password
✅ Create and edit [items]
✅ List view with sorting and filtering
✅ Delete with confirmation
✅ Search functionality

## Additional Features (Discussing)
❓ Categories/tags system?
❓ Due dates and reminders?
❓ File attachments?
❓ Export to CSV/PDF?
❓ Email notifications?

## Technical Requirements (Auto-determined)
- Sidebar navigation (customize for app-specific features only)
- GraphQL API with Selise Cloud MCP
- Responsive design (mobile/desktop)
- Real-time updates where needed
- Comprehensive error handling
- Loading states and skeletons

## Implementation Notes (Internal)
- Remove/hide irrelevant sidebar items (inventory, invoices, etc.)
- Show only navigation relevant to this app
- Follow src/modules/inventory/ structure pattern
- Backend setup via cloud-setup.md → Data operations via graphql-crud recipe

## Out of Scope (Confirmed)
❌ Mobile app (web only for now)
❌ Third-party integrations (phase 2)

## Status
- [x] Initial requirements gathered
- [x] Core features confirmed
- [ ] Additional features confirmed
- [ ] Ready for implementation
```

## Confirmation Before Implementation

### The Confirmation Message
```
Based on our discussion, here's what I'll build for you:

**[App Name]**

Core Features:
• Feature 1 with details
• Feature 2 with details
• Feature 3 with details

Technical Approach:
• Modern responsive web application
• Secure authentication
• Real-time data updates
• Professional UI/UX

Shall I proceed with building this? (You can still request changes as we go)
```

### After Confirmation - Project & Schema Setup
```
Great! I'll start building your [app name]. I'll set up the backend requirements and work through each feature systematically.

[Internal Process - Never mention to user:]
1. Execute MCP project creation (if new project needed)
2. Analyze confirmed features to determine required schemas
3. Document schema plan in CLOUD.md
4. Execute MCP schema creation operations
5. Update CLOUD.md with results
6. Proceed with implementation following TASKS.md
```

#### MCP Project Creation Process (Internal - First Time Only)
```python
# Step 1: Ask user for project details
project_name = "TaskManager"  # From user input
github_username = "user123"   # From user input
repository_name = "task-manager-app"  # From user input

# Step 2: Create Selise Cloud project
create_project(
    project_name=project_name,
    github_username=github_username, 
    repository_name=repository_name
)

# Step 3: Create local repository (if user wants local setup)
create_local_repository(project_name=project_name)

# Step 4: Document project details in CLOUD.md
# - Project name, GitHub integration
# - Application domain and tenant ID
# - Project creation timestamp
```

#### Schema Analysis Process (Internal)
For each confirmed feature, determine:
- **Data entities needed** (Users, Tasks, Categories, etc.)
- **Entity fields and types** (title: String, status: Enum, etc.)
- **Relationships** (Task belongs to User, etc.)
- **Permissions required** (admin can delete, users can edit own)

#### CLOUD.md Population Template
```markdown
# Backend Configuration - [App Name]

## Schema Requirements Analysis
Based on confirmed features:
- User authentication → User entity
- Task management → Tasks entity  
- Categories/tags → Categories entity
- File attachments → Files entity

## Schema Creation Plan

### User Entity
- Fields: name (String), email (String, unique), role (Enum: admin|user)
- Permissions: Admin full access, User read own profile

### Tasks Entity  
- Fields: title (String), description (Text), status (Enum), dueDate (DateTime), userId (Reference)
- Permissions: Admin full access, User CRUD own tasks

## MCP Operations Log

### [Timestamp] - Schema Creation
- Status: In Progress
- Operation: createEntity('User', {...})
- Result: [Success/Error details]

### [Timestamp] - Permissions Setup
- Status: Complete  
- Operation: configurePermissions('User', {...})
- Result: Successfully configured role-based access
```

## Handling Unclear Requirements

### When User is Vague
"I need a simple app for my business"

Response:
```
I'd be happy to help build an app for your business. To create the most useful solution, could you tell me:

1. What's the main problem this app should solve?
2. What type of business is this for?
3. Who are the primary users (employees, customers, both)?
4. What's the most important feature you need?
5. Can you describe a typical workflow or use case?
```

### When User Wants "Everything"
"I want all the features like [major app]"

Response:
```
I understand you'd like a comprehensive solution. Let's start with the most essential features for your initial version, then we can expand:

1. What are the top 3-5 features you absolutely need?
2. What's your primary use case?
3. Which features do your users need on day one?

We can always add more features once the core functionality is working well.
```

## Progressive Feature Discovery

As you build, discover additional needs:

```
I've completed the basic task list. While implementing, I noticed we might benefit from:
- Bulk actions for managing multiple tasks
- Keyboard shortcuts for power users
- A dashboard with statistics

Would you like me to add any of these?
```

## Managing Scope Creep

When user keeps adding features mid-build:

```
I'll note these additional features in our FEATURELIST.md. To keep momentum, let me finish the current core features first, then we can prioritize these additions:

New requests:
• [Feature A]
• [Feature B]

Current focus: [What you're building now]
```

## Cloud Setup Requests

When Selise Cloud setup is needed:

```
To implement [feature], we'll need to set up a few things in Selise Cloud:

1. Please go to Selise Cloud Admin Panel
2. Create a new entity called "[EntityName]" with these fields:
   - field1 (String)
   - field2 (Number)
   - field3 (Boolean)
3. Enable GraphQL API for this entity
4. Take a screenshot of the configuration
5. Let me know when complete

I'll document this in CLOUD.md for reference.
```

## Best Practices

1. **Be conversational** but professional
2. **Ask one set of questions** at a time (not 20 questions)
3. **Summarize understanding** before proceeding
4. **Document everything** in FEATURELIST.md
5. **Never mention Selise** or technical implementation details
6. **Focus on user value** not technical features
7. **Confirm before building** major features

## Common Patterns to Apply

Based on user needs, silently apply these:
- Data list → Use AdvanceDataTable
- Forms → React Hook Form + Zod
- Confirmations → ConfirmationModal
- Navigation → AppSidebar
- Rich text → CustomTextEditor
- Permissions → PermissionGuard

Never announce these technical decisions to the user.