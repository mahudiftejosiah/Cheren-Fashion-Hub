/**
 * migrate.ts — runs before `next build` on Vercel.
 * Creates any tables that don't exist yet in the Supabase database.
 * Safe to run multiple times (all statements use IF NOT EXISTS).
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Running database migrations…');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AdminUser" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "email"        TEXT        NOT NULL,
      "passwordHash" TEXT        NOT NULL,
      "name"         TEXT        NOT NULL,
      "role"         TEXT        NOT NULL DEFAULT 'ADMIN',
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "AdminUser_email_key" UNIQUE ("email")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "name"      TEXT        NOT NULL,
      "email"     TEXT        NOT NULL,
      "phone"     TEXT        NOT NULL,
      "address"   TEXT,
      "notes"     TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Customer_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Customer_email_key" UNIQUE ("email")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id"                     TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "trackingNumber"         TEXT        NOT NULL,
      "trackingId"             TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "customerId"             TEXT,
      "customerName"           TEXT        NOT NULL,
      "customerEmail"          TEXT        NOT NULL,
      "customerPhone"          TEXT        NOT NULL,
      "outfitTitle"            TEXT        NOT NULL,
      "description"            TEXT        NOT NULL,
      "measurements"           TEXT,
      "status"                 TEXT        NOT NULL DEFAULT 'ORDER_RECEIVED',
      "expectedCompletionDate" TEXT,
      "deliveryAddress"        TEXT,
      "confirmedAt"            TIMESTAMPTZ,
      "deleteAt"               TIMESTAMPTZ,
      "internalNotes"          TEXT,
      "createdAt"              TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"              TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Order_pkey"                PRIMARY KEY ("id"),
      CONSTRAINT "Order_trackingNumber_key"  UNIQUE ("trackingNumber"),
      CONSTRAINT "Order_trackingId_key"      UNIQUE ("trackingId"),
      CONSTRAINT "Order_customerId_fkey"     FOREIGN KEY ("customerId")
        REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
      "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "orderId"   TEXT        NOT NULL,
      "status"    TEXT        NOT NULL,
      "note"      TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "OrderStatusHistory_pkey"         PRIMARY KEY ("id"),
      CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Collection" (
      "id"          TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "title"       TEXT        NOT NULL,
      "slug"        TEXT        NOT NULL,
      "category"    TEXT        NOT NULL,
      "description" TEXT        NOT NULL,
      "coverImage"  TEXT        NOT NULL,
      "isFeatured"  BOOLEAN     NOT NULL DEFAULT false,
      "isPublished" BOOLEAN     NOT NULL DEFAULT true,
      "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Collection_pkey"     PRIMARY KEY ("id"),
      CONSTRAINT "Collection_slug_key" UNIQUE ("slug")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "FashionItem" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "collectionId" TEXT,
      "title"        TEXT        NOT NULL,
      "description"  TEXT        NOT NULL,
      "category"     TEXT        NOT NULL,
      "tags"         TEXT,
      "isFeatured"   BOOLEAN     NOT NULL DEFAULT false,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "FashionItem_pkey"             PRIMARY KEY ("id"),
      CONSTRAINT "FashionItem_collectionId_fkey" FOREIGN KEY ("collectionId")
        REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Media" (
      "id"            TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "fashionItemId" TEXT        NOT NULL,
      "url"           TEXT        NOT NULL,
      "mediaType"     TEXT        NOT NULL DEFAULT 'IMAGE',
      "altText"       TEXT,
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Media_pkey"               PRIMARY KEY ("id"),
      CONSTRAINT "Media_fashionItemId_fkey" FOREIGN KEY ("fashionItemId")
        REFERENCES "FashionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Video" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "title"        TEXT        NOT NULL,
      "description"  TEXT        NOT NULL,
      "videoUrl"     TEXT        NOT NULL,
      "thumbnailUrl" TEXT        NOT NULL DEFAULT '',
      "category"     TEXT        NOT NULL DEFAULT 'Fashion',
      "isFeatured"   BOOLEAN     NOT NULL DEFAULT false,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Feedback" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "orderId"      TEXT,
      "customerName" TEXT        NOT NULL,
      "rating"       INTEGER     NOT NULL,
      "review"       TEXT        NOT NULL,
      "imageUrl"     TEXT,
      "isApproved"   BOOLEAN     NOT NULL DEFAULT false,
      "isFeatured"   BOOLEAN     NOT NULL DEFAULT false,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Feedback_pkey"       PRIMARY KEY ("id"),
      CONSTRAINT "Feedback_orderId_key" UNIQUE ("orderId"),
      CONSTRAINT "Feedback_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ApprenticeshipApplication" (
      "id"              TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "fullName"        TEXT        NOT NULL,
      "phone"           TEXT        NOT NULL,
      "email"           TEXT        NOT NULL,
      "location"        TEXT        NOT NULL,
      "experienceLevel" TEXT        NOT NULL,
      "skillLevel"      TEXT        NOT NULL,
      "motivation"      TEXT        NOT NULL,
      "availability"    TEXT        NOT NULL,
      "status"          TEXT        NOT NULL DEFAULT 'PENDING',
      "internalNotes"   TEXT,
      "emailStatus"     TEXT,
      "emailSentAt"     TIMESTAMPTZ,
      "emailError"      TEXT,
      "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "ApprenticeshipApplication_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "QuoteRequest" (
      "id"                TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "fullName"          TEXT        NOT NULL,
      "phone"             TEXT        NOT NULL,
      "email"             TEXT        NOT NULL,
      "outfitType"        TEXT        NOT NULL,
      "description"       TEXT        NOT NULL,
      "preferredFabric"   TEXT,
      "desiredDeadline"   TEXT,
      "referenceImageUrl" TEXT,
      "status"            TEXT        NOT NULL DEFAULT 'PENDING',
      "internalNotes"     TEXT,
      "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Appointment" (
      "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "name"           TEXT        NOT NULL,
      "phone"          TEXT        NOT NULL,
      "email"          TEXT        NOT NULL,
      "preferredDate"  TEXT        NOT NULL,
      "preferredTime"  TEXT        NOT NULL,
      "serviceType"    TEXT        NOT NULL,
      "additionalInfo" TEXT,
      "status"         TEXT        NOT NULL DEFAULT 'PENDING',
      "internalNotes"  TEXT,
      "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "name"      TEXT        NOT NULL,
      "email"     TEXT        NOT NULL,
      "phone"     TEXT,
      "subject"   TEXT,
      "message"   TEXT        NOT NULL,
      "isRead"    BOOLEAN     NOT NULL DEFAULT false,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "FAQ" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "question"     TEXT        NOT NULL,
      "answer"       TEXT        NOT NULL,
      "category"     TEXT        NOT NULL DEFAULT 'General',
      "displayOrder" INTEGER     NOT NULL DEFAULT 0,
      "isPublished"  BOOLEAN     NOT NULL DEFAULT true,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Notification" (
      "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "title"     TEXT        NOT NULL,
      "message"   TEXT        NOT NULL,
      "type"      TEXT        NOT NULL,
      "linkUrl"   TEXT,
      "isRead"    BOOLEAN     NOT NULL DEFAULT false,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Certificate" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "title"        TEXT        NOT NULL,
      "institution"  TEXT        NOT NULL,
      "dateObtained" TEXT        NOT NULL,
      "description"  TEXT,
      "fileUrl"      TEXT        NOT NULL,
      "fileType"     TEXT        NOT NULL DEFAULT 'IMAGE',
      "isPublished"  BOOLEAN     NOT NULL DEFAULT false,
      "displayOrder" INTEGER     NOT NULL DEFAULT 0,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "BusinessSettings" (
      "id"             TEXT        NOT NULL DEFAULT 'default',
      "businessName"   TEXT        NOT NULL DEFAULT 'Fashion Hub',
      "tagline"        TEXT        NOT NULL DEFAULT 'Where Your Style Becomes Reality.',
      "logoUrl"        TEXT,
      "phone"          TEXT        NOT NULL DEFAULT '+234 800 123 4567',
      "email"          TEXT        NOT NULL DEFAULT 'contact@fashionhub.com',
      "whatsappNumber" TEXT        NOT NULL DEFAULT '2348001234567',
      "address"        TEXT        NOT NULL DEFAULT '12 Fashion Avenue, Victoria Island, Lagos',
      "openingHours"   TEXT        NOT NULL DEFAULT 'Mon - Sat: 9:00 AM - 6:00 PM',
      "instagramUrl"   TEXT        NOT NULL DEFAULT 'https://instagram.com',
      "tiktokUrl"      TEXT        NOT NULL DEFAULT 'https://tiktok.com',
      "facebookUrl"    TEXT        NOT NULL DEFAULT 'https://facebook.com',
      "bioText"        TEXT        NOT NULL DEFAULT 'Bespoke tailoring and modern luxury fashion designs crafted with precision and passion.',
      "missionText"    TEXT        NOT NULL DEFAULT 'To empower individuals through elegant, custom-crafted apparel that reflects their unique style.',
      "visionText"     TEXT        NOT NULL DEFAULT 'To be the world''s premier fashion and tailoring house celebrating heritage and contemporary design.',
      "themeDefault"   TEXT        NOT NULL DEFAULT 'dark',
      "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "TeamMember" (
      "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
      "name"         TEXT        NOT NULL,
      "role"         TEXT        NOT NULL,
      "bio"          TEXT,
      "imageUrl"     TEXT        NOT NULL,
      "displayOrder" INTEGER     NOT NULL DEFAULT 0,
      "isPublished"  BOOLEAN     NOT NULL DEFAULT true,
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
    );
  `);

  console.log('✅ All tables are up to date.');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
