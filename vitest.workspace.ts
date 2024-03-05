import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'chrome',
      environment: 'chrome',
      browser: {
        name: 'chrome',
        enabled: true,
        provider: 'webdriverio',
        headless: true,
      },
      setupFiles: ['./src/fixtures/msw/browser.ts'],
      // testTimeout: 300000,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'node',
      environment: 'node',
      setupFiles: ['./src/fixtures/msw/node.ts'],
    },
  },
]);
