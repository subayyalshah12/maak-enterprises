# MAAK Enterprises — Corporate Website

Next.js App Router frontend and admin portal based on the approved MAAK Figma design.

## Local development without Supabase

Supabase is not required to work on the frontend.

1. Use Node.js 22 (the repository pins the major version in `.node-version`).
2. Copy `.env.example` to `.env.local`.
3. Leave the Supabase URL and key blank until the company creates its Supabase project.
4. Keep `MAAK_DEMO_MODE=true` only for a local development walkthrough.
5. Run `npm ci` and `npm run dev`.

The local demo mode is explicitly labelled and restricted to `NODE_ENV=development`. Its records are stored in a local, Git-ignored `.maak-demo-data.json` file, so they can persist across local server restarts. This is a development fixture only: it is not production persistence, not real authentication, and must never be enabled or used in a deployment. The production build has a CI check that verifies the demo entry point is unavailable and protected admin routes redirect when Supabase is absent.

Public property and project pages remain empty until genuine, approved company records are connected. Demo records are clearly marked and must not be represented as actual inventory, projects, customers or enquiries.

## Future Supabase integration

The repository contains SSR/browser client scaffolding and `supabase/migrations/0001_initial_schema.sql`. Once the company creates a project:

1. Apply the SQL migration in Supabase SQL Editor.
2. Create the first approved staff user in Supabase Auth.
3. Manually insert that user's UUID into `public.admin_users` as documented in the migration.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to local `.env.local` and the deployment environment settings.
5. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS production origin before testing password reset links.
6. Test RLS, admin authorization, enquiry writes, CRUD and Storage against that real project before launch.

Never put a service-role/secret key in a `NEXT_PUBLIC_` variable or browser code. The current application is designed to use the public/anon key with database RLS; do not add a service-role key unless a separately reviewed server-only requirement is established.

## Netlify deployment preparation

See [docs/netlify-deployment.md](docs/netlify-deployment.md) for the GitHub connection, build settings, environment variables, preview checks, and Free-plan limitations.

Netlify automatically detects Next.js and provisions its maintained OpenNext adapter. Do not add a manually pinned adapter/plugin or a static-export configuration for this App Router application. A standard `next build` passing in GitHub Actions is not proof that a Netlify adapter build or deployment has passed; the guide keeps that verification as a separate step.

## Current implementation boundaries

- Public and admin UI can be developed locally without a Supabase account.
- Demo records are local-only development fixtures and are not persisted to Supabase.
- Supabase database, authentication, email delivery and storage are not live or verified until a real project is configured and tested.
- Property/project editors include a prepared authenticated Supabase Storage uploader with MIME and 10 MB size checks. It stays disabled until Supabase environment variables are configured; real upload and RLS behavior remain untested until a project exists.
- Division-specific WhatsApp routing must use company-approved destination numbers; no recipients are invented.
- No sample listing, fake testimonial, certification, company history or project claim is seeded.

## Company content required before launch

- Approved About copy, service descriptions and business claims.
- Verified property listings, authority to market, prices and media rights.
- Verified project names, statuses, descriptions and image rights.
- Approved WhatsApp/contact routing and public contact details.
