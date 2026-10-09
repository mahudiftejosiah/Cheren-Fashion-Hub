/**
 * Run once after adding the trackingId column.
 * Finds any Order rows that somehow still have a null/empty trackingId
 * and assigns each one a fresh UUID.
 *
 * Usage:
 *   npx tsx prisma/backfill-tracking-ids.ts
 */

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // SQLite stores the default UUID at migration time, but just in case
  // any rows slipped through without one we patch them here.
  const orders = await prisma.order.findMany({
    select: { id: true, trackingNumber: true, trackingId: true },
  });

  let patched = 0;

  for (const order of orders) {
    if (!order.trackingId || order.trackingId.trim() === '') {
      const newId = randomUUID();
      await prisma.order.update({
        where: { id: order.id },
        data: { trackingId: newId },
      });
      console.log(`  Patched ${order.trackingNumber}  →  ${newId}`);
      patched++;
    }
  }

  if (patched === 0) {
    console.log('✅ All orders already have a trackingId — nothing to patch.');
  } else {
    console.log(`\n✅ Backfill complete. Patched ${patched} order(s).`);
  }
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
