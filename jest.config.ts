import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
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
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
};

export default config;
