'use client';

import { useEffect, useState } from 'react';
import {
  getInstructorAnalytics,
  getWallet,
  type Wallet,
} from '@/lib/client-api';
import Link from 'next/link';

export default function InstructorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getInstructorAnalytics().then((d) => setAnalytics(d as Record<string, unknown>)),
      getWallet().then(setWallet),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-slate-500">Loading analytics...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
        <Link href="/instructor/courses" className="text-sm font-semibold text-violet-700">
          ← My Courses
        </Link>
      </div>

      {/* Wallet */}
      {wallet && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Earnings</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ${Number(wallet.balance).toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">Available balance</p>

          {wallet.transactions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
              <div className="mt-2 space-y-2">
                {wallet.transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{tx.description || tx.type}</span>
                    <span className={`font-semibold ${Number(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(tx.amount) >= 0 ? '+' : ''}${Number(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics data */}
      {analytics && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Course Analytics</h2>
          <pre className="mt-4 overflow-auto text-sm text-slate-700">
            {JSON.stringify(analytics, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
