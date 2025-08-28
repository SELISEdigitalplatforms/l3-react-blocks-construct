import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const meta: Meta<typeof Card> = {
  title: 'UI Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a card with header, content, and footer.',
      },
    },
  },
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the content of the card.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {},
};

export const Simple: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a simple card with just a title and content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Feature Update</CardTitle>
          <Badge>New</Badge>
        </div>
        <CardDescription>Check out our latest features and improvements.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>We&apos;ve added new functionality to improve your experience.</p>
      </CardContent>
    </Card>
  ),
};