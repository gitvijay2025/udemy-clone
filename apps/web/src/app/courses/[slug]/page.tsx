import Link from 'next/link';
import { getCourseBySlug } from '@/lib/courses';
import { EnrollButton } from '@/components/enroll-button';
import { CourseReviews } from '@/components/course-reviews';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { CourseCurriculum } from '@/components/course-curriculum';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <Link href="/courses" className="mt-4 inline-block text-violet-700">
          Back to catalog
        </Link>
      </main>
    );
  }

  const requirements = course.requirements
    ? (() => {
        try {
          return JSON.parse(course.requirements);
        } catch {
          return [];
        }
      })()
    : [];

  const targetAudience = course.targetAudience
    ? (() => {
        try {
          return JSON.parse(course.targetAudience);
        } catch {
          return [];
        }
      })()
    : [];

  const totalLectures = (course.sections ?? []).reduce(
    (acc, s) => acc + (s.lectures?.length ?? 0),
    0,
  );
  const totalDuration = (course.sections ?? []).reduce(
    (acc, s) =>
      acc + (s.lectures?.reduce((a, l) => a + (l.durationSec ?? 0), 0) ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          {course.category && (
            <Link
              href={`/courses?category=${course.category.slug}`}
              className="mb-2 inline-block text-sm text-violet-300 hover:text-violet-200"
            >
              {course.category.name}
            </Link>
          )}
          <h1 className="max-w-3xl text-4xl font-bold">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="font-semibold text-violet-300">{course.level}</span>
            {course.language && <span>Language: {course.language}</span>}
            <span>By {course.instructor.name}</span>
            {course.averageRating !== undefined && course.averageRating > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                ★ {course.averageRating.toFixed(1)}
                {course._count?.reviews !== undefined && (
                  <span className="text-slate-400">({course._count.reviews} reviews)</span>
                )}
              </span>
            )}
            {course._count?.enrollments !== undefined && (
              <span>{course._count.enrollments} students enrolled</span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="space-y-8">
          {/* What you'll learn */}
          {targetAudience.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Who this course is for</h2>
              <ul className="mt-4 space-y-2">
                {targetAudience.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Requirements</h2>
              <ul className="mt-4 space-y-2">
                {requirements.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-slate-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Curriculum */}
          <CourseCurriculum
            sections={course.sections ?? []}
            totalLectures={totalLectures}
            totalDuration={totalDuration}
          />

          {/* Reviews */}
          <CourseReviews courseId={course.id} instructorId={String(course.instructor.id)} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            {course.previewVideoUrl && (
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-slate-900">
                <video
                  src={course.previewVideoUrl}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                  className="h-full w-full object-cover"
                  poster={course.thumbnailUrl ?? undefined}
                />
              </div>
            )}
            <p className="text-3xl font-bold text-slate-900">
              {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              One-time purchase · lifetime access
            </p>
            <div className="mt-5 space-y-3">
              <AddToCartButton courseId={course.id} />
              <EnrollButton courseId={course.id} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">
            <h3 className="font-semibold text-slate-900">This course includes:</h3>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>{totalLectures} lectures</li>
              {totalDuration > 0 && <li>{Math.round(totalDuration / 60)} minutes of content</li>}
              <li>{(course.sections ?? []).length} sections</li>
              <li>Full lifetime access</li>
              <li>Certificate of completion</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Instructor</h3>
            <p className="mt-2 font-medium text-slate-800">{course.instructor.name}</p>
            <Link
              href={`/messages?to=${course.instructor.id}&name=${encodeURIComponent(course.instructor.name)}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
            >
              💬 Message Instructor
            </Link>
          </div>
          <Link
            href="/courses"
            className="inline-block text-sm font-semibold text-violet-700"
          >
            ← Back to catalog
          </Link>
        </aside>
      </section>
    </main>
  );
}
