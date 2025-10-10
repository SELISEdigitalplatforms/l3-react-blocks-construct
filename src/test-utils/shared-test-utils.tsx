import React from 'react';
import { screen } from '@testing-library/react';
import { vi, expect } from 'vitest';

// ------------------ Global Common Mocks ------------------
// These mocks are shared across ALL component tests to avoid code duplication.
// They execute immediately when this file is imported.

// react-i18next mock - used by most components
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// UI Card components mock - used by many components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

// UI Select components mock - used by many components
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectGroup: ({ children }: any) => <div data-testid="select-group">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Note: Button component mock is NOT included here as different components
// need different button test IDs. Each test file should mock buttons locally.

// ------------------ Shared Helper Functions ------------------
// These helpers encapsulate common expectations used across component tests.

export const expectElementWithClasses = (
  testId: string,
  classes: readonly string[]
) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
  return element;
};

export const expectElementsExist = (testIds: readonly string[]) => {
  testIds.forEach((testId) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
};

export const expectTextContent = (testId: string, content: string) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(content);
  return element;
};

export const expectElementsWithAttributes = (
  testId: string,
  expectedCount: number,
  attributeChecks: Array<{ attribute: string; value: string }>
) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  attributeChecks.forEach((check, index) => {
    expect(elements[index]).toHaveAttribute(check.attribute, check.value);
  });
};

export const expectLabelsInDocument = (labels: readonly string[]) => {
  labels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
};

export const expectTextElements = (texts: readonly string[]) => {
  texts.forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};

export const expectElementsWithCount = (testId: string, expectedCount: number) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  return elements;
};

// ------------------ Mock Factory Functions ------------------
// Reusable mock creators to reduce duplication

export const createMockIcon = (testId: string, title?: string) => {
  const MockIcon = ({ className }: { className?: string }) => (
    <svg data-testid={testId} className={className}>
      {title && <title>{title}</title>}
    </svg>
  );
  MockIcon.displayName = `MockIcon_${testId}`;
  return MockIcon;
};

export const createMockTranslation = () => (key: string) => key;

// ------------------ Common Test Data Patterns ------------------
// Reusable test data structures

export const COMMON_CARD_CLASSES = ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'];
export const COMMON_TITLE_CLASSES = ['text-xl', 'text-high-emphasis'];
export const COMMON_SELECT_TRIGGER_CLASSES = ['w-[105px]', 'h-[28px]', 'px-2', 'py-1'];

// ------------------ Console Error Suppression ------------------
// Helper for testing components without console noise

export const suppressConsoleErrors = () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    // Mock implementation to suppress console errors during testing
  });
  return consoleSpy;
};
