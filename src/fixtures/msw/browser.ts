import { setupWorker } from 'msw/browser';
import { handlers } from '../handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

export const worker = setupWorker(...handlers);

async function startWorker() {
  await worker.start({
    quiet: true,
    onUnhandledRequest(request, print) {
      print.warning();
    },
  })
}

beforeAll(startWorker);
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());
