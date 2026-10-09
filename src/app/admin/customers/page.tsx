import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, ShoppingBag } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { orders: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          Client Relationship Management
        </span>
        <h1 className="font-fashion-serif text-3xl font-bold text-white">
          Customer Directory
        </h1>
      </div>

      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-950/50">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Address</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/40">
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4">
                      <span>{c.phone}</span>
                      <span className="block text-zinc-500 text-[10px]">{c.email}</span>
                    </td>
                    <td className="p-4 text-zinc-400 max-w-[200px] truncate">{c.address || 'N/A'}</td>
                    <td className="p-4 font-bold text-gold-400">{c.orders.length} orders</td>
                    <td className="p-4 text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden divide-y divide-zinc-800">
          {customers.length === 0 ? (
            <p className="p-8 text-center text-zinc-500 text-xs">No customers registered yet.</p>
          ) : (
            customers.map((c) => (
              <div key={c.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <strong className="text-white text-xs">{c.name}</strong>
                  <span className="text-gold-400 font-bold text-[11px]">{c.orders.length} orders</span>
                </div>
                <p className="text-[11px] text-zinc-400">{c.phone}</p>
                <p className="text-[10px] text-zinc-500">{c.email}</p>
                {c.address && <p className="text-[10px] text-zinc-500 truncate">{c.address}</p>}
                <p className="text-[10px] text-zinc-600">Joined {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
