import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

// Shared test utilities with mocks and helpers
import {
  expectErrorPageStructure,
  expectErrorPageImage,
  expectErrorPageTextContent,
  expectErrorPageButton,
  expectErrorPageAccessibility,
  expectErrorPageLayoutStructure,
  expectTextElements,
  createMockIcon,
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

// Test constants - only component-specific data
const TEST_DATA = {
  title: 'PAGE_TEMPORARILY_UNAVAILABLE',
  description: 'SCHEDULED_MAINTENANCE_IN_PROGRESS',
  buttonText: 'RELOAD_PAGE',
  imageSrc: '/mock-unavailable-image.svg',
  imageAlt: 'error state',
  iconTestId: 'refresh-icon',
  iconTitle: 'Refresh',
} as const;

// Helper function
const renderComponent = () => render(<ServiceUnavailable />);

describe('ServiceUnavailable Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing and have correct structure', () => {
      renderComponent();
      expectErrorPageStructure(TEST_DATA.title);
    });
  });

  describe('Image Section', () => {
    it('should render the unavailable image correctly', () => {
      renderComponent();
      expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
    });
  });

  describe('Text Content', () => {
    it('should render title and description with correct styling', () => {
      renderComponent();
      expectErrorPageTextContent(TEST_DATA.title, TEST_DATA.description);
    });
  });

  describe('Button Section', () => {
    it('should render button with refresh icon', () => {
      renderComponent();
      expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
    });
  });

  describe('Translation Integration', () => {
    it('should use translation keys for all text content', () => {
      renderComponent();
      expectTextElements([TEST_DATA.title, TEST_DATA.description, TEST_DATA.buttonText]);
    });
  });

  describe('Accessibility', () => {
    it('should meet accessibility requirements', () => {
      renderComponent();
      expectErrorPageAccessibility(
        TEST_DATA.title,
        TEST_DATA.imageAlt,
        TEST_DATA.buttonText,
        TEST_DATA.iconTitle
      );
    });
  });

  describe('Layout Structure', () => {
    it('should have correct layout structure', () => {
      renderComponent();
      expectErrorPageLayoutStructure(
        TEST_DATA.title,
        TEST_DATA.description,
        TEST_DATA.buttonText,
        TEST_DATA.imageAlt
      );
    });
  });

  describe('Component-Specific Features', () => {
    it('should display maintenance-related messaging', () => {
      renderComponent();
      expectTextElements([TEST_DATA.title, TEST_DATA.description]);
    });

    it('should use refresh icon instead of arrow icon', () => {
      renderComponent();
      expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
    });

    it('should use unavailable image with correct attributes', () => {
      renderComponent();
      expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
    });

    it('should have reload-focused button text', () => {
      renderComponent();
      expectErrorPageButton(TEST_DATA.buttonText);
    });
  });

  describe('Semantic Differences from NotFound', () => {
    it('should convey temporary unavailability vs permanent not found', () => {
      renderComponent();
      expectTextElements([
        'PAGE_TEMPORARILY_UNAVAILABLE',
        'SCHEDULED_MAINTENANCE_IN_PROGRESS',
      ]);
    });

    it('should suggest reload action vs navigation action', () => {
      renderComponent();
      expectErrorPageButton('RELOAD_PAGE');
    });
  });
});
