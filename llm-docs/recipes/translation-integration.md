# Recipe: Translation Workflow

## 🌐 Static Content Translation Workflow

**AFTER implementing new features with static text, you MUST translate all user-facing strings using MCP translation tools.**

### Translation Process (MANDATORY):

1. **Get Available Languages:**

   ```python
   get_translation_languages()
   # Returns list of available languages with codes (e.g., "en-US", "bn-BD")
   ```

2. **Check if Translation Module Exists:**

   ```python
   modules = get_translation_modules()
   # Check if your module (e.g., "MEGA-shop") exists in the list
   ```

3. **Create Module if Not Exists:**

   ```python
   if module_not_found:
       create_module(module_name="MEGA-shop")
   ```

4. **Get Existing Keys in Module:**

   ```python
   existing_keys = get_module_keys(module_id="module_id_from_step_2_or_3")
   # Returns all existing translation keys in the module
   ```

5. **Save Translation Keys:**

   ```python
   save_module_keys_with_translations(request={
       "ProjectKey": "your_project_key",  # From get_global_state()
       "Translations": [
           {
               "KeyName": "MEGA_SHOP_ADD",  # Translation key from component
               "ModuleId": "module_id_from_step_4",
               "IsNewKey": True,  # True for new keys, False for updates
               "ItemId": "",  # Empty string for new keys
               "Resources": [
                   {
                       "Value": "Add MEGA Shop",  # English translation
                       "Culture": "en-US"  # Language code from step 1
                   },
                   {
                       "Value": "সবজি দোকান যোগ করুন",  # Bengali translation
                       "Culture": "bn-BD"
                   }
               ]
           }
       ]
   })
   ```

6. **Publish Translations (MANDATORY):**

   ```python
   # After saving all translation keys, PUBLISH them to make live
   publish_translation(project_key="your_project_key")  # From get_global_state()

   # Response will confirm successful publication
   # Translations are now live and available in the application
   ```

## Publishing Translations (CRITICAL)

### Why Publishing is Required

**Translations must be published to become live and available in the application.** The `save_module_keys_with_translations()` function saves translations to the database, but they remain in "draft" status until published.

### Publish Process

**ALWAYS invoke `publish_translation()` after completing all translation work:**

```python
# Get project key from global state
global_state = get_global_state()
project_key = global_state['app_state']['tenant_id']

# Publish all translations for the project
publish_translation(project_key=project_key)

# Response confirms successful publication
# {
#   "status": "success",
#   "message": "Translations published successfully",
#   "published_count": 25  # Number of translation keys published
# }
```

### When to Publish

- **After initial translation setup** for new features
- **After adding new translation keys** to existing modules
- **After updating existing translations** for any language
- **Before deploying to production** to ensure all translations are live

### Publishing Behavior

- **Makes translations immediately available** in the application
- **Applies to ALL modules** in the project (not just current module)
- **Safe to run multiple times** - only publishes changed/new translations
- **Required for route-based loading** to work properly

### Verification

After publishing, verify translations are working:

1. **Clear browser cache** or restart dev server
2. **Navigate to the feature route** to trigger translation loading
3. **Check that all `t('KEY_NAME')` calls** display translated text
4. **Test language switching** if multiple languages are supported

### Common Issues

**Translations not appearing after publish:**

- Clear browser cache and reload
- Check that route mapping includes the translation module
- Verify key names match exactly (case-sensitive)

**Publish fails:**

- Ensure project_key is correct from `get_global_state()`
- Check that translations were saved successfully first
- Verify user has publish permissions

### Translation Workflow Summary

1. ✅ **Implement feature** with translation keys
2. ✅ **Add route mapping** in `route-module-map.ts`
3. ✅ **Create translation module** using MCP
4. ✅ **Save translations** for all languages
5. ✅ **`publish_translation()` - CRITICAL STEP**
6. ✅ **Test and verify** translations load correctly

### Translation Key Examples:

**From MEGA-shop-list.tsx:**

