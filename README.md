# SmartHive Marketing Website

A responsive marketing website for **SmartHive Marketing**, focused on helping med spas improve patient acquisition, conversion, booking, retention, and reactivation.

## Pages

| File | Purpose |
| --- | --- |
| `home.html` | Main landing page and overview of SmartHive's services |
| `grow.html` | Explains the patient growth system and process |
| `growth leak.html` | Growth-leak diagnostic and patient-journey content |
| `case-studies.html` | Case studies and growth results |

## Project structure

```text
.
|-- home.html
|-- grow.html
|-- growth leak.html
|-- case-studies.html
|-- audit-modal.css
|-- audit-modal.js
|-- preview-server.js
`-- README.md
```

The website is built with plain HTML, CSS, and JavaScript. Most page-specific styles and scripts are embedded in their HTML files, while the audit modal uses the shared `audit-modal.css` and `audit-modal.js` files. There is no build step or package installation required.

## Run locally

Node.js is required for the included preview server.

1. Open a terminal in the project folder.
2. Start the server:

   ```bash
   node preview-server.js
   ```

3. Visit [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser.

The server opens `home.html` at the root URL and disables browser caching to make local development easier.

## External resources

The pages load Google Fonts and Font Awesome from public CDNs. An internet connection is needed for those fonts and icons to render as intended.

## Development notes

- Keep navigation links consistent across all HTML pages.
- Test changes on desktop and mobile screen sizes.
- Preserve the shared brand colors, typography, and spacing when adding sections.
- If the audit modal is changed, verify it from every page that uses the shared modal files.

## Repository

[github.com/fahadali-911/Smart-Hive-Marketing-Web](https://github.com/fahadali-911/Smart-Hive-Marketing-Web)
