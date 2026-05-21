/* ============================================================
   VIVA COFFEE — Main JavaScript
   Author: Viva Coffee Dev Team
   Description: All interactive behaviour for the website:
     - Page loader
     - Navbar scroll effect & active link tracking
     - Scroll-reveal animations
     - Menu category filter
     - Reservation form handler
     - Smooth scroll
     - Scroll-to-top button
============================================================ */

/* ============================================================
   1. PAGE LOADER
   Hides the full-screen loader once the window has fully loaded.
   A 1800ms delay lets the loading bar animation complete.
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('pageLoader').classList.add('hidden');
  }, 1800);
});

/* ============================================================
   2. NAVBAR — scroll behaviour & active link tracking
============================================================ */
const nav = document.getElementById('mainNav');

// Sections to track for active nav highlighting
const navSections = ['home', 'menu', 'about', 'gallery', 'testimonials', 'contact'];

window.addEventListener('scroll', () => {

  // Add 'scrolled' class once user scrolls past 60px
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Determine which section is currently in view
  let current = '';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });

  // Highlight the matching nav link
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Show / hide scroll-to-top button
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);

}, { passive: true });

/* ============================================================
   3. SCROLL-TO-TOP BUTTON
============================================================ */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   4. SCROLL REVEAL
   Uses IntersectionObserver to fade-in elements with
   the .reveal class when they enter the viewport.
   Siblings inside the same .row are staggered by 80ms.
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings in the same Bootstrap row
    const parentRow = entry.target.closest('.row');
    if (parentRow) {
      const siblings = parentRow.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach(el => {
        if (!el.classList.contains('visible')) {
          setTimeout(() => el.classList.add('visible'), delay);
          delay += 80;
        }
      });
    } else {
      entry.target.classList.add('visible');
    }

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

// Observe every element that has the reveal class
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. MENU CATEGORY FILTER
   Clicking a filter button shows/hides cards by data-category.
   A CSS opacity/scale transition creates a smooth effect.
============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // Update active state on buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.menu-item').forEach(item => {
      const isMatch = filter === 'all' || item.dataset.category === filter;

      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      if (isMatch) {
        // Restore the card
        item.style.display = '';
        // Force reflow so transition fires
        void item.offsetHeight;
        item.style.opacity  = '1';
        item.style.transform = 'scale(1)';
      } else {
        // Fade and shrink out, then hide
        item.style.opacity  = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          // Only hide if the filter hasn't changed in the meantime
          if (item.dataset.category !== document.querySelector('.filter-btn.active').dataset.filter &&
              document.querySelector('.filter-btn.active').dataset.filter !== 'all') {
            item.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

/* ============================================================
   6. RESERVATION FORM HANDLER
   Prevents real submission, shows a toast notification,
   then resets the form.
============================================================ */
const reservationForm = document.getElementById('reservationForm');
const formToast       = document.getElementById('formToast');

if (reservationForm) {
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop actual form submission

    // Show toast
    formToast.style.opacity       = '1';
    formToast.style.transform     = 'translateX(-50%) translateY(0)';
    formToast.style.pointerEvents = 'auto';

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      formToast.style.opacity       = '0';
      formToast.style.transform     = 'translateX(-50%) translateY(20px)';
      formToast.style.pointerEvents = 'none';
    }, 4000);

    // Clear all form fields
    reservationForm.reset();
  });
}

/* ============================================================
   7. SMOOTH SCROLL for anchor links
   Compensates for the fixed navbar height (80px offset).
   Also closes the Bootstrap mobile nav if it's open.
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const target   = document.querySelector(targetId);

    if (target) {
      e.preventDefault();
      const navOffset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close Bootstrap mobile menu if open
      const collapseEl = document.getElementById('navContent');
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});
