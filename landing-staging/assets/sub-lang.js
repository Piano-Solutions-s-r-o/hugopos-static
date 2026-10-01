/* Hugo landing — CZ/EN switch for content sub-pages (/srovnani, /cenik). HUGO-1828.
   Czech is authored in the markup; every translatable element carries its English
   innerHTML in a data-en attribute. The choice is shared with the main page via the
   same localStorage key ('hugo-lang'), so switching here also sticks on hugopos.eu. */
(function () {
  'use strict';
  var KEY = 'hugo-lang';
  var nodes = [];

  function read() { try { return localStorage.getItem(KEY) || 'cs'; } catch (e) { return 'cs'; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  function apply(lang) {
    var en = lang === 'en';
    nodes.forEach(function (n) { n.el.innerHTML = en ? n.en : n.cs; });
    var root = document.documentElement;
    root.lang = en ? 'en' : 'cs';
    var t = root.getAttribute(en ? 'data-title-en' : 'data-title-cs');
    if (t) document.title = t;
    document.querySelectorAll('#langToggle button').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.lang === (en ? 'en' : 'cs'));
    });
    document.dispatchEvent(new CustomEvent('hugo:lang', { detail: en ? 'en' : 'cs' }));
  }

  window.hugoSubLang = function () { return document.documentElement.lang === 'en' ? 'en' : 'cs'; };

  function boot() {
    document.documentElement.setAttribute('data-title-cs', document.title);
    document.querySelectorAll('[data-en]').forEach(function (el) {
      nodes.push({ el: el, cs: el.innerHTML, en: el.getAttribute('data-en') });
    });
    var t = document.getElementById('langToggle');
    if (t) t.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lang]');
      if (b) { save(b.dataset.lang); apply(b.dataset.lang); }
    });
    apply(read());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
