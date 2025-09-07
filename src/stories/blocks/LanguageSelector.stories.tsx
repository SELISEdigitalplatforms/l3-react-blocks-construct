import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import LanguageSelector from '../../components/blocks/language-selector/language-selector';

// Mock language context for stories
const MockLanguageProvider = ({ children, mockData }: any) => {
  const [currentLanguage, setCurrentLanguage] = useState(mockData.currentLanguage);
  
  const mockContext = {
    currentLanguage,
    setLanguage: (lang: string) => {
      setCurrentLanguage(lang);
    },
    availableLanguages: mockData.availableLanguages,
    isLoading: mockData.isLoading || false,
  };
  
  // Mock the useLanguageContext hook
  React.createContext(mockContext);
  
  return <div>{children}</div>;
};

const meta: Meta<typeof LanguageSelector> = {
  title: 'Block Components/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A dropdown menu component that allows users to select their preferred language from a list of available languages fetched from the API.',
      },
    },
  },
  decorators: [
    (Story, context) => (
      <MockLanguageProvider mockData={context.args}>
        <div className="p-4">
          <Story />
        </div>
      </MockLanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

export const Default: Story = {
  args: {
    currentLanguage: 'en',
    availableLanguages: [
      { itemId: '1', languageCode: 'en', languageName: 'English', isDefault: true },
      { itemId: '2', languageCode: 'es', languageName: 'Español', isDefault: false },
      { itemId: '3', languageCode: 'fr', languageName: 'Français', isDefault: false },
      { itemId: '4', languageCode: 'de', languageName: 'Deutsch', isDefault: false },
    ],
    isLoading: false,
  },
};

export const WithManyLanguages: Story = {
  args: {
    currentLanguage: 'en',
    availableLanguages: [
      { itemId: '1', languageCode: 'en', languageName: 'English', isDefault: true },
      { itemId: '2', languageCode: 'es', languageName: 'Español', isDefault: false },
      { itemId: '3', languageCode: 'fr', languageName: 'Français', isDefault: false },
      { itemId: '4', languageCode: 'de', languageName: 'Deutsch', isDefault: false },
      { itemId: '5', languageCode: 'it', languageName: 'Italiano', isDefault: false },
      { itemId: '6', languageCode: 'pt', languageName: 'Português', isDefault: false },
      { itemId: '7', languageCode: 'ru', languageName: 'Русский', isDefault: false },
      { itemId: '8', languageCode: 'ja', languageName: '日本語', isDefault: false },
      { itemId: '9', languageCode: 'zh', languageName: '中文', isDefault: false },
      { itemId: '10', languageCode: 'ar', languageName: 'العربية', isDefault: false },
    ],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    currentLanguage: 'en',
    availableLanguages: [],
    isLoading: true,
  },
};

export const NoLanguages: Story = {
  args: {
    currentLanguage: 'en',
    availableLanguages: [],
    isLoading: false,
  },
};

export const SingleLanguage: Story = {
  args: {
    currentLanguage: 'en',
    availableLanguages: [
      { itemId: '1', languageCode: 'en', languageName: 'English', isDefault: true },
    ],
    isLoading: false,
  },
};

export const NonDefaultSelected: Story = {
  args: {
    currentLanguage: 'es',
    availableLanguages: [
      { itemId: '1', languageCode: 'en', languageName: 'English', isDefault: true },
      { itemId: '2', languageCode: 'es', languageName: 'Español', isDefault: false },
      { itemId: '3', languageCode: 'fr', languageName: 'Français', isDefault: false },
    ],
    isLoading: false,
  },
};

export const InNavigation: Story = {
  render: (args) => (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">MyApp</div>
      </div>
      <div className="flex items-center space-x-4">
        <MockLanguageProvider mockData={args}>
          <LanguageSelector />
        </MockLanguageProvider>
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
          Login
        </button>
      </div>
    </nav>
  ),
  args: {
    currentLanguage: 'en',
    availableLanguages: [
      { itemId: '1', languageCode: 'en', languageName: 'English', isDefault: true },
      { itemId: '2', languageCode: 'es', languageName: 'Español', isDefault: false },
      { itemId: '3', languageCode: 'fr', languageName: 'Français', isDefault: false },
    ],
    isLoading: false,
  },
};