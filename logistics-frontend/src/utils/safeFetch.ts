// utils/safeFetch.ts
import { toast } from 'react-hot-toast';

const safeFetch = async <T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> => {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`❌ Server responded with non-JSON content: ${text.slice(0, 100)}...`);
    }

    const data: T = await res.json();

    if (!res.ok) {
      const errorMsg = (data as any)?.message || (data as any)?.error || `❌ Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    const errorMessage = (err as Error)?.message || `Failed to load ${url.split('/api/')[1] || 'data'}`;
    console.error(`🔴 [safeFetch] Error: ${errorMessage}`);
    toast.error(errorMessage);
    return null;
  }
};

export default safeFetch;
