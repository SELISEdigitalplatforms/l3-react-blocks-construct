import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Selise Blocks',
    brandImage: './selise_logo_small.svg',
  },
});
