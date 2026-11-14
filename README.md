# MAAK Enterprises Company — Corporate Website

A responsive Next.js App Router website and private admin portal based on the approved MAAK Figma design. Brand colors: navy `#172B55`, gold `#D6A642`, sky blue `#AFC7E7`, white and charcoal.

## Included

- Public pages: Home, About, Real Estate, Property Detail, Construction, Educational Consultancy, Projects, Project Detail and Contact.
- Private admin: login, dashboard, property CRUD/status actions, construction project CRUD, inquiry list/detail/status/notes/follow-up, password reset and settings overview.
- Supabase SSR authentication using cookie-based sessions.
- Supabase SQL migration with Row Level Security policies for properties, projects, enquiries, admin membership and media storage.
- Public listings remain empty until an administrator adds and publishes verified records. No sample listings, fake testimonials, statistics, certifications or project claims are seeded.
- Official MAAK logo supplied by the company is in `public/maak-logo.png`.

## Local setup

1. Install Node.js 22 or newer.
2. Create a Supabase project and open its SQL Editor.
3. Run `supabase/migrations/0001_initial_schema.sql` once.
4. In Supabase Authentication, create the first staff user with the approved administrator email. Disable public sign-up after creating the staff account.
5. Copy the new user's UUID from Authentication → Users, then run this SQL in the Supabase SQL Editor (replace the UUID):

   ```sql
   insert into public.admin_users (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

6. Copy `.env.example` to `.env.local` and fill:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

7. Run:

   ```bash
   npm install
   npm run dev
   ```

8. Open `http://localhost:3000`. Admin sign-in is at `/admin/login`.

## Security notes

- Never place a Supabase service-role/secret key in a `NEXT_PUBLIC_` variable or browser code. This project does not need a service-role key.
- Public visitors can submit consented enquiries only. They cannot read enquiries or change their status/notes.
- Only user IDs explicitly inserted into `public.admin_users` can access the staff portal or write properties/projects/upload media.
- Sold and archived properties remain in the admin database but are not returned by the public listing query.
- Only publish a property after owner/agent authority, accuracy, media rights and commission terms have been checked.
- The first migration creates a public-read media bucket with admin-only writes. Do not upload identity documents or private customer records there.

## Cloudflare deployment

Cloudflare's current Next.js guide recommends **vinext** as the default Workers path for new Next.js apps, while noting that vinext is beta. Keep the standard Next.js development workflow until the compatibility check is clean:

```bash
npx vinext check
npx vinext init
npm run dev:vinext
npm run build:vinext
npx @vinext/cloudflare deploy
```

`vinext init` generates the Vite and Cloudflare Workers configuration and scripts for the project. Review its generated `wrangler.jsonc` and the compatibility report before production deployment. Set the Supabase URL and publishable/anon key as Worker environment variables; set `NEXT_PUBLIC_SITE_URL` to the production domain. Use Cloudflare's secret/environment-variable settings, not committed files.

Official guidance: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

## Content still needed before public launch

- Company-approved About copy (mission, vision, values and any history the company wishes to publish).
- Approved service descriptions for Construction and Educational Consultancy.
- Verified property listings with owner/agent authorisation, prices and property photography.
- Verified construction project names, status, descriptions and image rights.
- Confirmed office phone/WhatsApp numbers and social links, if they should be shown publicly.

All unavailable facts remain omitted or clearly marked as placeholders. The site does not invent company history, property inventory, projects, certifications, achievements or testimonials.
