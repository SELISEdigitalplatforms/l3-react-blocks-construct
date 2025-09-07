import { render, screen, fireEvent } from '@testing-library/react';
import { Profile } from './profile';
import { GeneralInfo, DevicesTable } from 'features/core/profile';

jest.mock('features/core/profile', () => ({
  GeneralInfo: jest.fn(() => <div data-testid="general-info">General Info Content</div>),
  DevicesTable: jest.fn(() => <div data-testid="devices-table">Devices Table Content</div>),
}));

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile header', () => {
    render(<Profile />);
    expect(screen.getByText('MY_PROFILE')).toBeInTheDocument();
  });

  test('renders tabs', () => {
    render(<Profile />);
    expect(screen.getByText('GENERAL_INFO')).toBeInTheDocument();
    expect(screen.getByText('DEVICES')).toBeInTheDocument();
  });

  test('shows GeneralInfo tab by default', () => {
    render(<Profile />);
    expect(GeneralInfo).toHaveBeenCalled();
    expect(DevicesTable).not.toHaveBeenCalled();
    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });

  test('switches to Devices tab when clicked', () => {
    render(<Profile />);
    const devicesTab = screen.getByText('DEVICES');

    fireEvent.click(devicesTab);

    expect(DevicesTable).toHaveBeenCalled();
    expect(screen.getByTestId('devices-table')).toBeInTheDocument();
    expect(screen.queryByTestId('general-info')).not.toBeInTheDocument();
  });

  test('switches back to GeneralInfo tab when clicked', () => {
    render(<Profile />);

    const devicesTab = screen.getByText('DEVICES');
    fireEvent.click(devicesTab);

    const generalInfoTab = screen.getByText('GENERAL_INFO');
    fireEvent.click(generalInfoTab);

    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });
});
