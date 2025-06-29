module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.(ts|tsx)"],
  // Ignore workspace directory to resolve haste collision
  modulePathIgnorePatterns: ["<rootDir>/workspace"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
}; // Added a deliberate syntax error
