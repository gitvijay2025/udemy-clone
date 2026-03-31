'use client';

import { useState } from 'react';
import { addToCart, getStoredUser } from '@/lib/client-api';
import { useRouter } from 'next/navigation';

export function AddToCartButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function handleClick() {
    const user = getStoredUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      await addToCart(courseId);
      setAdded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add to cart';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  if (added) {
    return (
      <button
        onClick={() => router.push('/cart')}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-500"
      >
        ✓ Added — Go to Cart
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-lg border-2 border-violet-600 px-4 py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50 disabled:opacity-50"
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
