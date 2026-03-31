# Udemy Clone – Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Database Schema – 29 Tables](#4-database-schema--29-tables)
5. [Application Flow](#5-application-flow)
6. [API Modules (20 Modules)](#6-api-modules-20-modules)
7. [Frontend Pages (27 Routes)](#7-frontend-pages-27-routes)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [How to Run](#9-how-to-run)

---

## 1. Project Overview

A full-featured Udemy-like online learning platform where **Instructors** create and sell courses, **Students** browse, purchase, and learn, and **Admins** manage the entire platform. The application supports course creation with sections/lectures, shopping cart & checkout, quizzes & assignments, certificates, messaging, notifications, support tickets, analytics, and more.

---

## 2. Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| **Backend**  | NestJS 11, TypeScript, mysql2 (raw SQL queries) |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4            |
| **Database** | MySQL 8.4 (Docker)                              |
| **Auth**     | JWT + bcrypt + Passport                         |
| **Infra**    | Docker Compose (MySQL + Redis)                  |

---

## 3. Architecture

```
┌──────────────┐         ┌──────────────┐         ┌────────────┐
│   Next.js    │  HTTP   │   NestJS     │  SQL    │   MySQL    │
│   Frontend   │ ──────► │   Backend    │ ──────► │   8.4      │
│   :3000      │  /api   │   :3001      │  mysql2 │   :3306    │
└──────────────┘         └──────────────┘         └────────────┘
```

- **Frontend** (apps/web) — Server-side rendered Next.js app with App Router
- **Backend** (apps/api) — RESTful API with 20 modules, JWT auth, role-based guards
- **Database** — 29 MySQL tables, raw SQL via mysql2 connection pool

---

## 4. Database Schema – 29 Tables

### Summary Table

| #  | Table Name             | Purpose                              | Key Relations                    |
| -- | ---------------------- | ------------------------------------ | -------------------------------- |
| 1  | **User**               | All users (student/instructor/admin) | –                                |
| 2  | **Category**           | Course categories (hierarchical)     | Self-referencing (parentId)      |
| 3  | **Course**             | Courses created by instructors       | → User, → Category              |
| 4  | **Section**            | Course sections (chapters)           | → Course                        |
| 5  | **Lecture**            | Individual lessons within sections   | → Section                       |
| 6  | **Resource**           | Downloadable files for lectures      | → Lecture                       |
| 7  | **Enrollment**         | Student ↔ Course enrollment          | → User, → Course                |
| 8  | **LectureProgress**    | Per-lecture watch progress            | → User, → Lecture               |
| 9  | **Review**             | Course ratings & comments            | → User, → Course                |
| 10 | **Cart**               | Shopping cart (one per user)          | → User                          |
| 11 | **CartItem**           | Items inside a cart                  | → Cart, → Course                |
| 12 | **Order**              | Purchase orders                      | → User, → Coupon                |
| 13 | **OrderItem**          | Individual items in an order         | → Order, → Course               |
| 14 | **Coupon**             | Discount coupons                     | → Course (optional)             |
| 15 | **Quiz**               | Quizzes attached to courses          | → Course                        |
| 16 | **QuizQuestion**       | Questions within a quiz              | → Quiz                          |
| 17 | **QuizOption**         | Answer options for a question        | → QuizQuestion                  |
| 18 | **QuizAttempt**        | Student's quiz attempt record        | → User, → Quiz                  |
| 19 | **QuizAnswer**         | Individual answers per attempt        | → QuizAttempt, → QuizQuestion   |
| 20 | **Assignment**         | Assignments for courses              | → Course                        |
| 21 | **AssignmentSubmission**| Student submissions for assignments  | → Assignment, → User            |
| 22 | **Certificate**        | Completion certificates              | → User, → Course                |
| 23 | **Notification**       | User notifications                   | → User                          |
| 24 | **Message**            | Direct messages between users        | → User (sender), → User (receiver) |
| 25 | **SupportTicket**      | Help/support tickets                 | → User                          |
| 26 | **TicketMessage**      | Messages within a support ticket     | → SupportTicket, → User         |
| 27 | **FAQ**                | Frequently asked questions           | –                                |
| 28 | **Wallet**             | Instructor earnings wallet           | → User                          |
| 29 | **WalletTransaction**  | Wallet credit/debit history          | → Wallet                        |

### Entity Relationship Diagram (Text)

```
User ──┬── Course ──┬── Section ── Lecture ── Resource
       │            │                  │
       │            ├── Enrollment ────┘ (via LectureProgress)
       │            ├── Review
       │            ├── Quiz ── QuizQuestion ── QuizOption
       │            │             └── QuizAnswer ── QuizAttempt
       │            ├── Assignment ── AssignmentSubmission
       │            └── OrderItem ── Order ── Coupon
       │
       ├── Cart ── CartItem
       ├── Wallet ── WalletTransaction
       ├── Certificate
       ├── Notification
       ├── Message (sender/receiver)
       ├── SupportTicket ── TicketMessage
       └── Category (hierarchical, self-ref)

Standalone: FAQ
```

---

## 5. Application Flow

### 5.1 Authentication Flow

```
Register → POST /api/auth/register → Hash password → Insert User → Return JWT
Login    → POST /api/auth/login    → Verify bcrypt  → Return JWT + user info
Auth     → GET  /api/auth/me       → Decode JWT     → Return current user
```

- Passwords hashed with **bcrypt** (10 rounds)
- JWT token contains: `sub` (userId), `email`, `role`
- Protected routes use `JwtAuthGuard` + `RolesGuard`

### 5.2 Course Creation Flow (Instructor)

```
1. Instructor creates course     → POST /api/courses
2. Add sections to course        → POST /api/courses/:id/sections
3. Add lectures to sections      → POST /api/courses/:courseId/sections/:sectionId/lectures
4. Update content (video, text)  → PATCH lectures/sections/course
5. Publish course                → PATCH /api/courses/:id/publish (status → PENDING_REVIEW)
6. Admin approves                → PATCH /api/admin/courses/:id/approve (status → APPROVED)
7. Course goes live (isPublished = true)
```

### 5.3 Student Purchase Flow

```
1. Browse courses                → GET /api/courses?category=&level=&search=
2. View course detail            → GET /api/courses/slug/:slug
3. Add to cart                   → POST /api/cart/:courseId
4. View cart                     → GET /api/cart
5. Apply coupon (optional)       → POST /api/payments/validate-coupon
6. Checkout                      → POST /api/orders/checkout
   └── Creates Order + OrderItems
   └── Creates Enrollment records
   └── Credits instructor Wallet (70% revenue)
   └── Clears cart
   └── Sends notification
7. Order confirmation            → GET /api/orders/:id
```

### 5.4 Learning Flow

```
1. View enrolled courses         → GET /api/enrollments/me
2. Open course player            → /learn/:courseId (frontend)
3. Watch lecture                  → PATCH /api/progress/lecture/:lectureId
   └── Marks lecture completed
   └── Updates watchedSec
   └── Recalculates course progress %
4. View course progress          → GET /api/progress/course/:courseId
5. Take quiz                     → POST /api/quizzes/:id/submit
   └── Auto-graded (score calculated)
   └── Pass/fail determined by passingScore
6. Submit assignment             → POST /api/assignments/:id/submit
7. Instructor grades             → PATCH /api/assignments/submissions/:id/grade
8. Get certificate (100% done)   → POST /api/certificates/generate/:courseId
```

### 5.5 Review Flow

```
1. Student completes enrollment
2. Leave review                  → POST /api/reviews/course/:courseId
   └── Checks enrollment exists
   └── One review per user per course (upsert)
3. View reviews                  → GET /api/reviews/course/:courseId
   └── Returns reviews + average rating
```

### 5.6 Messaging Flow

```
1. Send message                  → POST /api/messages { receiverId, content }
   └── Creates notification for receiver
2. View conversations            → GET /api/messages (grouped by partner)
3. View thread                   → GET /api/messages/:partnerId
   └── Marks messages as read
```

### 5.7 Support Flow

```
1. Create ticket                 → POST /api/support/tickets { subject, priority, message }
2. View my tickets               → GET /api/support/tickets/me
3. Reply to ticket               → POST /api/support/tickets/:id/reply
   └── Admin reply can change status
4. Admin manages tickets         → GET /api/support/tickets (all)
   └── PATCH /api/support/tickets/:id/status
5. Browse FAQ                    → GET /api/support/faq
```

### 5.8 Admin Flow

```
1. Dashboard stats               → GET /api/admin/dashboard
   └── Total users, courses, enrollments, revenue
2. User management               → GET /api/admin/users
   └── Update role, ban user, approve instructor
3. Course moderation             → GET /api/admin/courses/pending
   └── Approve or reject courses
4. Coupon management             → CRUD /api/admin/coupons
5. Platform analytics            → GET /api/analytics/platform
```

### 5.9 Wallet & Payments Flow

```
1. Student checkout              → Order created, totalAmount charged
2. Instructor gets 70%           → Wallet credited automatically
3. View wallet                   → GET /api/payments/wallet
4. View revenue stats            → GET /api/payments/revenue
5. Refund request                → POST /api/orders/:id/refund
```

---

## 6. API Modules (20 Modules)

| #  | Module          | Controller Routes                                                        |
| -- | --------------- | ------------------------------------------------------------------------ |
| 1  | **Auth**        | `POST register`, `POST login`, `GET me`                                  |
| 2  | **Profile**     | `GET/PATCH profile`, `POST change-password/forgot/reset/verify/2fa`      |
| 3  | **Categories**  | `GET all`, `GET :slug`, `POST create`, `PATCH :id`, `DELETE :id`         |
| 4  | **Courses**     | `GET list`, `GET slug/:slug`, `POST create`, `PATCH update/publish`, sections/lectures CRUD |
| 5  | **Enrollments** | `POST :courseId`, `GET me`                                               |
| 6  | **Progress**    | `GET course/:courseId`, `PATCH lecture/:lectureId`                        |
| 7  | **Reviews**     | `GET/POST course/:courseId`, `PATCH :id`, `DELETE :id`                   |
| 8  | **Cart**        | `GET cart`, `POST/:DELETE :courseId`, `DELETE clear`                      |
| 9  | **Orders**      | `POST checkout`, `GET list`, `GET :id`, `POST :id/refund`               |
| 10 | **Payments**    | `POST validate-coupon`, `GET wallet`, `GET revenue`                      |
| 11 | **Quizzes**     | `GET course/:courseId`, `GET :id`, `POST create`, `POST submit`, `GET attempts` |
| 12 | **Assignments** | `GET/POST course/:courseId`, `POST submit`, `GET submissions`, `PATCH grade` |
| 13 | **Certificates**| `POST generate/:courseId`, `GET me`, `GET verify/:id`                    |
| 14 | **Notifications**| `GET list`, `GET unread-count`, `PATCH read/:id`, `PATCH read-all`, `DELETE :id` |
| 15 | **Messages**    | `GET conversations`, `GET :partnerId`, `POST send`                       |
| 16 | **Support**     | FAQ CRUD + `POST ticket`, `GET my/all tickets`, `POST reply`, `PATCH status` |
| 17 | **Admin**       | `GET dashboard/users/courses/coupons`, user/course/coupon management     |
| 18 | **Analytics**   | `GET student`, `GET instructor`, `GET platform`                          |
| 19 | **Database**    | Global module — mysql2 connection pool (DatabaseService)                 |
| 20 | **App**         | Root module — `GET /api` health check                                    |

---

## 7. Frontend Pages (27 Routes)

| #  | Route                                           | Page                        |
| -- | ----------------------------------------------- | --------------------------- |
| 1  | `/`                                             | Homepage                    |
| 2  | `/auth/login`                                   | Login page                  |
| 3  | `/auth/register`                                | Registration page           |
| 4  | `/courses`                                      | Course catalog / browse     |
| 5  | `/courses/[slug]`                               | Course detail page          |
| 6  | `/cart`                                         | Shopping cart               |
| 7  | `/my-learning`                                  | Enrolled courses list       |
| 8  | `/learn/[courseId]`                              | Course player               |
| 9  | `/certificates`                                 | My certificates             |
| 10 | `/profile`                                      | User profile settings       |
| 11 | `/messages`                                     | Direct messaging            |
| 12 | `/notifications`                                | Notifications list          |
| 13 | `/support`                                      | Support & FAQ               |
| 14 | `/instructor/courses`                           | Instructor course list      |
| 15 | `/instructor/courses/new`                       | Create new course           |
| 16 | `/instructor/courses/[id]/edit`                 | Edit course                 |
| 17 | `/instructor/courses/[courseId]/quizzes/new`     | Create quiz                 |
| 18 | `/instructor/courses/[courseId]/assignments/new` | Create assignment           |
| 19 | `/instructor/courses/[courseId]/assignments/[assignmentId]/submissions` | View submissions |
| 20 | `/instructor/analytics`                         | Instructor analytics        |
| 21 | `/admin`                                        | Admin dashboard             |
| 22 | `/admin/users`                                  | User management             |
| 23 | `/admin/courses`                                | Course moderation           |
| 24 | `/admin/categories`                             | Category management         |
| 25 | `/admin/coupons`                                | Coupon management           |
| 26 | `/admin/support`                                | Support ticket management   |
| 27 | `/admin/analytics`                              | Platform analytics          |

---

## 8. User Roles & Permissions

| Feature              | STUDENT | INSTRUCTOR | ADMIN |
| -------------------- | :-----: | :--------: | :---: |
| Browse/search courses | ✅      | ✅         | ✅    |
| Purchase courses      | ✅      | ✅         | ✅    |
| Enroll & learn        | ✅      | ✅         | ✅    |
| Leave reviews         | ✅      | ✅         | ✅    |
| Take quizzes          | ✅      | ✅         | ✅    |
| Submit assignments    | ✅      | ✅         | ✅    |
| Get certificates      | ✅      | ✅         | ✅    |
| Create courses        | ❌      | ✅         | ✅    |
| Create quizzes        | ❌      | ✅         | ✅    |
| Create assignments    | ❌      | ✅         | ✅    |
| Grade submissions     | ❌      | ✅         | ✅    |
| View instructor analytics | ❌  | ✅         | ✅    |
| Manage users          | ❌      | ❌         | ✅    |
| Approve courses       | ❌      | ❌         | ✅    |
| Manage coupons        | ❌      | ❌         | ✅    |
| Manage support tickets| ❌      | ❌         | ✅    |
| View platform analytics| ❌     | ❌         | ✅    |
| Manage FAQ            | ❌      | ❌         | ✅    |

---

## 9. How to Run

```bash
# 1. Start MySQL (Docker)
docker compose up -d

# 2. Initialize database (if tables don't exist)
docker compose exec mysql mysql -uudemy -pudemy123 udemy_clone < apps/api/scripts/init-db.sql

# 3. Start backend
cd apps/api
npm install
npx nest build
node dist/main.js          # Runs on http://localhost:3001

# 4. Start frontend
cd apps/web
npm install
npm run dev                # Runs on http://localhost:3000
```

### Environment Variables (Backend)

| Variable      | Default        | Description           |
| ------------- | -------------- | --------------------- |
| `DB_HOST`     | `localhost`    | MySQL host            |
| `DB_PORT`     | `3306`         | MySQL port            |
| `DB_USER`     | `udemy`        | MySQL user            |
| `DB_PASSWORD` | `udemy123`     | MySQL password        |
| `DB_NAME`     | `udemy_clone`  | MySQL database name   |
| `JWT_SECRET`  | `super-secret` | JWT signing key       |

---

## 10. Complete Table Schemas (29 Tables)

### Table 1 — User

| Column                   | Type         | Constraints                     |
| ------------------------ | ------------ | ------------------------------- |
| id                       | VARCHAR(36)  | **PK**                          |
| email                    | VARCHAR(255) | NOT NULL, **UNIQUE**            |
| name                     | VARCHAR(255) | NOT NULL                        |
| password                 | VARCHAR(255) | NOT NULL                        |
| role                     | ENUM('STUDENT','INSTRUCTOR','ADMIN') | NOT NULL, DEFAULT 'STUDENT' |
| phone                    | VARCHAR(50)  | NULL                            |
| bio                      | TEXT         | NULL                            |
| avatarUrl                | VARCHAR(500) | NULL                            |
| emailVerified            | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| emailVerificationToken   | VARCHAR(255) | NULL                            |
| passwordResetToken       | VARCHAR(255) | NULL                            |
| passwordResetExpires     | DATETIME     | NULL                            |
| twoFactorEnabled         | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| twoFactorSecret          | VARCHAR(255) | NULL                            |
| isApprovedInstructor     | BOOLEAN      | NOT NULL, DEFAULT FALSE         |
| locale                   | VARCHAR(10)  | NOT NULL, DEFAULT 'en'          |
| currency                 | VARCHAR(10)  | NOT NULL, DEFAULT 'USD'         |
| createdAt                | DATETIME     | NOT NULL, DEFAULT NOW           |
| updatedAt                | DATETIME     | NOT NULL, AUTO-UPDATE           |

---

### Table 2 — Category

| Column    | Type         | Constraints                        |
| --------- | ------------ | ---------------------------------- |
| id        | VARCHAR(36)  | **PK**                             |
| name      | VARCHAR(255) | NOT NULL, **UNIQUE**               |
| slug      | VARCHAR(255) | NOT NULL, **UNIQUE**               |
| parentId  | VARCHAR(36)  | NULL, **FK → Category(id)** ON DELETE SET NULL |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW              |
| updatedAt | DATETIME     | NOT NULL, AUTO-UPDATE              |

---

### Table 3 — Course

| Column          | Type           | Constraints                                    |
| --------------- | -------------- | ---------------------------------------------- |
| id              | VARCHAR(36)    | **PK**                                         |
| title           | VARCHAR(255)   | NOT NULL                                       |
| slug            | VARCHAR(255)   | NOT NULL, **UNIQUE**                           |
| description     | TEXT           | NOT NULL                                       |
| price           | DECIMAL(10,2)  | NOT NULL                                       |
| thumbnailUrl    | VARCHAR(500)   | NULL                                           |
| previewVideoUrl | VARCHAR(500)   | NULL                                           |
| level           | ENUM('BEGINNER','INTERMEDIATE','ADVANCED') | NOT NULL, DEFAULT 'BEGINNER' |
| language        | VARCHAR(50)    | NOT NULL, DEFAULT 'English'                    |
| requirements    | TEXT           | NULL                                           |
| targetAudience  | TEXT           | NULL                                           |
| isPublished     | BOOLEAN        | NOT NULL, DEFAULT FALSE                        |
| status          | ENUM('DRAFT','PENDING_REVIEW','APPROVED','REJECTED') | NOT NULL, DEFAULT 'DRAFT' |
| instructorId    | VARCHAR(36)    | NOT NULL, **FK → User(id)** ON DELETE CASCADE  |
| categoryId      | VARCHAR(36)    | NULL, **FK → Category(id)** ON DELETE SET NULL |
| createdAt       | DATETIME       | NOT NULL, DEFAULT NOW                          |
| updatedAt       | DATETIME       | NOT NULL, AUTO-UPDATE                          |

---

### Table 4 — Section

| Column      | Type         | Constraints                                  |
| ----------- | ------------ | -------------------------------------------- |
| id          | VARCHAR(36)  | **PK**                                       |
| title       | VARCHAR(255) | NOT NULL                                     |
| position    | INT          | NOT NULL                                     |
| isPublished | BOOLEAN      | NOT NULL, DEFAULT FALSE                      |
| courseId     | VARCHAR(36)  | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW                        |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE                        |

**Unique:** `(courseId, position)`

---

### Table 5 — Lecture

| Column        | Type         | Constraints                                    |
| ------------- | ------------ | ---------------------------------------------- |
| id            | VARCHAR(36)  | **PK**                                         |
| title         | VARCHAR(255) | NOT NULL                                       |
| videoUrl      | VARCHAR(500) | NULL                                           |
| content       | TEXT         | NULL                                           |
| durationSec   | INT          | NULL                                           |
| position      | INT          | NOT NULL                                       |
| isPublished   | BOOLEAN      | NOT NULL, DEFAULT FALSE                        |
| isFreePreview | BOOLEAN      | NOT NULL, DEFAULT FALSE                        |
| sectionId     | VARCHAR(36)  | NOT NULL, **FK → Section(id)** ON DELETE CASCADE |
| createdAt     | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt     | DATETIME     | NOT NULL, AUTO-UPDATE                          |

**Unique:** `(sectionId, position)`

---

### Table 6 — Resource

| Column    | Type         | Constraints                                    |
| --------- | ------------ | ---------------------------------------------- |
| id        | VARCHAR(36)  | **PK**                                         |
| title     | VARCHAR(255) | NOT NULL                                       |
| fileUrl   | VARCHAR(500) | NOT NULL                                       |
| fileType  | VARCHAR(100) | NOT NULL                                       |
| fileSize  | INT          | NULL                                           |
| lectureId | VARCHAR(36)  | NOT NULL, **FK → Lecture(id)** ON DELETE CASCADE |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                          |

---

### Table 7 — Enrollment

| Column      | Type        | Constraints                                  |
| ----------- | ----------- | -------------------------------------------- |
| id          | VARCHAR(36) | **PK**                                       |
| userId      | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId     | VARCHAR(36) | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| progress    | INT         | NOT NULL, DEFAULT 0                          |
| enrolledAt  | DATETIME    | NOT NULL, DEFAULT NOW                        |
| completedAt | DATETIME    | NULL                                         |

**Unique:** `(userId, courseId)`

---

### Table 8 — LectureProgress

| Column     | Type        | Constraints                                    |
| ---------- | ----------- | ---------------------------------------------- |
| id         | VARCHAR(36) | **PK**                                         |
| userId     | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE  |
| lectureId  | VARCHAR(36) | NOT NULL, **FK → Lecture(id)** ON DELETE CASCADE |
| completed  | BOOLEAN     | NOT NULL, DEFAULT FALSE                        |
| watchedSec | INT         | NOT NULL, DEFAULT 0                            |
| updatedAt  | DATETIME    | NOT NULL, AUTO-UPDATE                          |

**Unique:** `(userId, lectureId)`

---

### Table 9 — Review

| Column    | Type        | Constraints                                   |
| --------- | ----------- | --------------------------------------------- |
| id        | VARCHAR(36) | **PK**                                        |
| rating    | INT         | NOT NULL                                      |
| comment   | TEXT        | NULL                                          |
| userId    | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId   | VARCHAR(36) | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                         |
| updatedAt | DATETIME    | NOT NULL, AUTO-UPDATE                         |

**Unique:** `(userId, courseId)`

---

### Table 10 — Cart

| Column    | Type        | Constraints                                   |
| --------- | ----------- | --------------------------------------------- |
| id        | VARCHAR(36) | **PK**                                        |
| userId    | VARCHAR(36) | NOT NULL, **UNIQUE**, **FK → User(id)** ON DELETE CASCADE |
| updatedAt | DATETIME    | NOT NULL, AUTO-UPDATE                         |

---

### Table 11 — CartItem

| Column   | Type        | Constraints                                   |
| -------- | ----------- | --------------------------------------------- |
| id       | VARCHAR(36) | **PK**                                        |
| cartId   | VARCHAR(36) | NOT NULL, **FK → Cart(id)** ON DELETE CASCADE |
| courseId  | VARCHAR(36) | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| addedAt  | DATETIME    | NOT NULL, DEFAULT NOW                         |

**Unique:** `(cartId, courseId)`

---

### Table 12 — Order

> ⚠️ Table name backtick-quoted in SQL because `ORDER` is a reserved word.

| Column                | Type          | Constraints                                   |
| --------------------- | ------------- | --------------------------------------------- |
| id                    | VARCHAR(36)   | **PK**                                        |
| userId                | VARCHAR(36)   | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| totalAmount           | DECIMAL(10,2) | NOT NULL                                      |
| status                | ENUM('PENDING','COMPLETED','FAILED','REFUNDED') | NOT NULL, DEFAULT 'PENDING' |
| couponId              | VARCHAR(36)   | NULL, **FK → Coupon(id)** ON DELETE SET NULL  |
| stripePaymentIntentId | VARCHAR(255)  | NULL                                          |
| createdAt             | DATETIME      | NOT NULL, DEFAULT NOW                         |
| updatedAt             | DATETIME      | NOT NULL, AUTO-UPDATE                         |

---

### Table 13 — OrderItem

| Column   | Type          | Constraints                                    |
| -------- | ------------- | ---------------------------------------------- |
| id       | VARCHAR(36)   | **PK**                                         |
| orderId  | VARCHAR(36)   | NOT NULL, **FK → Order(id)** ON DELETE CASCADE |
| courseId  | VARCHAR(36)   | NOT NULL, **FK → Course(id)**                  |
| price    | DECIMAL(10,2) | NOT NULL                                       |

---

### Table 14 — Coupon

| Column          | Type         | Constraints                                    |
| --------------- | ------------ | ---------------------------------------------- |
| id              | VARCHAR(36)  | **PK**                                         |
| code            | VARCHAR(100) | NOT NULL, **UNIQUE**                           |
| discountPercent | INT          | NOT NULL                                       |
| maxUses         | INT          | NULL                                           |
| currentUses     | INT          | NOT NULL, DEFAULT 0                            |
| courseId         | VARCHAR(36)  | NULL, **FK → Course(id)** ON DELETE CASCADE    |
| expiresAt       | DATETIME     | NULL                                           |
| isActive        | BOOLEAN      | NOT NULL, DEFAULT TRUE                         |
| createdAt       | DATETIME     | NOT NULL, DEFAULT NOW                          |

---

### Table 15 — Quiz

| Column       | Type         | Constraints                                    |
| ------------ | ------------ | ---------------------------------------------- |
| id           | VARCHAR(36)  | **PK**                                         |
| title        | VARCHAR(255) | NOT NULL                                       |
| description  | TEXT         | NULL                                           |
| courseId      | VARCHAR(36)  | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| passingScore | INT          | NOT NULL, DEFAULT 70                           |
| createdAt    | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt    | DATETIME     | NOT NULL, AUTO-UPDATE                          |

---

### Table 16 — QuizQuestion

| Column    | Type        | Constraints                                  |
| --------- | ----------- | -------------------------------------------- |
| id        | VARCHAR(36) | **PK**                                       |
| question  | TEXT        | NOT NULL                                     |
| type      | ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER') | NOT NULL, DEFAULT 'MULTIPLE_CHOICE' |
| points    | INT         | NOT NULL, DEFAULT 1                          |
| position  | INT         | NOT NULL                                     |
| quizId    | VARCHAR(36) | NOT NULL, **FK → Quiz(id)** ON DELETE CASCADE |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                        |

---

### Table 17 — QuizOption

| Column     | Type         | Constraints                                          |
| ---------- | ------------ | ---------------------------------------------------- |
| id         | VARCHAR(36)  | **PK**                                               |
| text       | VARCHAR(500) | NOT NULL                                             |
| isCorrect  | BOOLEAN      | NOT NULL, DEFAULT FALSE                              |
| questionId | VARCHAR(36)  | NOT NULL, **FK → QuizQuestion(id)** ON DELETE CASCADE |

---

### Table 18 — QuizAttempt

| Column      | Type        | Constraints                                   |
| ----------- | ----------- | --------------------------------------------- |
| id          | VARCHAR(36) | **PK**                                        |
| userId      | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| quizId      | VARCHAR(36) | NOT NULL, **FK → Quiz(id)** ON DELETE CASCADE |
| score       | INT         | NOT NULL, DEFAULT 0                           |
| passed      | BOOLEAN     | NOT NULL, DEFAULT FALSE                       |
| completedAt | DATETIME    | NOT NULL, DEFAULT NOW                         |

---

### Table 19 — QuizAnswer

| Column     | Type        | Constraints                                          |
| ---------- | ----------- | ---------------------------------------------------- |
| id         | VARCHAR(36) | **PK**                                               |
| attemptId  | VARCHAR(36) | NOT NULL, **FK → QuizAttempt(id)** ON DELETE CASCADE |
| questionId | VARCHAR(36) | NOT NULL, **FK → QuizQuestion(id)** ON DELETE CASCADE |
| answer     | TEXT        | NOT NULL                                             |
| isCorrect  | BOOLEAN     | NOT NULL, DEFAULT FALSE                              |

---

### Table 20 — Assignment

| Column      | Type         | Constraints                                    |
| ----------- | ------------ | ---------------------------------------------- |
| id          | VARCHAR(36)  | **PK**                                         |
| title       | VARCHAR(255) | NOT NULL                                       |
| description | TEXT         | NOT NULL                                       |
| courseId     | VARCHAR(36)  | NOT NULL, **FK → Course(id)** ON DELETE CASCADE |
| dueDate     | DATETIME     | NULL                                           |
| maxScore    | INT          | NOT NULL, DEFAULT 100                          |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW                          |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE                          |

---

### Table 21 — AssignmentSubmission

| Column       | Type         | Constraints                                        |
| ------------ | ------------ | -------------------------------------------------- |
| id           | VARCHAR(36)  | **PK**                                             |
| assignmentId | VARCHAR(36)  | NOT NULL, **FK → Assignment(id)** ON DELETE CASCADE |
| userId       | VARCHAR(36)  | NOT NULL, **FK → User(id)** ON DELETE CASCADE      |
| content      | TEXT         | NOT NULL                                           |
| fileUrl      | VARCHAR(500) | NULL                                               |
| score        | INT          | NULL                                               |
| feedback     | TEXT         | NULL                                               |
| submittedAt  | DATETIME     | NOT NULL, DEFAULT NOW                              |
| gradedAt     | DATETIME     | NULL                                               |

**Unique:** `(assignmentId, userId)`

---

### Table 22 — Certificate

| Column         | Type         | Constraints                                   |
| -------------- | ------------ | --------------------------------------------- |
| id             | VARCHAR(36)  | **PK**                                        |
| userId         | VARCHAR(36)  | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| courseId        | VARCHAR(36)  | NOT NULL                                      |
| certificateUrl | VARCHAR(500) | NULL                                          |
| issuedAt       | DATETIME     | NOT NULL, DEFAULT NOW                         |

**Unique:** `(userId, courseId)`

---

### Table 23 — Notification

| Column    | Type         | Constraints                                   |
| --------- | ------------ | --------------------------------------------- |
| id        | VARCHAR(36)  | **PK**                                        |
| userId    | VARCHAR(36)  | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| type      | ENUM('ENROLLMENT','COURSE_UPDATE','REVIEW','PAYMENT','SYSTEM','MESSAGE') | NOT NULL, DEFAULT 'SYSTEM' |
| title     | VARCHAR(255) | NOT NULL                                      |
| message   | TEXT         | NOT NULL                                      |
| isRead    | BOOLEAN      | NOT NULL, DEFAULT FALSE                       |
| link      | VARCHAR(500) | NULL                                          |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                         |

---

### Table 24 — Message

| Column     | Type        | Constraints                                            |
| ---------- | ----------- | ------------------------------------------------------ |
| id         | VARCHAR(36) | **PK**                                                 |
| senderId   | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE (sender) |
| receiverId | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE (receiver) |
| content    | TEXT        | NOT NULL                                               |
| isRead     | BOOLEAN     | NOT NULL, DEFAULT FALSE                                |
| createdAt  | DATETIME    | NOT NULL, DEFAULT NOW                                  |

---

### Table 25 — SupportTicket

| Column    | Type         | Constraints                                   |
| --------- | ------------ | --------------------------------------------- |
| id        | VARCHAR(36)  | **PK**                                        |
| userId    | VARCHAR(36)  | NOT NULL, **FK → User(id)** ON DELETE CASCADE |
| subject   | VARCHAR(255) | NOT NULL                                      |
| status    | ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') | NOT NULL, DEFAULT 'OPEN' |
| priority  | ENUM('LOW','MEDIUM','HIGH','URGENT') | NOT NULL, DEFAULT 'MEDIUM' |
| createdAt | DATETIME     | NOT NULL, DEFAULT NOW                         |
| updatedAt | DATETIME     | NOT NULL, AUTO-UPDATE                         |

---

### Table 26 — TicketMessage

| Column    | Type        | Constraints                                            |
| --------- | ----------- | ------------------------------------------------------ |
| id        | VARCHAR(36) | **PK**                                                 |
| ticketId  | VARCHAR(36) | NOT NULL, **FK → SupportTicket(id)** ON DELETE CASCADE |
| userId    | VARCHAR(36) | NOT NULL, **FK → User(id)** ON DELETE CASCADE          |
| content   | TEXT        | NOT NULL                                               |
| createdAt | DATETIME    | NOT NULL, DEFAULT NOW                                  |

---

### Table 27 — FAQ

| Column      | Type         | Constraints                     |
| ----------- | ------------ | ------------------------------- |
| id          | VARCHAR(36)  | **PK**                          |
| question    | VARCHAR(500) | NOT NULL                        |
| answer      | TEXT         | NOT NULL                        |
| category    | VARCHAR(100) | NOT NULL, DEFAULT 'General'     |
| position    | INT          | NOT NULL, DEFAULT 0             |
| isPublished | BOOLEAN      | NOT NULL, DEFAULT TRUE          |
| createdAt   | DATETIME     | NOT NULL, DEFAULT NOW           |
| updatedAt   | DATETIME     | NOT NULL, AUTO-UPDATE           |

---

### Table 28 — Wallet

| Column    | Type          | Constraints                                            |
| --------- | ------------- | ------------------------------------------------------ |
| id        | VARCHAR(36)   | **PK**                                                 |
| userId    | VARCHAR(36)   | NOT NULL, **UNIQUE**, **FK → User(id)** ON DELETE CASCADE |
| balance   | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00                                 |
| updatedAt | DATETIME      | NOT NULL, AUTO-UPDATE                                  |

---

### Table 29 — WalletTransaction

| Column      | Type          | Constraints                                    |
| ----------- | ------------- | ---------------------------------------------- |
| id          | VARCHAR(36)   | **PK**                                         |
| walletId    | VARCHAR(36)   | NOT NULL, **FK → Wallet(id)** ON DELETE CASCADE |
| amount      | DECIMAL(10,2) | NOT NULL                                       |
| type        | VARCHAR(50)   | NOT NULL                                       |
| description | VARCHAR(500)  | NULL                                           |
| createdAt   | DATETIME      | NOT NULL, DEFAULT NOW                          |

---

### Enums Used

| Enum Name          | Values                                                          |
| ------------------ | --------------------------------------------------------------- |
| **UserRole**       | STUDENT, INSTRUCTOR, ADMIN                                      |
| **CourseLevel**    | BEGINNER, INTERMEDIATE, ADVANCED                                |
| **CourseStatus**   | DRAFT, PENDING_REVIEW, APPROVED, REJECTED                       |
| **PaymentStatus**  | PENDING, COMPLETED, FAILED, REFUNDED                            |
| **TicketStatus**   | OPEN, IN_PROGRESS, RESOLVED, CLOSED                             |
| **TicketPriority** | LOW, MEDIUM, HIGH, URGENT                                       |
| **NotificationType** | ENROLLMENT, COURSE_UPDATE, REVIEW, PAYMENT, SYSTEM, MESSAGE  |
| **QuizQuestionType** | MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER                     |

---

### Column Count Summary

| Table                | Columns |
| -------------------- | :-----: |
| User                 | 19      |
| Category             | 6       |
| Course               | 17      |
| Section              | 7       |
| Lecture              | 11      |
| Resource             | 7       |
| Enrollment           | 6       |
| LectureProgress      | 6       |
| Review               | 7       |
| Cart                 | 3       |
| CartItem             | 4       |
| Order                | 8       |
| OrderItem            | 4       |
| Coupon               | 9       |
| Quiz                 | 7       |
| QuizQuestion         | 7       |
| QuizOption           | 4       |
| QuizAttempt          | 6       |
| QuizAnswer           | 5       |
| Assignment           | 8       |
| AssignmentSubmission | 9       |
| Certificate          | 5       |
| Notification         | 8       |
| Message              | 6       |
| SupportTicket        | 7       |
| TicketMessage        | 5       |
| FAQ                  | 7       |
| Wallet               | 4       |
| WalletTransaction    | 6       |
| **TOTAL**            | **201** |

---

> **Total: 29 database tables (201 columns), 8 enums, 20 backend modules, 27 frontend routes, 3 user roles**
