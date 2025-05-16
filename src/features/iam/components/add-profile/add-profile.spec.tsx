import { render, screen, fireEvent } from '@testing-library/react';
import { AddUser } from './add-profile';
import { useCreateAccount } from 'features/profile/hooks/use-account';
import { useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';

jest.mock('features/profile/hooks/use-account', () => ({
  useCreateAccount: jest.fn(),
  ACCOUNT_QUERY_KEY: ['account'],
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('AddUser Component', () => {
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn();
  const mockInvalidateQueries = jest.fn().mockResolvedValue(null);
  const mockRefetchQueries = jest.fn().mockResolvedValue(null);

  const renderWithDialog = () => {
    return render(
      <Dialog.Root open={true}>
        <AddUser onClose={mockOnClose} />
      </Dialog.Root>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useCreateAccount as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      refetchQueries: mockRefetchQueries,
    });

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  test('renders AddUser component correctly', () => {
    renderWithDialog();

    expect(screen.getByText('ADD_USER')).toBeInTheDocument();
    expect(screen.getByText('ADD_USER_DESCRIPTION')).toBeInTheDocument();

    expect(screen.getByText('FIRST_NAME*')).toBeInTheDocument();
    expect(screen.getByText('LAST_NAME*')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'INVITE_USER' })).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    renderWithDialog();

    fireEvent.click(screen.getByRole('button', { name: 'CANCEL' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
