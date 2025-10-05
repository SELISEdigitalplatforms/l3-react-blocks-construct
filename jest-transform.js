import { createTransformer } from 'babel-jest';

// Create a Babel transformer for Jest
const babelTransformer = createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ],
  plugins: [
    // Transform import.meta.env to process.env for Jest compatibility
    [
      'babel-plugin-transform-define',
      {
        'import.meta.env.VITE_CAPTCHA_SITE_KEY': 'process.env.VITE_CAPTCHA_SITE_KEY',
        'import.meta.env.VITE_CAPTCHA_TYPE': 'process.env.VITE_CAPTCHA_TYPE',
        'import.meta.env.REACT_APP_CAPTCHA_SITE_KEY': 'process.env.REACT_APP_CAPTCHA_SITE_KEY',
        'import.meta.env.REACT_APP_CAPTCHA_TYPE': 'process.env.REACT_APP_CAPTCHA_TYPE',
      }
    ]
  ],
  babelrc: false,
  configFile: false,
});

export default babelTransformer;
