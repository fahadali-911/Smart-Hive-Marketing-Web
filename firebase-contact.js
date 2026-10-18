// Supabase's publishable key is safe for browser use when table access is protected by RLS.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://dldfakymxbrtzbdwcbli.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nd31hs9c3Hl6D9Wh-Zn2uQ_IYqTLwbL';

const form = document.getElementById('contact-form');
const submit = form?.querySelector('.contact-submit');
const status = form?.querySelector('.contact-status');

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

form?.addEventListener('submit', async event => {
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
  if (status) status.textContent = '';

  try {
    const values = Object.fromEntries(new FormData(form).entries());
    const { error } = await supabase.from('contact_submissions').insert({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      business: values.business.trim(),
      service: values.service,
      message: values.message.trim()
    });
    if (error) throw error;

    form.reset();
    if (status) status.textContent = 'Thank you. Your inquiry has been received.';
  } catch (error) {
    console.error('Contact submission failed:', error);
    if (status) status.textContent = 'We could not send your inquiry right now. Please try again shortly.';
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.innerHTML = 'Send Inquiry <span aria-hidden="true">→</span>';
    }
  }
});
