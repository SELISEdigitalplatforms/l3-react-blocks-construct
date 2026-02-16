import { AlignJustify, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-kit/tabs';

interface ViewToggleProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  className?: string;
}

export const ViewToggle = ({
  viewMode,
  onViewModeChange,
  className = '',
}: Readonly<ViewToggleProps>) => (
  <Tabs value={viewMode} onValueChange={onViewModeChange}>
    <TabsList className={`border rounded-lg flex bg-background ${className}`}>
      <TabsTrigger value="list" className="px-2">
        <AlignJustify className="h-3 w-3" />
      </TabsTrigger>
      <TabsTrigger value="grid" className="px-2">
        <LayoutGrid className="h-3 w-3" />
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
