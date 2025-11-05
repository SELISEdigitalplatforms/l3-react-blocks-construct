import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '../../../../test-utils/shared-test-utils';

import { CustomErrorView } from './custom-error-view';

// Test constants
const TEST_DATA = {
  props: {
    image: '/mock-error-image.svg',
    title: 'Test Error Title',
    description: 'Test error description message',
    buttonText: 'Test Button',
  },
  classes: {
    container: ['flex', 'justify-center', 'items-center', 'w-full'],
    content: ['flex', 'flex-col', 'gap-12'],
    textContainer: ['flex', 'flex-col', 'items-center'],
    title: ['text-high-emphasis', 'font-bold', 'text-[32px]', 'leading-[48px]'],
    description: ['mt-3', 'mb-6', 'text-medium-emphasis', 'font-semibold', 'text-2xl'],
    button: ['font-bold', 'text-sm'],
  },
  image: {
    alt: 'error state',
  },
} as const;

// Helper functions
const renderComponent = (
  props: {
    image: string;
    title: string;
    description: string;
    buttonText: string;
  } = TEST_DATA.props,
  buttonIcon?: ReactNode
) => render(<CustomErrorView {...props} buttonIcon={buttonIcon} />);

const expectElementWithClasses = (element: HTMLElement, classes: readonly string[]) => {
  classes.forEach((className) => {
    expect(element).toHaveClass(className);
  });
};

