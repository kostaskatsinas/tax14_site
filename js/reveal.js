/* Calm scroll reveal: section headings, service rows and steps rise 16px and fade in once, when they
   first come into view. Gated by html.rv-on, which this script sets, so without JavaScript, under
   reduced motion, in print or in a headless screenshot everything shows as written. */
const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const headless = /HeadlessChrome/.test(navigator.userAgent) && html.dataset.motion !== 'live';
const targets = document.querySelectorAll('main > .section:not(.hero) :is(.section-head, h2:not(.section-head h2, .mo-wh__text), .steps > li, .service-list > li, .credentials, .faq__item, .statement__detail, .compare, .calc)');

if (!reduced && !headless && html.dataset.motion !== 'off' && 'IntersectionObserver' in window && targets.length) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('rv-in');
    io.unobserve(entry.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  // Anything already above the fold (or above it after a hash jump) shows at once.
  targets.forEach((el, i) => {
    el.classList.add('rv');
    if (el.getBoundingClientRect().top < innerHeight * 0.9) el.classList.add('rv-in');
    else { el.style.setProperty('--rv-delay', `${(i % 4) * 60}ms`); io.observe(el); }
  });
  html.classList.add('rv-on');
  // Safety net: nothing stays hidden if the observer never fires.
  setTimeout(() => targets.forEach(el => el.classList.add('rv-in')), 8000);
}
