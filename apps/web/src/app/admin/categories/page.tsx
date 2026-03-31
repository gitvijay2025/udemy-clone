'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory, type Category } from '@/lib/client-api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      // ignore
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory({ name, slug, parentId: parentId || undefined });
      setName('');
      setSlug('');
      setParentId('');
      await loadCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch {
      // ignore
    }
  }

  function renderCategories(cats: Category[], level = 0) {
    return cats.map((cat) => (
      <div key={cat.id}>
        <div
          className="flex items-center justify-between border-b border-slate-100 px-4 py-3"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          <div>
            <p className="font-medium text-slate-900">{cat.name}</p>
            <p className="text-xs text-slate-400">/{cat.slug}</p>
          </div>
          <button
            onClick={() => handleDelete(cat.id)}
            className="text-xs text-red-600 hover:text-red-500"
          >
            Delete
          </button>
        </div>
        {cat.children && renderCategories(cat.children, level + 1)}
      </div>
    ));
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            }}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Parent (optional)</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">None (top level)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-slate-500">No categories yet.</p>
        ) : (
          renderCategories(categories)
        )}
      </div>
    </main>
  );
}
