/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import React from 'react';

export interface AxiosHooks<T> {
  response: T | null;
  loading: boolean;
  error: AxiosError | null;
  abortController: AbortController | null;
  executeFetch: () => Promise<void>;
  clear: () => void;
  status: number | null;
}

export function useAxios<T = unknown>(
  requestConfig: AxiosRequestConfig,
  immediate = true
): AxiosHooks<T> {
  const [response, setResponse] = React.useState<T | null>(null);
  const [error, setError] = React.useState<AxiosError | null>(null);
  const [loading, setLoading] = React.useState<boolean>(!!immediate);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const [status, setStatus] = React.useState<number | null>(null);

  const executeFetch = React.useCallback(async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setResponse(null);
    setError(null);
    setLoading(true);
    setStatus(null);

    try {
      const { data, status } = await axios.request({
        ...requestConfig,
        signal: controller.signal
      });
      setResponse(data);
      setStatus(status);
    } catch (e) {
      setError(e as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [requestConfig]);

  const clear = () => {
    setResponse(null!);
    setError(null!);
    setLoading(!!immediate);
  };

  React.useEffect(() => {
    immediate && executeFetch();
  }, [immediate]);

  return {
    response,
    error,
    loading,
    abortController,
    executeFetch,
    clear,
    status
  };
}
