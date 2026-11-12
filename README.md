# SmartHive Marketing Website

A responsive marketing website for **SmartHive Marketing**, focused on helping med spas improve patient acquisition, conversion, booking, retention, and reactivation.

## Pages

| File | Purpose |
| --- | --- |
| `home.html` | Main landing page and overview of SmartHive's services |
| `grow.html` | Explains the patient growth system and process |
| `growth leak.html` | Growth-leak diagnostic and patient-journey content |
| `case-studies.html` | Case Studies hub (`/case-studies`): hero and featured case-study cards |
| `case-studies/afuri.html` | Afuri Aesthetics & Wellness case study (`/case-studies/afuri`) |
| `blogs/index.html` | Blog index and article template, with production empty state and optional local draft preview |
| `blogs/blog.css`, `blogs/blog.js`, `blogs/blog-content.js` | Blog styles, shared shell behaviour and the content layer |
| `blogs/blog-preview.js` | Local draft preview only; exclude from launch |
| `contact.html` | Contact and practice inquiry page |
| `404.html` | Branded not-found page with recovery links |

## Project structure

```text
.
|-- home.html
|-- grow.html
|-- growth leak.html
|-- case-studies.html
|-- case-studies/
|   |-- afuri.html
|-- case-studies.css
|-- blogs/
|   |-- index.html
|   |-- blog.css
|   |-- blog.js
|   |-- blog-content.js
|   |-- blog-preview.js
|-- supabase-blog.sql
|-- contact.html
|-- 404.html
|-- typography.css
|-- site-shell.css
|-- case-studies-polish.css
|-- contact.css
|-- contact.js
|-- firebase-contact.js
|-- firebase.json
|-- firestore.rules
|-- .firebaserc
|-- assets/
|   |-- smarthive-mark.svg
|   |-- smarthive-logo.svg
|   |-- smarthive-logo-light.svg
|   |-- case-hero.webp
|   |-- case-booking-consultation.webp
|   |-- case-injectables-consultation.webp
|   |-- case-retention-followup.webp
|   |-- contact-consultation.webp
|   `-- IMAGE-PROMPTS.md
|-- audit-modal.css
|-- audit-modal.js
|-- SEO-STRATEGY.md
|-- preview-server.js
|-- package.json
|-- vercel.json
`-- README.md
```

The website is built with plain HTML, CSS, and JavaScript. `typography.css` and `site-shell.css` provide the shared design system, while `case-studies-polish.css` contains the editorial Case Studies layout. The audit modal uses `audit-modal.css` and `audit-modal.js`. There is no frontend build step or package installation required.

The Case Studies photography in `assets/` is project-local, compressed WebP imagery generated specifically for the SmartHive med-spa visual system.

The contact and audit forms currently provide client-side validation and preview success states. Connect them to the approved database, CRM, or email endpoint when the backend is ready.

The local preview server returns `404.html` with a real HTTP 404 status for missing routes. Configure the production host to use the same file and status behavior.

## Run locally

Node.js is required for the included preview server.

1. Open a terminal in the project folder.
2. Start the server:

   ```bash
   node preview-server.js
   ```

