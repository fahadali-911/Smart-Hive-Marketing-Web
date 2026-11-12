/* Hover effects follow the input actually being used: on for mouse or pen, off for
   touch, so a tap never leaves an item stuck in its hover state. */
(() => {
  const update = (event) => {
    document.documentElement.classList.toggle('sh-afuri-hover-on', event.pointerType === 'mouse' || event.pointerType === 'pen');
  };
  window.addEventListener('pointermove', update, { passive: true });
  window.addEventListener('pointerdown', update, { passive: true });
})();

/* Viewport reveals for the Afuri case study. Content is visible by default:
   the hidden starting states only apply once this script adds .sh-afuri-motion. */
(() => {
  const reveals = document.querySelectorAll('[data-sh-reveal], [data-sh-journey]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reveals.length || reducedMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('sh-afuri-motion');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  reveals.forEach((element) => observer.observe(element));
})();

/* Statistics strip: the top rule draws, the four groups rise with a small stagger,
   the separators grow, and each number counts up once to its final value. */
(() => {
  const strip = document.querySelector('[data-sh-stats]');
  if (!strip) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  const numbers = [...strip.querySelectorAll('strong[data-count]')];
  const DURATION = 1200;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  document.documentElement.classList.add('sh-afuri-stats-motion');
  numbers.forEach((el) => { el.textContent = '0' + (el.dataset.suffix || ''); });

  const countUp = (el, index) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.round(target * easeOut(t)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    }, 250 + index * 100);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      strip.classList.add('is-in');
      numbers.forEach(countUp);
      observer.disconnect();
    });
  }, { threshold: 0.3 });

  observer.observe(strip);
})();

/* Featured image carousel: cross-fades, auto-advances every 3.5s, pauses on hover,
   focus and when off-screen, and never autoplays under reduced motion. */
(() => {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('.sh-carousel-slide')];
  const captions = ['Brand experience', 'Treatment experience', 'Patient relationship'];
  const label = root.querySelector('[data-carousel-index]');
  const caption = root.querySelector('[data-carousel-caption]');
  const DELAY = 3500;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, timer = null, hovering = false, focused = false, visible = true;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const on = n === index;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', String(!on));
    });
    label.textContent = String(index + 1).padStart(2, '0');
    caption.textContent = captions[index];
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    if (reduced || timer || hovering || focused || !visible) return;
    timer = setInterval(() => show(index + 1), DELAY);
  };
  const restart = () => { stop(); start(); };

  root.addEventListener('mouseenter', () => { hovering = true; stop(); });
  root.addEventListener('mouseleave', () => { hovering = false; start(); });
  root.addEventListener('focusin', () => { focused = true; stop(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { focused = false; start(); } });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.35 }).observe(root);
  }
  show(0);
  start();
})();
