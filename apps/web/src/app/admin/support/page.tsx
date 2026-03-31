'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('udemy_clone_token');
}

async function fetchAllTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API}/support/tickets`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to load tickets');
  return res.json();
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const data = await fetchAllTickets();
      setTickets(data);
    } catch {
      console.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  const filtered = statusFilter ? tickets.filter((t) => t.status === statusFilter) : tickets;

  const statusColor: Record<string, string> = {
    OPEN: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-slate-100 text-slate-600',
  };

  const priorityColor: Record<string, string> = {
    LOW: 'text-slate-500',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600 font-semibold',
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-violet-700">
            ← Admin Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Support Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">{tickets.length} total ticket(s)</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-slate-400">No tickets found.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{ticket.subject}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900">{ticket.user.name}</div>
                    <div className="text-xs text-slate-400">{ticket.user.email}</div>
                  </td>
                  <td className={`px-4 py-3 text-xs ${priorityColor[ticket.priority] || ''}`}>
                    {ticket.priority}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        statusColor[ticket.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/support?ticket=${ticket.id}`}
                      className="text-xs text-violet-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
