import { ActivityGroup } from '../types/activity-log.types';

// Shared reusable items (centralized for deduplication)
const sharedActivities = {
  finalizeBudget: {
    category: 'Task manager',
    description: 'User Adrian Müller completed the task "Finalize Q1 Budget"',
  },
  quarterlyReview: {
    category: 'Calendar',
    description: 'Created an event: "Quarterly Review Meeting" (2025-03-10)',
  },
  steelBeamsAdded: {
    category: 'Inventory',
    description: 'Added a new inventory item: "Steel Beams - 50 units"',
  },
  emailFromAdrian: {
    category: 'Mail',
    description: 'New email from Adrian Müller (adrian-muller@gmail.com)',
  },
  dashboardRefreshed: {
    category: 'Dashboard',
    description: 'System auto-refreshed dashboard analytics.',
  },
  overdueTask: {
    category: 'Task manager',
    description: 'System marked overdue task "Submit Compliance Docs"',
  },
  standupRescheduled: {
    category: 'Calendar',
    description: 'User Ethan Gold rescheduled "Team Standup" from 9:00 AM to 10:00 AM',
  },
  mfaEnabled: {
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

export const timelineActivitiesData: ActivityGroup[] = [
  {
    date: '2025-03-24T00:00:00Z',
    items: [
      { time: '2025-03-24T08:00:00Z', ...sharedActivities.finalizeBudget },
      { time: '2025-03-24T08:01:00Z', ...sharedActivities.quarterlyReview },
      { time: '2025-03-24T08:02:00Z', ...sharedActivities.steelBeamsAdded },
      { time: '2025-03-24T08:03:00Z', ...sharedActivities.emailFromAdrian },
      { time: '2025-03-24T08:04:00Z', ...sharedActivities.dashboardRefreshed },
    ],
  },
  {
    date: '2025-03-23T00:00:00Z',
    items: [
      { time: '2025-03-23T08:10:00Z', ...sharedActivities.overdueTask },
      { time: '2025-03-23T08:11:00Z', ...sharedActivities.standupRescheduled },
      { time: '2025-03-23T08:12:00Z', ...sharedActivities.mfaEnabled },
      { time: '2025-03-23T08:13:00Z', ...sharedActivities.dashboardRefreshed },
    ],
  },
  {
    date: '2025-03-10T00:00:00Z',
    items: [
      { time: '2025-03-10T09:00:00Z', ...sharedActivities.deleteAdhesives },
      { time: '2025-03-10T09:01:00Z', ...sharedActivities.deleteVendorTask },
      { time: '2025-03-10T09:02:00Z', ...sharedActivities.dashboardRefreshed },
    ],
  },
  {
    date: '2025-03-09T00:00:00Z',
    items: [
      { time: '2025-03-09T09:10:00Z', ...sharedActivities.finalizeBudget },
      { time: '2025-03-09T09:11:00Z', ...sharedActivities.quarterlyReview },
      { time: '2025-03-09T09:12:00Z', ...sharedActivities.steelBeamsAdded },
    ],
  },
  {
    date: '2025-03-08T00:00:00Z',
    items: [
      { time: '2025-03-08T09:15:00Z', ...sharedActivities.overdueTask },
      { time: '2025-03-08T09:16:00Z', ...sharedActivities.standupRescheduled },
      { time: '2025-03-08T09:17:00Z', ...sharedActivities.mfaEnabled },
    ],
  },
  {
    date: '2025-03-07T00:00:00Z',
    items: [
      { time: '2025-03-07T09:20:00Z', ...sharedActivities.deleteAdhesives },
      { time: '2025-03-07T09:21:00Z', ...sharedActivities.deleteVendorTask },
    ],
  },
  {
    date: '2025-03-06T00:00:00Z',
    items: [
      { time: '2025-03-06T09:30:00Z', ...sharedActivities.finalizeBudget },
      { time: '2025-03-06T09:31:00Z', ...sharedActivities.quarterlyReview },
    ],
  },
];
