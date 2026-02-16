import { render, screen, fireEvent } from '@testing-library/react';
import { AddUser } from './add-profile';
import { useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { vi } from 'vitest';
import { useCreateAccount } from '@/modules/profile/hooks/use-account';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/modules/profile/hooks/use-account', () => ({
  useCreateAccount: vi.fn(),
  ACCOUNT_QUERY_KEY: ['account'],
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

describe('AddUser Component', () => {
  const mockOnClose = vi.fn();
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn().mockResolvedValue(null);
  const mockRefetchQueries = vi.fn().mockResolvedValue(null);

  const renderWithDialog = () => {
    return render(
      <Dialog.Root open={true}>
        <AddUser onClose={mockOnClose} />
      </Dialog.Root>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useCreateAccount as any).mockReturnValue({
      mutate: mockMutate,
    });

    (useQueryClient as any).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      refetchQueries: mockRefetchQueries,
    });

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  it('renders AddUser component correctly', () => {
    renderWithDialog();

    expect(screen.getByText('ADD_USER')).toBeInTheDocument();
    expect(screen.getByText('ADD_USER_DESCRIPTION')).toBeInTheDocument();

    expect(screen.getByText('FIRST_NAME*')).toBeInTheDocument();
    expect(screen.getByText('LAST_NAME*')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'INVITE_USER' })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    renderWithDialog();

    fireEvent.click(screen.getByRole('button', { name: 'CANCEL' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
