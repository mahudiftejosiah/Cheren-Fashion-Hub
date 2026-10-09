import { prisma } from '@/lib/prisma';

export interface SettingsData {
  businessName: string;
  tagline: string;
  logoUrl?: string | null;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  bioText: string;
  missionText: string;
  visionText: string;
}

// Real authoritative business details — always used as the base
const REAL_DETAILS = {
  phone: '+234 903 738 1538',
  email: 'mahudiftefreeman@gmail.com',
  whatsappNumber: '2349037381538',
  address: 'Shagari Phase1 Sabon Pegi, Opp. Yola Model School, Yola Town, Adamawa State',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
};

export async function getBusinessSettings(): Promise<SettingsData> {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'default' },
    });

    if (settings) {
      return {
        businessName: settings.businessName || 'CHEREN FASHION HUB',
        tagline: settings.tagline || 'Where Your Style Becomes Reality.',
        logoUrl: settings.logoUrl,
        // Always use real details — overrides whatever is in the DB
        phone: REAL_DETAILS.phone,
        email: REAL_DETAILS.email,
        whatsappNumber: REAL_DETAILS.whatsappNumber,
        address: REAL_DETAILS.address,
        openingHours: REAL_DETAILS.openingHours,
        instagramUrl: settings.instagramUrl || 'https://instagram.com',
        tiktokUrl: settings.tiktokUrl || 'https://tiktok.com',
        facebookUrl: settings.facebookUrl || 'https://facebook.com',
        bioText: settings.bioText || 'Bespoke tailoring and modern luxury fashion designs crafted with precision and passion.',
        missionText: settings.missionText || 'To empower individuals through elegant, custom-crafted apparel that reflects their unique style.',
        visionText: settings.visionText || 'To be the premier fashion and tailoring house celebrating heritage and contemporary design.',
      };
    }
  } catch (err) {
    console.error('Failed to load settings from DB:', err);
  }

  // Fallback if DB is unreachable or not yet seeded
  return {
    businessName: 'CHEREN FASHION HUB',
    tagline: 'Where Your Style Becomes Reality.',
    logoUrl: null,
    ...REAL_DETAILS,
    instagramUrl: 'https://instagram.com',
    tiktokUrl: 'https://tiktok.com',
    facebookUrl: 'https://facebook.com',
    bioText: 'Bespoke tailoring and modern luxury fashion designs crafted with precision and passion.',
    missionText: 'To empower individuals through elegant, custom-crafted apparel that reflects their unique style.',
    visionText: 'To be the premier fashion and tailoring house celebrating heritage and contemporary design.',
  };
}
