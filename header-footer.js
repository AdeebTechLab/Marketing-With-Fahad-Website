/**
 * header-footer.js  —  Marketing with Fahad
 * ─────────────────────────────────────────────
 * Handles:
 *  1. Sticky header shadow on scroll
 *  2. Mobile menu open / close / accordion
 *  3. Footer accordion (mobile)
 *
 * HOW TO USE:
 *  Add ONE <script> tag at the bottom of EVERY page:
 *  <script src="/assets/js/header-footer.js"></script>
 *
 *  Works regardless of whether the page is at root or in a subfolder
 *  because we use absolute /assets/ paths everywhere.
 */

(function () {
  'use strict';

  /* ── Run after header/footer have been injected ── */
  function init() {

    /* ══════════════════════════════════════════
       1. STICKY HEADER — add shadow on scroll
       ══════════════════════════════════════════ */
    const lHeader = document.querySelector('.l-header');
    if (lHeader) {
      function onScroll() {
        lHeader.classList.toggle('scrolled', window.scrollY > 10);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // run once on load
    }


    /* ══════════════════════════════════════════
       2. MOBILE MENU
       ══════════════════════════════════════════ */
    const mobileMenu  = document.getElementById('mobileMenu');
    const openBtn     = document.querySelector('[data-menu-mobile--switcher-btn]');
    const closeBtn    = document.getElementById('mobileMenuClose');

    function openMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('is-closed', 'anim-close');
      mobileMenu.classList.add('anim-open');
      document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    function closeMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('anim-open');
      mobileMenu.classList.add('anim-close');
      document.body.style.overflow = '';
      // hide after animation ends
      mobileMenu.addEventListener('animationend', function handler() {
        mobileMenu.classList.add('is-closed');
        mobileMenu.classList.remove('anim-close');
        mobileMenu.removeEventListener('animationend', handler);
      });
    }

    if (openBtn)  openBtn.addEventListener('click', openMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

    // Close on overlay click (clicking outside the panel)
    if (mobileMenu) {
      mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) closeMobileMenu();
      });
    }

    // Keyboard: close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });

    /* ── Mobile menu: accordion sub-items ── */
    const toggleBtns = document.querySelectorAll('.menu-mobile__toggle');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.menu-mobile__item');
        const sub  = item && item.querySelector('.menu-mobile__sub');
        if (!item || !sub) return;

        const isOpen = item.classList.contains('is-open');

        // Close all open items first
        document.querySelectorAll('.menu-mobile__item.is-open').forEach(function (openItem) {
          openItem.classList.remove('is-open');
          const openSub = openItem.querySelector('.menu-mobile__sub');
          if (openSub) openSub.classList.remove('is-open');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('is-open');
          sub.classList.add('is-open');
        }
      });
    });


    /* ══════════════════════════════════════════
       3. FOOTER ACCORDION (mobile only)
          Matches the .menu-footer__dropdown toggle
       ══════════════════════════════════════════ */
    const footerDropdowns = document.querySelectorAll(
      '.menu-footer li.-has-dropdown > a, .menu-footer li.-has-dropdown > span'
    );

    footerDropdowns.forEach(function (link) {
      link.addEventListener('click', function (e) {
        // Only activate on mobile
        if (window.innerWidth >= 820) return;

        e.preventDefault();
        const li       = link.closest('li.-has-dropdown');
        const dropdown = li && li.querySelector('.menu-footer__dropdown');
        if (!li || !dropdown) return;

        const isOpen = dropdown.classList.contains('is-open');

        // Close all
        document.querySelectorAll('.menu-footer__dropdown.is-open').forEach(function (d) {
          d.classList.remove('is-open');
        });

        // Toggle current
        if (!isOpen) dropdown.classList.add('is-open');
      });
    });

  } // end init()


  /* ══════════════════════════════════════════
     Boot: wait for header/footer to be loaded
     ══════════════════════════════════════════
     Your loadComponent() function is async.
     We watch for the header element to appear
     using a MutationObserver so we don't need
     to change any existing loading code.
  ══════════════════════════════════════════ */
  function waitForHeader(callback) {
    // If header is already in the DOM, run immediately
    if (document.querySelector('.l-header')) {
      callback();
      return;
    }
    // Otherwise observe DOM mutations
    const observer = new MutationObserver(function () {
      if (document.querySelector('.l-header')) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      waitForHeader(init);
    });
  } else {
    waitForHeader(init);
  }

})();
