(function () {
  'use strict';
  // The page's shared namespace and state. Every storefront module (shop-cart.js,
  // shop-catalogue.js, shop.js) reads and writes the same `HugoEshop.state`, and calls the
  // others through `HugoEshop.<fn>` so the load order of the deferred scripts is the only
  // coupling. Browser only: the pure rules live in shop-rules.js.
  var data = window.HugoEshopData;
  var rules = window.HugoEshopRules;
  var E = window.HugoEshop = {
    data: data,
    rules: rules,
    handoff: window.HugoEshopHandoff,
    products: data.products,
    state: {
      cart: [],
      // `caseVariants[].inStock` from the catalogue, by colour id (HUGO-1662).
      caseStock: {},
      selectedTerminalCaseVariant: data.DEFAULT_CASE_VARIANT,
      selectedExtraCaseVariant: data.DEFAULT_CASE_VARIANT,
      selectedDeliveryMethod: 'dpd',
      cartStep: 'items',
      delivery: {},
      checkoutEnabled: false,
      legal: { version: '2026-09-15', status: 'published' }
    }
  };

  E.caseInStock = function (id) { return E.state.caseStock[id] !== false; };
  E.isCaseVariant = function (id) { return data.caseVariants.some(function (item) { return item.id === id; }); };
  E.t = function (key) { return typeof window.shopT === 'function' ? window.shopT(key) : key; };
  E.caseVariantName = function (variant) { return variant.names[window.HUGO_LANG === 'en' ? 'en' : 'cs']; };
  // A product's copy in the current language (shop-i18n-products.js, by id): kicker,
  // title, description, lead, specs, included, imageLabel, imageAlt. Keyed by id, never by
  // position, so adding or reordering a card cannot shift another card's copy (HUGO-1583).
  E.copy = function (id) {
    var all = E.t('products');
    return (all && typeof all === 'object' && all[id]) || {};
  };
  E.productName = function (id) { return E.copy(id).title || id; };
  E.apiBase = function () { return rules.apiBaseFor(location.hostname); };
  E.adminBase = function () { return rules.adminBaseFor(location.hostname); };
  E.money = function (minor, currency) { return rules.formatMoney(minor, currency, window.HUGO_LANG); };
  E.isEmbedded = function () {
    return window.self !== window.top && new URLSearchParams(location.search).get('embedded') === '1';
  };
}());
