import React from 'react';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { AlignJustify, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = '',
}) => (
  <Tabs value={viewMode} onValueChange={onViewModeChange}>
    <TabsList className={`border rounded-lg flex ${className}`}>
      <TabsTrigger value="list" className="px-2">
        <AlignJustify className="h-3 w-3" />
      </TabsTrigger>
      <TabsTrigger value="grid" className="px-2">
        <LayoutGrid className="h-3 w-3" />
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
