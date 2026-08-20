import { useEffect, useRef, useState } from 'react';
import { readCatalogCache, writeCatalogCache, type CatalogCacheKey } from './catalogCache';

export function usePersistentRealtimeValue<T>(key: CatalogCacheKey, liveValue: T | undefined, fallback: T): T {
  const [cachedValue, setCachedValue] = useState<T | undefined>();
  const latestLiveValue = useRef(liveValue);
  latestLiveValue.current = liveValue;

  useEffect(() => {
    let active = true;
    void readCatalogCache<T>(key).then((value) => {
      // A live response always wins, including an empty array after deletion.
      if (active && latestLiveValue.current === undefined && value !== undefined) {
        setCachedValue(value);
      }
    });
    return () => { active = false; };
  }, [key]);

  useEffect(() => {
    if (liveValue === undefined) return;
    setCachedValue(liveValue);

    // Collapse rapid Realtime changes into one small IndexedDB write.
    const timer = window.setTimeout(() => {
      void writeCatalogCache(key, liveValue);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [key, liveValue]);

  return liveValue ?? cachedValue ?? fallback;
}
