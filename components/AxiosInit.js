'use client';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

export function AxiosInit({ children }) {
  // useRequestInit('/');
  useRequestInit(typeof window !== 'undefined' ? window.location.host : '/');

  return children;
}