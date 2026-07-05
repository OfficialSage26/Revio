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
saved to `public/uploads`.

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

## Deploying to Vercel

1. Switch the Prisma datasource provider in `prisma/schema.prisma` from `sqlite`
   to `postgresql` and set `DATABASE_URL` to a Postgres connection string (e.g.
   Neon via the Vercel Marketplace). Re-run `npx prisma migrate dev`.
2. Add a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` so uploads persist.
3. Set a strong `AUTH_SECRET` in the project's environment variables.
4. Deploy.

## Out of scope (future versions)

Real-time chat, notifications, GitHub API integration, AI-assisted review,
plagiarism detection, and panel evaluations are intentionally excluded from this
MVP.
