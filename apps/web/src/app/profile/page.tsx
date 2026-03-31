'use client';

import { useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  changePassword,
  getMyCertificates,
  getOrders,
  type Profile,
  type Certificate,
  type Order,
} from '@/lib/client-api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'profile' | 'security' | 'orders' | 'certificates'>('profile');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
    getMyCertificates().then(setCerts).catch(() => {});
    getOrders().then(setOrders).catch(() => {});
  }, []);

  async function loadProfile() {
    try {
      const p = await getProfile();
      setProfile(p);
      setName(p.name);
      setBio(p.bio ?? '');
      setPhone(p.phone ?? '');
    } catch {
      // not logged in
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateProfile({ name, bio, phone });
      setProfile(updated);
      setMessage('Profile updated!');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await changePassword({ currentPassword, newPassword });
      setMessage('Password changed!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { key: 'profile' as const, label: 'Profile' },
    { key: 'security' as const, label: 'Security' },
    { key: 'orders' as const, label: 'Purchase History' },
    { key: 'certificates' as const, label: 'Certificates' },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>

      {/* Horizontal tabs */}
      <div className="mt-6 flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setMessage(''); }}
            className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2 ${
              tab === t.key
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</p>
      )}

      {/* Profile tab */}
      {tab === 'profile' && profile && (
        <form onSubmit={handleUpdateProfile} className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <form onSubmit={handleChangePassword} className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <p className="text-slate-500">No purchase history yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Order #{order.id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(order.totalAmount).toFixed(2)}</p>
                    <span className={`text-xs rounded-full px-2 py-0.5 ${
                      order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-sm text-slate-600">
                      {item.course.title} — ${Number(item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {/* Certificates tab */}
      {tab === 'certificates' && (
        <div className="mt-6 space-y-4">
          {certs.length === 0 ? (
            <p className="text-slate-500">No certificates yet. Complete a course to earn one!</p>
          ) : (
            certs.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-semibold text-slate-900">{cert.course.title}</p>
                  <p className="text-xs text-slate-500">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                </div>
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  View Certificate
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
