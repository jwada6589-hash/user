const DATABASE_NAME = 'almurtada-market-cache';
const STORE_NAME = 'catalog-snapshots';
const DATABASE_VERSION = 1;
const CACHE_SCHEMA_VERSION = 1;

// Cached catalog data is only an instant-loading snapshot. Convex remains the
// source of truth and replaces this snapshot as soon as its live query arrives.
export const CATALOG_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

type CacheEnvelope<T> = {
  schemaVersion: number;
  updatedAt: number;
  value: T;
};

// Keep this list intentionally limited to public catalog data. User sessions,
// profile details, orders, wallet, favorites, and addresses must never enter it.
export type CatalogCacheKey = 'products' | 'categories' | 'subcategories';

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase() {
  if (!('indexedDB' in globalThis)) return Promise.reject(new Error('INDEXED_DB_UNAVAILABLE'));
  if (databasePromise) return databasePromise;

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('CACHE_DATABASE_OPEN_FAILED'));
  });

  return databasePromise;
}

function namespacedKey(key: CatalogCacheKey) {
  const deployment = import.meta.env.VITE_CONVEX_URL || 'unconfigured';
  return `${deployment}:${key}`;
}

async function clearCatalogStore(database: IDBDatabase) {
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('CACHE_CLEAR_FAILED'));
    transaction.onabort = () => reject(transaction.error ?? new Error('CACHE_CLEAR_ABORTED'));
  });
}

export async function readCatalogCache<T>(key: CatalogCacheKey): Promise<T | undefined> {
  try {
    const database = await openDatabase();
    const envelope = await new Promise<CacheEnvelope<T> | undefined>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(namespacedKey(key));
      request.onsuccess = () => resolve(request.result as CacheEnvelope<T> | undefined);
      request.onerror = () => reject(request.error ?? new Error('CACHE_READ_FAILED'));
    });

    if (!envelope) return undefined;
    if (
      envelope.schemaVersion !== CACHE_SCHEMA_VERSION
      || !Number.isFinite(envelope.updatedAt)
      || Date.now() - envelope.updatedAt > CATALOG_CACHE_MAX_AGE_MS
    ) {
      await clearCatalogStore(database);
      return undefined;
    }
    return envelope.value;
  } catch {
    return undefined;
  }
}

export async function writeCatalogCache<T>(key: CatalogCacheKey, value: T): Promise<void> {
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(
        { schemaVersion: CACHE_SCHEMA_VERSION, updatedAt: Date.now(), value } satisfies CacheEnvelope<T>,
        namespacedKey(key),
      );
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('CACHE_WRITE_FAILED'));
      transaction.onabort = () => reject(transaction.error ?? new Error('CACHE_WRITE_ABORTED'));
    });
  } catch {
    // Cache failures must never prevent the live Convex catalog from rendering.
  }
}