- `MEGA_SHOPS` - Page title
- `MEGA_SHOP_ADD` - Add button text
- `MEGA_SHOP_ITEM_NAME` - Table column header
- `MEGA_SHOP_PRICE` - Table column header
- `MEGA_SHOP_CREATED_DATE` - Table column header

**From MEGA-shop-form.tsx:**

- `MEGA_SHOP_ADD_DESCRIPTION` - Dialog description
- `MEGA_SHOP_ITEM_NAME_PLACEHOLDER` - Input placeholder
- `MEGA_SHOP_PRICE_PLACEHOLDER` - Input placeholder
- `MEGA_SHOP_CREATE` - Submit button text
- `MEGA_SHOP_CREATING` - Loading state text

**Menu/Sidebar Keys (common module):**

- `MEGA_SHOP` - Menu item text (goes in 'common' module)
- `DASHBOARD` - Dashboard menu item (goes in 'common' module)
- `INVENTORY` - Inventory menu item (goes in 'common' module)

### Critical Rules:

- **ALWAYS translate static content** after implementing new features
- **Extract ALL hardcoded strings** from components and replace with `t('KEY_NAME')`
- **Include translations for ALL available languages** returned by `get_translation_languages()`
- **Use descriptive key names** that indicate context (e.g., `MEGA_SHOP_ITEM_NAME` not just `ITEM_NAME`)

- **Menu/sidebar keys MUST go in 'common' module** - never in feature modules
- **Module names use hyphens** (e.g., `mega-shop`) - **Key names use underscores** (e.g., `MEGA_SHOP_ITEM_NAME`)
- **PUBLISH translations** using `publish_translation()` after saving keys to make them live
- **Document translation keys** in your TASKS.md file

### Module ID Requirements (CRITICAL):

**Every translation key MUST have a valid module ID:**

```python
# ✅ Correct - Get module ID dynamically
modules = get_translation_modules()
common_module = next(m for m in modules if m['moduleName'] == 'common')
feature_module = next(m for m in modules if m['moduleName'] == 'mega-shop')

# Use the actual itemId from the response
common_module_id = common_module['itemId']  # e.g., '25b40560-43b1-4263-88e7-407099e3b075'
feature_module_id = feature_module['itemId']  # e.g., '44d2021e-fd1e-4562-8902-9877bd8a1397'
```

**NEVER hardcode module IDs - always get them dynamically from `get_translation_modules()`**

## Route-Based Translation Loading

### Automatic Module Loading

The application automatically loads translation modules based on the current route using `src/i18n/route-module-map.ts`:

```typescript
export const routeModuleMap: Record<string, string[]> = {
  '/MEGA-shops': ['common', 'MEGA-shops'],
  '/invoices': ['common', 'invoices'],
  // ... other routes
};
```

**How it works:**

1. User navigates to `/MEGA-shops`
2. `LanguageProvider` detects the route
3. Looks up `['common', 'MEGA-shops']` in route map
4. Automatically loads translations for both modules
5. Components can use `t('KEY_NAME')` from either module

### Adding New Routes

When creating new features:

1. **Add route mapping** in `src/i18n/route-module-map.ts`:

   ```typescript
   export const routeModuleMap: Record<string, string[]> = {
     // ... existing routes
     '/your-feature': ['common', 'your-feature'],
     // ... other routes
   };
   ```

2. **Create translation module** using MCP:

   ```python
   create_module(module_name="your-feature")
   ```

3. **Add translations** using the process above

4. **Components automatically get translations** when route is visited

**Example for MEGAShops:**

```typescript
'/MEGA-shops': ['common', 'MEGA-shops'],
```

## Translation Key Naming Conventions

### Module Names (CRITICAL)

**Module names MUST follow strict conventions:**

- ✅ **Use hyphens only**: `mega-shop`, `user-management`, `data-export`
- ❌ **No underscores**: `mega_shop`, `user_management`, `data_export`
- ❌ **No special characters**: `mega@shop`, `user#management`
- ✅ **Lowercase only**: `mega-shop`, not `Mega-Shop`

