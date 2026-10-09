'use server';

import { prisma } from '@/lib/prisma';
import { verifyPassword, signJWT, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// The master passphrase is set in .env as ADMIN_PASSPHRASE
const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || 'CherenFashion@2026';

export async function loginAdminAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passphrase = formData.get('passphrase') as string;

  if (!email || !password || !passphrase) {
    return { success: false, error: 'All three fields are required — email, password, and passphrase.' };
  }

  // 1. Validate passphrase first — fail silently with generic error to prevent enumeration
  if (passphrase.trim() !== ADMIN_PASSPHRASE) {
    return { success: false, error: 'Access denied. Invalid credentials.' };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Use the same generic error for missing admin to prevent email enumeration
    if (!admin) {
      return { success: false, error: 'Access denied. Invalid credentials.' };
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Access denied. Invalid credentials.' };
    }

    // Generate JWT Token
    const token = await signJWT({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    // Set HTTP-Only Cookie
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return { success: true };
  } catch (err) {
    console.error('Error logging in admin:', err);
    return { success: false, error: 'Authentication failed. Please try again.' };
  }
}

export async function logoutAdminAction() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin/login');
}
