// HUGO-2459 — prices of the two services on /jak-zacit/, read from the public e-shop
// catalogue at runtime (never written into the page: Stripe's price can change weekly).
(function () {
  'use strict';
  var nodes = document.querySelectorAll('[data-service-price]');
  if (!nodes.length) return;
  // Same host mapping as eshop/shop-rules.js apiBaseFor.
  function apiBaseFor(hostname) {
    if (hostname === 'hugopos.eu' || hostname === 'www.hugopos.eu') return 'https://api.hugopos.eu/api';
    if (hostname === 'staging.hugopos.eu') return 'https://staging.api.hugopos.eu/api';
    return 'http://localhost:4471/api';
  }
  function formatMoney(minor, currency, lang) {
    var fraction = minor % 100 !== 0;
    return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'cs-CZ', {
      style: 'currency', currency: (currency || 'czk').toUpperCase(),
      minimumFractionDigits: fraction ? 2 : 0, maximumFractionDigits: fraction ? 2 : 0
    }).format(minor / 100);
  }
  function hideAll() { nodes.forEach(function (node) { node.hidden = true; }); }
  var lang = document.documentElement.lang === 'en' ? 'en' : 'cs';
  fetch(apiBaseFor(location.hostname) + '/v1/public/eshop/catalogue')
    .then(function (response) { if (!response.ok) throw new Error('catalogue'); return response.json(); })
    .then(function (body) {
      var items = {};
      (body.products || []).forEach(function (item) { if (item && item.id) items[item.id] = item; });
      nodes.forEach(function (node) {
        var item = items[node.getAttribute('data-service-price')];
        if (!item || item.available !== true || !Number.isInteger(item.amountMinor)) { node.hidden = true; return; }
        node.textContent = formatMoney(item.amountMinor, item.currency, lang) + ' ' + node.getAttribute('data-unit') + ' · ' + node.getAttribute('data-note');
      });
    })
    .catch(hideAll);
}());
