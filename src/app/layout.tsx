import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PublicLayoutShell } from '@/components/PublicLayoutShell';
import { getBusinessSettings } from '@/lib/getSettings';

export async function generateMetadata(): Metadata {
  const settings = await getBusinessSettings();
  return {
    title: {
      default: `${settings.businessName} | Bespoke Tailoring & Luxury Fashion`,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.bioText,
    keywords: ['Fashion', 'Tailoring', 'Bespoke', 'African Wear', 'Agbada', 'Suits', 'Couture', 'Cheren Fashion'],
    authors: [{ name: settings.businessName }],
    openGraph: {
      title: settings.businessName,
      description: settings.bioText,
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getBusinessSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <PublicLayoutShell settings={settings}>
            {children}
          </PublicLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
