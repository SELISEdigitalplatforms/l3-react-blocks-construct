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

import { NotFound } from './not-found';

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
  ArrowRight: createMockIcon('arrow-right-icon', 'Arrow Right'),
}));

// Mock the not found image
vi.mock('@/assets/images/not_found.svg', () => ({
  default: '/mock-not-found-image.svg',
}));

// Test constants - only component-specific data
const TEST_DATA = {
  title: 'COULDNT_FIND_WHAT_YOU_LOOKING_FOR',
  description: 'PAGE_MAY_MOVED_NO_LONGER_EXISTS',
  buttonText: 'TAKE_ME_BACK',
  imageSrc: '/mock-not-found-image.svg',
  imageAlt: 'error state',
  iconTestId: 'arrow-right-icon',
  iconTitle: 'Arrow Right',
} as const;

// Helper function
const renderComponent = () => render(<NotFound />);

describe('NotFound Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing and have correct structure', () => {
      renderComponent();
      expectErrorPageStructure(TEST_DATA.title);
    });
  });

  describe('Image Section', () => {
    it('should render the not found image correctly', () => {
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
    it('should render button with arrow right icon', () => {
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
    it('should display not found messaging', () => {
      renderComponent();
      expectTextElements([TEST_DATA.title, TEST_DATA.description]);
    });

    it('should use arrow right icon instead of refresh icon', () => {
      renderComponent();
      expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
    });

    it('should use not found image with correct attributes', () => {
      renderComponent();
      expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
    });

    it('should have navigation-focused button text', () => {
      renderComponent();
      expectErrorPageButton(TEST_DATA.buttonText);
    });
  });

  describe('Semantic Differences from ServiceUnavailable', () => {
    it('should convey permanent not found vs temporary unavailability', () => {
      renderComponent();
      expectTextElements([
        'COULDNT_FIND_WHAT_YOU_LOOKING_FOR',
        'PAGE_MAY_MOVED_NO_LONGER_EXISTS',
      ]);
    });

    it('should suggest navigation action vs reload action', () => {
      renderComponent();
      expectErrorPageButton('TAKE_ME_BACK');
    });
  });
});
