import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const WORKFLOW_STAGES = [
  'ORDER_RECEIVED',
  'CONSULTATION',
  'MEASUREMENTS_CONFIRMED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CUSTOMER_CONFIRMED',
];

function buildOrderResponse(order: any) {
  const stageIndex = WORKFLOW_STAGES.indexOf(order.status);
  return {
    success: true,
    order: {
      trackingNumber: order.trackingNumber,
      customerName: order.customerName,
      outfitTitle: order.outfitTitle,
      description: order.description,
      status: order.status,
      stageIndex: stageIndex >= 0 ? stageIndex : 0,
      totalStages: WORKFLOW_STAGES.length,
      expectedCompletionDate: order.expectedCompletionDate ?? null,
      deliveryAddress: order.deliveryAddress ?? null,
      confirmedAt: order.confirmedAt ? order.confirmedAt.toISOString() : null,
      history: order.history.map((h: any) => ({
        id: h.id,
        status: h.status,
        note: h.note ?? null,
        createdAt: h.createdAt.toISOString(),
      })),
    },
  };
}

// GET /api/track-order?trackingNumber=FH-2026-0001
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const trackingNumber = searchParams.get('trackingNumber')?.trim().toUpperCase();

  if (!trackingNumber) {
    return NextResponse.json(
      { success: false, error: 'Missing trackingNumber query parameter.' },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { trackingNumber },
      include: { history: { orderBy: { createdAt: 'asc' } } },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: `No order found with tracking number "${trackingNumber}".` },
        { status: 404 }
      );
    }

    return NextResponse.json(buildOrderResponse(order));
  } catch (err) {
    console.error('[/api/track-order] GET error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

// POST /api/track-order  { trackingNumber: "FH-2026-0001" }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const trackingNumber = (body?.trackingNumber as string | undefined)?.trim().toUpperCase();

    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing trackingNumber in request body.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber },
      include: { history: { orderBy: { createdAt: 'asc' } } },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: `No order found with tracking number "${trackingNumber}".` },
        { status: 404 }
      );
    }

    return NextResponse.json(buildOrderResponse(order));
  } catch (err) {
    console.error('[/api/track-order] POST error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
