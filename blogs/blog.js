/* Enhancement only: server/CMS-rendered articles and links work without JS. */
(() => {
  'use strict';
  const root = document.querySelector('.smart-hive-blog');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const close = document.getElementById('drawer-close');
  let lastFocus;

  // Canonical drawer markup, breakpoints, classes and visual treatment.
  function closeMenu(restore = true) {
    document.body.classList.remove('menu-open');
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    if (restore) lastFocus?.focus();
  }
  function openMenu() {
    lastFocus = document.activeElement;
    drawer.inert = false;
    document.body.classList.add('menu-open');
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    drawer.setAttribute('aria-hidden', 'false');
    // Let the shared drawer's visibility transition begin before moving focus.
    setTimeout(() => { if (drawer.classList.contains('is-open')) close.focus(); }, 100);
  }
  if (toggle && drawer && backdrop && close) {
    toggle.addEventListener('click', () => drawer.classList.contains('is-open') ? closeMenu() : openMenu());
    close.addEventListener('click', () => closeMenu());
    backdrop.addEventListener('click', () => closeMenu());
    drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', event => {
      if (!drawer.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeMenu();
      if (event.key === 'Tab') {
        const items = [...drawer.querySelectorAll('a[href],button')];
        const first = items[0], last = items[items.length - 1];
        if (!drawer.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 992 && drawer.classList.contains('is-open')) closeMenu(); }, { passive: true });
  }
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  let observer;
  if ('IntersectionObserver' in window && !reduced.matches) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    root.classList.add('blog-motion');
  }
  function reveal(scope = root) {
    scope.querySelectorAll('[data-reveal]').forEach(element => {
      if (observer) observer.observe(element);
      else element.classList.add('visible');
    });
  }
  reveal();
  reduced.addEventListener('change', event => {
    if (event.matches) { root.classList.remove('blog-motion'); observer?.disconnect(); }
  });

  function initArticles() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    const articles = [...grid.querySelectorAll('article[data-category]')];
    if (!articles.length) return;
    grid.hidden = false;
    document.getElementById('blog-empty').hidden = true;
    const filters = document.getElementById('blog-filters');
    if (filters) filters.hidden = false;
    const count = document.getElementById('blog-result-count');
    count.hidden = false;
    const isPreview = root.dataset.preview === 'true';
    const setCount = amount => { count.textContent = `${String(amount).padStart(2, '0')} ${isPreview ? 'draft previews' : amount === 1 ? 'insight' : 'insights'}`; };
    setCount(articles.length);
    let timer;
    if (filters) filters.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      clearTimeout(timer);
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      grid.classList.add('is-filtering');
      timer = setTimeout(() => {
        let visible = 0;
        articles.forEach(article => {
          const show = button.dataset.filter === 'all' || article.dataset.category.split(' ').includes(button.dataset.filter);
          article.hidden = !show;
          if (show) { visible++; article.classList.add('visible'); }
        });
        document.getElementById('blog-filter-empty').hidden = visible > 0;
        setCount(visible);
        grid.classList.remove('is-filtering');
      }, reduced.matches ? 0 : 180);
    }));
    reveal();
  }
  initArticles();
  root.addEventListener('blog:preview-ready', initArticles);
  root.addEventListener('blog:reveal', () => reveal());
  // blog-content.js loads posts (and loopback-only drafts) and signals when cards exist.
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === 'editorial') {
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.content = 'noindex, nofollow';
  }
})();
