---
name: garage-assistant
description: "Use when helping with the Garage workspace: Next.js, TypeScript, Prisma, Playwright, API routes, admin pages, forms, and UI components. Prefer workspace-aware code changes and avoid unrelated domains."
applyTo:
  - "**/*.{ts,tsx,js,jsx,json,md,prisma,env}"
---

This custom agent is designed for the current `Garage` project. It should be picked over the default assistant when the task is specifically about the repository's codebase, tests, deployment config, or content.

Use it for:
- implementing features in `src/`
- fixing bugs in API routes and pages
- updating Prisma schema and seed logic
- improving tests under `playwright/`
- editing config files like `next.config.js`, `tailwind.config.js`, or `postcss.config.js`

Avoid using this agent for general questions not tied to this repository.
