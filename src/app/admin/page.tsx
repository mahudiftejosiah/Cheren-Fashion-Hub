import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  ShoppingBag,
  Users,
  Layers,
  Star,
  FileText,
  Calendar,
  GraduationCap,
  Mail,
  HelpCircle,
  Bell,
  Settings,
  ArrowRight,
  CheckCircle2,
  Scissors,
  Clock,
  TrendingUp,
  Package,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    activeOrders,
    completedOrders,
    pendingOrders,
    customersCount,
    pendingFeedbackCount,
    applicationsCount,
    quotesCount,
    appointmentsCount,
    messagesCount,
    unreadNotifications,
    recentOrders,
    recentNotifications,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: {
          in: ['ORDER_RECEIVED', 'CONSULTATION', 'MEASUREMENTS_CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY', 'OUT_FOR_DELIVERY'],
        },
      },
    }),
    prisma.order.count({ where: { status: { in: ['DELIVERED', 'CUSTOMER_CONFIRMED'] } } }),
    prisma.order.count({ where: { status: 'ORDER_RECEIVED' } }),
    prisma.customer.count(),
    prisma.feedback.count({ where: { isApproved: false } }),
    prisma.apprenticeshipApplication.count({ where: { status: 'PENDING' } }),
    prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.notification.count({ where: { isRead: false } }),
    prisma.order.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
  ]);

  // ─── Section Index ───────────────────────────────────────────────────────────
  const sections = [
    {
      group: 'Production',
      color: 'blue',
      items: [
        {
          name: 'Orders & Tailoring',
          desc: 'Manage all client orders, track production stages, and update delivery status.',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: activeOrders,
          badgeLabel: 'active',
        },
        {
          name: 'Customer Directory',
          desc: 'View registered clients, contact info, and order history.',
          href: '/admin/customers',
          icon: Users,
          badge: customersCount,
          badgeLabel: 'total',
        },
        {
          name: 'Collections & Media',
          desc: 'Add, edit, or remove fashion collections, garment items and gallery images.',
          href: '/admin/collections',
          icon: Layers,
          badge: null,
          badgeLabel: '',
        },
      ],
    },
    {
      group: 'Requests',
      color: 'violet',
      items: [
        {
          name: 'Quote Requests',
          desc: 'Respond to custom fashion quote submissions from potential clients.',
          href: '/admin/quotes',
          icon: FileText,
          badge: quotesCount,
          badgeLabel: 'pending',
        },
        {
          name: 'Appointments',
          desc: 'Confirm, reschedule, or cancel studio fitting appointments.',
          href: '/admin/appointments',
          icon: Calendar,
          badge: appointmentsCount,
          badgeLabel: 'pending',
        },
        {
          name: 'Apprenticeships',
          desc: 'Review new apprenticeship applications and manage accepted students.',
          href: '/admin/apprenticeships',
          icon: GraduationCap,
          badge: applicationsCount,
          badgeLabel: 'pending',
        },
      ],
    },
    {
      group: 'Engagement',
      color: 'rose',
      items: [
        {
          name: 'Feedback & Reviews',
          desc: 'Moderate client reviews and feature the best ones on the website.',
          href: '/admin/feedback',
          icon: Star,
          badge: pendingFeedbackCount,
          badgeLabel: 'to review',
        },
        {
          name: 'Contact Messages',
          desc: 'Read and respond to enquiries sent via the contact form.',
          href: '/admin/messages',
          icon: Mail,
          badge: messagesCount,
          badgeLabel: 'unread',
        },
        {
          name: 'Notifications',
          desc: 'View all system alerts and real-time studio activity updates.',
          href: '/admin/notifications',
          icon: Bell,
          badge: unreadNotifications,
          badgeLabel: 'unread',
        },
      ],
    },
    {
      group: 'Configuration',
      color: 'emerald',
      items: [
        {
          name: 'FAQ Manager',
          desc: 'Create, edit, or reorder frequently asked questions shown on the website.',
          href: '/admin/faqs',
          icon: HelpCircle,
          badge: null,
          badgeLabel: '',
        },
        {
          name: 'Website Settings',
          desc: 'Update business info, branding, contact details, and social media links.',
          href: '/admin/settings',
          icon: Settings,
          badge: null,
          badgeLabel: '',
        },
      ],
    },
  ];

  const colorMap: Record<string, { border: string; glow: string; badge: string; icon: string; dot: string; label: string }> = {
    blue:    { border: 'hover:border-blue-500/60',   glow: 'group-hover:shadow-blue-500/10',   badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',   icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400',   dot: 'bg-blue-500',   label: 'text-blue-400' },
    violet:  { border: 'hover:border-violet-500/60', glow: 'group-hover:shadow-violet-500/10', badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30', icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400', dot: 'bg-violet-500', label: 'text-violet-400' },
    rose:    { border: 'hover:border-rose-500/60',   glow: 'group-hover:shadow-rose-500/10',   badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',   icon: 'bg-rose-500/10 border-rose-500/20 text-rose-400',   dot: 'bg-rose-500',   label: 'text-rose-400' },
    emerald: { border: 'hover:border-emerald-500/60',glow: 'group-hover:shadow-emerald-500/10',badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'bg-emerald-500', label: 'text-emerald-400' },
  };

  const statusColorMap: Record<string, string> = {
    ORDER_RECEIVED:        'bg-sky-500/15 text-sky-400 border-sky-500/30',
    CONSULTATION:          'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    MEASUREMENTS_CONFIRMED:'bg-violet-500/15 text-violet-400 border-violet-500/30',
    IN_PRODUCTION:         'bg-amber-500/15 text-amber-400 border-amber-500/30',
    QUALITY_CHECK:         'bg-orange-500/15 text-orange-400 border-orange-500/30',
    READY:                 'bg-lime-500/15 text-lime-400 border-lime-500/30',
    OUT_FOR_DELIVERY:      'bg-teal-500/15 text-teal-400 border-teal-500/30',
    DELIVERED:             'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    CUSTOMER_CONFIRMED:    'bg-green-500/15 text-green-400 border-green-500/30',
  };

  return (
    <div className="space-y-12 pb-16">

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800 p-8 sm:p-10">
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Studio is Live</span>
            </div>
            <h1 className="font-fashion-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Cheren Admin Studio
            </h1>
            <p className="text-zinc-400 text-sm max-w-md">
              Everything you need to run your fashion business — orders, clients, bookings, content and settings — all from here.
            </p>
          </div>

          {/* Quick stats pill row */}
          <div className="flex flex-wrap gap-3 shrink-0 sm:justify-end">
            {[
              { label: 'Active Orders', value: activeOrders, icon: Package, color: 'text-blue-400' },
              { label: 'Completed', value: completedOrders, icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'New Pending', value: pendingOrders, icon: Clock, color: 'text-amber-400' },
            ].map((s) => {
              const I = s.icon;
              return (
                <div key={s.label} className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                  <I className={`w-4 h-4 ${s.color}`} />
                  <div>
                    <p className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breadcrumb quick-nav */}
        <div className="relative mt-8 flex flex-wrap gap-2">
          {sections.map((s) => {
            const c = colorMap[s.color];
            return (
              <span
                key={s.group}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${c.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span>{s.group}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Section Index Grid ───────────────────────────────────────────── */}
      {sections.map((section) => {
        const c = colorMap[section.color];
        return (
          <div key={section.group} className="space-y-4">
            {/* Section header */}
            <div className="flex items-center space-x-3">
              <span className={`w-3 h-3 rounded-full ${c.dot}`} />
              <h2 className={`font-fashion-serif text-xl font-bold ${c.label} uppercase tracking-widest`}>
                {section.group}
              </h2>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900 border border-zinc-800 ${c.border} shadow-lg hover:shadow-xl ${c.glow} transition-all duration-300`}
                  >
                    {/* Top: icon + badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${c.icon}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {item.badge !== null && item.badge > 0 && (
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase ${c.badge}`}>
                          {item.badge} {item.badgeLabel}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-white font-bold text-sm group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Footer CTA */}
                    <div className={`mt-5 flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider ${c.label} group-hover:translate-x-1 transition-transform`}>
                      <span>Open Section</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Bottom Row: Recent Orders + Recent Alerts ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-3 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-fashion-serif text-lg font-bold text-white border-l-2 border-blue-500 pl-3">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentOrders.length === 0 && (
              <p className="text-zinc-500 text-xs py-4 text-center">No orders yet.</p>
            )}
            {recentOrders.map((ord) => (
              <Link
                key={ord.id}
                href="/admin/orders"
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-xs font-mono">{ord.trackingNumber}</p>
                    <p className="text-zinc-500 text-[11px] truncate">{ord.customerName} · {ord.outfitTitle}</p>
                  </div>
                </div>
                <span className={`ml-3 shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColorMap[ord.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                  {ord.status.replace(/_/g, ' ')}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center justify-center w-full py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/10 transition-colors"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Manage All Orders
          </Link>
        </div>

        {/* Recent Notifications */}
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-fashion-serif text-lg font-bold text-white border-l-2 border-violet-500 pl-3">
              Notifications
            </h2>
            <Link href="/admin/notifications" className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1">
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 flex-1">
            {recentNotifications.length === 0 && (
              <p className="text-zinc-500 text-xs py-4 text-center">No notifications.</p>
            )}
            {recentNotifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-violet-400 font-bold text-xs leading-snug">{n.title}</span>
                  <span className="text-[10px] text-zinc-600 shrink-0 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">{n.message}</p>
              </div>
            ))}
          </div>

          <Link
            href="/admin/notifications"
            className="flex items-center justify-center w-full py-2.5 rounded-xl border border-violet-500/30 text-violet-400 text-xs font-bold uppercase tracking-wider hover:bg-violet-500/10 transition-colors"
          >
            <Bell className="w-4 h-4 mr-2" />
            View All Alerts
          </Link>
        </div>

      </div>

      {/* ── Quick Access Footer ──────────────────────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-900 border border-zinc-800 p-6">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Quick Access — Every Page</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Orders',          href: '/admin/orders',          icon: ShoppingBag },
            { name: 'Customers',       href: '/admin/customers',       icon: Users },
            { name: 'Collections',     href: '/admin/collections',     icon: Layers },
            { name: 'Feedback',        href: '/admin/feedback',        icon: Star },
            { name: 'Quotes',          href: '/admin/quotes',          icon: FileText },
            { name: 'Appointments',    href: '/admin/appointments',    icon: Calendar },
            { name: 'Apprenticeships', href: '/admin/apprenticeships', icon: GraduationCap },
            { name: 'Messages',        href: '/admin/messages',        icon: Mail },
            { name: 'FAQs',            href: '/admin/faqs',            icon: HelpCircle },
            { name: 'Notifications',   href: '/admin/notifications',   icon: Bell },
            { name: 'Settings',        href: '/admin/settings',        icon: Settings },
          ].map((link) => {
            const I = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
              >
                <I className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
