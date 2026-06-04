import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/fixtures/msw/node.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['html', 'clover'],
    },
  },
});
