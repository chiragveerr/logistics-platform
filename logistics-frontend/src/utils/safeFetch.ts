import { toast } from 'react-hot-toast';

interface ErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// Maps URLs to last fetch timestamps for throttling
const fetchTimestamps = new Map<string, number>();

// Maps URLs to debounce timeouts
const debounceTimers = new Map<string, NodeJS.Timeout>();

// Default config
const THROTTLE_INTERVAL = 1000; // 1s
const DEBOUNCE_DELAY = 300;     // 300ms
const MAX_RETRIES = 3;

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const safeFetch = async <T = unknown>(
  url: string,
  options: RequestInit = {},
  config?: {
    throttle?: boolean;
    debounce?: boolean;
    throttleInterval?: number;
    debounceDelay?: number;
    retries?: number; // for retry count
    retryDelay?: number; // initial retry delay in ms
  }
): Promise<T | null> => {
  const {
    throttle = false,
    debounce = false,
    throttleInterval = THROTTLE_INTERVAL,
    debounceDelay = DEBOUNCE_DELAY,
    retries = 0,
    retryDelay = 1000, // 1 second initial retry delay
  } = config || {};

  // ⏱ Throttling
  if (throttle) {
    const lastCall = fetchTimestamps.get(url) || 0;
    const now = Date.now();
    if (now - lastCall < throttleInterval) {
      console.warn(`🟡 [safeFetch] Throttled: ${url}`);
      return null;
    }
    fetchTimestamps.set(url, now);
  }

  // 🧼 Debouncing
  if (debounce) {
    return new Promise((resolve) => {
      if (debounceTimers.has(url)) {
        clearTimeout(debounceTimers.get(url)!);
      }

      const timer = setTimeout(async () => {
        debounceTimers.delete(url);
        const result = await safeFetch<T>(url, options, {
          throttle,
          debounce: false, // Avoid infinite loop
          throttleInterval,
          debounceDelay,
          retries,
          retryDelay,
        });
        resolve(result);
      }, debounceDelay);

      debounceTimers.set(url, timer);
    });
  }

  // 📡 Real fetch logic
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    // Rate limit hit (429) => retry with exponential backoff if retries left
    if (res.status === 429) {
      if (retries < MAX_RETRIES) {
        const nextDelay = retryDelay * 2; // exponential backoff
        console.warn(`⚠️ [safeFetch] 429 received. Retry ${retries + 1} in ${retryDelay}ms.`);
        await wait(retryDelay);
        return safeFetch<T>(url, options, {
          throttle,
          debounce,
          throttleInterval,
          debounceDelay,
          retries: retries + 1,
          retryDelay: nextDelay,
        });
      } else {
        toast.error('⚠️ Too many requests! Please wait and try again later.');
        return null;
      }
    }

    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`❌ Server responded with non-JSON content: ${text.slice(0, 100)}...`);
    }

    const data = (await res.json()) as T & Partial<ErrorResponse>;

    if (!res.ok) {
      const errorMsg = data.message ?? data.error ?? `❌ Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    const errorMessage =
      (err as Error)?.message || `Failed to load ${url.split('/api/')[1] || 'data'}`;
    console.error(`🔴 [safeFetch] Error: ${errorMessage}`);

    // Avoid spamming toast on known rate limit error
    if (!errorMessage.includes('Too many requests')) {
      toast.error(errorMessage);
    }

    return null;
  }
};

export default safeFetch;
