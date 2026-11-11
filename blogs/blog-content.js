/* SmartHive Insights content layer.
   One page renders both states: the index and every article (/blog?post=slug).
   Published posts come from the Supabase `blog_posts` table, so publishing a new
   article never requires creating or editing an HTML file. See README.md and
   supabase-blog.sql. Article bodies are parsed into DOM nodes, never injected as
   raw HTML. */
(() => {
  'use strict';
  const root = document.querySelector('.smart-hive-blog');
  if (!root) return;

  const SUPABASE_URL = 'https://dldfakymxbrtzbdwcbli.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nd31hs9c3Hl6D9Wh-Zn2uQ_IYqTLwbL';
  const TABLE = 'blog_posts';
  const COLUMNS = 'slug,title,excerpt,content,category,featured_image,featured_image_alt,published_at,updated_at,author,reading_time,featured';
  const PAGE_SIZE = 6;
  const RELATED_COUNT = 3;
  const WORDS_PER_MINUTE = 200;
  const LOOPBACK = ['localhost', '127.0.0.1', '[::1]'];

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const isPreview = LOOPBACK.includes(location.hostname) && params.get('preview') === 'editorial';

  /* Category labels map onto the existing filter buttons. */
  const FILTER_KEYS = {
    'growth strategy': 'strategy', strategy: 'strategy',
    'acquisition & seo': 'acquisition', acquisition: 'acquisition', 'local search': 'acquisition', seo: 'acquisition',
    conversion: 'conversion',
    booking: 'booking',
    retention: 'retention', reactivation: 'retention',
    'crm & automation': 'automation', automation: 'automation', crm: 'automation'
  };
  const filterKey = (category) => FILTER_KEYS[String(category || '').trim().toLowerCase()] || '';

  /* ---------- data ---------- */

  function estimateReadingTime(content) {
    const words = String(content).trim().split(/\s+/).filter(Boolean).length;
    return words ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : 0;
  }

  function normalize(row) {
    const content = typeof row.content === 'string' ? row.content : '';
    return {
      slug: String(row.slug || '').trim(),
      title: String(row.title || '').trim(),
      excerpt: String(row.excerpt || '').trim(),
      content,
      category: String(row.category || '').trim(),
      image: String(row.featured_image || '').trim(),
      imageAlt: String(row.featured_image_alt || '').trim(),
      published: row.published_at || '',
      updated: row.updated_at || '',
      author: String(row.author || '').trim(),
      readingTime: Number(row.reading_time) > 0 ? Math.round(Number(row.reading_time)) : estimateReadingTime(content),
      featured: row.featured === true,
      draft: row.draft === true
    };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Could not load ' + src));
      document.head.append(script);
    });
  }

  async function loadPosts() {
    if (isPreview) {
      await loadScript('/blogs/blog-preview.js');
      return (window.SMART_HIVE_PREVIEW_POSTS || []).map(normalize);
    }
    const url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=' + COLUMNS + '&status=eq.published&order=published_at.desc.nullslast';
    const response = await fetch(url, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + SUPABASE_PUBLISHABLE_KEY }
    });
    if (!response.ok) throw new Error('Supabase responded ' + response.status);
    const rows = await response.json();
    return (Array.isArray(rows) ? rows : []).map(normalize).filter((post) => post.slug && post.title);
  }

  /* ---------- article body ---------- */

  const SAFE_HREF = /^(https?:\/\/|\/|#|[\w.-]+\.html)/i;

  function inline(text, parent) {
    const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
    let last = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (match.index > last) parent.append(text.slice(last, match.index));
      if (match[1] && SAFE_HREF.test(match[2])) {
        const link = document.createElement('a');
        link.href = match[2];
        link.textContent = match[1];
        if (/^https?:/i.test(match[2])) { link.rel = 'noopener'; link.target = '_blank'; }
        parent.append(link);
      } else if (match[1]) {
        parent.append(match[1]);
      } else if (match[3]) {
        const strong = document.createElement('strong');
        strong.textContent = match[3];
        parent.append(strong);
      } else if (match[4]) {
        const em = document.createElement('em');
        em.textContent = match[4];
        parent.append(em);
      }
      last = pattern.lastIndex;
    }
    if (last < text.length) parent.append(text.slice(last));
    return parent;
  }

  /* Markdown-lite: headings, lists, quotes, images, links, emphasis and
     :::takeaway blocks. Everything becomes DOM nodes, so post content cannot
     introduce markup or scripts. */
  function renderContent(markdown) {
    const fragment = document.createDocumentFragment();
    const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
    let index = 0;

    const takeBlock = (test) => {
      const block = [];
      while (index < lines.length && lines[index].trim() && test(lines[index])) block.push(lines[index++]);
      return block;
    };

    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) { index++; continue; }

      if (/^:::\s*takeaway/i.test(line)) {
        index++;
        const body = [];
        while (index < lines.length && !/^:::/.test(lines[index])) body.push(lines[index++]);
        if (index < lines.length) index++;
        const box = document.createElement('aside');
        box.className = 'blog-takeaway';
        const label = document.createElement('p');
        label.className = 'eyebrow';
        label.textContent = 'Key takeaway';
        box.append(label, inline(body.join(' ').trim(), document.createElement('p')));
        fragment.append(box);
        continue;
      }

      const image = line.match(/^!\[([^\]]*)\]\(([^\s)]+)\)\s*$/);
      if (image && SAFE_HREF.test(image[2])) {
        const figure = document.createElement('figure');
        figure.className = 'blog-prose-figure';
        const img = document.createElement('img');
        img.src = image[2];
        img.alt = image[1];
        img.loading = 'lazy';
        img.decoding = 'async';
        figure.append(img);
        fragment.append(figure);
        index++;
        continue;
      }

      const heading = line.match(/^(#{2,3})\s+(.*)$/);
      if (heading) {
        fragment.append(inline(heading[2].trim(), document.createElement(heading[1].length === 2 ? 'h2' : 'h3')));
        index++;
        continue;
      }

      if (/^>\s?/.test(line)) {
        const quote = takeBlock((item) => /^>\s?/.test(item)).map((item) => item.replace(/^>\s?/, '')).join(' ');
        fragment.append(inline(quote, document.createElement('blockquote')));
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        const list = document.createElement('ul');
        takeBlock((item) => /^[-*]\s+/.test(item)).forEach((item) => {
          list.append(inline(item.replace(/^[-*]\s+/, ''), document.createElement('li')));
        });
        fragment.append(list);
        continue;
      }

      const paragraph = takeBlock((item) => !/^(#{2,3}\s|>|[-*]\s|:::|!\[)/.test(item)).join(' ');
      if (paragraph.trim()) fragment.append(inline(paragraph.trim(), document.createElement('p')));
      else index++;
    }
    return fragment;
  }

  /* ---------- shared rendering ---------- */

  /* Local draft previews keep the preview flag so links stay inside the preview. */
  const indexUrl = isPreview ? '/blog?preview=editorial' : '/blog';
  const permalink = (post) => '/blog?post=' + encodeURIComponent(post.slug) + (isPreview ? '&preview=editorial' : '');
  const keepPreview = (scope) => {
    if (!isPreview) return;
    scope.querySelectorAll('a[href="/blog"]').forEach((link) => { link.href = indexUrl; });
  };

  function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return {
      iso: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  const TILE_SIZES = '(max-width:680px) calc(100vw - 30px), (max-width:992px) calc(50vw - 32px), 400px';
  const FEATURE_SIZES = '(max-width:680px) calc(100vw - 30px), 600px';

  function fillCard(templateId, post, sizes) {
    const fragment = document.getElementById(templateId).content.cloneNode(true);
    fragment.querySelector('article').dataset.category = filterKey(post.category);
    fragment.querySelector('[data-post-title]').textContent = post.title;
    fragment.querySelector('[data-post-excerpt]').textContent = post.excerpt;

    const category = fragment.querySelector('[data-post-category]');
    if (post.category) category.textContent = post.category; else category.remove();

    const date = formatDate(post.published);
    const time = fragment.querySelector('[data-post-date]');
    if (date) { time.dateTime = date.iso; time.textContent = date.label; } else { time.remove(); }

    const read = fragment.querySelector('[data-post-read-time]');
    if (post.draft) read.textContent = 'Draft preview';
    else if (post.readingTime) read.textContent = post.readingTime + ' min read';
    else read.remove();

    fragment.querySelectorAll('[data-post-link]').forEach((link) => { link.href = permalink(post); });

    const img = fragment.querySelector('[data-post-image]');
    if (post.image) {
      img.src = post.image;
      img.alt = post.imageAlt || '';
      img.sizes = sizes;
    } else {
      img.closest('a').remove();
    }
    return fragment;
  }

  /* ---------- index state ---------- */

  function renderIndex(posts) {
    if (!posts.length) return;
    $('blog-empty').hidden = true;

    const feature = posts.find((post) => post.featured) || posts[0];
    const rest = posts.filter((post) => post !== feature);

    $('blog-feature-slot').append(fillCard('blog-feature-template', feature, FEATURE_SIZES));
    $('blog-feature').hidden = false;

    const grid = $('blog-grid');
    const loadMore = $('blog-load-more');
    let shown = 0;

    const appendPage = () => {
      rest.slice(shown, shown + PAGE_SIZE).forEach((post, position) => {
        const fragment = fillCard('blog-tile-template', post, TILE_SIZES);
        fragment.querySelector('article').style.setProperty('--reveal-delay', (position % 3) * 70 + 'ms');
        grid.append(fragment);
      });
      shown = Math.min(shown + PAGE_SIZE, rest.length);
      loadMore.hidden = shown >= rest.length;
      root.dispatchEvent(new Event('blog:preview-ready'));
      root.dispatchEvent(new Event('blog:reveal'));
    };

    if (rest.length) appendPage();
    loadMore.addEventListener('click', appendPage);
  }

  /* ---------- article state ---------- */

  function setMeta(selector, value) {
    const tag = document.head.querySelector(selector);
    if (tag) tag.setAttribute('content', value);
  }

  function hideIndex() {
    document.querySelectorAll('[data-blog-view="index"]').forEach((section) => { section.hidden = true; });
  }

  function renderArticle(post, posts) {
    hideIndex();

    $('blog-article-crumb').textContent = post.category || 'Article';
    const category = $('blog-article-category');
    if (post.category) category.textContent = post.category; else category.hidden = true;

    $('blog-article-title').textContent = post.title;

    const excerpt = $('blog-article-excerpt');
    if (post.excerpt) excerpt.textContent = post.excerpt; else excerpt.hidden = true;

    const date = formatDate(post.published);
    const time = $('blog-article-date');
    if (date) { time.dateTime = date.iso; time.textContent = date.label; } else { time.hidden = true; }

    const read = $('blog-article-read');
    if (post.draft) read.textContent = 'Draft preview';
    else if (post.readingTime) read.textContent = post.readingTime + ' min read';
    else read.hidden = true;

    const author = $('blog-article-author');
    if (post.author) author.textContent = post.author; else author.hidden = true;

    if (post.image) {
      const img = $('blog-article-image');
      img.src = post.image;
      img.alt = post.imageAlt || '';
      $('blog-article-figure').hidden = false;
    }

    $('blog-article-body').append(renderContent(post.content));
    keepPreview($('blog-article'));
    $('blog-article').hidden = false;
    renderRelated(post, posts);

    document.title = post.title + ' | SmartHive Marketing';
    setMeta('meta[name="description"]', post.excerpt || post.title);
    setMeta('meta[property="og:title"]', post.title);
    setMeta('meta[property="og:description"]', post.excerpt || post.title);
    if (post.image) setMeta('meta[property="og:image"]', post.image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = new URL(permalink(post), location.href).href;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = canonical.href;

    if (post.draft) {
      setMeta('meta[name="robots"]', 'noindex, nofollow');
      return;
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || undefined,
      image: post.image || undefined,
      datePublished: post.published || undefined,
      dateModified: post.updated || post.published || undefined,
      author: post.author
        ? { '@type': 'Person', name: post.author }
        : { '@type': 'Organization', name: 'SmartHive Marketing' },
      publisher: { '@type': 'Organization', name: 'SmartHive Marketing' },
      mainEntityOfPage: canonical.href
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.append(script);
  }

  function renderRelated(post, posts) {
    const others = posts.filter((item) => item.slug !== post.slug);
    if (!others.length) return;
    const sameTopic = others.filter((item) => item.category && item.category === post.category);
    const related = sameTopic.concat(others.filter((item) => !sameTopic.includes(item))).slice(0, RELATED_COUNT);
    const grid = $('blog-related-grid');
    related.forEach((item, position) => {
      const fragment = fillCard('blog-tile-template', item, TILE_SIZES);
      fragment.querySelector('article').style.setProperty('--reveal-delay', position * 70 + 'ms');
      grid.append(fragment);
    });
    $('blog-related').hidden = false;
    root.dispatchEvent(new Event('blog:reveal'));
  }

  function renderNotFound() {
    hideIndex();
    keepPreview($('blog-notfound'));
    $('blog-notfound').hidden = false;
    setMeta('meta[name="robots"]', 'noindex, nofollow');
    document.title = 'Article not found | SmartHive Marketing';
  }

  /* ---------- routing ---------- */

  async function start() {
    const slug = (params.get('post') || '').trim();
    const loading = $('blog-loading');
    const spinner = setTimeout(() => { loading.hidden = false; }, 250);
    if (isPreview) { $('blog-preview-note').hidden = false; root.dataset.preview = 'true'; }
    if (slug) hideIndex();

    let posts = [];
    let failed = false;
    try {
      posts = await loadPosts();
    } catch (error) {
      failed = true;
      console.warn('SmartHive Insights: published posts could not be loaded.', error);
    }

    clearTimeout(spinner);
    loading.hidden = true;

    if (slug) {
      const post = posts.find((item) => item.slug === slug);
      if (post) renderArticle(post, posts);
      else renderNotFound();
    } else if (!failed) {
      renderIndex(posts);
    }

    root.dispatchEvent(new Event('blog:content-ready'));
  }

  start();
})();
