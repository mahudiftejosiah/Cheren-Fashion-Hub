import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Default Admin User
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'mahudiftefreeman@gmail.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'mahudifte2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: 'Cheren Lead Designer',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Default Business Settings
  const settings = await prisma.businessSettings.upsert({
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
      logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=300&auto=format&fit=crop',
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
      visionText: 'To be the world\'s premier fashion and tailoring house celebrating heritage and contemporary design.',
    },
  });
  console.log(`✅ Business settings seeded: ${settings.businessName}`);

  // 3. Seed Collections
  const collectionData = [
    {
      title: 'Royalty & Heritage Collection',
      slug: 'royalty-heritage',
      category: 'Traditional/African Wear',
      description: 'Handcrafted agbada, embellished lace, and regal Ankara ensembles featuring rich textures.',
      coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      title: 'Executive Elegance',
      slug: 'executive-elegance',
      category: "Men's Wear",
      description: 'Tailored sharp suits, bespoke tuxedos, and refined formal menswear for elite occasions.',
      coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      title: 'Haute Couture Evening Wear',
      slug: 'haute-couture',
      category: "Women's Wear",
      description: 'Bespoke ball gowns, floor-length silk silhouettes, and hand-beaded dinner dresses.',
      coverImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      title: 'Occasion & Celebration',
      slug: 'occasion-wear',
      category: 'Occasion Wear',
      description: 'Stunning bridesmaid attire, groomsmen sets, and high-fashion celebration outfits.',
      coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      isFeatured: false,
    },
  ];

  for (const col of collectionData) {
    const createdCol = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });

    // Seed Fashion Items for this collection
    await prisma.fashionItem.create({
      data: {
        collectionId: createdCol.id,
        title: `${col.title} - Signature Piece 1`,
        description: `Exquisite custom tailored outfit from our ${col.title}. Designed with premium imported fabrics.`,
        category: col.category,
        tags: 'Luxury, Bespoke, Hand-stitched, Signature',
        isFeatured: true,
        media: {
          create: [
            {
              url: col.coverImage,
              mediaType: 'IMAGE',
              altText: `${col.title} Front View`,
            },
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
              mediaType: 'IMAGE',
              altText: `${col.title} Detail View`,
            },
          ],
        },
      },
    });
  }
  console.log('✅ Collections & Fashion items seeded.');

  // 4. Seed Videos
  await prisma.video.createMany({
    data: [
      {
        title: 'Behind the Scenes: Crafting the Royal Agbada',
        description: 'Watch our master tailors meticulously hand-embroider 100% cotton silk fabric.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
        category: 'Behind the Scenes',
        isFeatured: true,
      },
      {
        title: 'Runway Highlights - Autumn Fashion Showcase',
        description: 'Exclusive look at our signature womenswear line featured on the international runway.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        category: 'Fashion Show',
        isFeatured: true,
      },
    ],
  });
  console.log('✅ Video showcase seeded.');

  // 5. Seed Customer & Sample Orders
  const customer = await prisma.customer.upsert({
    where: { email: 'adewale@example.com' },
    update: {},
    create: {
      name: 'Adewale Johnson',
      email: 'adewale@example.com',
      phone: '+234 812 345 6789',
      address: 'Plot 45 Admiralty Way, Lekki Phase 1, Lagos',
    },
  });

  const order1 = await prisma.order.upsert({
    where: { trackingNumber: 'FH-2026-0001' },
    update: {},
    create: {
      trackingNumber: 'FH-2026-0001',
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      outfitTitle: 'Three-Piece Velvet Tuxedo & Silk Bow',
      description: 'Custom navy velvet blazer with satin lapels, black trousers, and crisp white tuxedo shirt.',
      measurements: 'Chest: 42in, Waist: 34in, Shoulder: 18.5in, Sleeve: 25.5in, Inseam: 32in',
      status: 'IN_PRODUCTION',
      expectedCompletionDate: '2026-10-15',
      deliveryAddress: customer.address,
      internalNotes: 'Fabric imported from Italy. Fitting scheduled for Oct 12.',
      history: {
        create: [
          { status: 'ORDER_RECEIVED', note: 'Order placed via consultation.' },
          { status: 'CONSULTATION', note: 'Style and velvet fabric confirmed.' },
          { status: 'MEASUREMENTS_CONFIRMED', note: 'Measurements recorded in studio.' },
          { status: 'IN_PRODUCTION', note: 'Cutting and hand-stitching commenced.' },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { trackingNumber: 'FH-2026-0002' },
    update: {},
    create: {
      trackingNumber: 'FH-2026-0002',
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      outfitTitle: 'Royal Gold Embroidered Agbada Set',
      description: 'Heavy damask fabric with gold metallic embroidery detailing on front chest piece.',
      measurements: 'Height: 6ft, Chest: 44in, Shoulder: 19in',
      status: 'DELIVERED',
      expectedCompletionDate: '2026-10-01',
      deliveryAddress: customer.address,
      confirmedAt: new Date(),
      internalNotes: 'Dispatched via express courier.',
      history: {
        create: [
          { status: 'ORDER_RECEIVED', note: 'Order logged.' },
          { status: 'IN_PRODUCTION', note: 'Embroidery finished.' },
          { status: 'READY', note: 'Quality audit passed.' },
          { status: 'DELIVERED', note: 'Courier delivered outfit.' },
          { status: 'CUSTOMER_CONFIRMED', note: 'Customer clicked receipt confirmation.' },
        ],
      },
      feedback: {
        create: {
          customerName: 'Adewale Johnson',
          rating: 5,
          review: 'The agbada fit like perfection! Everyone at the wedding kept asking who made my outfit. Outstanding quality!',
          imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
          isApproved: true,
          isFeatured: true,
        },
      },
    },
  });
  console.log(`✅ Sample orders seeded: ${order1.trackingNumber}, ${order2.trackingNumber}`);

  // 6. Seed FAQs
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'You can request a quotation online or book an in-person consultation through our website. Once we discuss your style preferences and confirm measurements, your custom order is generated with a unique tracking code.',
      category: 'Orders',
      displayOrder: 1,
    },
    {
      question: 'How long does tailoring take?',
      answer: 'Standard bespoke tailoring takes between 7 to 14 business days depending on outfit complexity. Express tailoring services are also available upon request.',
      category: 'Production',
      displayOrder: 2,
    },
    {
      question: 'Do you accept custom designs from photos?',
      answer: 'Yes! You can upload reference photos through our "Request a Quote" page. Our designer will review your inspiration and guide fabric choices to bring it to life.',
      category: 'Design',
      displayOrder: 3,
    },
    {
      question: 'How do I provide measurements?',
      answer: 'You can visit our studio for professional measurements, or follow our easy online measurement guide during your consultation call.',
      category: 'Measurements',
      displayOrder: 4,
    },
    {
      question: 'Do you deliver nationwide and internationally?',
      answer: 'Yes, we offer worldwide doorstep delivery via insured door-to-door courier services.',
      category: 'Delivery',
      displayOrder: 5,
    },
    {
      question: 'How do I track my order?',
      answer: 'Enter your unique tracking code (e.g., FH-2026-0001) on our "Track My Order" page for live updates on every production stage.',
      category: 'Orders',
      displayOrder: 6,
    },
    {
      question: 'Do you accept fashion apprentices?',
      answer: 'Yes, we run an intensive hands-on apprenticeship program. Interested individuals can apply via our "Become an Apprentice" portal.',
      category: 'Apprenticeship',
      displayOrder: 7,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs seeded.');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
