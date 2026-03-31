'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCart, removeFromCart, clearCart, checkout, type Cart } from '@/lib/client-api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      // not logged in
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(courseId: string) {
    try {
      const updated = await removeFromCart(courseId);
      setCart(updated);
    } catch {
      // ignore
    }
  }

  async function handleClearCart() {
    try {
      const updated = await clearCart();
      setCart(updated);
    } catch {
      // ignore
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const order = await checkout(couponCode ? { couponCode } : undefined);
      alert(`Order placed! Order ID: ${order.id}`);
      router.push('/my-learning');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed';
      alert(msg);
    } finally {
      setCheckingOut(false);
    }
  }

  const total =
    cart?.items.reduce((sum, item) => sum + Number(item.course.price), 0) ?? 0;

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-slate-500">Loading cart...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-lg font-medium text-slate-600">Your cart is empty</p>
          <Link
            href="/courses"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Cart items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{cart.items.length} course(s) in cart</p>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            </div>
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {item.course.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    By {item.course.instructor.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    ${Number(item.course.price).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.courseId)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout sidebar */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6 lg:self-start">
            <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-500">Coupon Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-4 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {checkingOut ? 'Processing...' : 'Complete Checkout'}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
