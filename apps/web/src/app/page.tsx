import Link from "next/link";
import { getCourses } from "@/lib/courses";
import { HeroActions } from "@/components/hero-actions";

export default async function Home() {
  const { courses } = await getCourses({ limit: 6 });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
            Udemy Clone Platform
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight">
            Learn in-demand skills. Teach your own courses.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Full-stack online learning starter with authentication, instructor
            dashboard, catalog, course details, and student enrollment flow.
          </p>
          <HeroActions />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured courses</h2>
          <Link
            href="/courses"
            className="text-sm font-semibold text-violet-700"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 6).map((course) => (
            <article
              key={course.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                {course.level}
              </p>
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {course.description}
              </p>
              <p className="mt-3 text-sm text-slate-500">By {course.instructor.name}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">${Number(course.price).toFixed(2)}</span>
                <Link
                  href={`/courses/${course.slug}`}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
