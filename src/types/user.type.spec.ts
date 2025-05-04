import { User } from './user.type';

describe('User Type', () => {
  const createValidUser = (): User => ({
    itemId: '12345',
    createdDate: '2023-01-01T00:00:00Z',
    lastUpdatedDate: '2023-01-02T00:00:00Z',
    language: 'en',
    salutation: 'Mr.',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userName: 'johndoe',
    phoneNumber: '+1234567890',
    roles: ['user', 'admin'],
    active: true,
    isVarified: true,
    isMfaVerified: true,
    profileImageUrl: 'https://example.com/profile.jpg',
    lastLoggedInTime: '2023-01-03T00:00:00Z',
    mfaEnabled: true,
    userMfaType: 0,
  });

  test('should create a valid User object with all required fields', () => {
    const user = createValidUser();

    // Type checking
    expect(typeof user.itemId).toBe('string');
    expect(typeof user.createdDate).toBe('string');
    expect(typeof user.lastUpdatedDate).toBe('string');
    expect(typeof user.language).toBe('string');
    expect(typeof user.firstName).toBe('string');
    expect(typeof user.lastName).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.userName).toBe('string');
    expect(Array.isArray(user.roles)).toBe(true);
    expect(typeof user.active).toBe('boolean');
    expect(typeof user.isVarified).toBe('boolean');
    expect(typeof user.profileImageUrl).toBe('string');
    expect(typeof user.lastLoggedInTime).toBe('string');
    expect(typeof user.mfaEnabled).toBe('boolean');
    expect(typeof user.userMfaType).toBe('number');

    // Check that all properties exist
    expect(user).toHaveProperty('itemId');
    expect(user).toHaveProperty('createdDate');
    expect(user).toHaveProperty('lastUpdatedDate');
    expect(user).toHaveProperty('language');
    expect(user).toHaveProperty('salutation');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('userName');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('roles');
    expect(user).toHaveProperty('active');
    expect(user).toHaveProperty('isVarified');
    expect(user).toHaveProperty('profileImageUrl');
    expect(user).toHaveProperty('lastLoggedInTime');
    expect(user).toHaveProperty('mfaEnabled');
    expect(user).toHaveProperty('userMfaType');
  });

  test('should handle nullable fields correctly', () => {
    const user = createValidUser();

    const userWithNulls: User = {
      ...user,
      salutation: null,
      phoneNumber: null,
    };

    expect(userWithNulls.salutation).toBeNull();
    expect(userWithNulls.phoneNumber).toBeNull();
  });

  test('should validate email format', () => {
    const user = createValidUser();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(user.email).toMatch(emailRegex);
  });

  test('should validate roles as non-empty array of strings', () => {
    const user = createValidUser();

    expect(Array.isArray(user.roles)).toBe(true);
    expect(user.roles.length).toBeGreaterThan(0);
    user.roles.forEach((role) => {
      expect(typeof role).toBe('string');
    });
  });

  test('should handle different language codes', () => {
    const user = createValidUser();

    const userWithFrenchLanguage: User = {
      ...user,
      language: 'fr',
    };

    expect(userWithFrenchLanguage.language).toBe('fr');
  });

  test('should handle date strings in ISO format', () => {
    const user = createValidUser();

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z?$/;

    expect(user.createdDate).toMatch(isoDateRegex);
    expect(user.lastUpdatedDate).toMatch(isoDateRegex);
    expect(user.lastLoggedInTime).toMatch(isoDateRegex);

    expect(() => new Date(user.createdDate)).not.toThrow();
    expect(() => new Date(user.lastUpdatedDate)).not.toThrow();
    expect(() => new Date(user.lastLoggedInTime)).not.toThrow();
  });

  test('should work with active and inactive users', () => {
    const user = createValidUser();

    const inactiveUser: User = {
      ...user,
      active: false,
    };

    expect(user.active).toBe(true);
    expect(inactiveUser.active).toBe(false);
  });

  test('should work with verified and unverified users', () => {
    const user = createValidUser();

    const unverifiedUser: User = {
      ...user,
      isVarified: false,
    };

    expect(user.isVarified).toBe(true);
    expect(unverifiedUser.isVarified).toBe(false);
  });

  test('should validate profile image URL', () => {
    const user = createValidUser();

    const urlRegex = /^https?:\/\/\S+$/;
    expect(user.profileImageUrl).toMatch(urlRegex);
  });

  test('should handle multiple roles', () => {
    const user = createValidUser();

    const multiRoleUser: User = {
      ...user,
      roles: ['user', 'admin', 'moderator', 'support'],
    };

    expect(multiRoleUser.roles).toHaveLength(4);
    expect(multiRoleUser.roles).toContain('user');
    expect(multiRoleUser.roles).toContain('admin');
    expect(multiRoleUser.roles).toContain('moderator');
    expect(multiRoleUser.roles).toContain('support');
  });

  test('should handle user transformation', () => {
    const user = createValidUser();

    const transformedUser = {
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
    };

    expect(transformedUser.displayName).toBe('John Doe');
  });

  test('should validate usernames contain no spaces', () => {
    const user = createValidUser();

    expect(user.userName).not.toMatch(/\s/);
  });

  test('should work with mfaEnabled and mfaDisabled user', () => {
    const user = createValidUser();

    const mfaDisabledUser: User = {
      ...user,
      mfaEnabled: false,
    };

    expect(user.mfaEnabled).toBe(true);
    expect(mfaDisabledUser.mfaEnabled).toBe(false);
  });

  test('should validate userMfaType property for different MFA settings', () => {
    const user = createValidUser();

    expect(user.userMfaType).toBe(0);
    const userWithAppMfa = { ...user, userMfaType: 1 };
    expect(userWithAppMfa.userMfaType).toBe(1);
    const userWithEmailMfa = { ...user, userMfaType: 2 };
    expect(userWithEmailMfa.userMfaType).toBe(2);
  });
});
