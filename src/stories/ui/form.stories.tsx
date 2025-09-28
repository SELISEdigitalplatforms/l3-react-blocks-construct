import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Mail, Lock } from 'lucide-react';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from '../../components/ui/form';

type FormValues = {
  email: string;
  password: string;
};

const meta: Meta<typeof Form> = {
  title: 'Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

/* -------------------- Basic -------------------- */
const BasicFormDemo = () => {
  const form = useForm<FormValues>({
    defaultValues: { email: '' },
  });

  return (
    <Form {...form}>
      <form className="w-80 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export const Basic: Story = {
  render: () => <BasicFormDemo />,
};

/* -------------------- WithIcons -------------------- */
const WithIconsFormDemo = () => {
  const form = useForm<FormValues>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form className="w-80 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export const WithIcons: Story = {
  render: () => <WithIconsFormDemo />,
};

/* -------------------- WithState -------------------- */
const WithStateFormDemo = () => {
  const form = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setSubmitted(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {submitted && (
          <p className="text-sm text-green-600">Submitted: {JSON.stringify(submitted)}</p>
        )}
      </form>
    </Form>
  );
};
export const WithState: Story = {
  render: () => <WithStateFormDemo />,
};

/* -------------------- WithVariations -------------------- */
const WithVariationsFormDemo = () => {
  const form = useForm<FormValues>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form className="w-80 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Default)</FormLabel>
              <FormControl>
                <Input placeholder="Default input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (Outlined)</FormLabel>
              <FormControl>
                <Input
                  className="border-2 border-blue-500 focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Custom styled"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export const WithVariations: Story = {
  render: () => <WithVariationsFormDemo />,
};

/* -------------------- ComplexExample -------------------- */
const ComplexExampleFormDemo = () => {
  const form = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await new Promise((res) => setTimeout(res, 1000)); // Simulate async
    alert(JSON.stringify(data));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-6">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormDescription>Enter a valid email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{ required: 'Password is required', minLength: 6 }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>Must be at least 6 characters long.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <Lock className="mr-2 h-4 w-4" /> Sign In
        </Button>
      </form>
    </Form>
  );
};
export const ComplexExample: Story = {
  render: () => <ComplexExampleFormDemo />,
};

/* -------------------- EdgeCases -------------------- */
const EdgeCasesFormDemo = () => {
  const form = useForm<FormValues>({
    defaultValues: { email: '' },
  });

  return (
    <Form {...form}>
      <form className="w-80 space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Required)</FormLabel>
              <FormControl>
                <Input placeholder="Leave blank to see error" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={() => form.trigger()}>
          Validate
        </Button>
        <Button type="submit" disabled>
          Disabled Submit
        </Button>
      </form>
    </Form>
  );
};
export const EdgeCases: Story = {
  render: () => <EdgeCasesFormDemo />,
};

export {};
