
import { useState } from 'react';

interface ApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: T;
  headers?: Record<string, string>;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async <T, R>({
    url,
    method = 'GET',
    body,
    headers = {}
  }: ApiOptions<T>): Promise<R | null> => {
    setLoading(true);
    setError(null);

    // Ensure the URL starts with /api if it's a relative URL and doesn't already start with /api
    const apiUrl = url.startsWith('http') ? url : 
                 (url.startsWith('/api') ? url : `/api${url.startsWith('/') ? '' : '/'}${url}`);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data as R;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    callApi
  };
}

export default useApi;
