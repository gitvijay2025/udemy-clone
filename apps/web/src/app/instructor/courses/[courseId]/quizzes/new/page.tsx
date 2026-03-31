'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createQuiz } from '@/lib/client-api';
import Link from 'next/link';

type QuestionForm = {
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  options: Array<{ text: string; isCorrect: boolean }>;
};

export default function NewQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { question: '', type: 'MULTIPLE_CHOICE', points: 1, options: [{ text: '', isCorrect: false }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addQuestion() {
    setQuestions([
      ...questions,
      { question: '', type: 'MULTIPLE_CHOICE', points: 1, options: [{ text: '', isCorrect: false }] },
    ]);
  }

  function updateQuestion(idx: number, field: string, value: string | number) {
    const updated = [...questions];
    (updated[idx] as Record<string, unknown>)[field] = value;
    setQuestions(updated);
  }

  function addOption(qIdx: number) {
    const updated = [...questions];
    updated[qIdx].options.push({ text: '', isCorrect: false });
    setQuestions(updated);
  }

  function updateOption(qIdx: number, oIdx: number, field: string, value: string | boolean) {
    const updated = [...questions];
    (updated[qIdx].options[oIdx] as Record<string, unknown>)[field] = value;
    setQuestions(updated);
  }

  function removeQuestion(idx: number) {
    setQuestions(questions.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createQuiz({
        title,
        description: description || undefined,
        passingScore,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
        courseId,
        questions: questions.map((q) => ({
          question: q.question,
          type: q.type,
          points: q.points,
          options: q.options,
        })),
      });
      alert('Quiz created!');
      router.push(`/instructor/courses/${courseId}/edit`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href={`/instructor/courses/${courseId}/edit`} className="text-sm text-violet-700">
        ← Back to course editor
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Create Quiz</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Passing Score (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Time Limit (minutes)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Question {qIdx + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(qIdx)}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            </div>
            <div>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                placeholder="Enter question..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-500">Type</label>
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500">Points</label>
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) => updateQuestion(qIdx, 'points', Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500">Options</label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                    title="Mark as correct"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                    placeholder={`Option ${oIdx + 1}`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="text-xs text-violet-600"
              >
                + Add option
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            + Add Question
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </main>
  );
}
