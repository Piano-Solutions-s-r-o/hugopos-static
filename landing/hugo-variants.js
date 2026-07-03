/* ============================================================
   Hugo Landing — A/B audience variants
   Three same-page versions targeted by venue size:
     micro  — food trucks / stalls / solo
     small  — café & bar (default / base content)
     mid    — restaurant & multi-venue chain
   A subtle top switcher cycles them; choice persists in
   localStorage + ?v= URL param so each is directly deployable.
   Overrides sit on top of the i18n layer (CZ/EN both covered).
   ============================================================ */
(function () {
  'use strict';

  var ARR = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  var ORDER = ['micro', 'small', 'mid'];
  var PRESET = { micro: 'truck', small: 'cafe', mid: 'chain' };

  /* Per-variant content overrides (small = base, no overrides) */
  var VARIANTS = {
    micro: {
      '.hero-eyebrow': {
        cs: '<span class="pip">★</span> Pro food trucky, stánky a malé provozy &nbsp;·&nbsp; spustíš za 5 minut',
        en: '<span class="pip">★</span> For food trucks, stalls &amp; solo spots &nbsp;·&nbsp; live in 5 minutes'
      },
      '.hero h1': {
        cs: 'Pokladna, co se <span class="hl">vejde do kapsy.</span> <em>Spusť za 5 minut.</em>',
        en: 'A till that <span class="hl">fits in your pocket.</span> <em>Live in 5 minutes.</em>'
      },
      '.hero p.lead': {
        cs: 'Žádné kabely, žádná smlouva — a žádná instalace na týden. Stáhni appku, vyfoť ceník a ber karty hned na telefonu, co máš — nebo si vezmi fakt moderní terminál od nás. Jen 190 Kč měsíčně, když platby bereš přes nás.',
        en: 'No cables, no contract — and no week-long install. Download the app, snap your price list and take cards on the phone you own — or grab a genuinely modern terminal from us. Just 190 Kč a month when you take payments through us.'
      },
      '.hero-ctas .btn-primary': {
        cs: 'Stáhnout zdarma ' + ARR,
        en: 'Download free ' + ARR
      }
    },
    mid: {
      '.hero-eyebrow': {
        cs: '<span class="pip">★</span> Pro restaurace a více poboček &nbsp;·&nbsp; migrace zdarma',
        en: '<span class="pip">★</span> For restaurants &amp; multi-venue groups &nbsp;·&nbsp; free migration'
      },
      '.hero h1': {
        cs: 'Pokladna, která <span class="hl">roste s tvou restaurací.</span> <em>I přes víc poboček.</em>',
        en: 'The POS that <span class="hl">scales with your restaurant.</span> <em>Across every venue.</em>'
      },
      '.hero p.lead': {
        cs: 'Přejdi z Dotykačky nebo Storyous bez výpadku — a bez toho týdenního stěhování jako ze středověku. Menu naimportujeme my. Reporty, foodcost, sklad a předpovědi Piano Brain pro všechny pobočky na jednom místě.',
        en: 'Switch from Dotykačka or Storyous with zero downtime — and none of that week-long, medieval migration. We import your menu. Reports, foodcost, stock and Piano Brain forecasts for every venue in one place.'
      }
    }
  };

  /* Per-variant stat-band overrides (3 stats: value innerHTML + label) */
  var STATS = {
    small: {
      v: {
        cs: ['+19<span class="u">%</span>', '&minus;4<span class="u">h/týd</span>', '5<span class="u">min</span>'],
        en: ['+19<span class="u">%</span>', '&minus;4<span class="u">h/wk</span>', '5<span class="u">min</span>']
      },
      l: {
        cs: ['vyšší spropitné, když appka sama nabídne dýško', 'méně administrativy — DPH, účtenky a foodcost samy', 'od stažení k první tržbě'],
        en: ['higher tips with the on-screen tip prompt', 'less admin — VAT, receipts &amp; foodcost on autopilot', 'from download to your first sale']
      }
    },
    micro: {
      v: {
        cs: ['190<span class="u">Kč/měs</span>', '5<span class="u">min</span>', '+19<span class="u">%</span>'],
        en: ['190<span class="u">Kč/mo</span>', '5<span class="u">min</span>', '+19<span class="u">%</span>']
      },
      l: {
        cs: ['měsíčně s našimi platbami, nic skrytého', 'od stažení k první tržbě', 'vyšší spropitné, když appka nabídne dýško'],
        en: ['a month with our payments, nothing hidden', 'from download to first sale', 'higher tips with the on-screen tip prompt']
      }
    },
    mid: {
      v: {
        cs: ['1<span class="u">den</span>', '&minus;4<span class="u">h/týd</span>', '&infin;<span class="u">poboček</span>'],
        en: ['1<span class="u">day</span>', '&minus;4<span class="u">h/wk</span>', '&infin;<span class="u">venues</span>']
      },
      l: {
        cs: ['k přechodu — bez výpadku', 'ručních reportů a administrativy', 'a zařízení na jednom účtu'],
        en: ['to switch — no downtime', 'of manual reports &amp; admin', '&amp; devices on one account']
      }
    }
  };

  /* Per-variant Piano Brain chat (user question -> Brain answer, typed out) */
  var CHAT = {
    micro: {
      cs: {
        q: 'Jak vytáhnout víc z víkendu na trhu?',
        ph: 'Co vás zajímá nebo chcete vědět?',
        a: '<p>O víkendu ti nejvíc vydělává <b>wrap s kuřecím</b> a <b>domácí limonáda</b> — spolu dělají skoro <b>40 %</b> tržby.</p>'
         + '<p>Wrap teď prodáváš za <b>119 Kč</b>, okolní stánky za <b>135–145 Kč</b>. Klidně jdi na <b>129 Kč</b> — přidá ti to kolem <b>+1 600 Kč</b> za víkend a nikdo si nevšimne.</p>'
         + '<p>A nachystej si o <b>pětinu víc</b> placek: minulé dva víkendy ti došly už kolem <b>14:00</b>.</p>'
      },
      en: {
        q: 'How do I get more out of a market weekend?',
        ph: 'What would you like to know?',
        a: '<p>Your weekend earners are the <b>chicken wrap</b> and <b>homemade lemonade</b> — together almost <b>40%</b> of sales.</p>'
         + '<p>The wrap is <b>119 Kč</b>; nearby stalls charge <b>135–145 Kč</b>. Move to <b>129 Kč</b> — that adds about <b>+1,600 Kč</b> a weekend and no one blinks.</p>'
         + '<p>And prep <b>a fifth more</b> flatbreads: the last two weekends you sold out by <b>2pm</b>.</p>'
      }
    },
    small: {
      cs: {
        q: 'Jak zvednout tržby ve slabých dnech?',
        ph: 'Co vás zajímá nebo chcete vědět?',
        a: '<p>Nejslabší ti vychází <b>úterý a středa odpoledne</b> — kolem <b>2 900 Kč</b> za odpoledne, o třetinu míň než ve čtvrtek.</p>'
         + '<p>Zkus na ty dny spojit <b>kávu a zákusek za 99 Kč</b>. Podobná akce ti v pátek zvedla průměrnou útratu na účet o <b>14 %</b>.</p>'
         + '<p>Spropitné navíc roste tam, kde appka při placení sama nabídne dýško — drž to zapnuté u všech plateb a přidá ti to dalších pár stovek týdně.</p>'
      },
      en: {
        q: 'How do I lift sales on the slow days?',
        ph: 'What would you like to know?',
        a: '<p>Your weak spot is <b>Tuesday and Wednesday afternoons</b> — around <b>2,900 Kč</b> each, a third below Thursday.</p>'
         + '<p>On those days try a <b>coffee + cake for 99 Kč</b> deal. A similar offer lifted your average ticket by <b>14%</b> on Fridays.</p>'
         + '<p>Tips also climb wherever the digital prompt runs — keep it on for every payment and it adds a few hundred a week.</p>'
      }
    },
    mid: {
      cs: {
        q: 'Jak můžu zlepšit marži u poledního menu?',
        ph: 'Co vás zajímá nebo chcete vědět?',
        a: '<p>U tvého poledního menu doporučuji zaměřit se na <b>kuřecí řízek s bramborovou kaší</b>, který teď prodáváš za <b>165 Kč</b>. Foodcost vychází kolem <b>82 Kč</b>, takže marže je jen něco přes <b>50 %</b>.</p>'
         + '<p>V okolí se přitom podobná jídla pohybují mezi <b>185–195 Kč</b>. Ideální krok je zvýšit cenu na <b>189 Kč</b> – tím se okamžitě posuneš na tržní úroveň a marže stoupne na <b>64 %</b>.</p>'
         + '<p>Zároveň můžeš brambory nahradit celerem, který působí prémiověji („domácí celerová kaše"), a tím snížíš foodcost o dalších <b>6 Kč</b> na porci a výsledná marže ti vyroste téměř na <b>70 %</b>.</p>'
      },
      en: {
        q: 'How can I improve the margin on my lunch menu?',
        ph: 'What would you like to know?',
        a: '<p>On your lunch menu, focus on the <b>chicken schnitzel with mash</b> you sell for <b>165 Kč</b>. Foodcost runs around <b>82 Kč</b>, so the margin is only just over <b>50%</b>.</p>'
         + '<p>Nearby, similar dishes sit between <b>185–195 Kč</b>. The clean move is to raise it to <b>189 Kč</b> — that puts you at market level and lifts the margin to <b>64%</b>.</p>'
         + '<p>You can also swap the potato for celeriac, which reads more premium (“house celeriac mash”), cutting foodcost a further <b>6 Kč</b> per plate and pushing the margin to nearly <b>70%</b>.</p>'
      }
    }
  };

  /* Typewriter that preserves <b>/<p> formatting and shows a caret */
  function typeBrain(html, lang) {
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
  function ensureBrainObserver() {
    var sec = document.getElementById('brain');
    if (!sec || !('IntersectionObserver' in window)) { brainSeen = true; return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          brainSeen = true;
          var v = window.HUGO_VARIANT, lang = window.HUGO_LANG || 'cs';
          var ch = CHAT[v] && CHAT[v][lang];
          if (ch) typeBrain(ch.a, lang);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(sec);
  }

  window.HUGO_VARIANT = (function () {
    try {
      var u = new URLSearchParams(location.search).get('v');
      if (u && ORDER.indexOf(u) >= 0) return u;
      var s = localStorage.getItem('hugo-variant');
      if (s && ORDER.indexOf(s) >= 0) return s;
    } catch (e) {}
    return 'micro';
  })();

  /* Apply current variant's overrides on top of the i18n base */
  window.__applyVariant = function (lang) {
    lang = lang || window.HUGO_LANG || 'cs';
    var v = window.HUGO_VARIANT;
    var ov = VARIANTS[v];
    if (ov) {
      Object.keys(ov).forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el && ov[sel][lang] != null) el.innerHTML = ov[sel][lang];
      });
    }
    var st = STATS[v];
    if (st) {
      var vs = document.querySelectorAll('.stats-grid .stat .v');
      var ls = document.querySelectorAll('.stats-grid .stat .l');
      (st.v[lang] || []).forEach(function (t, i) { if (vs[i]) vs[i].innerHTML = t; });
      (st.l[lang] || []).forEach(function (t, i) { if (ls[i]) ls[i].innerHTML = t; });
    }
    var ch = CHAT[v] && CHAT[v][lang];
    if (ch) {
      var q = document.getElementById('bcQ');
      var fld = document.getElementById('bcField');
      if (q) q.textContent = ch.q;
      if (fld) fld.setAttribute('placeholder', ch.ph);
      if (brainSeen) typeBrain(ch.a, lang);
    }
  };

  function syncSeg() {
    document.querySelectorAll('.ab-opt').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.v === window.HUGO_VARIANT);
    });
  }

  function selectVariant(v) {
    if (ORDER.indexOf(v) < 0) return;
    window.HUGO_VARIANT = v;
    try { localStorage.setItem('hugo-variant', v); } catch (e) {}
    try {
      var url = new URL(location.href);
      url.searchParams.set('v', v);
      history.replaceState(null, '', url);
    } catch (e) {}
    syncSeg();
    // Re-run i18n base (resets overridden nodes), which calls __applyVariant at the end
    if (typeof window.applyHugoLang === 'function') {
      window.applyHugoLang(window.HUGO_LANG || 'cs');
    } else {
      window.__applyVariant(window.HUGO_LANG);
    }
    if (typeof window.applyPreset === 'function') window.applyPreset(PRESET[v]);
  }
  window.selectHugoVariant = selectVariant;

  function wire() {
    var eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      eyebrow.setAttribute('title', 'Klikni pro další verzi cílení');
      eyebrow.addEventListener('click', function () {
        var i = ORDER.indexOf(window.HUGO_VARIANT);
        selectVariant(ORDER[(i + 1) % ORDER.length]);
      });
    }
    document.querySelectorAll('.eb-arrow').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.stopPropagation();
        var i = ORDER.indexOf(window.HUGO_VARIANT);
        var dir = parseInt(a.dataset.dir, 10) || 1;
        selectVariant(ORDER[(i + dir + ORDER.length) % ORDER.length]);
      });
    });
    var seg = document.getElementById('abSeg');
    if (seg) seg.addEventListener('click', function (e) {
      var b = e.target.closest('.ab-opt');
      if (b) selectVariant(b.dataset.v);
    });
    document.querySelectorAll('.ab-arrow').forEach(function (a) {
      a.addEventListener('click', function () {
        var i = ORDER.indexOf(window.HUGO_VARIANT);
        var dir = parseInt(a.dataset.dir, 10) || 1;
        selectVariant(ORDER[(i + dir + ORDER.length) % ORDER.length]);
      });
    });
  }

  function boot() {
    syncSeg();
    ensureBrainObserver();
    window.__applyVariant(window.HUGO_LANG || 'cs');
    if (typeof window.applyPreset === 'function') window.applyPreset(PRESET[window.HUGO_VARIANT]);
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
