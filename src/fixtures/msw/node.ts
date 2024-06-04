import { setupServer } from 'msw/node';
import { handlers } from '../handlers.ts';
import { beforeAll, afterEach, afterAll } from 'vitest';

export const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
