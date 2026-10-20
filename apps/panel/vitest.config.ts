import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'], env: { PANEL_DB: 'memory', STALWART_MODE: 'fake' }, hookTimeout: 30000, testTimeout: 30000 },
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
});
