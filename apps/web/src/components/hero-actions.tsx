'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredUser } from '@/lib/client-api';

export function HeroActions() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    function sync() {
      const u = getStoredUser();
      setUser(u ? { name: u.name, role: u.role } : null);
    }
    sync();
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href="/courses"
        className="rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400"
      >
        Explore courses
      </Link>

      {user ? (
        <Link
          href="/my-learning"
          className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-400"
        >
          My Learning
        </Link>
      ) : (
        <Link
          href="/auth/register"
          className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-400"
        >
          Start learning
        </Link>
      )}

      {user && isInstructor ? (
        <Link
          href="/instructor/courses"
          className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-400"
        >
          Instructor dashboard
        </Link>
      ) : !user ? (
        <Link
          href="/instructor/courses/new"
          className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-400"
        >
          Become instructor
        </Link>
      ) : null}
    </div>
  );
}
