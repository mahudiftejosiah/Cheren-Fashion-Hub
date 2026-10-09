'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
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
  LogOut, 
  Scissors, 
  Menu, 
  X 
} from 'lucide-react';
import { logoutAdminAction } from '@/app/actions/auth';

interface AdminSidebarProps {
  unreadNotificationsCount: number;
}

export function AdminSidebar({ unreadNotificationsCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Collections & Media', href: '/admin/collections', icon: Layers },
    { name: 'Feedback & Reviews', href: '/admin/feedback', icon: Star },
    { name: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Apprenticeships', href: '/admin/apprenticeships', icon: GraduationCap },
    { name: 'Contact Messages', href: '/admin/messages', icon: Mail },
    { name: 'FAQ Manager', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: unreadNotificationsCount },
    { name: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar — fixed height h-[61px] matches the pt-[61px] offset in layout */}
      <div className="lg:hidden flex items-center justify-between px-4 h-[61px] bg-zinc-950 border-b border-zinc-800 text-white fixed top-0 left-0 right-0 z-50">
        <Link href="/admin" className="flex items-center space-x-2 font-fashion-serif font-bold text-lg">
          <Scissors className="w-5 h-5 text-blue-500" />
          <span>Studio Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile — sits above top bar so it dims it too */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[55] bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation — always above overlay */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[60] w-64 bg-zinc-950 border-r border-zinc-800 text-zinc-300 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Admin sidebar navigation"
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo Header */}
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-glow-blue">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="font-fashion-serif text-lg font-bold text-white block group-hover:text-blue-400 transition-colors">
                Fashion Studio
              </span>
              <span className="text-[9px] uppercase tracking-widest text-blue-400 block font-semibold">
                Admin Management
              </span>
            </div>
          </Link>

          {/* Links */}
          <nav className="space-y-1.5 pt-4">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-zinc-950 text-blue-400'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-zinc-900">
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

