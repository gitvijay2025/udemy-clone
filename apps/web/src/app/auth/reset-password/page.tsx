'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState, Suspense } from 'react';
import { resetPassword } from '@/lib/client-api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const token = String(form.get('token') ?? '');
    const newPassword = String(form.get('newPassword') ?? '');
    const confirmPassword = String(form.get('confirmPassword') ?? '');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
    } catch {
      setError('Invalid or expired reset token. Please request a new one.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="text-3xl font-bold text-slate-900">Password reset!</h1>
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-medium text-green-800">
            Your password has been updated successfully.
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
      <p className="mt-2 text-slate-600">Enter your new password below.</p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="token" value={tokenFromUrl} />

        <div>
          <label className="mb-1 block text-sm font-medium">New password</label>
          <input
            name="newPassword"
            type="password"
            minLength={6}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm password
          </label>
          <input
            name="confirmPassword"
            type="password"
            minLength={6}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        <Link href="/auth/login" className="font-semibold text-violet-700">
          ← Back to login
        </Link>
      </p>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-6 py-14">
          <p className="text-slate-600">Loading…</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
