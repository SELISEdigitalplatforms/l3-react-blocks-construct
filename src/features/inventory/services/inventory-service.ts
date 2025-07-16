export enum InventoryStatus {
  ACTIVE = 'Active',
  DISCONTINUED = 'Discontinued',
}

export const statusColors: Record<InventoryStatus, string> = {
  [InventoryStatus.ACTIVE]: 'success',
  [InventoryStatus.DISCONTINUED]: 'low-emphasis',
};

export const tags = ['Accessories', 'Electronic', 'Gaming', 'Monitor'];

export const categoryOptions = [
  'Supplies',
  'Electronics',
  'Furniture',
  'Apparel',
  'Accessories',
  'Wearables',
];
export const locationOptions = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
