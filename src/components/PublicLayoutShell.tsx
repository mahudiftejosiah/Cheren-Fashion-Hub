'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import type { SettingsData } from '@/lib/getSettings';

interface PublicLayoutShellProps {
  settings: SettingsData;
  children: React.ReactNode;
}

export function PublicLayoutShell({ settings, children }: PublicLayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar settings={settings} />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer settings={settings} />}
      {!isAdmin && <WhatsAppWidget whatsappNumber={settings.whatsappNumber} />}
    </>
  );
}
