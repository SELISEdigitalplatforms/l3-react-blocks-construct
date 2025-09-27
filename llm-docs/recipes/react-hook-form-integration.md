# Recipe: React Hook Form Integration with Selise Components

## What You'll Build
Forms using React Hook Form with Zod validation, integrated with Selise UI components

## Prerequisites
- React project initialized with Selise CLI:
  ```bash
  npm install -g @seliseblocks/cli
  blocks new web [PROJECT_NAME] --blocks-key [YOUR_BLOCKS_KEY] --app-domain [YOUR_APP_DOMAIN]
  ```
- React Hook Form and Zod installed
- Selise component library auto-included via CLI initialization

## Required Dependencies
```bash
npm install react-hook-form @hookform/resolvers zod
```

## Ingredients (Components Needed)

### From Selise Repository
```typescript
// UI Components (Always Import)
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select'
import { Textarea } from 'components/ui/textarea'
import { Checkbox } from 'components/ui/checkbox'

// Form Components (If Available)
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form'
```

## Recipe Steps

### Step 1: Set Up Form Schema with Zod
```typescript
// schemas/your-form.schema.ts
import { z } from 'zod'

export const yourFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(false),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
})

export type YourFormData = z.infer<typeof yourFormSchema>
```

### Step 2: Create Form Component
```typescript
// components/your-form.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select'
import { Textarea } from 'components/ui/textarea'
import { Checkbox } from 'components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form'
import { yourFormSchema, YourFormData } from '../schemas/your-form.schema'

interface YourFormProps {
  initialData?: Partial<YourFormData>;
  onSubmit: (data: YourFormData) => void;
  isLoading?: boolean;
}

export function YourForm({ initialData, onSubmit, isLoading = false }: YourFormProps) {
  const form = useForm<YourFormData>({
    resolver: zodResolver(yourFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      description: '',
      isActive: false,
      price: 0,
      ...initialData,
    },
  })

  const handleSubmit = (data: YourFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Item' : 'Create New Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Text Input Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Textarea Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description (optional)" 
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkbox Field */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Active Status
                    </FormLabel>
                    <FormDescription>
                      This item will be visible to users when active.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" loading={isLoading}>
                {initialData ? 'Update' : 'Create'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

### Step 3: Multi-Step Form Pattern
```typescript
// components/multi-step-form.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Progress } from 'components/ui/progress'

const steps = ['Basic Info', 'Details', 'Confirmation'];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<YourFormData>({
    resolver: zodResolver(yourFormSchema),
    mode: 'onChange', // Validate on change for better UX
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: YourFormData) => {
    console.log('Final submission:', data);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Multi-Step Form</CardTitle>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Name and email fields */}
              {/* ... form fields for step 1 */}
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Category, price, description fields */}
              {/* ... form fields for step 2 */}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Review Your Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {form.watch('name')}</p>
                  <p><strong>Email:</strong> {form.watch('email')}</p>
                  <p><strong>Category:</strong> {form.watch('category')}</p>
                  <p><strong>Price:</strong> ${form.watch('price')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!form.formState.isValid}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                Submit
              </Button>
            )}
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
```

### Step 4: Form with File Upload
```typescript
// components/form-with-file-upload.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'

export function FormWithFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const form = useForm<YourFormData>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleSubmit = async (data: YourFormData) => {
    // Handle form data
    console.log('Form data:', data);
    
    // Handle file uploads
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });
      
      // Upload files to your service
      console.log('Files to upload:', selectedFiles);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      
      {/* Regular form fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register('name')} />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="files">Upload Files</Label>
        <Input
          id="files"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        {selectedFiles.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Selected files: {selectedFiles.map(f => f.name).join(', ')}
          </div>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Step 5: Form Integration with React Query
```typescript
// hooks/use-form-mutations.ts
import { useGlobalMutation } from 'state/query-client/hooks'
import { useToast } from 'hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useGlobalMutation({
    mutationFn: async (data: YourFormData) => {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "Success",
        description: "Item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    },
  });
}

// In your component
export function YourFormWithMutation() {
  const { mutate: createItem, isPending } = useCreateItem();

  const handleSubmit = (data: YourFormData) => {
    createItem(data);
  };

  return (
    <YourForm 
      onSubmit={handleSubmit} 
      isLoading={isPending}
    />
  );
}
```

### Step 6: Form Validation Patterns
```typescript
// Advanced validation schema
export const advancedFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Custom validation with server-side check
const emailSchema = z.string().email().refine(async (email) => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const { available } = await response.json();
  return available;
}, {
  message: "Email is already taken",
});
```

## Integration Patterns

### With Existing Selise Forms
```typescript
// Follow patterns from existing features like inventory or invoices
// Look for FormSectionCard, FormTextInput patterns in existing code

// Example based on invoice patterns
import { FormSectionCard } from 'features/invoices/components/invoice-form/form-section-card'
import { FormTextInput } from 'features/invoices/components/invoice-form/form-text-input'

// Use these if available, otherwise use the UI components directly
```

### Error Handling
```typescript
// Global form error handling
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues,
});

// Handle server validation errors
useEffect(() => {
  if (serverErrors) {
    Object.entries(serverErrors).forEach(([field, message]) => {
      form.setError(field as any, { message });
    });
  }
}, [serverErrors, form]);
```

## Best Practices

### ✅ Form Structure
- Use Card components for form containers
- Group related fields with proper spacing
- Provide clear labels and helpful descriptions
- Show validation errors immediately

### ✅ State Management
- Use React Hook Form for form state
- Use Zod for validation schemas
- Use React Query for server state
- Keep local state minimal

### ✅ User Experience
- Show loading states during submission
- Provide success/error feedback with toast
- Enable real-time validation
- Support keyboard navigation

### ❌ Common Mistakes
- Don't mix different form libraries
- Don't skip validation schemas
- Don't forget loading states
- Don't ignore accessibility requirements

This pattern ensures consistent, accessible, and maintainable forms across your Selise application.