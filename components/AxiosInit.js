'use client';

import { useRequest } from '@/hooks/useRequest';

export function AxiosInit({ children }) {
  useRequest('/');

  return children;
}