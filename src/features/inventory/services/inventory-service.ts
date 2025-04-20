import DesktopImage1 from 'assets/images/desktop_1.webp';
import DesktopImage2 from 'assets/images/desktop_2.webp';
import DesktopImage3 from 'assets/images/desktop_3.webp';
import CoffeePods from 'assets/images/inventory/coffee_pod.webp';
import MonitorArm from 'assets/images/inventory/monitor_arm.webp';
import NoiseCancelling from 'assets/images/inventory/noise_cancelling.webp';
import WirelessMouse from 'assets/images/inventory/wireless_mouse.webp';
import OfficeChair from 'assets/images/inventory/office_chair.webp';
import SmartWatch from 'assets/images/inventory/smart_watch.webp';
import StandingDesk from 'assets/images/inventory/standing_desk.webp';
import Sneaker from 'assets/images/inventory/sneaker.webp';
import UsbCHub from 'assets/images/inventory/usb_c_hub.webp';

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
    itemImage: CoffeePods,
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
    itemImage: MonitorArm,
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
    itemImage: WirelessMouse,
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
    itemImage: NoiseCancelling,
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
    itemImage: OfficeChair,
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
    itemImage: SmartWatch,
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
    itemImage: StandingDesk,
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
    itemImage: Sneaker,
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
    itemImage: UsbCHub,
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
    itemName: 'Coffee Pods (Pack)',
    itemImage: CoffeePods,
    category: 'Supplies',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 25,
    lastupdated: '2025-03-02T14:00:00.000Z', // March date
    price: 'CHF 1200.00',
    status: 'Discontinued',
  },
  {
    itemId: '54321098',
    itemName: 'Monitor Arm',
    itemImage: MonitorArm,
    category: 'Accessories',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 50,
    lastupdated: '2025-01-30T14:00:00.000Z', // January date
    price: 'CHF 75.00',
    status: 'Active',
  },
  {
    itemId: '13579111',
    itemName: 'Wireless Mouse',
    itemImage: WirelessMouse,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 75,
    lastupdated: '2025-02-10T14:00:00.000Z', // February date
    price: 'CHF 15.00',
    status: 'Active',
  },
  {
    itemId: '24680222',
    itemName: 'Urban Explorer Sneakers',
    itemImage: Sneaker,
    category: 'Apparel',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '', // No date
    price: 'CHF 100.00',
    status: 'Active',
  },
  {
    itemId: '35791333',
    itemName: 'Standing Desk',
    itemImage: StandingDesk,
    category: 'Furniture',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 40,
    lastupdated: '2025-02-05T14:00:00.000Z', // February date
    price: 'CHF 120.00',
    status: 'Active',
  },
  {
    itemId: '46802444',
    itemName: 'Standing Desk',
    itemImage: StandingDesk,
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
    itemName: 'USB-C Hub',
    itemImage: UsbCHub,
    category: 'Electronics',
    supplier: 'Office Essentials Ltd.',
    itemLoc: 'Warehouse B',
    stock: 20,
    lastupdated: '2025-01-25T14:00:00.000Z', // January date
    price: 'CHF 150.00',
    status: 'Discontinued',
  },
  {
    itemId: '91357999',
    itemName: 'Office Chair',
    itemImage: OfficeChair,
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
    itemName: 'Monitor',
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
    itemName: 'Coffee Pods (Pack)',
    itemImage: CoffeePods,
    category: 'Supplies',
    supplier: 'Tech Gadgets Inc.',
    itemLoc: 'Warehouse A',
    stock: 40,
    lastupdated: '2025-03-08T14:00:00.000Z', // March date
    price: 'CHF 80.00',
    status: 'Active',
  },
  {
    itemId: '98765432',
    itemName: 'USB-C Hub',
    itemImage: UsbCHub,
    category: 'Electronics',
    supplier: 'Audio Excellence Co.',
    itemLoc: 'Warehouse B',
    stock: 30,
    lastupdated: '2025-02-28T14:00:00.000Z', // February date
    price: 'CHF 120.00',
    status: 'Active',
  },
];

export const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'apparel', label: 'Apparel' },
];
