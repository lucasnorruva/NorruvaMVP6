// src/app/(app)/products/edit/page.tsx
/**
 * Page for editing an existing product.
 * This is now the dedicated route for editing, separating it from creation.
 */
"use client";

import { Suspense } from 'react';
import AddEditProductPage from '../new/page';
import { FullPageLoader } from '@/components/shared/FullPageLoader';

export default function EditProductPage() {
  return (
    <Suspense fallback={<FullPageLoader message="Loading editor..." />}>
      <AddEditProductPage />
    </Suspense>
  );
}
