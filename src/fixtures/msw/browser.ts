import { setupWorker } from 'msw/browser'
import { handlers } from '../handlers'
import { beforeAll, afterEach, afterAll } from 'vitest'

export const worker = setupWorker(...handlers)
beforeAll(() => worker.start({
    quiet: true,
    onUnhandledRequest(request, print) {
        print.warning()
    },
}))
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())
