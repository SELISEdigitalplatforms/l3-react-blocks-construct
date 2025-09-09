import { renderHook } from '@testing-library/react';
import { useGetUsersQuery } from './use-iam';
import { useGlobalQuery } from 'state/query-client/hooks';

jest.mock('state/query-client/hooks', () => ({
  useGlobalQuery: jest.fn(),
}));

jest.mock('../services/user-service', () => ({
  getUsers: jest.fn(),
}));

describe('useGetUsersQuery', () => {
  const mockUseGlobalQuery = useGlobalQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useGlobalQuery with correct parameters', () => {
    const payload = {
      page: 1,
      pageSize: 10,
      filter: {
        email: 'test@example.com',
        name: 'John',
      },
    };

    const mockQueryResult = {
      data: undefined,
      isLoading: true,
      error: null,
    };

    mockUseGlobalQuery.mockReturnValue(mockQueryResult);

    renderHook(() => useGetUsersQuery(payload));

    expect(mockUseGlobalQuery).toHaveBeenCalledWith({
      queryKey: ['getUsers', payload.page, payload.pageSize, payload.filter],
      queryFn: expect.any(Function),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      placeholderData: expect.any(Function),
    });
  });

  it('should handle successful data fetching', async () => {
    const payload = {
      page: 1,
      pageSize: 10,
    };

    const mockData = {
      data: [
        {
          itemId: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
          roles: ['user'],
          permissions: ['read'],
          active: true,
          isVarified: true,
          language: 'en',
          createdDate: '2024-02-19T10:00:00Z',
          lastUpdatedDate: '2024-02-19T10:00:00Z',
          lastLoggedInTime: '2024-02-19T09:00:00Z',
          salutation: 'Mr',
          phoneNumber: null,
          profileImageUrl: null,
          mfaEnabled: false,
        },
      ],
      totalCount: 1,
    };

    mockUseGlobalQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useGetUsersQuery(payload));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle error states', () => {
    const payload = {
      page: 1,
      pageSize: 10,
    };

    // Create error state
    const errorState = {
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch users'),
      isError: true,
    };

    // Simply return the error state
    mockUseGlobalQuery.mockReturnValue(errorState);

    const { result } = renderHook(() => useGetUsersQuery(payload));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('should use placeholder data from previous query', () => {
    const payload = {
      page: 1,
      pageSize: 10,
    };

    const previousData = {
      data: [
        {
          itemId: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
          roles: ['user'],
          permissions: ['read'],
          active: true,
          isVarified: true,
          language: 'en',
          createdDate: '2024-02-19T10:00:00Z',
          lastUpdatedDate: '2024-02-19T10:00:00Z',
          lastLoggedInTime: '2024-02-19T09:00:00Z',
          salutation: 'Mr',
          phoneNumber: null,
          profileImageUrl: null,
          mfaEnabled: false,
        },
      ],
      totalCount: 1,
    };

    // Mock the query hook to return the placeholder data
    mockUseGlobalQuery.mockImplementation(({ placeholderData }) => ({
      data: placeholderData(previousData),
      isLoading: true,
      error: null,
    }));

    const { result } = renderHook(() => useGetUsersQuery(payload));

    expect(result.current.data).toEqual(previousData);
  });
});
