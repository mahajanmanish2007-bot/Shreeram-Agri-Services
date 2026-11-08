// Shared behaviour for every page: navbar shadow, mobile menu, scroll reveal.
(function () {
  'use strict';

  // Sticky navbar shadow
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.innerHTML = open
        ? '<i class="fas fa-xmark"></i>'
        : '<i class="fas fa-bars"></i>';
    };

    menuToggle.addEventListener('click', () => {
      setOpen(!navLinks.classList.contains('open'));
    });

    // Close the menu when a link is tapped or the user dismisses it.
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        setOpen(false);
      }
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Older browsers: show everything immediately
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();