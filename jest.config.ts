import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
  testPathPattern: 'lib/__tests__',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
}

export default config
