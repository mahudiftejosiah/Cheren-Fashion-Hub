import React from 'react';
import Link from 'next/link';
import {
  Scissors,
  Award,
  Target,
  Eye,
  Heart,
  CheckCircle2,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
  Crown,
  Gem,
} from 'lucide-react';
import { getBusinessSettings } from '@/lib/getSettings';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'About Our Brand & Designer',
  description: 'Learn about Cheren Fashion Collection, our story, founder, values, and bespoke tailoring craftsmanship.',
};

export default async function AboutPage() {
  const settings = await getBusinessSettings();

  // Fetch published certificates ordered by displayOrder
  const certificates = await prisma.certificate.findMany({
    where: { isPublished: true },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });

  // Fetch published team members / co-founders
  const teamMembers = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
  });

  const values = [
    {
      title: 'Precision Craftsmanship',
      desc: 'Every stitch, seam, and hem is tailored with absolute mathematical exactness.',
      icon: Scissors,
    },
    {
      title: 'Heritage & Innovation',
      desc: 'We blend traditional African embroidery techniques with modern European silhouette cuts.',
      icon: Heart,
    },
    {
      title: 'Uncompromised Luxury',
      desc: 'We source only premium silks, velvet, damask, wool, and authentic African fabrics.',
      icon: Award,
    },
  ];

  const specializations = [
    'Traditional & Royal African Wear (Agbada, Kaftans, Embellished Lace)',
    'Executive Bespoke Suits & Tuxedos',
    'Haute Couture Evening Gowns & Ball Dresses',
    'Custom Bridal & Groomsmen Wedding Outfits',
    'Ready-to-Wear Luxury Casual Collections',
  ];

  return (
    <div className="py-12 space-y-20">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Heritage & Legacy
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
          About {settings.businessName}
        </h1>
        <p className="max-w-3xl mx-auto text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
          {settings.tagline}
        </p>
      </section>

      {/* Story & Founder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
              alt="Fashion Studio Tailoring"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">Master Tailor & Founder</span>
              <p className="font-fashion-serif text-lg font-bold">Cheren Lead Artisan</p>
            </div>
          </div>

          {/* Text Story */}
          <div className="space-y-6">
            <h2 className="font-fashion-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Where Style Meets Perfection
            </h2>
            
            <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
              Founded over a decade ago, <strong>{settings.businessName}</strong> was born out of a deep reverence for high tailoring, African culture, and modern elegance. What started as a modest atelier has grown into an international luxury tailoring house serving dignitaries, corporate executives, and fashion lovers worldwide.
            </p>

            <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
              We believe garment making is a sacred form of self-expression. Every client who steps into our studio receives a personalized experience — from initial sketch inspiration to custom pattern drafting and final hand fitting.
            </p>

            {/* Specialization List */}
            <div className="pt-4">
              <h3 className="font-bold text-sm text-gold-600 dark:text-gold-400 uppercase tracking-wider mb-3">
                Areas of Specialization:
              </h3>
              <ul className="space-y-2.5">
                {specializations.map((spec, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-zinc-950 text-white py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-fashion-serif text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {settings.missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-fashion-serif text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {settings.visionText}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CO-FOUNDERS & TEAM */}
      {teamMembers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
              The Visionaries
            </span>
            <h2 className="font-fashion-serif text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
              Meet Our Co-Founders
            </h2>
            <div className="flex items-center justify-center space-x-4 max-w-xs mx-auto">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-pink-400" />
              <Crown className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-pink-400" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light">
              The creative minds and driving force behind {settings.businessName}.
            </p>
          </div>

          <div className={`grid gap-8 ${
            teamMembers.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
            teamMembers.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
            teamMembers.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-' + Math.min(teamMembers.length, 4) :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {teamMembers.map((member) => (
              <div key={member.id} className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:border-pink-400/50 dark:hover:border-pink-500/40 transition-all duration-500">
                {/* Photo */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Badge overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-md border border-pink-400/30 mb-2">
                      <Gem className="w-3 h-3 text-pink-300" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-pink-200">{member.role}</span>
                    </div>
                    <h3 className="font-fashion-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Bio */}
                {member.bio && (
                  <div className="p-5">
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Our Pillars</h2>
          <h3 className="font-fashion-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Core Values
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => {
            const IconComponent = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {v.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificates & Qualifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Credentials</h2>
          <h3 className="font-fashion-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Certificates &amp; Qualifications
          </h3>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Professionally trained and formally certified in fashion design, pattern making, and garment construction.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <Award className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">No certificates have been published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-gold-400/50 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Certificate preview */}
                <div className="relative h-52 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {cert.fileType === 'PDF' ? (
                    <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                      <Award className="w-14 h-14 text-gold-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">PDF Certificate</span>
                    </div>
                  ) : (
                    <img
                      src={cert.fileUrl}
                      alt={cert.title}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Gold overlay shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Info */}
                <div className="p-5 flex-grow space-y-1.5">
                  <h4 className="font-fashion-serif text-base font-bold text-zinc-900 dark:text-white leading-snug">
                    {cert.title}
                  </h4>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{cert.institution}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-gold-600 dark:text-gold-400 font-bold">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{cert.dateObtained}</span>
                  </div>
                  {cert.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed pt-1 line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-2">
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </a>
                  <a
                    href={cert.fileUrl}
                    download
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gold-400/40 bg-gold-500/5 text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:bg-gold-500/15 hover:border-gold-400/70 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Studio Location & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-900 text-white p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>Visit Our Studio</span>
            </div>
            <h3 className="font-fashion-serif text-3xl font-bold mb-2">
              Experience Bespoke Fitting in Person
            </h3>
            <p className="text-zinc-400 text-sm">
              {settings.address} • {settings.openingHours}
            </p>
          </div>

          <Link
            href="/book"
            className="shrink-0 px-8 py-4 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-glow flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
