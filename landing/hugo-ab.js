/* ============================================================
   Hugo Landing — A/B test of the three audience variants (HUGO-1860)
   Loaded synchronously in <head>, right after GTM, on every templated page.

   - A first visit to a page that shows the variants (<html data-ab-home>) is
     assigned micro / small / mid with equal probability; the choice is kept in
     localStorage, so a returning visitor always sees the same variant.
   - `?v=<variant>` shows that variant without touching the assignment (links
     from a campaign); it is measured as `<variant>_url`, never as the random arm.
   - `?ab=1` is the internal preview: it reveals the variant switcher for the
     tab session and sends nothing to analytics.
   - Measurement: GA4 user property `ab_variant` (gtag `set` through the GTM
     dataLayer) plus a dataLayer event `ab_variant`; every link to the Admin
     sign-in carries `lv=<value>`, which Admin keeps as `landing_variant` so a
     finished registration is attributed to the arm (Admin/src/lib/analytics.js).
   - While a non-default variant is swapped in, `ab-pending` hides the four hero
     slots so the prerendered micro copy never flashes (hugo-variants.js clears it;
     the timeout below is the safety net).
   ============================================================ */
(function () {
  'use strict';

  var ORDER = ['micro', 'small', 'mid'];
  var DEFAULT = 'micro';
  var KEY = 'hugo-variant';
  var root = document.documentElement;
  var isHome = root.hasAttribute('data-ab-home');

  function read(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function write(store, k, v) { try { window[store].setItem(k, v); } catch (e) {} }

  var q;
  try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function () { return null; } }; }

  if (q.get('ab') === '1') write('sessionStorage', 'hugo-ab-preview', '1');
  var preview = read('sessionStorage', 'hugo-ab-preview') === '1';

  var forced = ORDER.indexOf(q.get('v')) >= 0 ? q.get('v') : null;
  var assigned = read('localStorage', KEY);
  if (ORDER.indexOf(assigned) < 0) assigned = null;
  if (!assigned && isHome && !forced && !preview) {
    assigned = ORDER[Math.floor(Math.random() * ORDER.length)];
    write('localStorage', KEY, assigned);
  }

  var shown = forced || assigned || DEFAULT;
  /* What analytics and Admin are told: the random arm, or `<v>_url` for a forced view. */
  var measured = preview ? null : (forced ? forced + '_url' : assigned);

  window.HUGO_VARIANT = shown;
  window.HUGO_AB = { shown: shown, measured: measured, preview: preview };

  if (preview) root.classList.add('ab-preview');
  if (isHome && shown !== DEFAULT) {
    root.classList.add('ab-pending');
    setTimeout(function () { root.classList.remove('ab-pending'); }, 1500);
  }

  if (measured) {
    var dl = window.dataLayer = window.dataLayer || [];
    /* gtag.js only reads `arguments` objects from the dataLayer, never arrays. */
    var gtag = function () { dl.push(arguments); };
    gtag('set', 'user_properties', { ab_variant: measured });
    dl.push({ event: 'ab_variant', ab_variant: measured });
  }

  function decorate() {
    if (!measured) return;
    var links = document.querySelectorAll('a[href^="https://admin.hugopos.eu/login"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var u = new URL(links[i].href);
        u.searchParams.set('lv', measured);
        links[i].href = u.toString();
      } catch (e) {}
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();
