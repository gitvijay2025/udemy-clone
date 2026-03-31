export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  isPublished: boolean;
  thumbnailUrl?: string | null;
  previewVideoUrl?: string | null;
  language?: string;
  requirements?: string | null;
  targetAudience?: string | null;
  averageRating?: number;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  category?: { id: string; name: string; slug: string } | null;
  _count?: { enrollments: number; reviews: number };
  sections?: Array<{
    id: string;
    title: string;
    position: number;
    isPublished: boolean;
    lectures?: Array<{
      id: string;
      title: string;
      position: number;
      isPublished: boolean;
      isFreePreview?: boolean;
      durationSec?: number | null;
      content?: string | null;
      videoUrl: string | null;
      resources?: Array<{
        id: string;
        title: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
        createdAt: string;
      }>;
    }>;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: string; name: string };
  }>;
};

export type PaginatedCourses = {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const fallbackCourses: Course[] = [
  {
    id: 'c1',
    slug: 'nextjs-from-zero',
    title: 'Next.js From Zero to Production',
    description:
      'Learn routing, server components, data fetching, auth integration, and deployment best practices.',
    level: 'BEGINNER',
    price: 49.99,
    isPublished: true,
    thumbnailUrl: null,
    instructor: {
      id: 'u1',
      name: 'Demo Instructor',
      email: 'instructor@example.com',
    },
    sections: [
      {
        id: 's1',
        title: 'Getting started with Next.js',
        position: 1,
        isPublished: true,
      },
      {
        id: 's2',
        title: 'Routing and layouts',
        position: 2,
        isPublished: true,
      },
    ],
  },
  {
    id: 'c2',
    slug: 'nestjs-api-masterclass',
    title: 'NestJS API Masterclass',
    description:
      'Build robust APIs with modules, guards, JWT auth, role-based access control, and Prisma ORM.',
    level: 'INTERMEDIATE',
    price: 69.99,
    isPublished: true,
    thumbnailUrl: null,
    instructor: {
      id: 'u2',
      name: 'Backend Mentor',
      email: 'mentor@example.com',
    },
    sections: [
      {
        id: 's3',
        title: 'Nest fundamentals and modules',
        position: 1,
        isPublished: true,
      },
      {
        id: 's4',
        title: 'JWT auth and role guards',
        position: 2,
        isPublished: true,
      },
    ],
  },
];

export async function getCourses(params?: {
  search?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedCourses> {
  try {
    const sp = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') sp.set(k, String(v));
      });
    }
    const qs = sp.toString();
    const response = await fetch(`${API_BASE_URL}/courses${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        courses: fallbackCourses,
        total: fallbackCourses.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
    }

    const data = await response.json();

    // Handle both old array format and new paginated format
    if (Array.isArray(data)) {
      return {
        courses: data,
        total: data.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
    }

    if (data.courses && Array.isArray(data.courses)) {
      return data as PaginatedCourses;
    }

    return {
      courses: fallbackCourses,
      total: fallbackCourses.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  } catch {
    return {
      courses: fallbackCourses,
      total: fallbackCourses.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return fallbackCourses.find((course) => course.slug === slug) ?? null;
    }

    return (await response.json()) as Course;
  } catch {
    return fallbackCourses.find((course) => course.slug === slug) ?? null;
  }
}
