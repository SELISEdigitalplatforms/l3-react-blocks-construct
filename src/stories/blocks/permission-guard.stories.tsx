import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PermissionGuard } from '@/components/core/gurads/permission-guard/permission-guard';
import { Button } from '@/components/ui-kit/button';

const meta: Meta<typeof PermissionGuard> = {
  title: 'Block Components/Guards/PermissionGuard',
  component: PermissionGuard,
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A component that conditionally renders children based on user permissions. Provides various fallback modes including dialogs, toasts, or custom content when access is denied.',
      },
    },
  },
  argTypes: {
    permissions: { control: 'object' },
    showFallback: { control: 'boolean' },
    requireAll: { control: 'boolean' },
    fallbackType: {
      control: 'select',
      options: ['dialog', 'toast', 'hidden'],
    },
    checkOnClick: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionGuard>;

export const WithAccess: Story = {
  render: (args) => (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Permission Guard Demo - Access Granted</h3>
      <PermissionGuard {...args} permissions={['read']} requireAll={false}>
        <div className="p-4 bg-white border rounded">
          <h4 className="font-medium text-green-700">🔓 Content Visible</h4>
          <p className="text-gray-600">
            This content is visible because you have the required permissions.
          </p>
          <Button className="mt-2">Protected Action</Button>
        </div>
      </PermissionGuard>
      <p className="mt-4 text-sm text-gray-500">
        This simulates a user having the required &apos;read&apos; permission.
      </p>
    </div>
  ),
};

export const WithoutAccess: Story = {
  render: (args) => (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Permission Guard Demo - Access Denied</h3>
      <PermissionGuard
        {...args}
        permissions={['admin', 'write']}
        requireAll={true}
        showFallback={true}
        fallbackType="hidden"
      >
        <div className="p-4 bg-white border rounded">
          <h4 className="font-medium text-red-700">🔒 Protected Content</h4>
          <p className="text-gray-600">This content requires admin AND write permissions.</p>
          <Button className="mt-2">Admin Action</Button>
        </div>
      </PermissionGuard>
      <p className="mt-4 text-sm text-gray-500">
        This content is hidden because the user lacks required &apos;admin&apos; and
        &apos;write&apos; permissions.
      </p>
    </div>
  ),
};

export const WithCustomFallback: Story = {
  render: (args) => (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Permission Guard Demo - Custom Fallback</h3>
      <PermissionGuard
        {...args}
        permissions={['premium']}
        fallback={
          <div className="p-4 bg-white border-2 border-dashed border-yellow-300 rounded">
            <h4 className="font-medium text-yellow-700">⚠️ Upgrade Required</h4>
            <p className="text-gray-600 mb-3">
              This feature requires a premium subscription to access.
            </p>
            <Button variant="outline">Upgrade to Premium</Button>
          </div>
        }
      >
        <div className="p-4 bg-white border rounded">
          <h4 className="font-medium text-green-700">💎 Premium Content</h4>
          <p className="text-gray-600">This premium feature is only available to subscribers.</p>
        </div>
      </PermissionGuard>
    </div>
  ),
};

export const MultiplePermissions: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Multiple Permission Scenarios</h3>

      <div className="p-4 border rounded">
        <h4 className="font-medium mb-2">Requires ANY of: [&apos;read&apos;, &apos;write&apos;]</h4>
        <PermissionGuard
          permissions={['read', 'write']}
          requireAll={false}
          fallback={<div className="text-red-600">❌ No read or write access</div>}
        >
          <div className="text-green-600">✅ Has at least read or write access</div>
        </PermissionGuard>
      </div>

      <div className="p-4 border rounded">
        <h4 className="font-medium mb-2">
          Requires ALL of: [&apos;read&apos;, &apos;write&apos;, &apos;admin&apos;]
        </h4>
        <PermissionGuard
          permissions={['read', 'write', 'admin']}
          requireAll={true}
          fallback={<div className="text-red-600">❌ Missing some required permissions</div>}
        >
          <div className="text-green-600">✅ Has full admin access</div>
        </PermissionGuard>
      </div>
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Loading State Demo</h3>
      <p className="mb-4 text-sm text-gray-600">
        This shows the loading spinner while permissions are being checked.
      </p>
      {/* In a real app, this would show loading while permissions are being fetched */}
      <div className="flex items-center justify-center p-8 border rounded">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  ),
};
