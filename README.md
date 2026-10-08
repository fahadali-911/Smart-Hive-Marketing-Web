# SmartHive Marketing Website

A responsive marketing website for **SmartHive Marketing**, focused on helping med spas improve patient acquisition, conversion, booking, retention, and reactivation.

## Pages

| File | Purpose |
| --- | --- |
| `home.html` | Main landing page and overview of SmartHive's services |
| `grow.html` | Explains the patient growth system and process |
| `growth leak.html` | Growth-leak diagnostic and patient-journey content |
| `case-studies.html` | Case studies and growth results |
| `contact.html` | Contact and practice inquiry page |
| `404.html` | Branded not-found page with recovery links |

## Project structure

```text
.
|-- home.html
|-- grow.html
|-- growth leak.html
|-- case-studies.html
|-- contact.html
|-- 404.html
|-- typography.css
|-- site-shell.css
|-- case-studies-polish.css
|-- contact.css
|-- contact.js
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
|-- .env.example
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
4. Add the production domain later, then update canonical URLs, sitemap configuration, and form/database integrations when those systems are ready.

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
