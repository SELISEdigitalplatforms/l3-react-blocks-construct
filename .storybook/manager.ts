import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import './manager.css';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Selise Blocks',
    brandImage: './selise-logo.svg',
  },
});
