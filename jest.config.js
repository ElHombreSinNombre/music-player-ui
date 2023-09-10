const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})
const customJestConfig = {
  moduleNameMapper: {
    '^@/(.*)$': './src/*',
    '^@/app/(.*)$': './app/*',
    '^@/components/(.*)$': './src/app/components/*',
    '^@/icons/(.*)$': './src/app/components/Icons/*'
  },
  testEnvironment: 'jest-environment-jsdom'
}
module.exports = createJestConfig(customJestConfig)
