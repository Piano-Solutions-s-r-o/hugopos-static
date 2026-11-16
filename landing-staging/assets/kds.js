// /kuchynsky-displej (HUGO-2422): unrolls the thermal roll in the "5 km" section while it scrolls
// into view. Sets --p (0..1) on .kd-unroll; CSS does the rest. Without this script, or with
// reduced motion, --p keeps its CSS default of 1 (fully unrolled).
(function () {
  var el = document.querySelector('.kd-unroll');
  if (!el || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  function update() {
    ticking = false;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // The roll waits until its top is 70 % down the viewport (reel well in view), then
    // unrolls until its top reaches 15 % from the top.
    var p = (vh * 0.7 - r.top) / (vh * 0.55);
    p = Math.max(0, Math.min(1, p));
    el.style.setProperty('--p', p.toFixed(3));
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
