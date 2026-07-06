# Deploying Revio (free options)

Revio can run **100% free** for a capstone project. Pick the path that fits how
you'll demo it. All three are genuinely $0 for this scale.

| Option | Cost | Best for | Persists data? |
| --- | --- | --- | --- |
| **A. Vercel + Neon + Blob** | Free | A public URL your panel can open anytime | ✅ Yes |
| **B. Vercel + Supabase** | Free | One dashboard for DB + storage | ✅ Yes |
| **C. Local SQLite** | Free | Offline demo on your own laptop at defense | ✅ Yes (local file) |

The app is written so switching between them is just environment variables plus a
one-line change to the Prisma datasource. Enum-like fields are stored as strings,
so the **same schema works on SQLite and Postgres** — no schema rewrite needed.

---

## Option A — Vercel + Neon + Vercel Blob (recommended)

Everything below has a free tier. No credit card needed for Neon or Vercel Hobby.

### 1. Point Prisma at Postgres
In `prisma/schema.prisma`, change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

The SQLite migration in `prisma/migrations/` is SQLite-flavored, so regenerate it
for Postgres:

```bash
rm -rf prisma/migrations        # (PowerShell: Remove-Item -Recurse -Force prisma/migrations)
```

You'll run the fresh migration against Neon in step 3.

### 2. Create a free Neon database
1. Sign up at **neon.tech** (free tier).
2. Create a project → copy the **connection string** (looks like
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).

### 3. Create a free Vercel Blob store
1. In your Vercel project → **Storage → Create → Blob** (free allowance).
2. Copy the **`BLOB_READ_WRITE_TOKEN`**.

### 4. Set environment variables
Locally (to run the migration) and in Vercel → **Settings → Environment Variables**:

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
AUTH_SECRET=<long random string>
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Generate `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Migrate and deploy
```bash
npx prisma migrate dev --name init   # creates tables in Neon
npx vercel                           # or push to GitHub and import at vercel.com
```

That's it — you get a public `https://your-app.vercel.app` URL.

> **Tip:** add `prisma generate` to your build so Vercel always has a fresh client.
> In `package.json`: `"build": "prisma generate && next build"`.

---

## Option B — Vercel + Supabase (single provider for DB + files)

Supabase's free tier gives you Postgres **and** file storage in one dashboard.

1. Follow Option A steps 1–2, but get your `DATABASE_URL` from **Supabase →
   Project Settings → Database** (use the connection pooler string for serverless).
2. For files you have two easy choices:
   - **Simplest:** still use Vercel Blob for uploads (Option A step 3). It's free
     and needs no code changes.
   - **All-Supabase:** create a Supabase Storage bucket and swap the `put()` call
     in `src/lib/storage.ts` for the Supabase JS client. (Small change, isolated
     to that one file.)
3. Deploy on Vercel exactly as in Option A step 5.

---

## Option C — Local SQLite (zero cloud, great for a live defense)

No accounts, no internet needed. This is the default the repo ships with.

```bash
npm install
npx prisma migrate dev      # creates dev.db (SQLite)
npm run build
npm run start               # http://localhost:3000
```

- Data lives in `prisma/dev.db`; uploaded files in `./uploads`.
- Perfect for demoing on the same laptop during your defense.
- To share on a network, run `npm run start -- -H 0.0.0.0` and open your machine's
  LAN IP from another device on the same Wi-Fi.

> Want a free always-on host with a persistent disk instead of Vercel? Render's
> free web service or Fly.io's free allowance can run this SQLite build — just
> mount a persistent volume for `dev.db` and `./uploads`.

---

## Security checklist before going live

- [x] `AUTH_SECRET` is a long random value (not the dev placeholder).
- [x] Passwords are hashed with bcrypt (already implemented).
- [x] Uploaded files are extension-whitelisted and served through an
      authenticated route — no direct public access to other teams' documents.
- [x] Login is rate-limited (5 attempts / 15 min per email).
- [x] Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) are set
      in `next.config.ts`.
- [x] Project pages enforce that only the owning student or linked adviser can view.
- [ ] Set all secrets as environment variables in your host — never commit `.env`.
