'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getInbox,
  getSentMessages,
  getMessage,
  composeMessage,
  replyToMessage,
  getStoredUser,
  type Message,
  type MessageDetail,
} from '@/lib/client-api';

type Tab = 'inbox' | 'sent' | 'compose' | 'view';

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toParam = searchParams.get('to');
  const nameParam = searchParams.get('name');

  const [tab, setTab] = useState<Tab>(toParam ? 'compose' : 'inbox');
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [viewing, setViewing] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Compose form
  const [compTo, setCompTo] = useState(toParam ?? '');
  const [compToName, setCompToName] = useState(nameParam ?? '');
  const [compSubject, setCompSubject] = useState('');
  const [compBody, setCompBody] = useState('');
  const [sending, setSending] = useState(false);
  const [compError, setCompError] = useState('');
  const [compSuccess, setCompSuccess] = useState('');

  const user = getStoredUser();

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const [inboxData, sentData] = await Promise.all([getInbox(), getSentMessages()]);
      setInbox(inboxData);
      setSent(sentData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(id: string) {
    try {
      const data = await getMessage(id);
      setViewing(data);
      setTab('view');
      setReplyText('');
      // Refresh inbox counts
      loadMessages();
    } catch {
      // ignore
    }
  }

  async function handleCompose(e: React.FormEvent) {
    e.preventDefault();
    setCompError('');
    setCompSuccess('');
    if (!compTo || !compSubject.trim() || !compBody.trim()) {
      setCompError('Please fill in all fields.');
      return;
    }
    setSending(true);
    try {
      await composeMessage({ receiverId: compTo, subject: compSubject.trim(), content: compBody.trim() });
      setCompSuccess('Message sent successfully!');
      setCompSubject('');
      setCompBody('');
      setCompTo(toParam ?? '');
      await loadMessages();
    } catch (err: unknown) {
      setCompError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!viewing || !replyText.trim()) return;
    setReplying(true);
    try {
      await replyToMessage(String(viewing.id), replyText.trim());
      setReplyText('');
      // Reload the message to show the new reply
      const data = await getMessage(String(viewing.id));
      setViewing(data);
      await loadMessages();
    } catch {
      // ignore
    } finally {
      setReplying(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setViewing(null);
    setCompError('');
    setCompSuccess('');
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="mt-4 text-slate-600">Please log in to view your messages.</p>
      </main>
    );
  }

  const unreadCount = inbox.filter((m) => !m.isRead).length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <button
          onClick={() => { switchTab('compose'); setCompTo(''); setCompToName(''); }}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          ✉ Compose
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-slate-200">
        <button
          onClick={() => switchTab('inbox')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'inbox'
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Inbox {unreadCount > 0 && <span className="ml-1 rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}
        </button>
        <button
          onClick={() => switchTab('sent')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'sent'
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Sent
        </button>
        {tab === 'compose' && (
          <span className="px-4 py-2 text-sm font-semibold border-b-2 border-violet-600 text-violet-700">
            Compose
          </span>
        )}
        {tab === 'view' && (
          <span className="px-4 py-2 text-sm font-semibold border-b-2 border-violet-600 text-violet-700">
            View Message
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* ── Inbox ── */}
        {tab === 'inbox' && (
          loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : inbox.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500">Your inbox is empty</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {inbox.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(String(msg.id))}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${
                    !msg.isRead ? 'bg-violet-50/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && <span className="h-2 w-2 rounded-full bg-violet-600 flex-shrink-0" />}
                        <p className={`text-sm truncate ${!msg.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {msg.sender.name}
                        </p>
                      </div>
                      <p className={`mt-0.5 text-sm truncate ${!msg.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                        {msg.subject ?? '(No subject)'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 truncate">{msg.content}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      {(msg.replyCount ?? 0) > 0 && (
                        <p className="mt-0.5 text-xs text-slate-400">{msg.replyCount} {msg.replyCount === 1 ? 'reply' : 'replies'}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {/* ── Sent ── */}
        {tab === 'sent' && (
          loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : sent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500">No sent messages</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {sent.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(String(msg.id))}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        To: {msg.receiver.name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600 truncate">
                        {msg.subject ?? '(No subject)'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 truncate">{msg.content}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      {(msg.replyCount ?? 0) > 0 && (
                        <p className="mt-0.5 text-xs text-slate-400">{msg.replyCount} {msg.replyCount === 1 ? 'reply' : 'replies'}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {/* ── Compose ── */}
        {tab === 'compose' && (
          <form onSubmit={handleCompose} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            {compError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{compError}</p>}
            {compSuccess && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{compSuccess}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
              {compToName ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 flex-1">
                    {compToName}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCompTo(''); setCompToName(''); }}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <input
                  value={compTo}
                  onChange={(e) => setCompTo(e.target.value)}
                  placeholder="Recipient User ID"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input
                value={compSubject}
                onChange={(e) => setCompSubject(e.target.value)}
                placeholder="Message subject"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                value={compBody}
                onChange={(e) => setCompBody(e.target.value)}
                rows={6}
                placeholder="Write your message…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={sending}
                className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
              <button
                type="button"
                onClick={() => switchTab('inbox')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── View Message ── */}
        {tab === 'view' && viewing && (
          <div className="space-y-4">
            <button
              onClick={() => switchTab('inbox')}
              className="text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              ← Back to Inbox
            </button>

            {/* Original message */}
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">{viewing.subject ?? '(No subject)'}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>
                  <span className="font-medium text-slate-700">From:</span> {viewing.sender.name}
                </span>
                <span>
                  <span className="font-medium text-slate-700">To:</span> {viewing.receiver.name}
                </span>
                <span>{new Date(viewing.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {viewing.content}
              </div>
            </article>

            {/* Replies */}
            {viewing.replies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Replies ({viewing.replies.length})
                </h3>
                {viewing.replies.map((reply) => (
                  <article
                    key={reply.id}
                    className={`rounded-xl border p-5 ${
                      String(reply.sender.id) === String(user?.id)
                        ? 'border-violet-200 bg-violet-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span className="font-medium text-slate-700">{reply.sender.name}</span>
                      <span>{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                  </article>
                ))}
              </div>
            )}

            {/* Reply form */}
            <form onSubmit={handleReply} className="rounded-xl border border-slate-200 bg-white p-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Write your reply…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={replying || !replyText.trim()}
                className="mt-3 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {replying ? 'Sending…' : 'Send Reply'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-slate-500">Loading…</p>
        </main>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
