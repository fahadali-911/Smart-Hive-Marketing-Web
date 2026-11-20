#!/usr/bin/env node
/*
  Shared page pieces for the static SmartHive site.

  The header (with mobile menu), the closing CTA band and the footer each live
  once in /partials. This script stamps them into every page between marker
  comments, sets the active menu item per page and fills in the one audit link.

  Edit a partial, then run:  npm run build:shared
  Check without writing:     npm run build:shared -- --check
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_URL = '/contact?source=growth-audit-cta#contact-form';

// Every page, the menu item it highlights, and whether it gets the closing band.
const PAGES = [
  { file: 'home.html', nav: 'home', header: true, cta: true },
  { file: 'grow.html', nav: 'grow', header: true, cta: true },
  { file: 'growth leak.html', nav: 'leaks', header: true, cta: true },
  { file: 'case-studies.html', nav: 'cases', header: true, cta: true },
  { file: 'case-studies/afuri.html', nav: 'cases', header: true, cta: true },
  { file: 'contact.html', nav: 'contact', header: true, cta: false }, // the form is the call to action
  { file: 'blogs/index.html', nav: 'blog', header: true, cta: true },
  { file: 'blogs/find-the-constraint-medspa-growth.html', nav: 'blog', header: true, cta: true },
  { file: 'blogs/best-crm-for-medspas.html', nav: 'blog', header: true, cta: true },
  { file: 'blogs/med-spa-lead-generation-system.html', nav: 'blog', header: true, cta: true },
  { file: '404.html', nav: null, header: false, cta: false } // standalone error layout without the menu script
];

const partial = (name) => fs.readFileSync(path.join(ROOT, 'partials', name + '.html'), 'utf8')
  .replace(/\{\{AUDIT_URL\}\}/g, AUDIT_URL)
  .replace(/\s+$/, '');

function setActive(html, nav) {
  if (!nav) return html;
  return html.replace(/<a ([^>]*?)class="(nav-link|drawer-link)" data-nav="([a-z]+)"/g, (m, before, cls, key) =>
    key === nav ? `<a ${before}class="${cls} active" aria-current="page" data-nav="${key}"` : m);
}

const block = (name, body) => `<!-- shared:${name} (edit partials/${name}.html, then run npm run build:shared) -->\n${body}\n  <!-- /shared:${name} -->`;
const MARKED = (name) => new RegExp(`<!-- shared:${name} [^>]*-->[\\s\\S]*?<!-- \\/shared:${name} -->`);

function cutElement(html, openRe, closeTag) {
  const m = openRe.exec(html);
  if (!m) return null;
  const end = html.indexOf(closeTag, m.index);
  if (end < 0) throw new Error('unclosed ' + closeTag);
  return { start: m.index, end: end + closeTag.length };
}

function apply(html, name, body, openRe, closeTag, extraRemovals = []) {
  if (MARKED(name).test(html)) return html.replace(MARKED(name), () => block(name, body));
  const found = cutElement(html, openRe, closeTag);
  if (!found) return null;
  html = html.slice(0, found.start) + block(name, body) + html.slice(found.end);
  // First run only: drop the page's old copies of pieces now inside the block.
  for (const [re, close] of extraRemovals) {
    const blockEnd = html.indexOf(`<!-- /shared:${name} -->`);
    const rest = html.slice(blockEnd);
    const hit = cutElement(rest, re, close);
    if (hit) html = html.slice(0, blockEnd) + rest.slice(0, hit.start).replace(/\s*$/, '\n  ') + rest.slice(hit.end).replace(/^\s*\n/, '\n');
  }
  return html;
}

const check = process.argv.includes('--check');
const header = partial('header'), cta = partial('cta'), footer = partial('footer');
let changed = 0, problems = [];

for (const page of PAGES) {
  const file = path.join(ROOT, page.file);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  if (page.header) {
    const out = apply(html, 'header', setActive(header, page.nav), /<header class="site-header"[^>]*>/, '</header>', [
      [/<div class="mobile-nav-backdrop"[^>]*>/, '</div>'],
      [/<aside class="mobile-nav-drawer"[^>]*>/, '</aside>']
    ]);
    if (out == null) problems.push(page.file + ': no header found'); else html = out;
  }
  if (page.cta) {
    const out = apply(html, 'cta', cta, /<section class="final-cta"[^>]*>/, '</section>');
    if (out == null) problems.push(page.file + ': no closing band found'); else html = out;
  }
  const out = apply(html, 'footer', footer, /<footer class="site-footer"[^>]*>/, '</footer>');
  if (out == null) problems.push(page.file + ': no footer found'); else html = out;

  if (html !== before) {
    changed++;
    if (!check) fs.writeFileSync(file, html);
    console.log((check ? 'out of date: ' : 'updated: ') + page.file);
  }
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(changed ? `${changed} page(s) ${check ? 'need a rebuild' : 'updated'}` : 'all pages up to date');
if (check && changed) process.exit(1);
