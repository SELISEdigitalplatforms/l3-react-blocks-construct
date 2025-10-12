import { render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  createErrorPageTestSuite,
  createMockIcon,
  expectErrorPageButton,
  expectErrorPageImage,
  expectTextElements,
  type ErrorPageTestData,
} from '../../../test-utils/shared-test-utils';
import { ServiceUnavailable } from './service-unavailable';

// Mock UI Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button data-testid="button" className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons using shared utility
vi.mock('lucide-react', () => ({
  RefreshCcw: createMockIcon('refresh-icon', 'Refresh'),
}));

// Mock the unavailable image
vi.mock('@/assets/images/unavailable.svg', () => ({
  default: '/mock-unavailable-image.svg',
}));

// Test data - only component-specific data
const TEST_DATA: ErrorPageTestData = {
  title: 'PAGE_TEMPORARILY_UNAVAILABLE',
  description: 'SCHEDULED_MAINTENANCE_IN_PROGRESS',
  buttonText: 'RELOAD_PAGE',
  imageSrc: '/mock-unavailable-image.svg',
  imageAlt: 'error state',
  iconTestId: 'refresh-icon',
  iconTitle: 'Refresh',
};

// Render helper
const renderComponent = () => render(<ServiceUnavailable />);

// Helper functions to reduce code duplication
const expectMaintenanceMessaging = () => {
  expectTextElements([TEST_DATA.title, TEST_DATA.description]);
};

const expectRefreshIconAndButton = () => {
  expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
};

const expectUnavailableImageAttributes = () => {
  expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
};

const expectReloadFocusedButton = () => {
  expectErrorPageButton(TEST_DATA.buttonText);
};

const expectTemporaryUnavailabilityMessaging = () => {
  expectTextElements(['PAGE_TEMPORARILY_UNAVAILABLE', 'SCHEDULED_MAINTENANCE_IN_PROGRESS']);
};

const expectReloadActionInsteadOfNavigation = () => {
  expectErrorPageButton('RELOAD_PAGE', 'refresh-icon');
};

// Create and execute the test suite using shared factory
const testSuite = createErrorPageTestSuite('ServiceUnavailable', TEST_DATA, renderComponent, {
  specificFeatures: [
    {
      name: 'should display maintenance-related messaging',
      test: () => {
        renderComponent();
        expectMaintenanceMessaging();
      },
    },
    {
      name: 'should use refresh icon instead of arrow icon',
      test: () => {
        renderComponent();
        expectRefreshIconAndButton();
      },
    },
    {
      name: 'should use unavailable image with correct attributes',
      test: () => {
        renderComponent();
        expectUnavailableImageAttributes();
      },
    },
    {
      name: 'should have reload-focused button text',
      test: () => {
        renderComponent();
        expectReloadFocusedButton();
      },
    },
  ],
  semanticDifferences: [
    {
      name: 'should convey temporary unavailability vs permanent not found',
      test: () => {
        renderComponent();
        expectTemporaryUnavailabilityMessaging();
      },
    },
    {
      name: 'should use reload action instead of navigation action',
      test: () => {
        renderComponent();
        expectReloadActionInsteadOfNavigation();
      },
    },
  ],
});

// Execute the test suite
testSuite();
