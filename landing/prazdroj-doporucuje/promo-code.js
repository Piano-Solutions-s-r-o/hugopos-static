// HUGO-2486: PRAZDNINY2026 blocks on the Prazdroj page: copy button, hidden after the end.
// The end instant mirrors HOLIDAY_END_AT in API/src/services/fee_holiday_campaign.js (keep them in sync by hand).
(function () {
  'use strict';
  var END = Date.parse('2026-12-31T23:00:00Z');

  function init(doc, now) {
    doc.querySelectorAll('.promo').forEach(function (block) {
      if (now >= END) { block.hidden = true; return; }
      var btn = block.querySelector('.promo-copy');
      var code = block.querySelector('.promo-code');
      btn.addEventListener('click', function () {
        var label = btn.querySelector('.promo-copy-label');
        var done = function (ok) {
          if (!ok) doc.defaultView.getSelection().selectAllChildren(code);
          btn.setAttribute('data-state', ok ? 'copied' : 'selected');
          label.textContent = ok ? 'Zkopírováno' : 'Označeno, zkopírujte';
        };
        var cb = doc.defaultView.navigator.clipboard;
        if (!cb || !cb.writeText) return done(false);
        Promise.resolve().then(function () { return cb.writeText(code.textContent.trim()); })
          .then(function () { done(true); }, function () { done(false); });
      });
    });
  }

  if (typeof module === 'object' && module.exports) module.exports = { END: END, init: init };
  else init(document, Date.now());
})();
