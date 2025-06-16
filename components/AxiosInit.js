'use client';

import { useRequest } from '@/hooks/useRequest';

export function AxiosInit({ children }) {
  // useRequest('/');
  useRequest(typeof window !== 'undefined' ? window.location.host : '/');

  return children;
}