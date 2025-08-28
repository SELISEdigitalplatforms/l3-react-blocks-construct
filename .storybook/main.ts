import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../src/stories/blocks/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.mdx',
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
};
export default config;
