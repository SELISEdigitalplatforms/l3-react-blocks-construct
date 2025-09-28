import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../../components/ui/command';
import { Button } from '../../components/ui/button';
import { Calendar, Calculator, CreditCard, Settings, Smile, User, Search } from 'lucide-react';

const meta = {
  title: 'Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof Command>;

// Basic Command Component
const BasicCommandDemo = () => {
  return (
    <div className="w-full max-w-md">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicCommandDemo />,
};

// Command with Search Filtering
const FilteringCommandDemo = () => {
  const frameworks = [
    {
      value: 'next.js',
      label: 'Next.js',
    },
    {
      value: 'sveltekit',
      label: 'SvelteKit',
    },
    {
      value: 'nuxt.js',
      label: 'Nuxt.js',
    },
    {
      value: 'remix',
      label: 'Remix',
    },
    {
      value: 'astro',
      label: 'Astro',
    },
    {
      value: 'angular',
      label: 'Angular',
    },
    {
      value: 'vue',
      label: 'Vue.js',
    },
    {
      value: 'react',
      label: 'React',
    },
  ];

  const [searchValue, setSearchValue] = useState('');

  const filteredFrameworks = frameworks.filter((framework) =>
    framework.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full max-w-md">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search framework..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup heading="Frameworks">
            {filteredFrameworks.map((framework) => (
              <CommandItem key={framework.value} value={framework.value}>
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const WithFiltering: Story = {
  render: () => <FilteringCommandDemo />,
};

// Command Dialog Example
const CommandDialogDemo = () => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Search...
          <CommandShortcut className="ml-auto">⌘K</CommandShortcut>
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export const DialogExample: Story = {
  render: () => <CommandDialogDemo />,
};

// Command with Multiple Groups
const MultipleGroupsCommandDemo = () => {
  const [searchValue, setSearchValue] = useState('');

  const teamMembers = [
    { name: 'John Doe', role: 'Developer' },
    { name: 'Jane Smith', role: 'Designer' },
    { name: 'Robert Johnson', role: 'Manager' },
    { name: 'Sarah Wilson', role: 'QA Engineer' },
  ];

  const projects = [
    { name: 'Website Redesign', status: 'In Progress' },
    { name: 'Mobile App', status: 'Planning' },
    { name: 'API Integration', status: 'Completed' },
  ];

  const filteredTeam = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.status.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full max-w-md">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search team members or projects..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredTeam.length > 0 && (
            <CommandGroup heading="Team Members">
              {filteredTeam.map((member) => (
                <CommandItem key={member.name} value={member.name}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{member.name}</span>
                  <span className="text-muted-foreground ml-2">— {member.role}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredTeam.length > 0 && filteredProjects.length > 0 && <CommandSeparator />}

          {filteredProjects.length > 0 && (
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem key={project.name} value={project.name}>
                  <span>{project.name}</span>
                  <span className="text-muted-foreground ml-2">— {project.status}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export const MultipleGroups: Story = {
  render: () => <MultipleGroupsCommandDemo />,
};

// Command with Custom Styling
const StyledCommandDemo = () => {
  return (
    <div className="w-full max-w-md">
      <Command className="rounded-lg border-2 border-primary/20 shadow-lg">
        <CommandInput
          placeholder="Search with custom styling..."
          className="focus:ring-2 focus:ring-primary"
        />
        <CommandList className="max-h-64">
          <CommandEmpty className="py-8 text-center text-muted-foreground">
            Nothing found. Try a different search.
          </CommandEmpty>
          <CommandGroup
            heading="Fruits"
            className="[&>[cmdk-group-heading]]:text-primary [&>[cmdk-group-heading]]:font-bold"
          >
            <CommandItem className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              🍎 Apple
            </CommandItem>
            <CommandItem className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              🍌 Banana
            </CommandItem>
            <CommandItem className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              🍊 Orange
            </CommandItem>
            <CommandItem className="aria-selected:bg-primary aria-selected:text-primary-foreground">
              🍓 Strawberry
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className="bg-primary/20" />
          <CommandGroup
            heading="Vegetables"
            className="[&>[cmdk-group-heading]]:text-green-600 [&>[cmdk-group-heading]]:font-bold"
          >
            <CommandItem className="aria-selected:bg-green-600 aria-selected:text-white">
              🥕 Carrot
            </CommandItem>
            <CommandItem className="aria-selected:bg-green-600 aria-selected:text-white">
              🥦 Broccoli
            </CommandItem>
            <CommandItem className="aria-selected:bg-green-600 aria-selected:text-white">
              🥒 Cucumber
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const CustomStyling: Story = {
  render: () => <StyledCommandDemo />,
};

// Command with Action Items
const ActionCommandDemo = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleActionSelect = (value: string) => {
    setSelectedAction(value);
    alert(`Action selected: ${value}`);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="What would you like to do?" />
        <CommandList>
          <CommandEmpty>No actions available.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="create-project" onSelect={handleActionSelect}>
              📁 Create New Project
            </CommandItem>
            <CommandItem value="invite-member" onSelect={handleActionSelect}>
              👥 Invite Team Member
            </CommandItem>
            <CommandItem value="export-data" onSelect={handleActionSelect}>
              📊 Export Data
            </CommandItem>
            <CommandItem value="settings" onSelect={handleActionSelect}>
              ⚙️ Open Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      {selectedAction && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">
            Last action: <span className="font-medium">{selectedAction}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const WithActions: Story = {
  render: () => <ActionCommandDemo />,
};

// Command with Async Loading
// ...existing code...
const AsyncCommandDemo = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  React.useEffect(() => {
    if (searchValue.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const mockResults = [
        `Result for "${searchValue}" 1`,
        `Result for "${searchValue}" 2`,
        `Result for "${searchValue}" 3`,
        `Result for "${searchValue}" 4`,
      ];
      setResults(mockResults);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  let commandContent;
  if (isLoading) {
    commandContent = <CommandEmpty>Searching...</CommandEmpty>;
  } else if (results.length === 0 && searchValue.length >= 2) {
    commandContent = <CommandEmpty>No results found.</CommandEmpty>;
  } else if (results.length === 0) {
    commandContent = <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>;
  } else {
    commandContent = (
      <CommandGroup heading="Search Results">
        {results.map((result) => (
          <CommandItem key={result} value={result}>
            {result}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search with async results..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>{commandContent}</CommandList>
      </Command>
    </div>
  );
};

export const AsyncSearch: Story = {
  render: () => <AsyncCommandDemo />,
};

export {};
