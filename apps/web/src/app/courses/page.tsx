import Link from 'next/link';
import { getCourses } from '@/lib/courses';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const level = typeof params.level === 'string' ? params.level : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

  const data = await getCourses({ search, category, level, sort, page, limit: 12 });

  function buildUrl(overrides: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { search, category, level, sort, page: String(page), ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== '') sp.set(k, v);
    });
    return `/courses?${sp.toString()}`;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Catalog</h1>
            <p className="mt-2 text-slate-600">
              {data.total} course{data.total !== 1 ? 's' : ''} available
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-violet-700">
            ← Back home
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs font-medium text-slate-500">Search</label>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search courses..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Level</label>
              <select
                name="level"
                defaultValue={level ?? ''}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Sort</label>
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Search
            </button>
            {(search || level || category) && (
              <Link
                href="/courses"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Course grid */}
        {data.courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium">No courses found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.courses.map((course) => (
              <article
                key={course.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    {course.level}
                  </span>
                  {course.category && (
                    <Link
                      href={buildUrl({ category: course.category.slug, page: '1' })}
                      className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                    >
                      {course.category.name}
                    </Link>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {course.description}
                </p>

                <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                  <span>By {course.instructor.name}</span>
                  {course.averageRating !== undefined && course.averageRating > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      ★ {course.averageRating.toFixed(1)}
                    </span>
                  )}
                  {course._count?.enrollments !== undefined && (
                    <span>{course._count.enrollments} students</span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`}
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    View course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                ← Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-slate-500">
              Page {data.page} of {data.totalPages}
            </span>
            {page < data.totalPages && (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
