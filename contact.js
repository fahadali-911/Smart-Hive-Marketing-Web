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

  const form = document.getElementById('contact-form');
  const submit = form?.querySelector('.contact-submit');
  const status = form?.querySelector('.contact-status');

  const setError = (control, message = '') => {
    const field = control.closest('.contact-field');
    const error = field?.querySelector('.contact-error');
    field?.classList.toggle('has-error', Boolean(message));
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  form?.querySelectorAll('.contact-control').forEach(control => {
    control.addEventListener('input', () => setError(control));
    control.addEventListener('change', () => setError(control));
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    let firstInvalid = null;

    form.querySelectorAll('.contact-control[required]').forEach(control => {
      let message = '';
      if (!control.value.trim()) message = 'Please complete this field.';
      else if (!control.validity.valid) message = 'Please enter a valid value.';
      setError(control, message);
      if (message && !firstInvalid) firstInvalid = control;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      if (status) status.textContent = 'Please review the highlighted fields.';
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending...';
    }

    window.setTimeout(() => {
      form.reset();
      if (submit) {
        submit.disabled = false;
        submit.innerHTML = 'Send Inquiry <span aria-hidden="true">→</span>';
      }
      if (status) status.textContent = 'Thank you. Your inquiry has been received.';
    }, 650);
  });
})();
