import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Profile } from './profile';
import { GeneralInfo } from 'features/profile';
import { DevicesTable } from 'features/profile';

jest.mock('features/profile', () => ({
  GeneralInfo: jest.fn(() => <div data-testid="general-info">General Info Content</div>),
  DevicesTable: jest.fn(() => <div data-testid="devices-table">Devices Table Content</div>),
}));

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile header', () => {
    render(<Profile />);
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  test('renders tabs', () => {
    render(<Profile />);
    expect(screen.getByText('General info')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
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
    const devicesTab = screen.getByText('Devices');

    fireEvent.click(devicesTab);

    expect(DevicesTable).toHaveBeenCalled();
    expect(screen.getByTestId('devices-table')).toBeInTheDocument();
    expect(screen.queryByTestId('general-info')).not.toBeInTheDocument();
  });

  test('switches back to GeneralInfo tab when clicked', () => {
    render(<Profile />);

    const devicesTab = screen.getByText('Devices');
    fireEvent.click(devicesTab);

    const generalInfoTab = screen.getByText('General info');
    fireEvent.click(generalInfoTab);

    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });
});
