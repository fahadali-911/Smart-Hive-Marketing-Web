(() => {
  const body = document.body;
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const close = document.getElementById('drawer-close');
  const header = document.getElementById('siteHeader');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    drawer?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    toggle?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
  };

  const openMenu = () => {
    body.classList.add('menu-open');
    drawer?.classList.add('is-open');
    backdrop?.classList.add('is-open');
    toggle?.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    close?.focus();
  };

  toggle?.addEventListener('click', () => drawer?.classList.contains('is-open') ? closeMenu() : openMenu());
  close?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

})();
