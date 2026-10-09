import React from 'react';
import Link from 'next/link';
import { 
  Shirt, 
  Calendar, 
  Ruler, 
  Scissors, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | Our Tailoring Process',
  description: 'Learn step-by-step how Cheren Fashion Collection crafts bespoke tailored outfits from initial consultation to delivery confirmation.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Style',
      subtitle: 'Exploration & Inspiration',
      desc: 'Browse our signature online collections, or upload reference photos of your dream outfit during quotation.',
      icon: Shirt,
    },
    {
      step: '02',
      title: 'Personal Consultation',
      subtitle: 'Designer Alignment',
      desc: 'Meet with our lead designer in-person or virtually to discuss fabric weights, embellishment patterns, and styling choices.',
      icon: Calendar,
    },
    {
      step: '03',
      title: 'Measurements & Requirements',
      subtitle: 'Anatomical Precision',
      desc: 'We record over 15 precise body measurements to guarantee a flawless drape and comfortable fit.',
      icon: Ruler,
    },
    {
      step: '04',
      title: 'Bespoke Production',
      subtitle: 'Artisanal Crafting',
      desc: 'Master artisans hand-draft pattern blocks, cut premium fabrics, and execute detailed embroidery and seams.',
      icon: Scissors,
    },
    {
      step: '05',
      title: 'Quality Check & Audit',
      subtitle: 'Zero-Defect Inspection',
      desc: 'Our quality supervisor inspects seam strength, zipper action, lining finish, and measurement compliance.',
      icon: ShieldCheck,
    },
    {
      step: '06',
      title: 'Insured Delivery',
      subtitle: 'Doorstep Shipping',
      desc: 'Your garment is carefully packaged in a protective garment bag and dispatched with a unique tracking code.',
      icon: Truck,
    },
    {
      step: '07',
      title: 'Customer Receipt Confirmation',
      subtitle: 'Final Satisfaction',
      desc: 'You confirm receipt on our tracking portal, unlock customer feedback, and share your 5-star review!',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Transparency & Perfection
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white mb-4">
          How It Works
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
          From the first sketch to final delivery confirmation, discover how we turn your style vision into luxury reality.
        </p>
      </div>

      {/* 7 Step Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="space-y-10">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gold-500/50 transition-colors"
              >
                <div className="flex items-start space-x-6">
                  {/* Number Badge & Icon */}
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-500 flex flex-col items-center justify-center font-bold">
                    <IconComp className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] uppercase font-bold">Step {item.step}</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-6">
          <h2 className="font-fashion-serif text-3xl font-bold">
            Ready to Begin Step 01?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Book a personal consultation with our master tailor today or submit your design ideas for an instant quotation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="px-8 py-4 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-glow"
            >
              Book Consultation Now
            </Link>
            <Link
              href="/quote"
              className="px-8 py-4 rounded-full border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
