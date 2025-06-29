"use client"; // Add this because usePathname is a client hook
import type { ReactNode } from "react";
import React from "react"; // Import React for monkey-patching
import { usePathname } from "next/navigation"; // Import usePathname
import { SidebarProvider } from "@/components/ui/sidebar/SidebarProvider";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebarContent from "@/components/layout/AppSidebarContent";
// Removed RoleProvider import as it's provided by the root layout

// Runtime patch to strip asChild from DOM elements
if (typeof window !== "undefined" && React.createElement) {
  type CreateElementFn = typeof React.createElement;
  type AnyComponent = React.ComponentType<Record<string, unknown>>;

  const originalCreateElement: CreateElementFn = React.createElement;

  const patchedCreateElement = (
    type: string | AnyComponent,
    props: Record<string, unknown> | null,
    ...children: ReactNode[]
  ): ReturnType<CreateElementFn> => {
    if (props && "asChild" in props && typeof type === "string") {
      const { asChild, ...cleanProps } = props;
      return originalCreateElement(type, cleanProps, ...children);
    }
    return originalCreateElement(type, props, ...children);
  };

  React.createElement = patchedCreateElement as unknown as CreateElementFn;
  // console.log('Firebase Studio asChild prop runtime patch applied to React.createElement');
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Get current pathname

  if (pathname.startsWith("/developer")) {
    // Render a simplified layout for the developer portal
    // RoleProvider is inherited from the root layout
    return (
      <main
        id="main-content"
        className="flex-1 p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen"
      >
        {children}
      </main>
    );
  }

  // Render the standard app layout for other routes
  // RoleProvider is no longer needed here as it's in the root layout
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
