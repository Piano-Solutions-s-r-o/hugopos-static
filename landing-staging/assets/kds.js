// /kuchynsky-displej (HUGO-2422, HUGO-2520): feeds the ticket strip up out of the printer in the
// "5 km" section as the page scrolls, SPEED times faster than the page moves, until the strip
// runs out; the section's top edge clips it. Lengthens the strip with older tickets first, then
// sets --len and --p (0..1) on .kd-unroll; CSS does the rest. Without this script, or with
// reduced motion, --p keeps its CSS default of 1 (fully fed).
(function () {
  var el = document.querySelector('.kd-unroll');
  var print = el && el.querySelector('.kd-strip-in');
  if (!print || !print.firstElementChild || !window.matchMedia ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var SPEED = 3;      // paper fed per pixel scrolled
  var LENGTH = 3000;  // px of print to feed in all

  // Older tickets at the free end: copies of the printed ones, numbered down from the oldest.
  var tickets = Array.prototype.slice.call(print.children);
  var head = tickets[0].querySelector('b');
  var oldest = parseInt(((head && head.textContent.match(/#(\d+)/)) || [0, '411'])[1], 10);
  function height() {
    var h = 0;
    Array.prototype.forEach.call(print.children, function (c) { h += c.offsetHeight; });
    return h;
  }
  var tall = height();
  for (var i = 0; tall < LENGTH && i < 60; i++) {
    var c = tickets[tickets.length - 1 - (i % tickets.length)].cloneNode(true);
    var b = c.querySelector('b');
    if (b) b.textContent = b.textContent.replace(/#\d+/, '#' + String(oldest - 1 - i).padStart(4, '0'));
    print.insertBefore(c, print.firstElementChild);
    tall += c.offsetHeight;
  }

  var len = 0, ticking = false;
  function measure() {
    len = height() + 4;
    el.style.setProperty('--len', len + 'px');
  }
  function update() {
    ticking = false;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // Feeding starts once the printer (the frame's bottom) is fully in view.
    var fed = Math.max(0, Math.min(len, (vh * 0.95 - r.bottom) * SPEED));
    el.style.setProperty('--p', (fed / len).toFixed(4));
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
})();
