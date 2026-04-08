# Auto Service Site

This project is a Next.js + Tailwind + Prisma web app for an auto service booking platform.

## Environment variables

Create a `.env.local` file in the project root with the following values:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Upstash Redis (required for reliable rate limiting on serverless platforms)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# CSRF (optional - only used to avoid undefined behavior)
# NEXT_PUBLIC_CSRF_TOKEN="..." (unused when using server-generated CSRF via /api/csrf)
```

## Running locally

```bash
npm install
npm run dev
```

## Production / Deployment

### Vercel

1. Set the same environment variables in Vercel dashboard.
2. Deploy.

### Notes

- Rate limiting is implemented via **Upstash Redis** (serverless-safe).
- CSRF tokens are served via `/api/csrf` and stored in an http-only cookie.
