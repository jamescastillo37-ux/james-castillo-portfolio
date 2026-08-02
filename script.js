document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Nav shadow on scroll
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Stat values remain correct in HTML; animation is optional enhancement.
  const stats = document.querySelectorAll('[data-count]');
  const setFinalValue = (el) => {
    const target = Number.parseInt(el.dataset.count, 10);
    if (!Number.isFinite(target)) return;
    el.textContent = target + (el.dataset.suffix || '');
  };

  if (!stats.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    stats.forEach(setFinalValue);
    return;
  }

  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statIo.unobserve(entry.target);

      const el = entry.target;
      const target = Number.parseInt(el.dataset.count, 10);
      if (!Number.isFinite(target)) return;

      const suffix = el.dataset.suffix || '';
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  stats.forEach(el => statIo.observe(el));
});
