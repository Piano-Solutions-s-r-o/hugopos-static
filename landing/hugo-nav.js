/* ============================================================
   Hugo Landing — mobile menu (HUGO-1872)
   Below the tablet breakpoint the header hides `.nav-links`; the
   `.nav-burger` button opens them as a panel under the header.
   Closes on a link click, a second button press or Escape.
   ============================================================ */
(function () {
  'use strict';

  function boot() {
    var button = document.querySelector('.nav-burger');
    var header = button && button.closest('header.nav');
    var links = document.getElementById('navLinks');
    if (!button || !header || !links) return;

    function set(open) {
      header.classList.toggle('menu-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      set(button.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) set(false);
    });
    /* Widening to desktop hides the button; do not leave a stale open state behind. */
    window.addEventListener('resize', function () {
      if (button.offsetParent === null && header.classList.contains('menu-open')) set(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) {
        set(false);
        button.focus();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
