/* Home hero carousel: a slow cross-fade between the hero photographs.
   Advances every DELAY ms once the hero has revealed. Pauses on hover, on
   keyboard focus, when the hero is off-screen and when the tab is hidden.
   No autoplay under reduced motion. */
(() => {
  const root = document.querySelector('[data-home-carousel]');
  if (!root) return;

  const slides = [...root.querySelectorAll('.home-hero-carousel__slide')];
  const indicators = [...root.querySelectorAll('.home-hero-carousel__indicator')];
  if (slides.length < 2) return;

  const DELAY = 3500;
  const START_AFTER_REVEAL = 1400;
  const RESUME_AFTER_HOVER = 600;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentIndex = 0;
  let timer = null;
  let resumeTimer = null;
  let started = false;
  const state = { hovering: false, focused: false, visible: true, hidden: document.hidden };

  root.style.setProperty('--home-hero-delay', DELAY + 'ms');

  const canPlay = () => started && !reduced.matches && !state.hovering && !state.focused && state.visible && !state.hidden;

  function restartProgress() {
    indicators.forEach((indicator) => indicator.classList.remove('is-active'));
    const active = indicators[currentIndex];
    if (!active) return;
    void active.offsetWidth; // restart the fill animation
    active.classList.add('is-active');
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const isActive = n === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    restartProgress();
  }

  const nextSlide = () => showSlide(currentIndex + 1);

  function stopAutoplay() {
    clearInterval(timer);
    timer = null;
    root.classList.add('is-paused');
  }

  function startAutoplay() {
    if (timer || !canPlay()) return;
    root.classList.remove('is-paused');
    timer = setInterval(nextSlide, DELAY);
  }


  root.addEventListener('mouseenter', () => { state.hovering = true; clearTimeout(resumeTimer); stopAutoplay(); });
  root.addEventListener('mouseleave', () => {
    state.hovering = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { restartProgress(); startAutoplay(); }, RESUME_AFTER_HOVER);
  });
  // Only keyboard focus pauses autoplay; a mouse click on an arrow should not hold it.
  root.addEventListener('focusin', (event) => {
    if (!event.target.matches(':focus-visible')) return;
    state.focused = true;
    stopAutoplay();
  });
  root.addEventListener('focusout', (event) => {
    if (root.contains(event.relatedTarget)) return;
    state.focused = false;
    restartProgress();
    startAutoplay();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      state.visible = entries[0].isIntersecting;
      if (state.visible) { restartProgress(); startAutoplay(); } else { stopAutoplay(); }
    }, { threshold: 0.35 }).observe(root);
  }

  document.addEventListener('visibilitychange', () => {
    state.hidden = document.hidden;
    if (state.hidden) { stopAutoplay(); } else { restartProgress(); startAutoplay(); }
  });

  reduced.addEventListener('change', () => { if (reduced.matches) stopAutoplay(); else startAutoplay(); });

  // Load the later slides once the page has settled so the first image stays the priority.
  window.addEventListener('load', () => {
    root.querySelectorAll('img[loading="lazy"]').forEach((img, n) => {
      setTimeout(() => { img.loading = 'eager'; }, 300 * (n + 1));
    });
  });

  // Start only after the hero's own entrance animation has had time to play.
  showSlide(0);
  root.classList.add('is-paused');
  setTimeout(() => { started = true; restartProgress(); startAutoplay(); }, START_AFTER_REVEAL);
})();
