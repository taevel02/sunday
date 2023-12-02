module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  setupFiles: ['<rootDir>/__test__/setup-tests.ts']
}
