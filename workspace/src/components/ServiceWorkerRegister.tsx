
"use client";

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/registerServiceWorker';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
