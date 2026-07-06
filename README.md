# Revio

**Capstone project review & monitoring platform.** Students post their capstone
outputs (documents, code links, progress); advisers review and give feedback on
their own time. No in-person meeting required, no administrator role.

Built with Next.js (App Router) + Prisma. Two roles: **Student** and **Adviser**.
Advisers generate a unique code; students join by entering it.

## Getting started

```bash
npm install
npx prisma migrate dev   # creates the local SQLite database
npm run dev              # http://localhost:3000
```

The app runs fully locally out of the box — SQLite for data, and uploaded files
saved to a private `./uploads` folder served through an authenticated route.

Copy `.env.example` to `.env` before starting.

### Environment (`.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Database connection. Default: `file:./dev.db` (SQLite). |
| `AUTH_SECRET` | Secret used to sign session cookies. **Change this in production.** |
| `BLOB_READ_WRITE_TOKEN` | Optional. When set, uploads go to Vercel Blob instead of the local folder. |

## How it works

1. **Adviser** registers → gets a code like `ADV-7QK2ML` shown on their dashboard.
2. **Student** registers → creates a project (title, description, GitHub URL, live
   URL) and links the adviser with that code.
3. Student uploads documents (proposal, Chapter 1–5, other) and posts progress
   updates. New uploads of the same type become new versions; old versions are kept.
4. Adviser opens the project, reviews documents, opens the GitHub/live links, and
   leaves feedback — a comment plus a status: **Approved / Pending Review /
   Revision Required**.
5. Every action is recorded on the project's **timeline**, giving both sides a
   transparent chronological history.

Access control: only a project's owning student or its linked adviser can open it;
anything else returns 404.

## Security

- Passwords hashed with **bcrypt**; sessions are signed httpOnly JWT cookies (`jose`).
- **Login rate limiting** — 5 failed attempts per email per 15 minutes.
- Uploads are **extension-whitelisted** (blocks executable/script types) and served
  only through `/api/files/[key]`, which verifies the session and project membership
  before streaming the file — no team can read another team's documents.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`) set in `next.config.ts`; `poweredByHeader` disabled.
- Every project route enforces student-or-adviser membership.

## Project structure

```
prisma/schema.prisma          Data model (User, Project, Document, ProgressUpdate,
                              Feedback, TimelineEvent)
src/lib/                      prisma client, auth (session/bcrypt/jose), storage,
                              access control, timeline + adviser-code helpers,
                              domain constants
src/app/actions/              Server actions (auth, project, document, progress, feedback)
src/app/                      Pages: /, /login, /register, /dashboard,
                              /project/new, /project/[id]
src/components/               UI + client forms
```

## Deploying (free options)

Revio can run **100% free**. Three paths — Vercel + Neon + Blob, Vercel + Supabase,
or a fully-local SQLite build for an offline defense demo — are documented step by
step in **[DEPLOYMENT.md](./DEPLOYMENT.md)**, including the security checklist.

## Out of scope (future versions)

Real-time chat, notifications, GitHub API integration, AI-assisted review,
plagiarism detection, and panel evaluations are intentionally excluded from this
MVP.
