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
  Calendar 
} from 'lucide-react';
import { getBusinessSettings } from '@/lib/getSettings';

export const metadata = {
  title: 'About Our Brand & Designer',
  description: 'Learn about Cheren Fashion Collection, our story, founder, values, and bespoke tailoring craftsmanship.',
};

export default async function AboutPage() {
  const settings = await getBusinessSettings();

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
