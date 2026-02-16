import React from 'react';

interface ResponsiveMainPaneProps {
  isDetailsOpen: boolean;
  isPreviewOpen?: boolean;
  children: React.ReactNode;
}

export const ResponsiveMainPane = ({
  isDetailsOpen,
  isPreviewOpen = false,
  children,
}: Readonly<ResponsiveMainPaneProps>) => {
  const shouldHideMainContent = isDetailsOpen || isPreviewOpen;

  const childArray = React.Children.toArray(children);
  const main = childArray[0] ?? null;
  const aside = childArray.slice(1);

  return (
    <div className="flex h-full w-full rounded-xl relative">
      <div
        className={`flex flex-col h-full transition-all duration-150 ${
          shouldHideMainContent ? 'hidden md:flex md:flex-1' : 'w-full'
        } ${isDetailsOpen && !shouldHideMainContent ? 'md:flex-1' : ''}`}
      >
        {main}
      </div>

      {/* Render any additional children (e.g., details/preview panes) as siblings to appear on the right */}
      {aside}
    </div>
  );
};
