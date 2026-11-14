# MAAK Enterprises — Corporate Website

Next.js App Router frontend and admin portal based on the approved MAAK Figma design.

## Local development without Supabase

Supabase is not required to work on the frontend.

1. Install Node.js 22 or newer.
2. Copy `.env.example` to `.env.local`.
3. Leave the Supabase URL and key blank until the company creates its Supabase project.
4. Keep `MAAK_DEMO_MODE=true` for the local admin UI walkthrough.
5. Run `npm install` and `npm run dev`.

The local demo mode is explicitly labelled, restricted to non-production `NODE_ENV`, and uses volatile in-memory records. Changes are not persistent and can disappear on process restart. It is not real authentication, must never be deployed, and never bypasses production authorization.

Public property and project pages remain empty until genuine, approved company records are connected. Demo records are clearly marked and must not be represented as actual inventory, projects, customers or enquiries.

## Future Supabase integration

The repository contains SSR/browser client scaffolding and `supabase/migrations/0001_initial_schema.sql`. Once the company creates a project:

1. Apply the SQL migration in Supabase SQL Editor.
2. Create the first approved staff user in Supabase Auth.
3. Manually insert that user's UUID into `public.admin_users` as documented in the migration.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to local `.env.local` and deployment environment settings.
5. Test RLS, admin authorization, enquiry writes, CRUD and storage against that real project before launch.

Never put a service-role/secret key in a `NEXT_PUBLIC_` variable or browser code.

## Current implementation boundaries

- Public and admin UI can be developed locally without a Supabase account.
- Demo records are illustrative only, volatile and not persisted.
- Supabase database, authentication, email delivery and storage are not live or verified until a real project is configured and tested.
- Property/project image fields currently accept URLs. An authenticated file-upload interface and live Storage tests remain outstanding.
- Division-specific WhatsApp routing must use company-approved destination numbers; no recipients are invented.
- No sample listing, fake testimonial, certification, company history or project claim is seeded.

## Company content required before launch

- Approved About copy, service descriptions and business claims.
- Verified property listings, authority to market, prices and media rights.
- Verified project names, statuses, descriptions and image rights.
- Approved WhatsApp/contact routing and public contact details.