**Examples:**

```typescript
// ✅ Correct module names
'mega-shop';
'user-management';
'data-export';
'inventory-management';

// ❌ Incorrect module names
'mega_shop'; // underscore not allowed
'Mega-Shop'; // uppercase not allowed
'mega@shop'; // special characters not allowed
```

### Key Names (CRITICAL)

**Translation keys MUST follow strict conventions:**

- ✅ **Use underscores only**: `MEGA_SHOP_ITEM_NAME`
- ❌ **No hyphens in keys**: `MEGA-SHOP-ITEM-NAME`
- ❌ **No special characters**: `MEGA@SHOP_ITEM_NAME`
- ✅ **Uppercase with underscores**: `MEGA_SHOP_ITEM_NAME`

**Examples:**

```typescript
// ✅ Correct key names
'TIME_TRACKER_DASHBOARD_TITLE';
'MEGA_SHOP_ADD_BUTTON';
'USER_PROFILE_EDIT_FORM';

// ❌ Incorrect key names
'mega-shop-item-name'; // hyphens not allowed in keys
'MEGA-SHOP-ITEM-NAME'; // hyphens not allowed in keys
'mega_shop_item_name'; // lowercase not allowed
```

### Module vs Key Separation

**IMPORTANT: Module names and key names have different rules:**

- **Module names**: Use hyphens, lowercase (`mega-shop`)
- **Key names**: Use underscores, uppercase (`MEGA_SHOP_ITEM_NAME`)

### Module Prefixes

Always prefix keys with the module name to avoid conflicts:

```typescript
// ✅ Good - specific to MEGA shops
t('MEGA_SHOPS_TITLE');
t('MEGA_SHOP_ADD_BUTTON');

// ❌ Bad - too generic
t('TITLE');
t('ADD_BUTTON');
```

### Key Categories

- **Page Titles**: `FEATURE_NAME` (e.g., `MEGA_SHOPS`)
- **Buttons**: `FEATURE_ACTION` (e.g., `MEGA_SHOP_ADD`)
- **Labels**: `FEATURE_FIELD_LABEL` (e.g., `MEGA_SHOP_ITEM_NAME`)
- **Placeholders**: `FEATURE_FIELD_PLACEHOLDER` (e.g., `MEGA_SHOP_ITEM_NAME_PLACEHOLDER`)
- **Messages**: `FEATURE_MESSAGE_TYPE` (e.g., `MEGA_SHOP_CREATED_SUCCESS`)

### Menu/Sidebar Keys (CRITICAL)

**Menu and sidebar navigation keys MUST be placed in the 'common' module:**

```typescript
// ✅ Correct - MEGA_SHOP key in 'common' module
// Module ID: '25b40560-43b1-4263-88e7-407099e3b075' (common module)
{
  "KeyName": "MEGA_SHOP",
  "ModuleId": "25b40560-43b1-4263-88e7-407099e3b075", // common module ID
  "Resources": [{"Value": "Mega Shop", "Culture": "en"}]
}

// ❌ Incorrect - MEGA_SHOP key in feature module
{
  "KeyName": "MEGA_SHOP",
  "ModuleId": "feature-module-id", // wrong - should be common
  "Resources": [{"Value": "Mega Shop", "Culture": "en"}]
}
```

**How to find the common module ID:**

```python
modules = get_translation_modules()
common_module = next(m for m in modules if m['moduleName'] == 'common')
common_module_id = common_module['itemId']  # Use this ID for menu keys
```

### Common Suffixes

- `_LABEL` - Form field labels
- `_PLACEHOLDER` - Input placeholders
- `_ERROR` - Error messages
- `_SUCCESS` - Success messages
- `_LOADING` - Loading states
- `_EMPTY` - Empty state messages

## Implementation Checklist

After implementing new features:

