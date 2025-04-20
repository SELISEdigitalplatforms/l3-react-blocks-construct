import { Task, taskSchema } from './schema';

describe('taskSchema', () => {
  it('should validate a valid task object', () => {
    const validTask: Task = {
      id: '1',
      title: 'Complete project',
      status: 'In Progress',
      label: 'Feature',
      priority: 'High',
    };

    // Parse the valid task object
    const result = taskSchema.safeParse(validTask);

    // Assert that the validation is successful
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validTask);
    }
  });

  it('should fail validation for an invalid task object (missing required fields)', () => {
    const invalidTask = {
      id: '1',
      title: 'Complete project',
      // Missing status, label, and priority
    };

    // Parse the invalid task object
    const result = taskSchema.safeParse(invalidTask);

    // Assert that the validation fails
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('should fail validation for an invalid task object (incorrect types)', () => {
    const invalidTask = {
      id: 123, // Incorrect type (should be string)
      title: 'Complete project',
      status: 'In Progress',
      label: 'Feature',
      priority: 'High',
    };

    // Parse the invalid task object
    const result = taskSchema.safeParse(invalidTask);

    // Assert that the validation fails
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});
