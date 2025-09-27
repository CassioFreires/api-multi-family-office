import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // Trata .ts como ESM
  extensionsToTreatAsEsm: ['.ts'],

  testMatch: [
    '**/tests/unit/**/*.spec.ts',
    '**/tests/integration/**/*.spec.ts'
  ],


  // Mapeia imports que terminam com .js para funcionarem em TypeScript
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Transforma arquivos .ts com ESM ativado
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },

  // Ignora node_modules do transform
  transformIgnorePatterns: ['node_modules'],
};

export default config;
