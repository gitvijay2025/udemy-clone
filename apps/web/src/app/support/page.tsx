'use client';

import { useEffect, useState } from 'react';
import {
  getMyTickets,
  createSupportTicket,
  getTicket,
  replyToTicket,
  getFaqs,
  type SupportTicket,
  type FAQ,
} from '@/lib/client-api';

export default function SupportPage() {
  const [tab, setTab] = useState<'tickets' | 'new' | 'faq' | 'detail'>('faq');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getFaqs().then(setFaqs).catch(() => {});
    getMyTickets().then(setTickets).catch(() => {});
  }, []);

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSupportTicket({ subject, message });
      setSubject('');
      setMessage('');
      const updated = await getMyTickets();
      setTickets(updated);
      setTab('tickets');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function viewTicket(ticketId: string) {
    try {
      const t = await getTicket(ticketId);
      setSelectedTicket(t);
      setTab('detail');
    } catch {
      // ignore
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket || !reply.trim()) return;
    setSubmitting(true);
    try {
      await replyToTicket(selectedTicket.id, reply.trim());
      const updated = await getTicket(selectedTicket.id);
      setSelectedTicket(updated);
      setReply('');
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  const tabs = [
    { key: 'faq' as const, label: 'FAQ' },
    { key: 'tickets' as const, label: 'My Tickets' },
    { key: 'new' as const, label: 'New Ticket' },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>

      <div className="mt-6 flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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

      {/* FAQ */}
      {tab === 'faq' && (
        <div className="mt-6 space-y-3">
          {faqs.length === 0 ? (
            <p className="text-slate-500">No FAQs available yet.</p>
          ) : (
            faqs.map((faq) => (
              <details
                key={faq.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50">
                  {faq.question}
                </summary>
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                  {faq.answer}
                </div>
              </details>
            ))
          )}
        </div>
      )}

      {/* Ticket list */}
      {tab === 'tickets' && (
        <div className="mt-6 space-y-3">
          {tickets.length === 0 ? (
            <p className="text-slate-500">No support tickets.</p>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => viewTicket(ticket.id)}
                className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{ticket.subject}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      ticket.status === 'OPEN'
                        ? 'bg-yellow-100 text-yellow-700'
                        : ticket.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString()} · {ticket.priority}
                </p>
              </button>
            ))
          )}
        </div>
      )}

      {/* New ticket */}
      {tab === 'new' && (
        <form onSubmit={handleCreateTicket} className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      )}

      {/* Ticket detail */}
      {tab === 'detail' && selectedTicket && (
        <div className="mt-6">
          <button
            onClick={() => setTab('tickets')}
            className="text-sm text-violet-600 hover:text-violet-500"
          >
            ← Back to tickets
          </button>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                {selectedTicket.status}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {selectedTicket.messages.map((msg) => (
                <div key={msg.id} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{msg.user.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{msg.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleReply} className="mt-4 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Reply
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
