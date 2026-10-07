(() => {
  const modal = document.getElementById('audit-modal');
  const form = document.getElementById('site-audit-form');
  if (!modal || !form || modal.dataset.canonicalReady === 'true') return;

  modal.dataset.canonicalReady = 'true';
  const dialog = modal.querySelector('.site-audit-dialog');
  const closeButton = modal.querySelector('.site-audit-close');
  const submitButton = form.querySelector('.site-audit-submit');
  const status = form.querySelector('.site-audit-status');
  const triggers = document.querySelectorAll('.open-audit-modal, .js-open-audit');
  let lastFocused = null;
  let hiddenElements = [];

  const focusable = () => [...modal.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.disabled && element.offsetParent !== null);

  const setBackgroundInert = (inert) => {
    if (inert) {
      hiddenElements = [...document.querySelectorAll('header, main, footer, .mobile-nav-drawer, .mobile-nav-backdrop')]
        .filter(element => !element.contains(modal));
      hiddenElements.forEach(element => element.setAttribute('inert', ''));
    } else {
      hiddenElements.forEach(element => element.removeAttribute('inert'));
      hiddenElements = [];
    }
  };

  const openModal = event => {
    if (event) event.preventDefault();
    if (window.closeSmartHiveMobileMenu) window.closeSmartHiveMobileMenu();
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setBackgroundInert(true);
    requestAnimationFrame(() => closeButton?.focus());
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setBackgroundInert(false);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  triggers.forEach(trigger => trigger.addEventListener('click', openModal));
  closeButton?.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const setFieldError = (control, message = '') => {
    const field = control.closest('.site-audit-field');
    const error = field?.querySelector('.site-field-error');
    field?.classList.toggle('has-error', Boolean(message));
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  form.querySelectorAll('.site-audit-control').forEach(control => {
    control.addEventListener('input', () => setFieldError(control));
    control.addEventListener('change', () => setFieldError(control));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.className = 'site-audit-status';
    let firstInvalid = null;
    form.querySelectorAll('.site-audit-control[required]').forEach(control => {
      let message = '';
      if (!control.value.trim()) message = 'Please complete this field.';
      else if (!control.validity.valid) message = control.type === 'email' ? 'Enter a valid work email.' : 'Enter a valid website URL.';
      setFieldError(control, message);
      if (message && !firstInvalid) firstInvalid = control;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting…';
    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Request My Free Audit <span aria-hidden="true">→</span>';
      status.textContent = 'Thank you. Your request has been received.';
      status.classList.add('visible', 'success');
      form.reset();
    }, 700);
  });
})();
