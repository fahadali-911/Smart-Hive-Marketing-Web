# SmartHive SEO Strategy and Launch Checklist

This document records the on-page keyword map, technical SEO foundation, and legitimate off-page opportunities for the SmartHive website. It avoids fabricated search volumes, backlinks, results, certifications, locations, and business details.

## Search positioning

SmartHive is positioned around a connected med spa patient-growth system rather than a single marketing channel. Current market language consistently centers on local SEO, Google and Meta advertising, treatment landing pages, reviews, speed-to-lead, booked consultations, retention, and reactivation. The site should retain its stronger patient-journey framing while using those familiar commercial terms naturally.

## Keyword and intent map

| Page | Primary search intent | Primary keyword theme | Supporting themes |
| --- | --- | --- | --- |
| `home.html` | Find a specialized growth partner | med spa marketing agency | medical spa marketing company, med spa patient growth, aesthetics marketing agency |
| `grow.html` | Understand services and approach | med spa patient growth system | med spa patient acquisition, conversion systems, booking automation, retention marketing |
| `growth leak.html` | Diagnose a known growth problem | med spa lead conversion | patient journey bottlenecks, med spa leads not booking, speed-to-lead, patient retention |
| `case-studies.html` | Evaluate experience and proof | med spa marketing case studies | local SEO case study, booking conversion, patient retention systems |
| `contact.html` | Start a commercial conversation | med spa marketing consultation | med spa growth strategy, patient journey audit, contact med spa marketing agency |

The map intentionally gives each page a distinct primary intent so the pages support one another instead of competing for the same query.

## Metadata status

Every current page has a unique title and meta description. Open Graph titles and descriptions, Twitter summary cards, index directives, one H1, and the shared approved PNG favicon are also present.

Canonical tags and absolute social image URLs must be added only after the production domain is confirmed. Using a guessed domain would create incorrect indexing signals.

## Structured data

Use only claims that can be verified. Recommended production schema:

- `Organization` for SmartHive Marketing.
- `WebSite` for the final production domain.
- `ContactPage` for the visible Contact page.
- `Service` only where a page clearly describes that service.
- `BreadcrumbList` when visible breadcrumbs are added.
- `FAQPage` only for questions and answers visibly presented on a page.

Do not add `LocalBusiness` without a genuine public business location. Do not add ratings, reviews, prices, or service areas that have not been confirmed.

## Technical launch checklist

- Confirm the production domain and preferred HTTPS hostname.
- Add a unique absolute canonical URL to every indexable page.
- Generate `sitemap.xml` with absolute production URLs and reference it from `robots.txt` after the production domain is confirmed.
- Configure the production host to serve the included `404.html` page with an HTTP 404 status. The local preview server already uses this behavior.
- Redirect alternate hostnames and legacy URLs in one hop.
- Connect the Contact and audit forms to the approved CRM or email endpoint.
- Add verified business email, phone, location, and official social profiles where applicable.
- Configure Open Graph and Twitter images with absolute URLs.
- Run Rich Results Test and Schema Markup Validator after structured data is finalized.
- Test Core Web Vitals on the deployed host because CDN, caching, compression, and network behavior cannot be measured accurately from the local preview.
- Self-host or privacy-review third-party fonts and icon resources if policy or performance requirements call for it.
- Convert remote editorial imagery to optimized local WebP or AVIF files only when usage rights and final image choices are confirmed.

## Internal linking rules

- Main navigation connects Home, How We Grow, Growth Leaks, Case Studies, and Contact.
- Diagnostic content should link to the relevant growth-system stage rather than using generic anchor text.
- Case studies should link to the specific method or service demonstrated by the case.
- Commercial sections should use Contact as the primary next step, with the growth diagnostic available as a contextual alternative.
- Avoid placeholder links, `javascript:void(0)`, and links to nonexistent anchors.

## Legitimate off-page foundation

Pursue only profiles and placements that match the real business:

- Complete and maintain LinkedIn company and founder profiles with consistent name, description, and website URL.
- Create Google Business Profile, Bing Places, and Apple Business Connect listings only if SmartHive meets their location and customer-contact eligibility rules.
- Join relevant professional associations, including aesthetics or agency organizations, only when membership is genuine and can be verified.
- Build partner listings with CRM, booking, advertising, analytics, and web-platform partners only when there is an active relationship or certification.
- Use verified client reviews on reputable agency platforms such as Clutch only when real clients provide them directly.
- Develop guest education with reputable medical-aesthetics publications around patient journey measurement, lead response, rebooking, and retention.
- Publish original benchmarks or anonymized research only when the underlying data can be substantiated.
- Use digital PR for real research, partnerships, events, or expert commentary rather than manufactured announcements.
- Keep brand name, description, website URL, logo, and contact details consistent across every approved profile.

Avoid bulk directory submissions, paid link packages, fabricated guest posts, private blog networks, and unverified performance claims.

## Content standards

- Write for med spa owners and operators, not search engines.
- Prefer concrete patient-journey language over generic growth claims.
- Use treatment, booking, local-search, retention, and reactivation terminology where the section genuinely supports it.
- Keep case studies explicit about whether examples are anonymized, representative, or supported by verified results.
- Never invent percentages, revenue, ranking gains, patient counts, return on ad spend, or client identities.
