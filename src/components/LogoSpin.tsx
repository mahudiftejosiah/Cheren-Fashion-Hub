/**
 * LogoSpin
 *
 * Renders the Cheren Fashion Hub logo with a continuous globe-like 3D rotation.
 *
 * How the 3D illusion works
 * ─────────────────────────
 * The outer wrapper sets a CSS `perspective` value so that child transforms are
 * interpreted in 3-D space rather than flat 2-D space.  The inner `.logo-globe`
 * element runs two simultaneous keyframe animations defined in globals.css:
 *
 *   logo-globe-spin  — rotates the image 360° around the Y-axis
 *   logo-globe-scale — oscillates scaleX between 1 and ~0.72, mimicking the
 *                      elliptical compression a sphere shows at its sides
 *
 * Together they produce a convincing globe rotation without any JavaScript or
 * additional libraries.  A `@media (prefers-reduced-motion: reduce)` rule in
 * globals.css freezes the animation for users who need it.
 *
 * Props
 * ─────
 * size      — Tailwind size classes for width/height (default: "w-11 h-11")
 * alt       — img alt text
 * className — extra classes forwarded to the outermost wrapper
 */

import React from 'react';

const LOGO_URL =
  'https://dwogqcjjeefostuwilti.supabase.co/storage/v1/object/public/cheren-fashion/IMG_8794.PNG';

interface LogoSpinProps {
  /** Tailwind w-* / h-* classes that control rendered size, e.g. "w-11 h-11" */
  size?: string;
  alt?: string;
  /** Additional classes applied to the outermost wrapper div */
  className?: string;
  /** Pass true on the hero showcase (larger padding + object-contain padding) */
  hero?: boolean;
}

export function LogoSpin({
  size = 'w-11 h-11',
  alt = 'Cheren Fashion Hub Logo',
  className = '',
  hero = false,
}: LogoSpinProps) {
  return (
    /**
     * The perspective wrapper must be a *separate* element from the one that
     * carries the rotateY transform — otherwise `perspective()` inside a
     * `transform` shorthand collapses to a flat projection when combined with
     * the scaleX animation on the same element.
     *
     * Setting perspective here via an inline style is intentional: Tailwind
     * does not ship a `perspective-*` utility by default in v3.
     */
    <div
      className={`relative ${size} rounded-full ${className}`}
      style={{ perspective: '400px' }}
      aria-hidden="false"
    >
      {/* Animated globe element — do NOT add other transforms here */}
      <div className="logo-globe w-full h-full rounded-full overflow-hidden">
        <img
          src={LOGO_URL}
          alt={alt}
          className={`w-full h-full object-contain${hero ? ' p-2' : ''}`}
          draggable={false}
        />
      </div>
    </div>
  );
}
