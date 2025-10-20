import React from 'react';

interface ResponsiveMainPaneProps {
  isMobile: boolean;
  isDetailsOpen: boolean;
  isPreviewOpen?: boolean;
  children: React.ReactNode;
}

export const ResponsiveMainPane = ({
  isMobile,
  isDetailsOpen,
  isPreviewOpen = false,
  children,
}: Readonly<ResponsiveMainPaneProps>) => {
  const shouldHideMainContent = isMobile && (isDetailsOpen || isPreviewOpen);

  const childArray = React.Children.toArray(children);
  const main = childArray[0] ?? null;
  const aside = childArray.slice(1);

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-150 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          {main}
        </div>
      )}

      {/* Render any additional children (e.g., details/preview panes) as siblings to appear on the right */}
      {aside}
    </div>
  );
};
