export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ["**/tests/**/*.test.(ts|tsx|js)"],
  transformIgnorePatterns: ["/node_modules/(?!supertest)"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
