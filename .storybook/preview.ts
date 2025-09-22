import '../src/styles/globals.css';
import type { Preview } from '@storybook/react-webpack5';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        // If 'a' is the gettingStarted page, place it first
        if (a.id.includes('gettingstarted') || a.title?.toLowerCase().includes('getting started')) {
          return -1;
        }
        // If 'b' is the gettingStarted page, place it first
        if (b.id.includes('gettingstarted') || b.title?.toLowerCase().includes('getting started')) {
          return 1;
        }

        // If 'a' is a docs page and 'b' is a story, place 'a' first.
        if (a.type === 'docs' && b.type !== 'docs') {
          return -1;
        }
        // If 'b' is a docs page and 'a' is a story, place 'b' first.
        if (b.type === 'docs' && a.type !== 'docs') {
          return 1;
        }

        // For all other cases, maintain default sorting (e.g., alphabetical).
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      },
    },
  },
};

export default preview;
