# MAAK Enterprises — Figma-to-implementation review

Reference: approved Figma file `MAAK Enterprises — Corporate Website — Admin Dashboard`, especially pages 04–08 and page 09 Design QA. This is a structural/code review, not a claim of pixel-perfect browser screenshot approval.

## Public route coverage
- Home `/`: implemented with shared site shell, hero and division cards. Compare hero geometry, CTA and card image placeholders against Desktop / Home and Mobile / Home.
- About `/about`: implemented, but the approved screen includes a large company/team image and Mission, Vision and Values cards. Current page substitutes a leadership grid and omits those visual sections. Content must remain company-approved.
- Real Estate `/real-estate`: implemented with listing cards and empty state. Approved Figma includes location/property-type search, Buy/Rent/Sell controls and default/filtered/no-results/loading states; these interactive filters are not present in the current page.
- Property detail `/real-estate/[slug]`: implemented with gallery, specifications, price and inquiry form. Verify image geometry and responsive stacking; images currently use Next Image with `unoptimized`, so optimizer delivery is not yet enabled.
- Construction `/construction`: implemented with service content and portfolio. Approved Construction Project Detail is served through generic `/projects/[slug]`, not a dedicated `/construction/[slug]` route. Confirm intended URL with client.
- Educational Consultancy `/education`: implemented with enquiry form and editable placeholder copy. Compare with the dedicated education and enquiry/confirmation screens; no claims about partners or services should be added without approval.
- Projects `/projects` and `/projects/[slug]`: implemented. Detail page uses a placeholder project-art panel rather than a true multi-image gallery.
- Contact `/contact`: implemented with office/map links, email, leadership contacts and enquiry form. Verify supplied company content and layout at each breakpoint.

## Admin route coverage
- Login, dashboard, properties, property editor, projects, inquiry list/detail and settings routes exist and call server-side `requireAdmin()` on protected pages/actions.
- Approved property workflow includes publish/available, sold and archive actions. The Figma archive includes a delete confirmation state; no permanent-delete UI is implemented (intentionally safer than destructive deletion).
- Image upload accepts multiple files when Supabase is configured, but per-image replace/remove workflow and orphan cleanup are not implemented.
- Project draft/publish/unpublish/archive/restore controls exist; verify actual Storage and DB behavior only after Supabase exists.
- Inquiry list/detail, status, internal notes and follow-up exist. Current status enum (new/contacted/qualified/closed/spam) differs from Figma labels (new/contacted/viewing/negotiation/won/lost); confirm desired business workflow before changing it.
- Website Settings currently displays company configuration and is read-only; the Figma settings screen may imply editable website settings. Keep read-only until edit permissions and approved fields are defined.

## Responsive/design QA boundary
Figma includes desktop, tablet, mobile and canonical admin screens plus workflow states. Code uses shared layout components and responsive CSS, but no complete browser screenshot comparison has been performed for every frame at this review stage. The manual checklist in `docs/functional-test-checklist.md` is the release gate.
