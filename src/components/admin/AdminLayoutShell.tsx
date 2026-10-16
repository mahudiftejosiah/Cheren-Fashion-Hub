'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side shell that conditionally applies the sidebar offset.
 * On /admin/login: full-screen, no offset (sidebar is hidden).
 * On all other admin pages: ml-64 offset to clear the sidebar.
 */
export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    // Login page: full-screen, no sidebar offset, no top padding
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <main className="lg:ml-64 min-h-screen pt-[61px] lg:pt-0 overflow-x-hidden">
      <div className="w-full max-w-full p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}
