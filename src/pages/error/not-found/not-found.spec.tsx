import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// react-i18next and button mocks provided by shared test-utils
import '../../../test-utils/shared-test-utils';

import { NotFound } from './not-found';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowRight: ({ className }: any) => (
    <svg data-testid="arrow-right-icon" className={className}>
      <title>Arrow Right</title>
    </svg>
  ),
}));

// Mock the not found image
vi.mock('@/assets/images/not_found.svg', () => ({
  default: '/mock-not-found-image.svg',
}));

// Test constants
const TEST_DATA = {
  translations: {
    title: 'COULDNT_FIND_WHAT_YOU_LOOKING_FOR',
    subtitle: 'PAGE_MAY_MOVED_NO_LONGER_EXISTS',
    buttonText: 'TAKE_ME_BACK',
  },
  classes: {
    container: ['flex', 'justify-center', 'items-center', 'w-full'],
    content: ['flex', 'flex-col', 'gap-12'],
    textContainer: ['flex', 'flex-col', 'items-center'],
    title: ['text-high-emphasis', 'font-bold', 'text-[32px]', 'leading-[48px]'],
    subtitle: ['mt-3', 'mb-6', 'text-medium-emphasis', 'font-semibold', 'text-2xl'],
    button: ['font-bold', 'text-sm'],
  },
  image: {
    src: '/mock-not-found-image.svg',
    alt: 'error state',
  },
} as const;

// Helper functions
const renderComponent = () => render(<NotFound />);

const expectElementWithClasses = (element: HTMLElement, classes: readonly string[]) => {
  classes.forEach((className) => {
    expect(element).toHaveClass(className);
  });
};

describe('NotFound Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByText(TEST_DATA.translations.title)).toBeInTheDocument();
    });

    it('should render with correct container structure', () => {
      renderComponent();
      
      const container = screen.getByText(TEST_DATA.translations.title).closest('div')?.parentElement?.parentElement;
      expect(container).toBeInTheDocument();
      if (container) {
        expectElementWithClasses(container, TEST_DATA.classes.container);
      }
    });

    it('should render content wrapper with correct classes', () => {
      renderComponent();
      
      const contentWrapper = screen.getByText(TEST_DATA.translations.title).closest('div')?.parentElement;
      expect(contentWrapper).toBeInTheDocument();
      if (contentWrapper) {
        expectElementWithClasses(contentWrapper, TEST_DATA.classes.content);
      }
    });
  });

  describe('Image Section', () => {
    it('should render the not found image', () => {
      renderComponent();
      
      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', TEST_DATA.image.src);
      expect(image).toHaveAttribute('alt', TEST_DATA.image.alt);
    });

    it('should render image as an img element', () => {
      renderComponent();
      
      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image.tagName).toBe('IMG');
    });
  });

  describe('Text Content', () => {
    it('should render the main title with correct text and styling', () => {
      renderComponent();
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(TEST_DATA.translations.title);
      expectElementWithClasses(title, TEST_DATA.classes.title);
    });

    it('should render the subtitle with correct text and styling', () => {
      renderComponent();
      
      const subtitle = screen.getByText(TEST_DATA.translations.subtitle);
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.tagName).toBe('P');
      expectElementWithClasses(subtitle, TEST_DATA.classes.subtitle);
    });

    it('should render text container with correct layout classes', () => {
      renderComponent();
      
      const textContainer = screen.getByText(TEST_DATA.translations.title).parentElement;
      expect(textContainer).toBeInTheDocument();
      if (textContainer) {
        expectElementWithClasses(textContainer, TEST_DATA.classes.textContainer);
      }
    });
  });

  describe('Button Section', () => {
    it('should render the back button with correct text', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(TEST_DATA.translations.buttonText);
    });

    it('should render button with correct styling classes', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expectElementWithClasses(button, TEST_DATA.classes.button);
    });

    it('should render arrow right icon inside button', () => {
      renderComponent();
      
      const arrowIcon = screen.getByTestId('arrow-right-icon');
      expect(arrowIcon).toBeInTheDocument();
      
      // Verify icon is inside the button
      const button = screen.getByRole('button');
      expect(button).toContainElement(arrowIcon);
    });
  });

  describe('Translation Integration', () => {
    it('should use translation keys for all text content', () => {
      renderComponent();
      
      // Since our mock returns the key as-is, we can verify the translation keys are used
      expect(screen.getByText(TEST_DATA.translations.title)).toBeInTheDocument();
      expect(screen.getByText(TEST_DATA.translations.subtitle)).toBeInTheDocument();
      expect(screen.getByText(TEST_DATA.translations.buttonText)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible image alt text', () => {
      renderComponent();
      
      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image).toHaveAccessibleName(TEST_DATA.image.alt);
    });

    it('should have accessible button', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Button accessible name includes both text and icon title
      const expectedAccessibleName = `${TEST_DATA.translations.buttonText}Arrow Right`;
      expect(button).toHaveAccessibleName(expectedAccessibleName);
    });
  });

  describe('Layout Structure', () => {
    it('should render elements in correct order', () => {
      renderComponent();
      
      const container = screen.getByText(TEST_DATA.translations.title).closest('div')?.parentElement;
      const children = Array.from(container?.children || []);
      
      expect(children).toHaveLength(2);
      
      // First child should be the image
      const image = children[0] as HTMLImageElement;
      expect(image.tagName).toBe('IMG');
      expect(image).toHaveAttribute('alt', TEST_DATA.image.alt);
      
      // Second child should be the text container
      const textContainer = children[1];
      expect(textContainer).toContainElement(screen.getByRole('heading', { level: 1 }));
      expect(textContainer).toContainElement(screen.getByRole('button'));
    });

    it('should render text elements in correct order within text container', () => {
      renderComponent();
      
      const textContainer = screen.getByText(TEST_DATA.translations.title).parentElement;
      const children = Array.from(textContainer?.children || []);
      
      expect(children).toHaveLength(3);
      
      // First: title (h1)
      expect(children[0].tagName).toBe('H1');
      expect(children[0]).toHaveTextContent(TEST_DATA.translations.title);
      
      // Second: subtitle (p)
      expect(children[1].tagName).toBe('P');
      expect(children[1]).toHaveTextContent(TEST_DATA.translations.subtitle);
      
      // Third: button
      expect(children[2].tagName).toBe('BUTTON');
      expect(children[2]).toHaveTextContent(TEST_DATA.translations.buttonText);
    });
  });
});
