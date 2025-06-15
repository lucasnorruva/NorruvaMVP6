
"use client"; 
import type { ReactNode } from 'react';
import React from 'react'; 
import { usePathname } from 'next/navigation'; 
import { SidebarProvider } from "@/components/ui/sidebar/SidebarProvider";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebarContent from "@/components/layout/AppSidebarContent";

// Runtime patch to strip asChild from DOM elements (if needed, can be conditional)
// This is more of a global fix, if it's still an issue, this is one place it can live.
// However, usually this error is specific to how components are used.
// For now, assuming it's not universally needed if ShadCN components are up-to-date.
/*
if (typeof window !== 'undefined' && React.createElement) {
  type CreateElementFn = typeof React.createElement;
  type AnyComponent = React.ComponentType<Record<string, unknown>>;

  const originalCreateElement: CreateElementFn = React.createElement;

  const patchedCreateElement = (
    type: string | AnyComponent,
    props: Record<string, unknown> | null,
    ...children: ReactNode[]
  ): ReturnType<CreateElementFn> => {
    if (props && 'asChild' in props && typeof type === 'string') {
      const { asChild, ...cleanProps } = props;
      return originalCreateElement(type, cleanProps, ...children);
    }
    return originalCreateElement(type, props, ...children);
  };

  React.createElement = patchedCreateElement as unknown as CreateElementFn;
}
*/

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 

  if (pathname.startsWith('/developer')) {
    return (
      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebarContent />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
