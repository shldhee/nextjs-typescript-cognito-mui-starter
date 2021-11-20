import { setupWorker } from 'msw'
import { handlers } from './handlers'

if (typeof window !== 'undefined') {
  // Client-side-only code
}
export const worker =
  typeof window !== 'undefined' ? setupWorker(...handlers) : null
