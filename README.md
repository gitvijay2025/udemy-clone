# Udemy Clone (Next.js + NestJS + MySQL)

## Project Structure

- `apps/web` — Next.js frontend
- `apps/api` — NestJS backend
- `docker-compose.yml` — MySQL service

## Implemented Features

- JWT auth (`register`, `login`, `me`)
- Role-based guards (`STUDENT`, `INSTRUCTOR`, `ADMIN`)
- Public course catalog and course detail pages
- Instructor course CRUD basics (create, list mine, update, publish)
- Course curriculum basics (create sections)
- Instructor lecture video upload per section topic
- Instructor editing screens for course details, topics, and lecture content/video replacement
- Student enroll flow and “My Learning” list
- Responsive UI pages for learner + instructor flows

## Quick Start

### 1) Start MySQL

```bash
docker compose up -d
```

### 2) Run API

```bash
cd apps/api
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 3) Run Web

```bash
cd apps/web
cp .env.example .env.local
npm run dev
```

## Main Routes

- `/` Home / featured courses
- `/courses` Catalog
- `/courses/[slug]` Course detail + enroll
- `/auth/login` Login
- `/auth/register` Register
- `/my-learning` Student dashboard
- `/instructor/courses` Instructor dashboard
- `/instructor/courses/new` Create course

## Notes

If `docker compose up -d` fails with iptables errors on Linux, fix Docker networking first (iptables/nftables bridge rules), then rerun the command.
