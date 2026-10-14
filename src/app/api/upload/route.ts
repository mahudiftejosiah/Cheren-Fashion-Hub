import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { verifyJWT, COOKIE_NAME } from '@/lib/auth';

// Supabase admin client — uses the service-role key so uploads bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = 'cheren-fashion';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'application/pdf',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
];
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

const MAX_IMAGE_MB    = 10;
const MAX_VIDEO_MB    = 200;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  // ── Auth — only logged-in admins can upload ────────────────────────────────
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const session = await verifyJWT(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  // ── Parse multipart form data ──────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid form data.' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
  }

  // ── Server-side validation ─────────────────────────────────────────────────
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, PDF, MP4, WebM, MOV, AVI.' },
      { status: 400 }
    );
  }

  const isVideo  = VIDEO_TYPES.includes(file.type);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const maxMB    = isVideo ? MAX_VIDEO_MB    : MAX_IMAGE_MB;

  if (file.size > maxBytes) {
    return NextResponse.json(
      { success: false, error: `File too large. Maximum size is ${maxMB}MB for ${isVideo ? 'videos' : 'images'}.` },
      { status: 400 }
    );
  }

  // ── Upload to Supabase Storage ─────────────────────────────────────────────
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    // Build a unique, collision-proof path: uploads/<timestamp>-<random>.<ext>
    const ext      = file.name.split('.').pop() ?? 'bin';
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType:  file.type,
        cacheControl: '3600',
        upsert:       false,
      });

    if (uploadError) {
      console.error('[/api/upload] Supabase Storage error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Upload failed. Please try again.' },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filename);

    return NextResponse.json({ success: true, url: urlData.publicUrl, mediaType: isVideo ? 'VIDEO' : 'IMAGE' });
  } catch (err) {
    console.error('[/api/upload] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
