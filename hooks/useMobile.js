import { useSyncExternalStore } from 'react';

import { mediaMobile } from '@/styles/globals';

export function useMobile() {
  return useSyncExternalStore(
    subscribeMobileStatus.subscribe,
    subscribeMobileStatus.getSnapshot,
    subscribeMobileStatus.getServerSnapshot
  );
}

let isMobile =
  typeof window !== 'undefined'
    ? window.matchMedia(mediaMobile.replace('@media', '')).matches
    : false;

const subscribeMobileStatus = {
  subscribe() {
    function windowWidthListener() {
      isMobile = window.matchMedia(mediaMobile.replace('@media', '')).matches;
    }
    window.addEventListener('resize', windowWidthListener);
    return () => {
      window.removeEventListener('resize', windowWidthListener);
    };
  },
  getSnapshot() {
    return isMobile;
  },
  getServerSnapshot() {
    return isMobile;
  }
};

export default useMobile;
