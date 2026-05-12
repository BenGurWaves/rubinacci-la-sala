document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const cipher = document.querySelector('.loader-cipher');
  const rule = document.querySelector('.loader-rule');
  const statement = document.querySelector('.loader-statement');
  const heroTitle = document.querySelector('.hero-title');
  const heroSub = document.querySelector('.hero-sub');
  const heroRule = document.querySelector('.hero-rule');
  const heroLine = document.querySelector('.hero-line');
  const scrollCue = document.querySelector('.scroll-cue');
  const cursor = document.getElementById('cursor');
  const indexPanel = document.getElementById('index-panel');
  const indexTrigger = document.getElementById('index-trigger');
  const indexClose = document.getElementById('index-close');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const delay = (ms, fn) => prefersReduced ? fn() : setTimeout(fn, ms);

  delay(200, () => cipher.classList.add('is-drawn'));
  delay(800, () => rule.classList.add('is-drawn'));
  delay(1200, () => statement.classList.add('is-visible'));
  delay(3200, () => {
    loader.classList.add('is-hidden');
    heroTitle.classList.add('is-visible');
    heroSub.classList.add('is-visible');
    heroRule.classList.add('is-drawn');
    heroLine.classList.add('is-visible');
    scrollCue.classList.add('is-visible');
  });

  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch && cursor) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    document.querySelectorAll('a, button, .p-frame-br, .index-close').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  indexTrigger.addEventListener('click', () => indexPanel.classList.add('is-open'));
  indexClose.addEventListener('click', () => indexPanel.classList.remove('is-open'));
  document.querySelectorAll('.index-nav a').forEach(a => {
    a.addEventListener('click', () => indexPanel.classList.remove('is-open'));
  });

  // Swipe to close index panel
  let touchStartX = 0;
  indexPanel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  indexPanel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      indexPanel.classList.remove('is-open');
    }
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.chapter').forEach(ch => observer.observe(ch));

  document.querySelectorAll('.chapter-ghost').forEach(ghost => {
    const parent = ghost.closest('.chapter');
    if (!parent) return;

    const moveGhost = (x, y) => {
      const rect = parent.getBoundingClientRect();
      const gx = (x - rect.left) / rect.width - 0.5;
      const gy = (y - rect.top) / rect.height - 0.5;
      ghost.style.transform = `translate(calc(-50% + ${gx * -20}px), calc(-50% + ${gy * -20}px))`;
    };

    parent.addEventListener('mousemove', (e) => moveGhost(e.clientX, e.clientY));
    parent.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) moveGhost(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    parent.addEventListener('mouseleave', () => {
      ghost.style.transform = 'translate(-50%, -50%)';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
});
