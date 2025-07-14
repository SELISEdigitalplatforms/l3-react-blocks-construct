import React from 'react';

interface FileManagerLayoutProps {
  children: React.ReactNode;
  headerToolbar: React.ReactNode;
  modals: React.ReactNode;
}

export const FileManagerLayout: React.FC<FileManagerLayoutProps> = ({
  children,
  headerToolbar,
  modals,
}) => {
  return (
    <div className="flex flex-col h-full w-full space-y-4 p-4 md:p-6">
      {headerToolbar}

      <div className="flex-1 overflow-hidden">{children}</div>

      {modals}
    </div>
  );
};
