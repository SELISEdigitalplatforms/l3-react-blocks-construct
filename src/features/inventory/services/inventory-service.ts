import DesktopImage1 from 'assets/images/desktop_1.png';
import DesktopImage2 from 'assets/images/desktop_2.webp';
import DesktopImage3 from 'assets/images/desktop_3.webp';

export interface InventoryData {
  itemId: string;
  itemName: string;
  itemImage: string;
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

export const images = [DesktopImage1, DesktopImage2, DesktopImage3];

export const tags = ['Accessories', 'Electronic', 'Gaming', 'Monitor'];
export const checkedTags = tags.filter((tag) => ['Electronic', 'Gaming', 'Monitor'].includes(tag));

export const categoryOptions = [
  'Supplies',
  'Electronics',
  'Furniture',
  'Apparel',
  'Accessories',
  'Wearables',
];
export const locationOptions = ['Warehouse A', 'Warehouse B'];

export const inventoryData: InventoryData[] = [
  {
    itemId: '58944167',
    itemName: 'Coffee Pods (Pack)',
    itemImage: DesktopImage2,
    category: 'Supplies',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 200,
    lastupdated: '2025-02-19T14:00:00.000Z', // Today's date
    price: 'CHF 20.00',
    status: 'Active',
  },
  {
    itemId: '12289160',
    itemName: 'Monitor',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 30,
    lastupdated: '2025-01-10T14:00:00.000Z', // January date
    price: 'CHF 250.00',
    status: 'Active',
  },
  {
    itemId: '28391730',
    itemName: 'Monitor Arm',
    itemImage: DesktopImage2,
    category: 'Accessories',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 15,
    lastupdated: '', // No date
    price: 'CHF 75.00',
    status: 'Discontinued',
  },
  {
    itemId: '71029237',
    itemName: 'Wireless Mouse',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 33,
    lastupdated: '2025-03-05T14:00:00.000Z', // March date
    price: 'CHF 25.00',
    status: 'Active',
  },
  {
    itemId: '45379810',
    itemName: 'Noise-Canceling Headphones',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 12,
    lastupdated: '2025-02-01T14:00:00.000Z', // February date
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '86573219',
    itemName: 'Office Chair',
    itemImage: DesktopImage2,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 68,
    lastupdated: '', // No date
    price: 'CHF 200.00',
    status: 'Discontinued',
  },
  {
    itemId: '64205138',
    itemName: 'Smartwatch',
    itemImage: DesktopImage2,
    category: 'Wearables',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 80,
    lastupdated: '2025-02-25T14:00:00.000Z', // February date
    price: 'CHF 300.00',
    status: 'Active',
  },
  {
    itemId: '12985703',
    itemName: 'Standing Desk',
    itemImage: DesktopImage2,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 14,
    lastupdated: '2025-01-15T14:00:00.000Z', // January date
    price: 'CHF 400.00',
    status: 'Active',
  },
  {
    itemId: '73029846',
    itemName: 'Urban Explorer Sneakers',
    itemImage: DesktopImage2,
    category: 'Apparel',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 0,
    lastupdated: '2025-03-10T14:00:00.000Z', // March date
    price: 'CHF 100.00',
    status: 'Discontinued',
  },
  {
    itemId: '49821730',
    itemName: 'USB-C Hub',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse A',
    stock: 40,
    lastupdated: '', // No date
    price: 'CHF 40.00',
    status: 'Active',
  },
  {
    itemId: '98765432',
    itemName: 'Laptop',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 25,
    lastupdated: '2025-03-02T14:00:00.000Z', // March date
    price: 'CHF 1200.00',
    status: 'Discontinued',
  },
  {
    itemId: '54321098',
    itemName: 'Keyboard',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 50,
    lastupdated: '2025-01-30T14:00:00.000Z', // January date
    price: 'CHF 75.00',
    status: 'Active',
  },
  {
    itemId: '13579111',
    itemName: 'Mousepad',
    itemImage: DesktopImage2,
    category: 'Accessories',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 75,
    lastupdated: '2025-02-10T14:00:00.000Z', // February date
    price: 'CHF 15.00',
    status: 'Active',
  },
  {
    itemId: '24680222',
    itemName: 'Webcam',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '', // No date
    price: 'CHF 100.00',
    status: 'Active',
  },
  {
    itemId: '35791333',
    itemName: 'External Hard Drive',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 40,
    lastupdated: '2025-02-05T14:00:00.000Z', // February date
    price: 'CHF 120.00',
    status: 'Active',
  },
  {
    itemId: '46802444',
    itemName: 'Desk Lamp',
    itemImage: DesktopImage2,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 60,
    lastupdated: '2025-03-12T14:00:00.000Z', // March date
    price: 'CHF 50.00',
    status: 'Discontinued',
  },
  {
    itemId: '57913555',
    itemName: 'File Cabinet',
    itemImage: DesktopImage2,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 20,
    lastupdated: '2025-01-25T14:00:00.000Z', // January date
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '91357999',
    itemName: 'Whiteboard',
    itemImage: DesktopImage2,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 10,
    lastupdated: '', // No date
    price: 'CHF 80.00',
    status: 'Active',
  },
  {
    itemId: '12345678',
    itemName: 'Ergonomic Keyboard',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Tech Gadgets Inc.',
    itemLoc: 'Warehouse A',
    stock: 60,
    lastupdated: '2025-02-20T14:00:00.000Z', // February date
    price: 'CHF 100.00',
    status: 'Active',
  },
  {
    itemId: '87654321',
    itemName: 'Gaming Mouse',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Tech Gadgets Inc.',
    itemLoc: 'Warehouse A',
    stock: 40,
    lastupdated: '2025-03-08T14:00:00.000Z', // March date
    price: 'CHF 80.00',
    status: 'Active',
  },
  {
    itemId: '98765432',
    itemName: 'Bluetooth Speaker',
    itemImage: DesktopImage2,
    category: 'Electronics',
    supplier: 'Audio Excellence Co.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '2025-02-28T14:00:00.000Z', // February date
    price: 'CHF 120.00',
    status: 'Active',
  },
];