describe('ErrorState Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByText(TEST_DATA.props.title)).toBeInTheDocument();
    });

    it('should render with correct container structure', () => {
      renderComponent();

      const container = screen.getByText(TEST_DATA.props.title).closest('div')
        ?.parentElement?.parentElement;
      expect(container).toBeInTheDocument();
      if (container) {
        expectElementWithClasses(container, TEST_DATA.classes.container);
      }
    });

    it('should render content wrapper with correct classes', () => {
      renderComponent();

      const contentWrapper = screen.getByText(TEST_DATA.props.title).closest('div')?.parentElement;
      expect(contentWrapper).toBeInTheDocument();
      if (contentWrapper) {
        expectElementWithClasses(contentWrapper, TEST_DATA.classes.content);
      }
    });
  });

  describe('Props Integration', () => {
    it('should render all required props correctly', () => {
      renderComponent();

      // Check title
      expect(screen.getByText(TEST_DATA.props.title)).toBeInTheDocument();

      // Check description
      expect(screen.getByText(TEST_DATA.props.description)).toBeInTheDocument();

      // Check button text
      expect(screen.getByText(TEST_DATA.props.buttonText)).toBeInTheDocument();

      // Check image
      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image).toHaveAttribute('src', TEST_DATA.props.image);
    });

    it('should handle custom props correctly', () => {
      const customProps = {
        image: '/custom-image.svg',
        title: 'Custom Title',
        description: 'Custom description',
        buttonText: 'Custom Button',
      };

      renderComponent(customProps);

      expect(screen.getByText(customProps.title)).toBeInTheDocument();
      expect(screen.getByText(customProps.description)).toBeInTheDocument();
      expect(screen.getByText(customProps.buttonText)).toBeInTheDocument();

      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image).toHaveAttribute('src', customProps.image);
    });
  });

  describe('Image Section', () => {
    it('should render the error state image', () => {
      renderComponent();

      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', TEST_DATA.props.image);
      expect(image).toHaveAttribute('alt', TEST_DATA.image.alt);
    });

    it('should render image as an img element', () => {
      renderComponent();

      const image = screen.getByAltText(TEST_DATA.image.alt);
      expect(image.tagName).toBe('IMG');
    });

    it('should use fixed alt text for consistency', () => {
      renderComponent();

      // Alt text should always be "error state" regardless of props
      const image = screen.getByAltText('error state');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Text Content', () => {
    it('should render the title with correct text and styling', () => {
      renderComponent();

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(TEST_DATA.props.title);
      expectElementWithClasses(title, TEST_DATA.classes.title);
    });

    it('should render the description with correct text and styling', () => {
      renderComponent();

      const description = screen.getByText(TEST_DATA.props.description);
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
      expectElementWithClasses(description, TEST_DATA.classes.description);
    });

    it('should render text container with correct layout classes', () => {
      renderComponent();

      const textContainer = screen.getByText(TEST_DATA.props.title).parentElement;
      expect(textContainer).toBeInTheDocument();
      if (textContainer) {
        expectElementWithClasses(textContainer, TEST_DATA.classes.textContainer);
      }
    });
  });

  describe('Button Section', () => {
    it('should render the button with correct text', () => {
      renderComponent();

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(TEST_DATA.props.buttonText);
    });

    it('should render button with correct styling classes', () => {
      renderComponent();

      const button = screen.getByRole('button');
      expectElementWithClasses(button, TEST_DATA.classes.button);
    });

    it('should render button without icon when buttonIcon is not provided', () => {
      renderComponent();

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(TEST_DATA.props.buttonText);

      // Should only contain text, no icon elements
      expect(button.children).toHaveLength(0);
    });

    it('should render button with icon when buttonIcon is provided', () => {
      const mockIcon = <span data-testid="mock-icon">Icon</span>;
      renderComponent(TEST_DATA.props, mockIcon);

      const button = screen.getByRole('button');
      expect(button).toContainElement(screen.getByTestId('mock-icon'));
      expect(button).toHaveTextContent(TEST_DATA.props.buttonText);
    });
  });

  describe('Button Icon Integration', () => {
    it('should handle ReactNode icons correctly', () => {
      const complexIcon = (
        <svg data-testid="complex-icon" className="test-class">
          <title>Complex Icon</title>
          <path d="test-path" />
        </svg>
      );

      renderComponent(TEST_DATA.props, complexIcon);

      const icon = screen.getByTestId('complex-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('test-class');

      const button = screen.getByRole('button');
      expect(button).toContainElement(icon);
    });

    it('should handle string icons correctly', () => {
      const stringIcon = 'String Icon';
      renderComponent(TEST_DATA.props, stringIcon);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(`${TEST_DATA.props.buttonText}${stringIcon}`);
    });

    it('should handle null/undefined icons gracefully', () => {
      renderComponent(TEST_DATA.props, null);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(TEST_DATA.props.buttonText);
      expect(button.children).toHaveLength(0);
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
      expect(button).toHaveAccessibleName(TEST_DATA.props.buttonText);
    });

    it('should maintain accessibility with icons', () => {
      const iconWithTitle = (
        <svg data-testid="accessible-icon">
          <title>Accessible Icon</title>
        </svg>
      );

      renderComponent(TEST_DATA.props, iconWithTitle);

      const button = screen.getByRole('button');
      const expectedAccessibleName = `${TEST_DATA.props.buttonText}Accessible Icon`;
      expect(button).toHaveAccessibleName(expectedAccessibleName);
    });
  });

  describe('Layout Structure', () => {
    it('should render elements in correct order', () => {
      renderComponent();

      const container = screen.getByText(TEST_DATA.props.title).closest('div')?.parentElement;
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

      const textContainer = screen.getByText(TEST_DATA.props.title).parentElement;
      const children = Array.from(textContainer?.children || []);

      expect(children).toHaveLength(3);

      // First: title (h1)
      expect(children[0].tagName).toBe('H1');
      expect(children[0]).toHaveTextContent(TEST_DATA.props.title);

      // Second: description (p)
      expect(children[1].tagName).toBe('P');
      expect(children[1]).toHaveTextContent(TEST_DATA.props.description);

      // Third: button
      expect(children[2].tagName).toBe('BUTTON');
      expect(children[2]).toHaveTextContent(TEST_DATA.props.buttonText);
    });
  });

  describe('Component Reusability', () => {
    it('should work as a reusable component with different content', () => {
      const scenarios = [
        {
          image: '/error1.svg',
          title: 'Network Error',
          description: 'Please check your connection',
          buttonText: 'Retry',
        },
        {
          image: '/error2.svg',
          title: 'Server Error',
          description: 'Something went wrong on our end',
          buttonText: 'Go Home',
        },
      ];

      scenarios.forEach((scenario) => {
        const { unmount } = renderComponent(scenario);

        expect(screen.getByText(scenario.title)).toBeInTheDocument();
        expect(screen.getByText(scenario.description)).toBeInTheDocument();
        expect(screen.getByText(scenario.buttonText)).toBeInTheDocument();

        const image = screen.getByAltText('error state');
        expect(image).toHaveAttribute('src', scenario.image);

        unmount();
      });
    });

    it('should maintain consistent styling across different content', () => {
      const longContent = {
        image: '/long-error.svg',
        title: 'This is a very long error title that might wrap to multiple lines',
        description:
          'This is a very long error description that provides detailed information about what went wrong and what the user should do next',
        buttonText: 'Very Long Button Text',
      };

      renderComponent(longContent);

      // Styling should remain consistent regardless of content length
      const title = screen.getByRole('heading', { level: 1 });
      expectElementWithClasses(title, TEST_DATA.classes.title);

      const description = screen.getByText(longContent.description);
      expectElementWithClasses(description, TEST_DATA.classes.description);

      const button = screen.getByRole('button');
      expectElementWithClasses(button, TEST_DATA.classes.button);
    });
  });
});
