import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDynamicMenu } from '../hooks/use-dynamic-menu';
import { getRouteConfig, hasRouteConfig } from '../utils/dynamic-routing';

// Import all possible components
import { Dashboard } from '../features/functional/dashboard/pages/dashboard';
import Finance from '../features/functional/finance/pages/finance';
import TaskPage from '../features/core/iam/pages/iam-table';
import { Inventory } from '../features/functional/inventory/pages/inventory';
import { InventoryDetails } from '../features/functional/inventory/pages/inventory-details';
import { InventoryForm } from '../features/functional/inventory/component/inventory-form/inventory-form';
import { Email } from '../features/functional/email/pages/email';
import { CalendarPage } from '../features/functional/big-calendar/pages/calendar';
import ActivityLogPage1 from '../features/core/activity-log-v1/pages/activity-log';
import ActivityLogPage2 from '../features/functional/activity-log-v2/pages/activity-log';
import TaskManager from '../features/functional/task-manager/pages/task-manager';
import { ChatPage } from '../features/functional/chat/pages/chat';
import { InvoicesPage } from '../features/functional/invoices/pages/invoices';
import { InvoiceDetailsPage } from '../features/functional/invoices/pages/invoices-detail';
import { CreateInvoice, EditInvoice } from '../features/functional/invoices';
import { FileManagerMyFiles } from '../features/functional/file-manager/pages/my-files';
import SharedWithMe from '../features/functional/file-manager/pages/shared-files';
import Trash from '../features/functional/file-manager/pages/trash';
import ServiceUnavailable from '../pages/error/service-unavailable/service-unavailable';
import NotFound from '../pages/error/not-found/not-found';

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  'Dashboard': Dashboard,
  'Finance': Finance,
  'TaskPage': TaskPage,
  'Inventory': Inventory,
  'Email': Email,
  'CalendarPage': CalendarPage,
  'ActivityLogPage1': ActivityLogPage1,
  'ActivityLogPage2': ActivityLogPage2,
  'TaskManager': TaskManager,
  'ChatPage': ChatPage,
  'InvoicesPage': InvoicesPage,
  'FileManagerMyFiles': FileManagerMyFiles,
  'NotFound': NotFound,
  'ServiceUnavailable': ServiceUnavailable,
};

/**
 * Renders routes dynamically based on selected menu items from blocks_constructs_selected.
 * Sub-routes are only available when their parent menu item is selected.
 */
export function DynamicRoutes() {
  const { menuItems, isLoading } = useDynamicMenu();

  if (isLoading) {
    return (
      <Routes>
        <Route path="*" element={<div>Loading routes...</div>} />
      </Routes>
    );
  }

  // Only register routes for menu items that have route configurations
  const routableItems = menuItems.filter(hasRouteConfig);

  return (
    <Routes>
      {/* Main routes for selected menu items */}
      {routableItems.map((item) => {
        const config = getRouteConfig(item);
        if (!config) return null;

        const Component = componentMap[config.component];
        if (!Component) return null;

        return (
          <Route key={item.id} path={config.path} element={<Component />} />
        );
      })}

      {/* Sub-routes - only available when parent menu item is selected */}
      {routableItems.some(item => item.id === 'inventory') && (
        <>
          <Route path="/inventory/add" element={<InventoryForm />} />
          <Route path="/inventory/:itemId" element={<InventoryDetails />} />
        </>
      )}
      
      {routableItems.some(item => item.id === 'mail') && (
        <>
          <Route path="/mail/:category" element={<Email />} />
          <Route path="/mail/:category/:emailId" element={<Email />} />
          <Route path="/mail/:category/:labels/:emailId" element={<Email />} />
        </>
      )}
      
      {routableItems.some(item => item.id === 'invoices') && (
        <>
          <Route path="/invoices/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoices/edit/:invoiceId" element={<EditInvoice />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
        </>
      )}
      
      {routableItems.some(item => item.id === 'file-manager') && (
        <>
          <Route path="/file-manager/my-files" element={<FileManagerMyFiles />} />
          <Route path="/file-manager/shared-files" element={<SharedWithMe />} />
          <Route path="/file-manager/trash" element={<Trash />} />
        </>
      )}

      {/* Default redirect - first available menu item */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={
              (routableItems.length > 0 ? getRouteConfig(routableItems[0])?.path : '/404') || 
              '/404'
            } 
          />
        } 
      />
      
      {/* Error pages - always available */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/503" element={<ServiceUnavailable />} />
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}
