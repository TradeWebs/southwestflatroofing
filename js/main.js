/* ── Scroll reveal ─────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('reveal--visible'));
}

/* ── Footer year ───────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Quote form: submit to the shared TradeWebs forms Worker ───── */
const FORMS_ENDPOINT = 'https://tradewebs-forms.tradewebs.workers.dev/';
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit');
const statusEl = document.getElementById('contact-form-status');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.classList.remove('quote-form__status--ok', 'quote-form__status--error');

    try {
      const res = await fetch(FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error('Request failed');

      form.reset();
      submitBtn.textContent = 'Sent - thank you!';
      statusEl.textContent = "Thanks - we'll be in touch shortly to arrange your free survey.";
      statusEl.classList.add('quote-form__status--ok');
    } catch (err) {
      submitBtn.textContent = 'Request my free quote';
      submitBtn.disabled = false;
      statusEl.textContent = 'Something went wrong - please call or WhatsApp us using the links below.';
      statusEl.classList.add('quote-form__status--error');
    }
  });
}
