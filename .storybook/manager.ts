import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import './manager.css';

addons.setConfig({
  theme: {
    ...themes.normal,
    brandTitle: 'Selise Blocks',
    brandImage: './selise-logo.svg',
  },
});
