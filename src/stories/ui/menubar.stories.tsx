import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarGroup,
  MenubarShortcut,
} from '../../components/ui/menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible menu bar built on top of Radix UI Menubar. Supports nested submenus, checkbox and radio items, groups, separators, and keyboard shortcuts.',
      },
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Menubar>;

/* -------------------- Basic -------------------- */
export const Basic: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/* -------------------- WithSubMenu -------------------- */
export const WithSubMenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>More Tools</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Format</MenubarItem>
              <MenubarItem>Spelling</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/* -------------------- WithCheckboxAndRadio -------------------- */
export const WithCheckboxAndRadio: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Toolbar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Theme</MenubarLabel>
          <MenubarRadioGroup value="light">
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/* -------------------- WithGroups -------------------- */
export const WithGroups: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Account
              <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Settings
              <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>Sign Out</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export {};
