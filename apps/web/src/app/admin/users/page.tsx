'use client';

import { useEffect, useState } from 'react';
import {
  getAdminUsers,
  updateUserRole,
  banUser,
  approveInstructor,
  type AuthUser,
  type UserRole,
} from '@/lib/client-api';

type AdminUser = AuthUser & { createdAt: string; isBanned?: boolean };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, page]);

  async function loadUsers() {
    try {
      const data = await getAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: 20,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      // ignore
    }
  }

  async function handleRoleChange(userId: string, role: UserRole) {
    try {
      await updateUserRole(userId, role);
      await loadUsers();
    } catch {
      // ignore
    }
  }

  async function handleBan(userId: string) {
    if (!confirm('Ban this user?')) return;
    try {
      await banUser(userId);
      await loadUsers();
    } catch {
      // ignore
    }
  }

  async function handleApproveInstructor(userId: string) {
    try {
      await approveInstructor(userId);
      await loadUsers();
    } catch {
      // ignore
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>

      <div className="mt-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-slate-500">{total} user(s) found</div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="INSTRUCTOR">INSTRUCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleApproveInstructor(user.id)}
                    className="text-xs text-green-600 hover:text-green-500"
                  >
                    Approve Instructor
                  </button>
                  <button
                    onClick={() => handleBan(user.id)}
                    className="text-xs text-red-600 hover:text-red-500"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
