
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import { Loader2 } from 'lucide-react';
import { roleDashboardPaths } from '@/config/navConfig'; // Import from navConfig

export default function DashboardRedirectPage() {
  const { currentRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (currentRole && roleDashboardPaths[currentRole]) {
      router.replace(roleDashboardPaths[currentRole]);
    }
  }, [currentRole, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-semibold text-foreground">Loading Your Dashboard...</h1>
      <p className="text-muted-foreground mt-2">
        Please wait while we tailor your experience.
      </p>
    </div>
  );
}
