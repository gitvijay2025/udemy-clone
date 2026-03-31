'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredUser } from '@/lib/client-api';

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function RoleGuard({ allowedRoles, children }: Props) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied' | 'unauthenticated'>('loading');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      setStatus('unauthenticated');
    } else if (allowedRoles.includes(user.role)) {
      setStatus('allowed');
    } else {
      setStatus('denied');
    }
  }, [allowedRoles]);

  if (status === 'loading') {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Login Required</h1>
        <p className="mt-2 text-slate-600">You need to log in to access this page.</p>
        <Link
          href="/auth/login"
          className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  if (status === 'denied') {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
        <p className="mt-2 text-slate-600">You do not have permission to view this page.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Go to Homepage
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
