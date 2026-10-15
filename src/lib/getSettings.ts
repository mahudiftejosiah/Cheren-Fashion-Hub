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

// Default fallback values — only used when the DB row doesn't exist yet.
// Once saved via the admin settings page these values are no longer used.
const DEFAULTS: SettingsData = {
  businessName: 'CHEREN FASHION HUB',
  tagline: 'Where Your Style Becomes Reality.',
  logoUrl: 'https://dwogqcjjeefostuwilti.supabase.co/storage/v1/object/public/cheren-fashion/IMG_8794.PNG',
  phone: '+234 903 738 1538',
  email: 'mahudiftefreeman@gmail.com',
  whatsappNumber: '2349037381538',
  address: 'Shagari Phase1 Sabon Pegi, Opp. Yola Model School, Yola Town, Adamawa State',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  facebookUrl: 'https://facebook.com',
  bioText: 'Bespoke tailoring and modern luxury fashion designs crafted with precision and passion.',
  missionText: 'To empower individuals through elegant, custom-crafted apparel that reflects their unique style.',
  visionText: 'To be the premier fashion and tailoring house celebrating heritage and contemporary design.',
};

export async function getBusinessSettings(): Promise<SettingsData> {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'default' },
    });

    if (settings) {
      // Every field comes from the DB. Fallback to DEFAULTS only when the
      // DB value is an empty string (shouldn't happen but guards against it).
      return {
        businessName:   settings.businessName   || DEFAULTS.businessName,
        tagline:        settings.tagline        || DEFAULTS.tagline,
        logoUrl:        settings.logoUrl        || DEFAULTS.logoUrl,
        phone:          settings.phone          || DEFAULTS.phone,
        email:          settings.email          || DEFAULTS.email,
        whatsappNumber: settings.whatsappNumber || DEFAULTS.whatsappNumber,
        address:        settings.address        || DEFAULTS.address,
        openingHours:   settings.openingHours   || DEFAULTS.openingHours,
        instagramUrl:   settings.instagramUrl   || DEFAULTS.instagramUrl,
        tiktokUrl:      settings.tiktokUrl      || DEFAULTS.tiktokUrl,
        facebookUrl:    settings.facebookUrl    || DEFAULTS.facebookUrl,
        bioText:        settings.bioText        || DEFAULTS.bioText,
        missionText:    settings.missionText    || DEFAULTS.missionText,
        visionText:     settings.visionText     || DEFAULTS.visionText,
      };
    }
  } catch (err) {
    console.error('Failed to load settings from DB:', err);
  }

  // Fallback when DB is unreachable or the row hasn't been seeded yet
  return DEFAULTS;
}
