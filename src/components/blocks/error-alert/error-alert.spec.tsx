import { render, screen, act } from '@testing-library/react';
import ErrorAlert from './error-alert';

jest.mock('lucide-react', () => ({
  TriangleAlert: jest.fn(() => <svg data-testid="triangle-alert-icon" />),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      switch (key) {
        case 'ERROR':
          return 'Error';
        case 'AN_ERROR_OCCURRED.':
          return 'An error occurred.';
        case 'Custom Error':
          return 'Custom Error';
        case 'This is a custom error message.':
          return 'This is a custom error message.';
        default:
          return key;
      }
    },
  }),
}));

describe('ErrorAlert Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the component when isError is true', () => {
    render(<ErrorAlert isError={true} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred.')).toBeInTheDocument();
    expect(screen.getByTestId('triangle-alert-icon')).toBeInTheDocument();
  });

  it('should hide the component after 5 seconds', () => {
    render(<ErrorAlert isError={true} />);

    expect(screen.getByText('Error')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('should use default props when no custom props are provided', () => {
    render(<ErrorAlert isError={true} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred.')).toBeInTheDocument();
    expect(screen.getByTestId('triangle-alert-icon')).toBeInTheDocument();
  });

  it('should use custom props when provided', () => {
    const customTitle = 'Custom Error';
    const customMessage = 'This is a custom error message.';

    render(<ErrorAlert isError={true} title={customTitle} message={customMessage} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should not render the component when isError is false', () => {
    render(<ErrorAlert isError={false} />);

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
    expect(screen.queryByText('An error occurred.')).not.toBeInTheDocument();
  });
});
