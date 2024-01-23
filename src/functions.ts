import { Store } from './types';

export function showStore(store: Store): string {
  return `Your Store name is: ${store.name}`;
}
