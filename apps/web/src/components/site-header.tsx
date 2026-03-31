'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearSession, getStoredUser, getUnreadCount, getUnreadMessageCount } from '@/lib/client-api';

export function SiteHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    function syncAuth() {
      const user = getStoredUser();
      setUserName(user?.name ?? null);
      setUserRole(user?.role ?? null);

      if (user) {
        getUnreadCount()
          .then((res) => setUnreadNotifs(res.count))
          .catch(() => {});
        getUnreadMessageCount()
          .then((res) => setUnreadMsgs(res.count))
          .catch(() => {});
      } else {
        setUnreadNotifs(0);
        setUnreadMsgs(0);
      }
    }

    syncAuth();
    window.addEventListener('auth-change', syncAuth);

    // Poll every 30s for new messages/notifications
    const interval = setInterval(syncAuth, 30000);
    return () => {
      window.removeEventListener('auth-change', syncAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Udemy Clone
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
          {userRole !== 'ADMIN' && (
            <Link href="/courses" className="hover:text-slate-950">
              Courses
            </Link>
          )}

          {userName && userRole !== 'ADMIN' && (
            <>
              {userRole === 'STUDENT' && (
                <Link href="/my-learning" className="hover:text-slate-950">
                  My Learning
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative hover:text-slate-950">
                🛒 Cart
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className={`relative transition-colors ${
                  unreadNotifs > 0
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'hover:text-slate-950'
                }`}
              >
                🔔
                {unreadNotifs > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </span>
                )}
              </Link>

              {/* Messages */}
              <Link
                href="/messages"
                className={`relative transition-colors ${
                  unreadMsgs > 0
                    ? 'text-violet-600 hover:text-violet-700'
                    : 'hover:text-slate-950'
                }`}
              >
                ✉️
                {unreadMsgs > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {unreadMsgs > 9 ? '9+' : unreadMsgs}
                  </span>
                )}
              </Link>

              {/* Support */}
              <Link href="/support" className="hover:text-slate-950">
                Support
              </Link>
            </>
          )}

          {userRole === 'INSTRUCTOR' && (
            <Link href="/instructor/courses" className="hover:text-slate-950">
              Instructor
            </Link>
          )}

          {userRole === 'ADMIN' && (
            <Link
              href="/admin"
              className="rounded-md bg-red-100 px-3 py-1.5 text-red-700 hover:bg-red-200"
            >
              Admin
            </Link>
          )}

          {!userName ? (
            <>
              <Link href="/auth/login" className="rounded-md border border-slate-300 px-3 py-1.5">
                Login
              </Link>
              <Link href="/auth/register" className="rounded-md bg-slate-900 px-3 py-1.5 text-white">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="rounded-md bg-slate-100 px-3 py-1.5 text-slate-800 hover:bg-slate-200"
              >
                {userName}
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  setUserName(null);
                  setUserRole(null);
                  window.location.href = '/';
                }}
                className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
