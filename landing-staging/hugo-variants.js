/* ============================================================
   Hugo Landing — audience variants
   Three same-page versions targeted by venue size:
     micro  — food trucks / stalls / solo (default; prerendered into the HTML)
     small  — café & bar
     mid    — restaurant & multi-venue chain
   Which variant a visitor sees is decided by hugo-ab.js (HUGO-1860 A/B test:
   random, persisted, measured). The switcher below is the internal preview only
   (`?ab=1`); its choice lives in ?v= and is never written to the A/B assignment.
   Copy comes from the page's #hugo-strings blob (Web/landing/i18n/runtime.mjs,
   HUGO-1844): every variant defines every slot, so a switch never depends on a
   base being restored. The page language is fixed by its URL.
   ============================================================ */
(function () {
  'use strict';

  var ORDER = ['micro', 'small', 'mid'];
  var DEFAULT = 'micro';
  var SLOTS = {
    eyebrow: '.hero-eyebrow',
    h1: '.hero h1',
    lead: '.hero p.lead',
    cta: '.hero-ctas .btn-primary'
  };

  function strings() { return window.HUGO_T || {}; }

  /* Typewriter that preserves <b>/<p> formatting and shows a caret */
  function typeBrain(html) {
    var box = document.getElementById('bcA');
    if (!box) return;
    if (box._timer) { clearInterval(box._timer); box._timer = null; }
    box.innerHTML = '';
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    while (tmp.firstChild) box.appendChild(tmp.firstChild);
    var nodes = [];
    (function walk(el) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var n = el.childNodes[i];
        if (n.nodeType === 3) nodes.push(n);
        else if (n.nodeType === 1) walk(n);
      }
    })(box);
    var full = nodes.map(function (n) { return n.textContent; });
    nodes.forEach(function (n) { n.textContent = ''; });
    var caret = document.createElement('span');
    caret.className = 'bc-caret';
    var ni = 0, ci = 0, STEP = 2;
    function place() {
      var node = nodes[Math.min(ni, nodes.length - 1)];
      var p = node && node.parentNode ? (node.parentNode.closest ? node.parentNode.closest('p') || node.parentNode : node.parentNode) : box;
      (p || box).appendChild(caret);
    }
    place();
    box._timer = setInterval(function () {
      if (ni >= nodes.length) {
        clearInterval(box._timer); box._timer = null;
        if (caret.parentNode) caret.parentNode.removeChild(caret);
        return;
      }
      var s = full[ni];
      if (ci < s.length) {
        nodes[ni].textContent += s.slice(ci, ci + STEP);
        ci += STEP;
        place();
      } else { ni++; ci = 0; }
    }, 16);
  }
  window.__typeBrain = typeBrain;

  var brainSeen = false;
  function chat() {
    var c = strings().chat;
    return c && c[window.HUGO_VARIANT];
  }
  function ensureBrainObserver() {
    var sec = document.getElementById('brain');
    if (!sec || !('IntersectionObserver' in window)) { brainSeen = true; return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          brainSeen = true;
          var ch = chat();
          if (ch) typeBrain(ch.a);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(sec);
  }

  if (ORDER.indexOf(window.HUGO_VARIANT) < 0) window.HUGO_VARIANT = DEFAULT;

  function applyVariant() {
    var v = window.HUGO_VARIANT;
    var copy = strings().variants && strings().variants[v];
    if (copy) {
      Object.keys(SLOTS).forEach(function (slot) {
        var el = document.querySelector(SLOTS[slot]);
        if (el && copy[slot] != null) el.innerHTML = copy[slot];
      });
    }
    var ch = chat();
    if (ch) {
      var q = document.getElementById('bcQ');
      var fld = document.getElementById('bcField');
      if (q) q.textContent = ch.q;
      if (fld) fld.setAttribute('placeholder', ch.ph);
      if (brainSeen) typeBrain(ch.a);
    }
  }

  function syncSeg() {
    document.querySelectorAll('.ab-opt').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.v === window.HUGO_VARIANT);
    });
  }

  function selectVariant(v) {
    if (ORDER.indexOf(v) < 0) return;
    window.HUGO_VARIANT = v;
    try {
      var url = new URL(location.href);
      url.searchParams.set('v', v);
      history.replaceState(null, '', url);
    } catch (e) {}
    syncSeg();
    applyVariant();
    document.dispatchEvent(new CustomEvent('hugo:variant', { detail: v }));
  }
  window.selectHugoVariant = selectVariant;

  function step(dir) {
    var i = ORDER.indexOf(window.HUGO_VARIANT);
    selectVariant(ORDER[(i + dir + ORDER.length) % ORDER.length]);
  }

  function wire() {
    /* Visitors in the A/B test must not switch arms; only the ?ab=1 preview may. */
    if (!document.documentElement.classList.contains('ab-preview')) return;
    var eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      if (strings().eyebrowTitle) eyebrow.setAttribute('title', strings().eyebrowTitle);
      eyebrow.addEventListener('click', function () { step(1); });
    }
    document.querySelectorAll('.eb-arrow').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.stopPropagation();
        step(parseInt(a.dataset.dir, 10) || 1);
      });
    });
    var seg = document.getElementById('abSeg');
    if (seg) seg.addEventListener('click', function (e) {
      var b = e.target.closest('.ab-opt');
      if (b) selectVariant(b.dataset.v);
    });
    document.querySelectorAll('.ab-arrow').forEach(function (a) {
      a.addEventListener('click', function () { step(parseInt(a.dataset.dir, 10) || 1); });
    });
  }

  function boot() {
    syncSeg();
    ensureBrainObserver();
    /* The prerendered HTML already shows micro; only a different choice rewrites it. */
    if (window.HUGO_VARIANT !== DEFAULT) applyVariant();
    document.documentElement.classList.remove('ab-pending');
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
