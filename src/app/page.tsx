import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Scissors, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Play, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Shirt,
  Crown,
  Award,
  Gem,
  Compass
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getBusinessSettings } from '@/lib/getSettings';
import { ReviewsSection } from '@/components/ReviewsSection';

export const revalidate = 60; // Refresh page cache every 60s

export default async function HomePage() {
  const settings = await getBusinessSettings();

  // Fetch Collections
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  // Fetch Featured Fashion Items
  const featuredItems = await prisma.fashionItem.findMany({
    where: { isFeatured: true },
    include: { media: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  // Fetch Videos
  const videos = await prisma.video.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  // Fetch Approved Testimonials
  const testimonials = await prisma.feedback.findMany({
    where: { isApproved: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const stats = [
    { label: 'Happy Clients', value: '1,200+', icon: Crown },
    { label: 'Masterpieces Crafted', value: '3,500+', icon: Gem },
    { label: 'Years of Excellence', value: '12+', icon: Award },
    { label: 'Satisfaction Rate', value: '99.4%', icon: Star },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Vision & Fabric Selection',
      desc: 'Explore signature silhouettes or provide custom inspiration photos.',
      icon: Shirt,
    },
    {
      number: '02',
      title: 'Precision Measurements',
      desc: 'Mathematical fit recorded in-studio or guided via virtual consultation.',
      icon: Ruler,
    },
    {
      number: '03',
      title: 'Artisanal Hand Tailoring',
      desc: 'Master craftspeople hand-stitch every seam and metallic embroidery.',
      icon: Scissors,
    },
    {
      number: '04',
      title: 'Rigorous Quality Audit',
      desc: 'Inspected for flawless fall, lining comfort, and seam durability.',
      icon: ShieldCheck,
    },
    {
      number: '05',
      title: 'White-Glove Delivery',
      desc: 'Shipped directly to your doorstep with unique live tracking timeline.',
      icon: Truck,
    },
  ];

  return (
    <div className="space-y-32 pb-24 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 overflow-hidden">
      
      {/* 1. ROYAL HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-pink-100/50 via-white to-pink-50/30 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950 pt-12 transition-colors duration-300">
        
        {/* Ambient Red/Pink/Purple Orbs */}
        <div className="fashion-orb w-96 h-96 top-10 left-10 opacity-70" />
        <div className="fashion-orb w-[500px] h-[500px] bottom-10 right-10 opacity-50" />

        {/* High Fashion Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 dark:opacity-35">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1920&auto=format&fit=crop"
            alt="Haute Couture Studio Backdrop"
            className="w-full h-full object-cover scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          
          {/* Royal Badge */}
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-pink-500/10 border border-pink-400/40 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-[0.2em] shadow-pink-glow">
            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span>Bespoke Tailoring & Haute Couture</span>
            <Crown className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          </div>

          {/* Heading */}
          <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider text-zinc-900 dark:text-white leading-tight fashion-gradient-text uppercase drop-shadow-2xl">
            {settings.businessName}
          </h1>

          <p className="text-2xl sm:text-3xl text-pink-900 dark:text-pink-200/90 font-light italic font-fashion-serif tracking-wide max-w-3xl mx-auto">
            "{settings.tagline}"
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center space-x-4 max-w-md mx-auto py-2">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-pink-400" />
            <Gem className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-pink-400" />
          </div>

          <p className="max-w-2xl mx-auto text-zinc-700 dark:text-zinc-300 text-base sm:text-lg font-light leading-relaxed">
            {settings.bioText}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link
              href="/collections"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-pink-glow hover:shadow-pink-glow-lg hover:scale-105 transition-all flex items-center justify-center space-x-3 border border-pink-300/40"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/track-order"
              className="w-full sm:w-auto px-9 py-4 rounded-full border border-pink-400/50 hover:border-pink-500 text-pink-700 dark:text-pink-300 hover:bg-pink-500/10 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 backdrop-blur-md"
            >
              <Truck className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Track Your Order</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
            Haute Couture Showcase
          </span>
          <h2 className="font-fashion-serif text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Curated Collections
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-light">
            From regal traditional African ensembles to bespoke executive suits and floor-length evening gowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections#${col.slug}`}
              className="group relative rounded-3xl overflow-hidden luxury-border bg-white dark:bg-zinc-900 h-96 flex flex-col justify-end p-7 shadow-2xl transition-all duration-500"
            >
              <img
                src={col.coverImage}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-65 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider">
                  {col.category}
                </span>
                <h3 className="font-fashion-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-pink-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-zinc-300 text-xs line-clamp-2 font-light">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center text-pink-400 text-xs font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  <span>Discover Designs</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SIGNATURE GALLERY DESIGNS */}
      <section className="bg-pink-100/40 dark:bg-zinc-900/60 py-24 border-y border-pink-200 dark:border-pink-500/20 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
                Fresh From Studio
              </span>
              <h2 className="font-fashion-serif text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
                Signature Fashion Gallery
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 text-pink-600 dark:text-pink-400 hover:text-pink-500 font-bold text-xs uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View Complete Gallery</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => {
              const coverImg = item.media[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
              return (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden luxury-border bg-white dark:bg-zinc-950 p-4 shadow-xl group transition-all"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-pink-500/30 text-pink-400 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>
                  <div className="space-y-3 px-2 pb-2">
                    <h3 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 font-light">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href="/quote"
                        className="inline-flex items-center text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-500 uppercase tracking-wider"
                      >
                        <span>Request Custom Order</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. MOTION & VIDEO SHOWCASE */}
      {videos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
              Artistry in Motion
            </span>
            <h2 className="font-fashion-serif text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
              Fashion Video Showcase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-3xl overflow-hidden luxury-border bg-white dark:bg-zinc-900 shadow-2xl p-4 group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 mb-4">
                  <video
                    controls
                    poster={vid.thumbnailUrl}
                    className="w-full h-full object-cover"
                    preload="none"
                  >
                    <source src={vid.videoUrl} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                </div>
                <div className="px-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 block">
                    {vid.category}
                  </span>
                  <h3 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">
                    {vid.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs font-light">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. ROYAL STATS */}
      <section className="bg-gradient-to-r from-pink-100/60 via-purple-100/40 to-pink-100/60 dark:from-zinc-950 dark:via-purple-950/30 dark:to-zinc-950 py-20 border-y border-pink-200 dark:border-pink-500/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => {
              const IconComp = st.icon;
              return (
                <div key={i} className="p-8 rounded-3xl luxury-border bg-white/80 dark:bg-zinc-900/50 space-y-3">
                  <IconComp className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto" />
                  <span className="block font-cinzel text-4xl sm:text-5xl font-black text-pink-600 dark:text-pink-400 fashion-gradient-text">
                    {st.value}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-bold block">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BESPOKE PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
            Seamless Perfection
          </span>
          <h2 className="font-fashion-serif text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
            How Your Outfit Is Crafted
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {processSteps.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-3xl p-6 luxury-border bg-white dark:bg-zinc-900 text-center flex flex-col items-center shadow-xl space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-pink-glow">
                  <IconComp className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 tracking-widest uppercase block">
                  Step {step.number}
                </span>
                <h3 className="font-fashion-serif text-lg font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. VERIFIED REVIEWS */}
      <ReviewsSection testimonials={testimonials} />

      {/* 8. ORDER TRACKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden luxury-border bg-gradient-to-r from-pink-100 via-purple-100/60 to-pink-100 dark:from-zinc-950 dark:via-purple-950/40 dark:to-zinc-950 p-10 sm:p-16 text-zinc-900 dark:text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors duration-300">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/40 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-widest">
              <Truck className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Real-Time Order Tracking</span>
            </div>
            <h2 className="font-fashion-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Track Your Bespoke Garment Production
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
              Have an active order with us? Enter your unique tracking number to view real-time production stages from fabric cutting to courier dispatch.
            </p>
          </div>

          <Link
            href="/track-order"
            className="shrink-0 px-9 py-4 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-pink-glow border border-pink-300/40"
          >
            Track Order Now
          </Link>
        </div>
      </section>

    </div>
  );
}


