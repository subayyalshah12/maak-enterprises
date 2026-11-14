# MAAK Enterprises — Figma-to-implementation review

Reference: approved Figma file `MAAK Enterprises — Corporate Website — Admin Dashboard`, pages 04–08 and page 09 Design QA. This is a structural implementation review; it does not claim a complete pixel-perfect browser screenshot sign-off.

## Public route coverage and current alignment
- Home `/`: shared site shell, hero and division cards are implemented. Final screenshot comparison against Desktop / Home and Mobile / Home remains a manual release task.
- About `/about`: now follows the approved About structure with company/team image placeholder, Our Approach section, Mission, Vision and Philosophy cards, and the provided leadership contact cards. Placeholder copy and photography remain explicitly unapproved until the company supplies content.
- Real Estate `/real-estate`: interactive keyword/location, property type, minimum/maximum price, Buy/Rent/Sell and reset controls are implemented. Results, no-results and sell-enquiry states are included. Loading state is provided by the framework's route loading behavior only if a loading route is added; no artificial loading animation was added.
- Property detail `/real-estate/[slug]`: gallery, specifications, price and inquiry form use Next Image. Image delivery is currently marked `unoptimized` because the project accepts approved external URLs; configure and test an allowlist/optimizer before enabling optimization.
- Construction `/construction`: service content and construction-only project cards remain.
- Construction project detail `/construction/[slug]`: dedicated route now exists and only renders published projects whose division is construction.
- Projects `/projects` and `/projects/[slug]`: shared detail view now renders up to five approved project images in a gallery, overview, location/status and enquiry form.
- Educational Consultancy `/education`: enquiry form and editable placeholder copy remain. No unverified partner or service claims have been introduced.
- Contact `/contact`: office/map links, supplied email, leadership contacts and enquiry form remain.

## Admin route and workflow coverage
- Protected admin pages and server actions use `requireAdmin()`. Production authentication remains Supabase-backed; the demo adapter is development-only.
- Property create/edit, publish/available, sold and archive controls remain. Permanent delete remains intentionally unavailable; archive is safer and matches the approved workflow's reversible action.
- Project create/edit, draft/publish/unpublish/archive/restore controls remain.
- Image upload accepts JPG, PNG, WebP and AVIF up to 10 MB each, supports multiple uploads, displays previews, and allows removal from the saved image URL list. On a successful record update, removed files belonging to the MAAK public media bucket are cleaned up. Supabase upload and cleanup still require a real project and RLS verification.
- Inquiry list/detail, status, internal notes and follow-up remain. Current status enum (new/contacted/qualified/closed/spam) differs from Figma labels (new/contacted/viewing/negotiation/won/lost); keep the current values until the client approves a mapping.
- Website Settings remains read-only until editable fields and permissions are approved.

## Division-specific WhatsApp routing
The inquiry form now supports optional destinations through `NEXT_PUBLIC_WHATSAPP_GENERAL`, `NEXT_PUBLIC_WHATSAPP_REAL_ESTATE`, `NEXT_PUBLIC_WHATSAPP_CONSTRUCTION` and `NEXT_PUBLIC_WHATSAPP_EDUCATION`. A division-specific WhatsApp follow-up link is shown only when its destination is configured as a valid international phone number. All values are blank in `.env.example` pending official company approval; no number has been invented.

## Responsive/design QA boundary
The main layouts have responsive CSS for desktop/tablet/mobile. The complete browser screenshot comparison at 1440 px, 768 px and 390 px, keyboard/contrast checks, and cross-browser testing are still manual release gates. Use `docs/functional-test-checklist.md` and compare against the corresponding Figma frames. Do not treat a successful build as visual sign-off.
