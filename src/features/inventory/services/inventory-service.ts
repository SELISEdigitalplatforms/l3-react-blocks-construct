export interface InventoryData {
  itemId: string;
  itemName: string;
  category: string;
  supplier: string;
  itemLoc: string;
  stock: number | null;
  lastupdated: string;
  price: string;
  status: string;
}

export enum InventoryStatus {
  ACTIVE = 'Active',
  DISCONTINUED = 'Discontinued',
}

export const statusColors: Record<InventoryStatus, string> = {
  [InventoryStatus.ACTIVE]: 'success',
  [InventoryStatus.DISCONTINUED]: 'low-emphasis',
};

export const inventoryData: InventoryData[] = [
  {
    itemId: '58944167',
    itemName: 'Coffee Pods (Pack)',
    category: 'Supplies',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 200,
    lastupdated: '',
    price: 'CHF 20.00',
    status: 'Active',
  },
  {
    itemId: '12289160',
    itemName: 'Monitor',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 30,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 250.00',
    status: 'Active',
  },
  {
    itemId: '28391730',
    itemName: 'Monitor Arm',
    category: 'Accessories',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 15,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 75.00',
    status: 'Discontinued',
  },
  {
    itemId: '71029237',
    itemName: 'Wireless Mouse',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 33,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 25.00',
    status: 'Active',
  },
  {
    itemId: '45379810',
    itemName: 'Noise-Canceling Headphones',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 12,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '86573219',
    itemName: 'Office Chair',
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 68,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 200.00',
    status: 'Discontinued',
  },
  {
    itemId: '64205138',
    itemName: 'Smartwatch',
    category: 'Wearables',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 80,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 300.00',
    status: 'Active',
  },
  {
    itemId: '12985703',
    itemName: 'Standing Desk',
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 14,
    lastupdated: '',
    price: 'CHF 400.00',
    status: 'Active',
  },
  {
    itemId: '73029846',
    itemName: 'Urban Explorer Sneakers',
    category: 'Apparel',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 0,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 100.00',
    status: 'Discontinued',
  },
  {
    itemId: '49821730',
    itemName: 'USB-C Hub',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 40,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 40.00',
    status: 'Active',
  },
  {
    itemId: '98765432',
    itemName: 'Laptop',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 25,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 1200.00',
    status: 'Discontinued',
  },
  {
    itemId: '54321098',
    itemName: 'Keyboard',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 50,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 75.00',
    status: 'Active',
  },
  {
    itemId: '13579111',
    itemName: 'Mousepad',
    category: 'Accessories',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 75,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 15.00',
    status: 'Active',
  },
  {
    itemId: '24680222',
    itemName: 'Webcam',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 100.00',
    status: 'Active',
  },
  {
    itemId: '35791333',
    itemName: 'External Hard Drive',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 40,
    lastupdated: '',
    price: 'CHF 120.00',
    status: 'Active',
  },
  {
    itemId: '46802444',
    itemName: 'Desk Lamp',
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 60,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 50.00',
    status: 'Discontinued',
  },
  {
    itemId: '57913555',
    itemName: 'File Cabinet',
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 20,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '68024666',
    itemName: 'Printer',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 15,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 200.00',
    status: 'Active',
  },
  {
    itemId: '79135777',
    itemName: 'Toner Cartridge',
    category: 'Supplies',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 100,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 60.00',
    status: 'Discontinued',
  },
  {
    itemId: '80246888',
    itemName: 'Paper Shredder',
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 5,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '91357999',
    itemName: 'Whiteboard',
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 10,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 80.00',
    status: 'Active',
  },
  {
    itemId: '12345678',
    itemName: 'Ergonomic Keyboard',
    category: 'Electronics',
    supplier: 'Tech Gadgets Inc.',
    itemLoc: 'Warehouse A',
    stock: 60,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 100.00',
    status: 'Active',
  },
  {
    itemId: '87654321',
    itemName: 'Gaming Mouse',
    category: 'Electronics',
    supplier: 'Tech Gadgets Inc.',
    itemLoc: 'Warehouse A',
    stock: 40,
    lastupdated: '',
    price: 'CHF 80.00',
    status: 'Active',
  },
  {
    itemId: '98765432',
    itemName: 'Bluetooth Speaker',
    category: 'Electronics',
    supplier: 'Audio Excellence Co.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '2025-01-20T14:00:00.000Z',
    price: 'CHF 120.00',
    status: 'Active',
  },
];
