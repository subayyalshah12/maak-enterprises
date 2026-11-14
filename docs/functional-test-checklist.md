# MAAK Enterprises — Functional QA Checklist

Use this checklist in the local Supabase-free demo first, then repeat backend-dependent cases against a real Supabase project before launch. Mark each case PASS / FAIL / BLOCKED and record browser, viewport, date and evidence.

## A. Local setup and access
- [ ] Copy `.env.example` to `.env.local`; leave Supabase URL/key blank.
- [ ] Start the app with Node.js 22 and `npm ci && npm run dev`.
- [ ] Confirm the admin login clearly labels local demo mode.
- [ ] Enter the demo dashboard; confirm demo property, project and inquiry records are visibly marked.
- [ ] Create/edit demo properties, projects and inquiry status; verify the UI updates in process memory.
- [ ] Confirm demo changes are volatile and can reset after process restart.
- [ ] Build and start production with `MAAK_DEMO_MODE=true`; confirm the demo entry point is absent and unauthenticated `/admin` redirects to login/setup.
- [ ] Confirm public routes do not expose demo records as genuine listings, projects or enquiries.

## B. Property management
- [ ] Create a property with required title, slug, type, purpose, location and size.
- [ ] Validate required fields, numeric price, bedrooms and bathrooms.
- [ ] Save as unpublished; confirm it is absent from public listings.
- [ ] Edit all property fields and save; confirm changes persist in the selected backend.
- [ ] Publish an approved property; confirm it appears in public listings and its detail page.
- [ ] Mark a property sold; confirm it disappears from public listings but remains in admin.
- [ ] Archive a property; confirm it disappears from public listings but remains in admin.
- [ ] Verify duplicate slugs and invalid input return understandable errors.
- [ ] Verify keyword/location, property type, min/max price, Buy/Rent and Reset filters against multiple fixture records.
- [ ] Verify Sell opens the property-submission enquiry path.
- [ ] Upload multiple permitted images; test file type and 10 MB size rejection.
- [ ] Replace/remove images; confirm detached files in the MAAK media bucket are removed only after the record update succeeds.

## C. Construction project management
- [ ] Create a construction project with title, unique slug, location, division, status and description.
- [ ] Save as draft; confirm it is absent from public project pages.
- [ ] Edit project details and gallery.
- [ ] Publish; confirm project appears in construction portfolio and `/construction/[slug]`.
- [ ] Unpublish; confirm it disappears from public pages.
- [ ] Archive; confirm it remains available in admin but is not public.
- [ ] Restore archived project as draft.
- [ ] Verify invalid division and duplicate slug handling.
- [ ] Upload, replace and remove project images; verify Storage permissions and cleanup.

## D. Inquiry handling and WhatsApp routing
- [ ] Submit valid general, real-estate, construction and education enquiries.
- [ ] Submit a property-linked enquiry and verify property association.
- [ ] Verify required fields, email format, phone length and consent validation.
- [ ] Verify invalid origin, wrong content type, oversized body and honeypot behavior.
- [ ] Confirm public/anonymous users cannot read, update or delete inquiries.
- [ ] Confirm public insert cannot set staff-only status, internal notes, follow-up or timestamps.
- [ ] Admin opens inquiry detail and sees submitted fields.
- [ ] Admin changes status, adds internal notes and sets follow-up date.
- [ ] Confirm updates persist and are visible after refresh.
- [ ] Test error responses and duplicate/retry behavior.
- [ ] After official destination numbers are approved, set the four WhatsApp environment variables and test each division's link and prefilled message. Confirm links remain hidden while destinations are blank.

## E. Responsive and accessibility review
- [ ] Compare every public route at 1440 px desktop, 768 px tablet and 390 px mobile.
- [ ] Specifically compare About intro/cards, real-estate filters, property detail gallery and project detail gallery to approved Figma frames.
- [ ] Check header navigation, mobile menu open/close and keyboard operation.
- [ ] Check hero, cards, gallery, forms, tables, footer and CTA wrapping.
- [ ] Check horizontal overflow, clipped text, image aspect ratios and touch target sizes.
- [ ] Check visible keyboard focus, labels, form errors, semantic headings and image alt text.
- [ ] Check contrast and reduced-motion behavior.
- [ ] Repeat across Chrome and one additional browser.

## F. Production backend acceptance (blocked until Supabase exists)
- [ ] Apply the reviewed SQL migration to a NEW Supabase project.
- [ ] Create approved staff Auth users; manually seed only approved UUIDs in `admin_users`.
- [ ] Test RLS for anon, authenticated non-admin and approved admin roles.
- [ ] Test CRUD, publish/unpublish/archive, inquiry handling and Storage policies with real sessions.
- [ ] Verify storage bucket MIME/size constraints and public-read scope.
- [ ] Verify removed media cleanup using actual storage objects.
- [ ] Verify secrets are not exposed in client bundles or logs.
- [ ] Configure backup/restore and incident recovery procedures.
- [ ] Perform production smoke test before DNS/domain launch.
