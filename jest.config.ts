import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/file-mocks.js',
    '\\.css$': 'identity-obj-proxy',
    '^/(.*)$': '<rootDir>/src/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^constant/(.*)$': '<rootDir>/src/constant/$1',
    '^state/(.*)$': '<rootDir>/src/state/$1',
  },
  testMatch: ['**/*.spec.{ts,tsx}'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.model.ts',
    '!src/**/*.module.ts',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.jest.json',
        isolatedModules: true,
        esModuleInterop: true,
        allowJs: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
};

export default config;
