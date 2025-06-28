module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)']
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)'],
  // Ignore workspace directory to resolve haste collision
  modulePathIgnorePatterns: ['<rootDir>/workspace'],
  // Explicitly configure ts-jest for .ts and .tsx
  transform: {
    '^.+\.(ts|tsx)$ ': ['ts-jest', {
      // Ensure JSX is processed
      tsconfig: {
        jsx: 'react',
      },
      // e.g., isolatedModules: true,
      // extensionsToTreatAsEsm: ['.ts', '.tsx'], // Might be needed for ESM, but often not with Next.js
    }],
  }
};
