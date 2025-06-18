'use client';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

export function AxiosInit({ children }) {
  useRequestInit(process.env.NEXT_PUBLIC_API_BASE);

  return children;
}