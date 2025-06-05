
"use client";
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebarContent from "@/components/layout/AppSidebarContent";
import { RoleProvider } from '@/contexts/RoleContext'; // Import RoleProvider

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProvider> {/* Wrap with RoleProvider */}
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="sidebar" collapsible="icon">
          <AppSidebarContent />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  );
}
