/* ═══════════════════════════════════════════════════════
   一體性藍圖 — Main JavaScript
   Covers: theme toggle, scroll reveal, breathing exercise,
           mobile nav, sticky header, smooth anchors
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── THEME TOGGLE ── */
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');

  // Initialize from html attribute (default: dark)
  let currentTheme = root.getAttribute('data-theme') || 'dark';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    currentTheme = theme;
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? '切換為亮色模式' : '切換為深色模式');
      themeBtn.innerHTML = theme === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  // Set initial icon
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── HERO ANIMATIONS — trigger on load ── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .fade-in').forEach((el) => {
      el.classList.add('hero-visible');
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal-fade');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el, i) => {
      // Stagger delay based on sibling index within parent
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-fade'));
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.transitionDelay = `${idx * 0.1}s`;
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── STICKY HEADER SCROLL BEHAVIOR ── */
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (header) {
          if (currentScrollY > 60) {
            header.style.background = root.getAttribute('data-theme') === 'light'
              ? 'rgba(238, 235, 255, 0.95)'
              : 'rgba(8, 7, 15, 0.92)';
          } else {
            header.style.background = '';
          }
        }
        lastScrollY = currentScrollY;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close nav when a link is clicked
    siteNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── BREATHING EXERCISE ── */
  const breathOrb = document.getElementById('breathOrb');
  const breathText = document.getElementById('breathText');
  const breathLabel = document.getElementById('breathLabel');
  const breathBtn = document.getElementById('breathBtn');

  if (breathOrb && breathText && breathBtn) {
    let breathActive = false;
    let breathPhase = 'idle'; // idle | in | hold | out
    let breathTimer = null;
    let cycleCount = 0;

    const phases = [
      { name: 'in',   duration: 4000, label: '吸氣…',   message: '慢慢吸氣', cls: 'breathing-in' },
      { name: 'hold', duration: 2000, label: '屏住…',   message: '輕輕屏住', cls: 'breathing-hold' },
      { name: 'out',  duration: 6000, label: '呼氣…',   message: '慢慢呼出', cls: 'breathing-out' },
    ];

    function clearPhaseClasses() {
      breathOrb.classList.remove('breathing-in', 'breathing-hold', 'breathing-out');
    }

    function runPhase(index) {
      if (!breathActive) return;

      const phase = phases[index];
      clearPhaseClasses();

      if (index === 0) {
        cycleCount++;
        breathLabel.textContent = `第 ${cycleCount} 次呼吸循環`;
      }

      breathOrb.classList.add(phase.cls);
      breathText.textContent = phase.message;

      breathTimer = setTimeout(() => {
        const next = (index + 1) % phases.length;
        runPhase(next);
      }, phase.duration);
    }

    function startBreathing() {
      breathActive = true;
      cycleCount = 0;
      clearTimeout(breathTimer);
      runPhase(0);
      breathBtn.textContent = '暫停';
    }

    function stopBreathing() {
      breathActive = false;
      clearPhaseClasses();
      clearTimeout(breathTimer);
      breathText.textContent = '點我開始呼吸';
      breathLabel.textContent = '深呼吸練習 · 跟著光圈節奏';
      breathBtn.textContent = '開始 / 暫停';
      cycleCount = 0;
    }

    breathBtn.addEventListener('click', () => {
      if (breathActive) {
        stopBreathing();
      } else {
        startBreathing();
      }
    });

    // Clicking orb also toggles
    breathOrb.addEventListener('click', () => {
      if (breathActive) {
        stopBreathing();
      } else {
        startBreathing();
      }
    });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── PARALLAX on hero orbs (subtle) ── */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      orb1.style.transform = `translateY(${scrollY * 0.08}px)`;
      orb2.style.transform = `translateY(${-scrollY * 0.05}px)`;
    }, { passive: true });
  }

  /* ── ACTIVE NAV HIGHLIGHT on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--color-primary)'
              : '';
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

})();
