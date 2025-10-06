import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const meta: Meta<any> = {
  title: 'Card',
  component: Card,
  parameters: {},
  argTypes: {
    header: {
      control: 'text',
      description: 'Content displayed at the top of the card.',
    },
    footer: {
      control: 'text',
      description: 'Content displayed at the bottom of the card.',
    },
    title: {
      control: 'text',
      description: 'Title of the card.',
    },
    content: {
      control: 'text',
      description: 'Main content of the card.',
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
type Story = StoryObj<any>;

export const Default: Story = {
  args: {
    header: 'This is a header',
    footer: 'This is a footer',
    title: 'This is a title',
    content: 'Main content',
  },
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
