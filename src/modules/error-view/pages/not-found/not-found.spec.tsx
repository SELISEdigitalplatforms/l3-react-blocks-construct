import { render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  createErrorPageTestSuite,
  ErrorPageTestData,
  expectErrorPageButton,
  expectErrorPageImage,
  expectTextElements,
} from '@/test-utils/shared-test-utils';
import { NotFoundPage } from './not-found';

// Mock UI Button component
vi.mock('@/components/ui-kit/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button data-testid="button" className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons (inline to avoid hoisting issues)
vi.mock('lucide-react', () => {
  const ArrowRight = ({ className }: any) => (
    <svg data-testid="arrow-right-icon" className={className}>
      <title>Arrow Right</title>
    </svg>
  );
  ArrowRight.displayName = 'MockIcon_arrow-right-icon';
  return { ArrowRight };
});

// Mock the not found image
vi.mock('@/assets/images/not_found.svg', () => ({
  default: '/mock-not-found-image.svg',
}));

// Test data - only component-specific data
const TEST_DATA: ErrorPageTestData = {
  title: 'COULDNT_FIND_WHAT_YOU_LOOKING_FOR',
  description: 'PAGE_MAY_MOVED_NO_LONGER_EXISTS',
  buttonText: 'TAKE_ME_BACK',
  imageSrc: '/mock-not-found-image.svg',
  imageAlt: 'error state',
  iconTestId: 'arrow-right-icon',
  iconTitle: 'Arrow Right',
};

// Render helper
const renderComponent = () => render(<NotFoundPage />);

// Helper functions to reduce code duplication
const expectNotFoundMessaging = () => {
  expectTextElements([TEST_DATA.title, TEST_DATA.description]);
};

const expectArrowRightIconAndButton = () => {
  expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
};

const expectNotFoundImageAttributes = () => {
  expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
};

const expectNavigationFocusedButton = () => {
  expectErrorPageButton(TEST_DATA.buttonText);
};

const expectPermanentNotFoundMessaging = () => {
  expectTextElements(['COULDNT_FIND_WHAT_YOU_LOOKING_FOR', 'PAGE_MAY_MOVED_NO_LONGER_EXISTS']);
};

const expectNavigationActionInsteadOfReload = () => {
  expectErrorPageButton('TAKE_ME_BACK', 'arrow-right-icon');
};

// Create and execute the test suite using shared factory
const testSuite = createErrorPageTestSuite('NotFound', TEST_DATA, renderComponent, {
  specificFeatures: [
    {
      name: 'should display not found messaging',
      test: () => {
        renderComponent();
        expectNotFoundMessaging();
      },
    },
    {
      name: 'should use arrow right icon instead of refresh icon',
      test: () => {
        renderComponent();
        expectArrowRightIconAndButton();
      },
    },
    {
      name: 'should use not found image with correct attributes',
      test: () => {
        renderComponent();
        expectNotFoundImageAttributes();
      },
    },
    {
      name: 'should have navigation-focused button text',
      test: () => {
        renderComponent();
        expectNavigationFocusedButton();
      },
    },
  ],
  semanticDifferences: [
    {
      name: 'should convey permanent not found vs temporary unavailability',
      test: () => {
        renderComponent();
        expectPermanentNotFoundMessaging();
      },
    },
    {
      name: 'should use navigation action instead of reload action',
      test: () => {
        renderComponent();
        expectNavigationActionInsteadOfReload();
      },
    },
  ],
});

// Execute the test suite
testSuite();
