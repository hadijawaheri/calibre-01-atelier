# 0001. Rebuild the Lovable prototype on the project blueprint

Status: accepted

The Lovable export was a single Vite page with no backend. The store needs accounts, orders, stock and payments, so
the repository now follows PROJECT_BLUEPRINT_SHADCN.md: a pnpm monorepo with NestJS + MongoDB, Next.js + shadcn/ui
(RTL, Persian) and shared Zod contracts.

Consequence: the Lovable editor can no longer build the project once this lands on the synced branch.
