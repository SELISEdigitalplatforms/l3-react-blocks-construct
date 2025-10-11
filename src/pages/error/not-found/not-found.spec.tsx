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
const renderComponent = () => render(<NotFound />);

// Create and execute the test suite using shared factory
const testSuite = createErrorPageTestSuite('NotFound', TEST_DATA, renderComponent, {
  specificFeatures: [
    {
      name: 'should display not found messaging',
      test: () => {
        renderComponent();
        expectTextElements([TEST_DATA.title, TEST_DATA.description]);
      },
    },
    {
      name: 'should use arrow right icon instead of refresh icon',
      test: () => {
        renderComponent();
        expectErrorPageButton(TEST_DATA.buttonText, TEST_DATA.iconTestId);
      },
    },
    {
      name: 'should use not found image with correct attributes',
      test: () => {
        renderComponent();
        expectErrorPageImage(TEST_DATA.imageAlt, TEST_DATA.imageSrc);
      },
    },
    {
      name: 'should have navigation-focused button text',
      test: () => {
        renderComponent();
        expectErrorPageButton(TEST_DATA.buttonText);
      },
    },
  ],
  semanticDifferences: [
    {
      name: 'should convey permanent not found vs temporary unavailability',
      test: () => {
        renderComponent();
        expectTextElements([
          'COULDNT_FIND_WHAT_YOU_LOOKING_FOR',
          'PAGE_MAY_MOVED_NO_LONGER_EXISTS',
        ]);
      },
    },
    {
      name: 'should use navigation action instead of reload action',
      test: () => {
        renderComponent();
        expectErrorPageButton('TAKE_ME_BACK', 'arrow-right-icon');
      },
    },
  ],
});

// Execute the test suite
testSuite();
