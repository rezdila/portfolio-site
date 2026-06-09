/**
 * main.js — App initialization, navigation, scroll effects, and animations
 */
import { renderAll } from './renderer.js';
import { DataManager } from './dataManager.js';
import ParticleSystem from './particles.js';
import { debounce, smoothScrollTo } from './utils.js';

/* ========== APP INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', async () => {
  // Force reload fresh data if data version changed
  const DATA_VERSION = '5.0';
  const storedVersion = localStorage.getItem('portfolio_data_version');
  if (storedVersion !== DATA_VERSION) {
    localStorage.removeItem('yuresh_portfolio_data');
    localStorage.setItem('portfolio_data_version', DATA_VERSION);
  }

  // Fetch from cloud database if configured
  await DataManager.initCloud();

  initNavigation();
  initParticles();
  initScrollReveal();
  initFloatingNav();
  initContactForm();
  initTypewriter();
  initBackToTop();
  renderAll();

  // Re-trigger scroll reveal after render
  setTimeout(() => {
    handleScrollReveal();
  }, 100);
});

/* ========== NAVIGATION ========== */
function initNavigation() {
  const nav = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link, .nav__dropdown-item');

  // Scroll effect — add background on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Hide/show nav on scroll direction
    if (currentScroll > lastScroll && currentScroll > 300) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('nav__mobile-menu--open');
      navToggle.classList.toggle('nav__hamburger--active');
      const isOpen = mobileMenu.classList.contains('nav__mobile-menu--open');
      navToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);

      if (isOpen) {
        document.body.classList.add('body-scroll-lock');
      } else {
        document.body.classList.remove('body-scroll-lock');
      }
    });
  }

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href.substring(1));

        // Close mobile menu
        if (mobileMenu) {
          mobileMenu.classList.remove('nav__mobile-menu--open');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
        if (navToggle) {
          navToggle.classList.remove('nav__hamburger--active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('body-scroll-lock');
      }
    });
  });

  // Clean up mobile menu state on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      if (mobileMenu && mobileMenu.classList.contains('nav__mobile-menu--open')) {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (navToggle) {
          navToggle.classList.remove('nav__hamburger--active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('body-scroll-lock');
      }
    }
  });

  // Dropdown handling
  const dropdowns = document.querySelectorAll('.nav__dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav__dropdown-toggle');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Close other dropdowns
        dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
        dropdown.classList.toggle('open');
        const isOpen = dropdown.classList.contains('open');
        trigger.setAttribute('aria-expanded', isOpen);
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__dropdown')) {
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });
}

/* ========== PARTICLES ========== */
let particleSystem = null;

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  particleSystem = new ParticleSystem(canvas);
  particleSystem.start();
}

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
  // Use Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Animate skill bars when they come into view
        if (entry.target.querySelector('.skill-bar-fill')) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.level + '%';
          });
        }

        // Animate counters
        if (entry.target.querySelector('[data-count]')) {
          entry.target.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.dataset.count);
            animateCounterElement(counter, 0, target, 1500);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Expose a global helper so renderer.js can re-observe dynamically added cards
  window.__revealObserver = observer;
  window.__reObserve = function() {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => {
      observer.observe(el);
      // If the element is already in view, mark it active immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
    });
  };

  // Also observe sections for floating nav
  window.__sectionObserver = observer;
}

function handleScrollReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.active)');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

function animateCounterElement(element, start, end, duration) {
  const startTime = performance.now();
  const suffix = element.textContent.includes('+') ? '+' : '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (end - start) * eased);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ========== FLOATING NAV ========== */
function initFloatingNav() {
  const floatingNav = document.getElementById('dot-nav');
  if (!floatingNav) return;

  const sections = document.querySelectorAll('section[id]');
  const dots = floatingNav.querySelectorAll('.dot-nav__dot');

  // Highlight active section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));

  // Click to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      smoothScrollTo(dot.dataset.section);
    });
  });
}

/* ========== CONTACT FORM ========== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Save message to localStorage inbox
    const msg = {
      id: Date.now(),
      name: data.name || '',
      email: data.email || '',
      subject: data.subject || '',
      message: data.message || '',
      date: new Date().toISOString(),
      read: false
    };
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      existing.unshift(msg); // newest first
      localStorage.setItem('portfolio_messages', JSON.stringify(existing));
    } catch(err) { /* ignore */ }

    // Show success feedback
    const submitBtn = form.querySelector('[type="submit"]');
    const statusEl  = document.getElementById('form-status');
    if (submitBtn) {
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.disabled = false;
      }, 3000);
    }
    if (statusEl) {
      statusEl.textContent = '✓ Your message has been saved. I\'ll get back to you soon!';
      statusEl.style.color = 'var(--accent-emerald, #34d399)';
      setTimeout(() => { statusEl.textContent = ''; }, 4000);
    }
    form.reset();
  });
}

/* ========== TYPEWRITER EFFECT ========== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Industrial Mathematics Student',
    'Data Science Enthusiast',
    'ML Explorer',
    'Youth Leader',
    'Community Builder'
  ];

  // Roles where 'an' is correct (start with a vowel sound)
  const vowelStartRoles = new Set(['Industrial Mathematics Student', 'ML Explorer']);

  const prefixEl = document.querySelector('.hero__typewriter-prefix');

  function updateArticle(role) {
    if (!prefixEl) return;
    prefixEl.textContent = vowelStartRoles.has(role) ? 'I\'m an\u00a0' : 'I\'m a\u00a0';
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseDelay = 2200;

  // Set initial article
  updateArticle(roles[0]);

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        updateArticle(roles[roleIndex]);
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, deletingSpeed);
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseDelay);
        return;
      }
      setTimeout(type, typingSpeed);
    }
  }

  el.textContent = '';
  setTimeout(type, 900);
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 100));

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
