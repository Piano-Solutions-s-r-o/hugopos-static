/* ============================================================
   Hugo Landing — page-language runtime (HUGO-1844)
   Translation happens at build time: every page is generated once per
   language (`/` Czech, `/en/` English; Web/landing/generator/). This script only
   - exposes the page language (window.HUGO_LANG, from <html lang>) and the
     runtime strings blob (#hugo-strings) as window.HUGO_T;
   - remembers the language for the client-side e-shop, which shares the
     'hugo-lang' key (the URL, never this value, decides a page's language);
   - keeps the visitor's query string (UTM, ?v=) and #hash when they switch
     language through a [data-lang-link].
   ============================================================ */
(function () {
  'use strict';

  var lang = document.documentElement.lang === 'en' ? 'en' : 'cs';
  window.HUGO_LANG = lang;

  var strings = {};
  var blob = document.getElementById('hugo-strings');
  if (blob) {
    try { strings = JSON.parse(blob.textContent); } catch (e) { strings = {}; }
  }
  window.HUGO_T = strings;

  try { localStorage.setItem('hugo-lang', lang); } catch (e) {}

  /* Localized waitlist "thanks" message (called from the form's onsubmit). */
  window.hugoFormThanks = function (form) {
    var btn = form.querySelector('.btn');
    if (btn && strings.waitlistThanks) btn.textContent = strings.waitlistThanks;
  };

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[data-lang-link]');
    if (!a || ev.defaultPrevented || ev.button !== 0
      || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (!location.search && !location.hash) return;
    var url = new URL(a.getAttribute('href'), location.href);
    url.search = location.search;
    url.hash = location.hash;
    ev.preventDefault();
    location.href = url.href;
  });
})();
