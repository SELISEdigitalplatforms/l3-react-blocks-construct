import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/core/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    // Ensure path aliases work in Storybook
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      assets: '/src/assets',
      components: '/src/components',
      modules: '/src/modules',
      hooks: '/src/hooks',
      lib: '/src/lib',
      constant: '/src/constant',
      pages: '/src/pages',
      providers: '/src/providers',
      styles: '/src/styles',
      utils: '/src/utils',
    };

    return config;
  },
};
export default config;
