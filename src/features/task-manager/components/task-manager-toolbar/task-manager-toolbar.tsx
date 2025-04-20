import { AlignJustify, Columns3, ListFilter, Plus, Search } from 'lucide-react';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';

interface TaskManagerToolbarProps {
  onOpen: () => void;
  viewMode?: string;
  handleViewMode: (view: string) => void;
}

export default function TaskManagerToolbar({
  onOpen,
  viewMode,
  handleViewMode,
}: TaskManagerToolbarProps) {
  const handleTaskModalOpen = () => {
    viewMode === 'board' && onOpen();
  };
  return (
    <div className="flex gap-2">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 bg-background" />
        <Input placeholder={`Search`} className="h-8 w-full rounded-lg bg-background pl-8" />
      </div>
      <Button variant="outline" size="sm" className="h-8 px-3">
        <ListFilter className="h-4 w-4" />
      </Button>

      <Tabs value={viewMode} onValueChange={(value) => handleViewMode(value)}>
        <TabsList className="border rounded-lg flex h-8 ">
          <TabsTrigger value="board">
            <Columns3 className="h-3 w-4" />
          </TabsTrigger>
          <TabsTrigger value="list">
            <AlignJustify className="h-3 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button onClick={handleTaskModalOpen} size="sm" className="h-8 text-sm font-bold">
        <Plus />
        Add Item
      </Button>
    </div>
  );
}
