import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: {
      phone: '+234 903 738 1538',
      email: 'mahudiftefreeman@gmail.com',
      whatsappNumber: '2349037381538',
      address: 'Shagari Phase1 Sabon Pegi, Opp. Yola Model School, Yola Town, Adamawa State',
      openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
    create: {
      id: 'default',
      businessName: 'CHEREN FASHION HUB',
      tagline: 'Where Your Style Becomes Reality.',
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
    },
  });

  console.log('✅ Business settings updated successfully!');
  console.log('   Address : Shagari Phase1 Sabon Pegi, Opp. Yola Model School, Yola Town, Adamawa State');
  console.log('   Phone   : +234 903 738 1538');
  console.log('   Email   : mahudiftefreeman@gmail.com');
  console.log('   WhatsApp: https://wa.me/2349037381538');
  console.log('   Hours   : Mon - Sat: 9:00 AM - 6:00 PM');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
