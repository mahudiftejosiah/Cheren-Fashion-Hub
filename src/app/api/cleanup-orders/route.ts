import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/cleanup-orders
 *
 * Deletes all orders whose deleteAt timestamp has passed (i.e. confirmed 24h+ ago).
 *
 * Call this on a schedule — two options:
 *
 * Option A — Vercel Cron (vercel.json):
 *   { "crons": [{ "path": "/api/cleanup-orders", "schedule": "0 * * * *" }] }
 *   This fires every hour automatically on Vercel.
 *
 * Option B — Manual / self-hosted:
 *   Hit GET /api/cleanup-orders with the secret header:
 *   Authorization: Bearer <CLEANUP_SECRET>
 *   Set CLEANUP_SECRET in your .env file.
 *
 * The route is protected by a secret so random visitors can't trigger it.
 */
export async function GET(request: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const secret = process.env.CLEANUP_SECRET;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // On Vercel, cron jobs send a special header instead — allow that too
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';

  if (secret && !isVercelCron && token !== secret) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find orders due for deletion first so we can log them
    const due = await prisma.order.findMany({
      where: {
        deleteAt: { lte: now },
      },
      select: {
        id: true,
        trackingNumber: true,
        customerName: true,
        confirmedAt: true,
        deleteAt: true,
      },
    });

    if (due.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: 'No orders due for deletion.',
      });
    }

    // Delete them — cascade removes OrderStatusHistory and Feedback automatically
    const result = await prisma.order.deleteMany({
      where: {
        deleteAt: { lte: now },
      },
    });

    console.log(
      `[cleanup-orders] Deleted ${result.count} confirmed order(s):`,
      due.map((o) => o.trackingNumber).join(', ')
    );

    return NextResponse.json({
      success: true,
      deleted: result.count,
      orders: due.map((o) => ({
        trackingNumber: o.trackingNumber,
        customerName: o.customerName,
        confirmedAt: o.confirmedAt?.toISOString(),
        deletedAt: now.toISOString(),
      })),
    });
  } catch (err) {
    console.error('[cleanup-orders] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Cleanup failed. Check server logs.' },
      { status: 500 }
    );
  }
}