- [ ] Extract all hardcoded strings to translation keys
- [ ] Add route mapping in `route-module-map.ts` (use hyphens in module names)
- [ ] Create translation module using MCP (use hyphens: `mega-shop`, not `mega_shop`)
- [ ] Add menu/sidebar keys to **'common' module** (get module ID dynamically)
- [ ] Add feature keys to **feature module** (get module ID dynamically)
- [ ] Add translations for all supported languages
- [ ] **Publish translations using `publish_translation()` MCP tool**
- [ ] Test translation loading on the route
- [ ] Document keys in TASKS.md

### Module ID Workflow (MANDATORY):

```python
# Step 1: Get all modules
modules = get_translation_modules()

# Step 2: Find common module ID
common_module = next(m for m in modules if m['moduleName'] == 'common')
common_module_id = common_module['itemId']

# Step 3: Find/create feature module ID
feature_module = next((m for m in modules if m['moduleName'] == 'mega-shop'), None)
if not feature_module:
    create_module(module_name="mega-shop")  # Use hyphens
    # Then get the module again
    modules = get_translation_modules()
    feature_module = next(m for m in modules if m['moduleName'] == 'mega-shop')
feature_module_id = feature_module['itemId']

# Step 4: Save translations with correct module IDs
save_module_keys_with_translations(request={
    "ProjectKey": project_key,
    "Translations": [
        # Menu keys go to common module
        {
            "KeyName": "MEGA_SHOP",  # Underscores in keys
            "ModuleId": common_module_id,
            "Resources": [{"Value": "MEGA Shop", "Culture": "en"}]
        },
        # Feature keys go to feature module
        {
            "KeyName": "MEGA_SHOP_ADD_DESCRIPTION",
            "ModuleId": feature_module_id,
            "Resources": [{"Value": "Add Description", "Culture": "en"}]
        }
    ]
})
```

## Troubleshooting

### Translations Not Loading

1. **Check route mapping** - Is your route in `route-module-map.ts`?
2. **Verify module exists** - Use `get_translation_modules()` to confirm
3. **Check key names** - Are keys prefixed correctly?
4. **Clear cache** - Restart dev server to reload translations

### Key Not Found Errors

1. **Check module** - Is the key in the correct module?
2. **Verify spelling** - Case-sensitive matching
3. **Check route** - Is the route loading the right modules?

### Language Not Available

1. **Check supported languages** - Use `get_translation_languages()`
2. **Add missing translations** - Provide translations for all supported languages

## Integration with Component Development

### Form Components

Use translation keys in form components:

```typescript
// ✅ Good - translation-ready
<FormTextInput
  labelKey="MEGA_SHOP_ITEM_NAME"
  placeholderKey="MEGA_SHOP_ITEM_NAME_PLACEHOLDER"
  error={errors.itemName}
/>

// ❌ Bad - hardcoded strings
<FormTextInput
  label="Item Name"
  placeholder="Enter item name"
  error="Item name is required"
/>
```

### Page Components

```typescript
// ✅ Good - translation-ready
<h1>{t('MEGA_SHOPS')}</h1>
<Button>{t('MEGA_SHOP_ADD')}</Button>

// ❌ Bad - hardcoded strings
<h1>MEGA Shops</h1>
<Button>Add MEGA Shop</Button>
```

### Error Messages

```typescript
// ✅ Good - translation-ready
toast({
  title: t('ERROR'),
  description: t('MEGA_SHOP_CREATE_FAILED'),
});

// ❌ Bad - hardcoded strings
toast({
  title: 'Error',
  description: 'Failed to create MEGA shop',
});
```

## Summary

Translation is a critical part of the Selise Blocks development workflow. Always:

1. **Implement features first** with proper translation key structure
2. **Add route mapping** for automatic module loading
3. **Create translation modules** using MCP tools
4. **Add translations** for all supported languages
5. **PUBLISH translations** using `publish_translation()` MCP tool (CRITICAL)
6. **Test thoroughly** to ensure translations load correctly

This ensures a consistent, internationalized user experience across all features.
