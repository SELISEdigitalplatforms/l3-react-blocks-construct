import { ActivityGroup, Module } from '../types/activity-log.types';

// Shared activity items (de-duplicated)
const shared = {
  finalizeBudget: {
    category: 'Task manager',
    description: 'User Adrian Müller completed the task "Finalize Q1 Budget"',
  },
  reviewMeeting: {
    category: 'Calendar',
    description: 'Created an event: "Quarterly Review Meeting" (2025-03-10)',
  },
  addSteelBeams: {
    category: 'Inventory',
    description: 'Added a new inventory item: "Steel Beams - 50 units"',
  },
  emailFromAdrian: {
    category: 'Mail',
    description: 'New email from Adrian Müller (adrian-muller@gmail.com)',
  },
  refreshDashboard: {
    category: 'Dashboard',
    description: 'System auto-refreshed dashboard analytics.',
  },
  overdueCompliance: {
    category: 'Task manager',
    description: 'System marked overdue task "Submit Compliance Docs"',
  },
  rescheduleStandup: {
    category: 'Calendar',
    description: 'User Ethan Gold rescheduled "Team Standup" from 9:00 AM to 10:00 AM',
  },
  enableMFA: {
    category: 'IAM',
    description: 'Enabled MFA for 3 users',
  },
  deleteAdhesives: {
    category: 'Inventory',
    description: 'Deleted item "Adhesives" from inventory',
  },
  deleteVendorTask: {
    category: 'Task manager',
    description: 'Deleted task "Follow-up on Vendor Contract"',
  },
};

// Final de-duplicated array
export const activitiesData: ActivityGroup[] = [
  {
    date: '2025-03-24T00:00:00Z',
    items: [
      { time: '2025-03-24T08:10:00Z', ...shared.finalizeBudget },
      { time: '2025-03-24T08:11:00Z', ...shared.reviewMeeting },
      { time: '2025-03-24T08:12:00Z', ...shared.addSteelBeams },
      { time: '2025-03-24T08:13:00Z', ...shared.emailFromAdrian },
      { time: '2025-03-24T08:14:00Z', ...shared.refreshDashboard },
    ],
  },
  {
    date: '2025-03-23T00:00:00Z',
    items: [
      { time: '2025-03-23T08:15:00Z', ...shared.overdueCompliance },
      { time: '2025-03-23T08:16:00Z', ...shared.rescheduleStandup },
      { time: '2025-03-23T08:17:00Z', ...shared.enableMFA },
      { time: '2025-03-23T08:18:00Z', ...shared.refreshDashboard },
    ],
  },
  {
    date: '2025-03-10T00:00:00Z',
    items: [
      { time: '2025-03-10T09:00:00Z', ...shared.deleteAdhesives },
      { time: '2025-03-10T09:01:00Z', ...shared.deleteVendorTask },
      { time: '2025-03-10T09:02:00Z', ...shared.refreshDashboard },
    ],
  },
  {
    date: '2025-03-09T00:00:00Z',
    items: [
      { time: '2025-03-09T09:10:00Z', ...shared.finalizeBudget },
      { time: '2025-03-09T09:11:00Z', ...shared.reviewMeeting },
      { time: '2025-03-09T09:12:00Z', ...shared.addSteelBeams },
    ],
  },
  {
    date: '2025-03-08T00:00:00Z',
    items: [
      { time: '2025-03-08T09:15:00Z', ...shared.overdueCompliance },
      { time: '2025-03-08T09:16:00Z', ...shared.rescheduleStandup },
      { time: '2025-03-08T09:17:00Z', ...shared.enableMFA },
    ],
  },
  {
    date: '2025-03-07T00:00:00Z',
    items: [{ time: '2025-03-07T10:00:00Z', ...shared.deleteAdhesives }],
  },
  {
    date: '2025-03-06T00:00:00Z',
    items: [{ time: '2025-03-06T10:10:00Z', ...shared.reviewMeeting }],
  },
];

export const availableModulesData: Module[] = [
  { id: 'task_manager', label: 'TASK_MANAGER' },
  { id: 'calendar', label: 'CALENDAR' },
  { id: 'mail', label: 'MAIL' },
  { id: 'iam', label: 'IAM' },
  { id: 'inventory', label: 'INVENTORY' },
  { id: 'dashboard', label: 'DASHBOARD' },
];
