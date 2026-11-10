/* Shared navigation polish. The kit owns opening/closing; this adds focus
   containment, background isolation and the site's 1200px menu breakpoint. */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('header.nav');
  const toggle = nav?.querySelector('.nav__toggle');
  const links = nav?.querySelector('.nav__links');
  if (!nav || !toggle || !links) return;

  links.id ||= 'site-navigation';
  toggle.setAttribute('aria-controls', links.id);
  let wasOpen = false;
  const background = new Map();

  const syncMenu = () => {
    const open = nav.classList.contains('is-open');
    if (open === wasOpen) return;
    wasOpen = open;
    toggle.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Μενού');
    if (open) {
      document.querySelectorAll('main, footer, .actionbar').forEach((element) => {
        background.set(element, element.inert);
        element.inert = true;
      });
      links.querySelector('a[href]')?.focus({ preventScroll: true });
    } else {
      background.forEach((inert, element) => { element.inert = inert; });
      background.clear();
      if (links.contains(document.activeElement) || nav.querySelector('.nav__actions')?.contains(document.activeElement)) {
        toggle.focus({ preventScroll: true });
      }
    }
  };
  new MutationObserver(syncMenu).observe(nav, { attributes: true, attributeFilter: ['class'] });

  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !wasOpen) return;
    const focusable = [...nav.querySelectorAll('a[href], button:not([disabled])')]
      .filter((element) => !element.classList.contains('skip-link') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });

  matchMedia('(min-width: 1200px)').addEventListener('change', (event) => {
    if (event.matches && nav.classList.contains('is-open')) toggle.click();
  });

  const sectionLinks = [...links.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);
  if (!sectionLinks.length) return;
  let scheduled = false;
  const updateCurrentSection = () => {
    scheduled = false;
    const top = nav.getBoundingClientRect().bottom + 100;
    let current = null;
    sectionLinks.forEach(({ link, section }) => {
      if (section.getBoundingClientRect().top <= top) current = link;
    });
    const contact = document.getElementById('contact');
    if (contact && contact.getBoundingClientRect().top <= top) current = null;
    sectionLinks.forEach(({ link }) => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  };
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  updateCurrentSection();
});
