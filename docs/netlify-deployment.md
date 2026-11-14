# Netlify deployment runbook — MAAK Enterprises

This guide prepares the project for a client-owned Netlify account. It does not authorize a public deployment, domain purchase, PR merge, or a change to the approved design.

## 1. Current deployment posture

- Framework: Next.js 16 App Router with React 19.
- Routing: App Router pages, Route Handlers, Server Actions, and Next.js 16 `proxy.ts`.
- Hosting target: Netlify Free, using Netlify's automatically managed Next.js/OpenNext adapter.
- Runtime pin: Node.js 22 via repository `.node-version`, shared with GitHub Actions.
- Database/auth/storage: Supabase integration is prepared in source, but no live Supabase project has been created or tested.
- Deploy status: not connected to a Netlify site; no production deploy has been performed.

Do not set this application to static export. Admin authentication, server actions, Route Handlers, inquiry writes, and future Supabase-backed content require server runtime support.

## 2. Before connecting GitHub

1. Confirm the client owns or controls the Netlify account and GitHub repository access.
2. Keep the GitHub repository private if possible. It is currently public; review all tracked files and Git history for secrets and client-confidential content before hosting.
3. Inspect and remove any unnecessary source archives or backups from the repository after confirming they are not needed. A tracked ZIP archive exists in this repository; this review did not extract and inspect every compressed file's contents, so it is not certified clean. Do not assume that `.gitignore` protects a file already tracked by Git.
4. If any credential is found in the archive or Git history, rotate/revoke it first. Removing the current file does not remove old Git history. History rewriting requires a separate coordinated approval.
5. Do not put real secrets in GitHub files, commits, screenshots, or this runbook.

## 3. Create the Netlify site (when authorized)

1. Sign in to the client's Netlify account.
2. Choose **Add new project → Import an existing project**.
3. Connect GitHub and select `subayyalshah12/maak-enterprises`.
4. Select the intended production branch only after PR #1 is reviewed and merged with explicit approval. Until then, use a Deploy Preview for the feature branch if a preview is explicitly authorized.
5. Let Netlify detect Next.js automatically.

Expected build configuration:
- Build command: `npm run build` (Netlify's Next.js runtime may provide its own default; retain the detected Next.js setting unless the build log indicates otherwise).
- Publish directory: leave Netlify's Next.js default; do not force `out` or `.next`.
- Node version: `.node-version` (22).
- Do not manually install or pin `@netlify/plugin-nextjs`; Netlify manages the Next.js adapter.

A successful local `next build` or GitHub Actions build is not the same as a successful Netlify adapter build. Confirm the Netlify build log and test the resulting deploy preview before production.

## 4. Environment variables

Add variables in **Site configuration → Environment variables** for the correct deploy contexts. Never commit actual values.

| Variable | Required | Guidance |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Yes for production auth links | Exact HTTPS production origin, no trailing slash |
| `NEXT_PUBLIC_SUPABASE_URL` | When Supabase exists | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | When Supabase exists | Public/anon key only; RLS must protect data |
| `MAAK_DEMO_MODE` | No | Do not set true in Netlify; leave unset/false |
| `NEXT_PUBLIC_WHATSAPP_GENERAL` | Optional | Only company-approved international digits |
| `NEXT_PUBLIC_WHATSAPP_REAL_ESTATE` | Optional | Only company-approved international digits |
| `NEXT_PUBLIC_WHATSAPP_CONSTRUCTION` | Optional | Only company-approved international digits |
| `NEXT_PUBLIC_WHATSAPP_EDUCATION` | Optional | Only company-approved international digits |

Never expose a Supabase service-role/secret key with a `NEXT_PUBLIC_` prefix or in browser code. No such key is required by the current client-facing configuration. If a future server-only integration requires one, it needs separate security review and must be stored as a server-only Netlify environment variable.

After changing environment variables, trigger a fresh deploy so the build/runtime receives them.

## 5. Supabase setup is a separate prerequisite

1. Create the Supabase project under the client's ownership.
2. Apply `supabase/migrations/0001_initial_schema.sql`.
3. Create approved staff users and seed their UUIDs into `public.admin_users`.
4. Configure the two public Supabase variables in Netlify and local development.
5. Set the correct production site URL and allowed redirect URLs in Supabase Auth.
6. Test public reads, admin login/logout, role checks, password reset, inquiry inserts, property/project CRUD, storage upload limits, and RLS using real accounts.
7. Verify unauthorized users cannot read private inquiries or mutate content.

Until those tests pass, the admin database, auth, uploads and enquiry persistence are not production-verified. Do not use local demo data as real customer records.

## 6. Preview QA checklist

Use a non-production Deploy Preview first, with no real customer data.

- [ ] Netlify build completes using its managed Next.js adapter.
- [ ] Homepage, About, Real Estate, Construction, Education, Projects and Contact load.
- [ ] Responsive navigation and mobile layouts work.
- [ ] Missing inventory/project states are clear and do not show demo records.
- [ ] Unknown slugs return the designed not-found page.
- [ ] `/admin` redirects unauthenticated visitors.
- [ ] Demo entry point is absent; `MAAK_DEMO_MODE` is not true.
- [ ] Inquiry endpoint rejects invalid, oversized, cross-origin and honeypot submissions as expected.
- [ ] With Supabase configured, test authorized admin workflows and RLS end-to-end.
- [ ] Verify images, caching, redirects, headers and browser console on mobile and desktop.
- [ ] Verify password reset email links resolve to the correct HTTPS domain.

Do not accept a preview as production-ready until the real Supabase tests and client content approvals are complete.

## 7. Client-owned .pk domain (later, with approval)

After production approval and domain purchase by the client:
1. Add the domain in Netlify's domain management.
2. Follow the exact DNS records Netlify provides for that site and the registrar's interface.
3. Verify DNS propagation and HTTPS certificate issuance.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and update Supabase Auth redirect URLs.
5. Run the production smoke checklist again.

Do not guess DNS records or change nameservers before the client approves the domain and registrar details.

## 8. Free-plan cost and availability controls

Netlify Free is a metered plan with a monthly credit allowance, not an unlimited always-on hosting guarantee. Production deploys, bandwidth, compute and requests consume credits. When the allowance is exhausted, projects may be paused until the allowance resets; do not promise uninterrupted service or a fixed traffic capacity. Check the current Netlify plan page and site usage dashboard before launch and monitor usage monthly.

Supabase Free has resource limits and may pause projects after a period of low activity. It does not provide the same backup guarantees as paid tiers. For a real business site, schedule manual database exports/backups and document recovery steps before accepting live enquiries. A paused Supabase project can make dynamic content and admin operations unavailable even if the static shell still loads.

The client must understand that zero-cost hosting has operational limits. If the business later needs guaranteed uptime, larger media storage, dependable backups, or more traffic, review costs with the client before upgrading. No paid upgrade is authorized by this guide.

## 9. Go-live approval gates

Production deployment requires all of the following:
- Explicit client approval of final site content and assets.
- Approved Supabase project configured and end-to-end tests passed.
- Repository archive/security review completed, with any exposed credentials rotated.
- CI and Netlify adapter build both passing.
- Client-owned Netlify account and domain ready.
- Explicit approval to merge PR #1 and deploy the production branch.

Until then, keep the work in the existing feature branch and leave the PR open.
