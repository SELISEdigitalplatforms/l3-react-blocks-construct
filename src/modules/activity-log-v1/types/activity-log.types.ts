export interface ActivityItem {
  time: string;
  category: string;
  description: string;
}

export interface ActivityGroup {
  date: string;
  items: ActivityItem[];
}

export type Module = {
  id: string;
  label: string;
};