3. Visit [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser.

The server opens `home.html` at the root URL and disables browser caching to make local development easier.

## Deploy to Vercel

1. Import the repository into Vercel or run `vercel` from this directory.
2. Keep the project root set to this folder and use the default static deployment settings.
3. Deploy. Vercel reads `vercel.json`, serves `home.html` at `/`, exposes the clean route aliases, applies the security headers, and serves the branded `404.html` page for missing routes.
4. Add the production domain later, then update canonical URLs and sitemap configuration when those systems are ready.

## Firebase contact storage

The Contact page uses the Firebase browser SDK to save inquiries to the `contactSubmissions` Firestore collection and sends an optional `contact_form_submit` Analytics event. The Firebase web configuration is public client configuration; never add a Firebase service-account key to the frontend.

The rules in `firestore.rules` allow validated creates only. Public reads, edits, and deletes are denied. Deploy the rules with the Firebase CLI after logging in:

```bash
firebase login
firebase use smarthive-marketing
firebase deploy --only firestore:rules
```

Add the deployed Vercel domain under Firebase Console → Authentication → Settings → Authorized domains. Enable Firebase App Check before treating the public form as production traffic.

## External resources

The pages load Google Fonts and Font Awesome from public CDNs. An internet connection is needed for those fonts and icons to render as intended.

## Development notes

- Keep navigation links consistent across all HTML pages.
- Test changes on desktop and mobile screen sizes.
- Preserve the shared brand colors, typography, and spacing when adding sections.
- Update `SEO-STRATEGY.md`, canonical URLs, and the sitemap when the production domain is confirmed.
- If the audit modal is changed, verify it from every page that uses the shared modal files.

## Repository

[github.com/fahadali-911/Smart-Hive-Marketing-Web](https://github.com/fahadali-911/Smart-Hive-Marketing-Web)

## Case Studies

Case Studies follows the same structure as the Blog: one hub page plus one page
per study, each with its own URL.

| URL | File | Purpose |
| --- | --- | --- |
| `/case-studies` | `case-studies.html` | Discovery: hero and one card per study |
| `/case-studies/afuri` | `case-studies/afuri.html` | The full Afuri case study |

Shared files, used by the hub and every study page:

- `case-studies.css`: page styles (previously an inline `<style>` block on the hub)
- `case-studies-polish.css` and `case-study-afuri.css`: card, section, carousel and animation styles
- `case-study-afuri.js`: hover mode, scroll reveals, statistics count-up and the image carousel. Each block exits quietly when its elements are not on the page.

### Adding a case study

1. Copy `case-studies/afuri.html` to `case-studies/<slug>.html` and replace the article content. Keep the breadcrumb and back link, and keep the title as the page's only `<h1>`.
2. Update the page's `<title>`, description, canonical URL, Open Graph tags and JSON-LD.
3. Add a card for it on `case-studies.html` linking to `/case-studies/<slug>`.
4. Add the clean URL to `vercel.json` (a redirect from `.html` plus a rewrite to the file), `preview-server.js` and `sitemap.xml`.

Links inside study pages are root-absolute (`/contact`, `/assets/...`) so they work from the nested folder and when the page is opened directly.

## Blog

The Blog is **one page that renders two states**, so publishing an article never
creates or edits an HTML file:

| URL | State |
| --- | --- |
| `/blog` | Index: hero, featured article, topic filters, up to six tiles, CTA |
| `/blog?post=article-slug` | Article: breadcrumb, header, image, body, related insights, CTA |

Everything lives in the `blogs/` folder. `blogs/index.html` holds the markup for
both states, `blogs/blog.css` the scoped styles (everything under
`.smart-hive-blog`), `blogs/blog.js` the shared shell behaviour
(drawer, sticky header, reveals, filters) and `blogs/blog-content.js` the content
layer: loading posts, routing on `?post=`, and rendering cards and articles.

### Where posts come from

Published posts are read from the Supabase `blog_posts` table — the same
Supabase project the contact form already uses.

1. Open Supabase Studio → SQL Editor and run `supabase-blog.sql` once. It
   creates the table, the index and a row-level-security policy that lets
   visitors read **published** rows only.
2. To publish: Table Editor → `blog_posts` → **Insert row**. Fill in
   `slug`, `title`, `excerpt`, `category`, `content`, `featured_image`,
   `featured_image_alt`, set `status` to `published` and `published_at` to
   now. Set `featured` on the one post that should lead the index.
3. Reload `/blog`. The tile appears automatically and links to
   `/blog?post=<slug>`. No deploy and no HTML edit is required.

Posts are ordered newest first. The featured post leads; if none is marked,
the newest post is used. Six tiles load at a time behind **Load More Insights**.
Reading time comes from `reading_time`, or is estimated from the body when that
column is empty.

### Article body format

`content` is plain text with light markers, converted into elements by
`blog-content.js`:

```text
## Section heading        ### Sub heading
- bullet item             > pull quote
**bold**  *italic*        [label](https://example.com)
![alt text](https://…)    :::takeaway … :::
```

Pasted markup is never injected as HTML, so post content cannot run scripts.
Featured images accept any HTTPS URL; the Pexels CDN and Supabase Storage are
both allowed by the Content-Security-Policy in `vercel.json`.

### Security

The browser key is the publishable (anon) key and is read-only here: no insert,
update or delete policy exists, so the public site cannot write posts. There is
no admin UI on the website — publishing happens inside Supabase Studio, which
authenticates you. Never place a service-role key in the frontend.

### States

- **No posts yet or the table is missing:** the index shows its prepared empty
  state and links to How We Grow and the case study. Nothing is fabricated.
  A `404` from Supabase in the browser console is expected until the table exists.
- **Unknown slug:** an "Article not found" state with a link back to the index.

### Local design preview

`/blog?preview=editorial` renders seven clearly-marked **draft** topics from
`blog-preview.js` through the real index and article templates. It only runs on
loopback hosts, never on a hosted domain, and sets `noindex, nofollow`. Drafts
carry no publication dates and no `BlogPosting` schema. Exclude
`blog-preview.js` from launch artifacts.

### SEO note

Article detail is rendered in the browser, so titles, descriptions, canonical
links and `BlogPosting` schema are set after load. That is fine for sharing and
indexing by modern crawlers, but server-rendered article routes remain stronger.
If the site later moves behind a CMS or a server runtime, keep this one template
and render the same fields server-side; the data model already matches.

### Photography

Fixed remote Pexels CDN URLs; nothing is downloaded into `assets/`. Preview
photo IDs: 4269274 (hero), 29648640, 4266947, 7446690, 4266930, 6663360,
3764013 — source pages at `https://www.pexels.com/photo/ID/`.

### CTA

The audit CTA routes to `contact.html?source=growth-audit-cta#contact-form`,
matching every other page. No blog-specific form or modal exists.
