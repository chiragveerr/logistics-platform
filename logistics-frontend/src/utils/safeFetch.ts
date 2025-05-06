// utils/safeFetch.ts
import { toast } from 'react-hot-toast';

const safeFetch = async (url: string, options: RequestInit = {}) => {
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
    let data: any = {};

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`❌ Server responded with non-JSON content: ${text.slice(0, 100)}...`);
    }

    if (!res.ok) {
      const errorMsg =
        data.message ||
        data.error ||
        `❌ Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: any) {
    const errorMessage = err?.message || `Failed to load ${url.split('/api/')[1] || 'data'}`;
    console.error(`🔴 [safeFetch] Error: ${errorMessage}`);
    toast.error(errorMessage);
    return null;
  }
};

export default safeFetch;
