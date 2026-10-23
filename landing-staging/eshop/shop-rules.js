(function (root) {
  'use strict';
  // The storefront's pure rules: no DOM, no state, so each is testable on its own
  // (Web/tests/eshop_shop.test.js) and the page modules only wire them to the page.
  var data = typeof module !== 'undefined' && module.exports
    ? require('./shop-data')
    : root.HugoEshopData;

  function cartIsOrderable(lines, catalogue) {
    return lines.length > 0 && lines.every(function (line) {
      var product = catalogue[line.id];
      return product && product.available === true && Number.isInteger(product.price);
    });
  }

  function gallerySourcesFor(product, caseKind, selected) {
    return caseKind ? [data.ASSET_ROOT + selected.image].concat(product.gallery.slice(1)) : product.gallery;
  }
  // Single source of truth for "is this catalogue-priced product free": both the
  // catalogue card and the cart line key their free-label rendering on this, never on
  // a product id, so a new 0 Kč SKU (e.g. android_tap_to_pay) needs no per-id branch.
  function isZeroPriced(product) {
    return Boolean(product) && product.price === 0;
  }
  function cartHasPhysicalItem(lines) {
    return (lines || []).some(function (line) { return !data.NON_PHYSICAL_IDS.includes(line.id); });
  }
  function cartNeedsMealVoucherChoice(lines) {
    return (lines || []).some(function (line) { return data.MEAL_VOUCHER_PRODUCT_IDS.includes(line.id); });
  }
  function mealVoucherChoiceComplete(preference) {
    return Boolean(preference)
      && typeof preference.accepts === 'boolean'
      && (!preference.accepts || preference.providers.length > 0);
  }
  // Which "when does it ship" sentence the thank-you page shows (HUGO-2165). Only a DPD
  // order has a tracking number to promise; the status endpoint's `deliveryMethod` is the
  // one answer, never re-derived from the cart.
  function successShippingKey(deliveryMethod, linked) {
    if (deliveryMethod !== 'dpd') return null;
    return linked ? 'successShipsLinked' : 'successShipsGuest';
  }

  // GET /v1/public/eshop/catalogue → the product map: availability and every amount come
  // only from the server; an id the storefront does not know is ignored, and anything but
  // `available: true` leaves the product unavailable.
  function applyServerCatalogue(catalogue, items) {
    (items || []).forEach(function (item) {
      if (!item || !catalogue[item.id]) return;
      catalogue[item.id].available = item.available === true;
      catalogue[item.id].price = item.amountMinor;
      catalogue[item.id].currency = item.currency;
    });
    return catalogue;
  }

  // A product is orderable only while the server prices it AND the 0 Kč line it brings
  // along (`includes`: the terminal's case, a tablet's stand) is priced too — the server
  // adds that line to the order, so selling the product without it would fail at checkout.
  function productIsOrderable(catalogue, id) {
    var product = catalogue[id];
    if (!product || product.available !== true) return false;
    return !product.includes || (catalogue[product.includes] || {}).available === true;
  }

  // HUGO-2182 — a tablet's stand: the 0 Kč SKU `<tablet>_stand` that rides along at the
  // tablet's quantity (the server's `stand_quantity_mismatch` rule). Never orderable alone.
  // The static product entry for an id, by own property only (the HUGO-2099 rule): an id
  // such as "constructor" must not resolve to an inherited member.
  function productConfig(id) {
    return Object.prototype.hasOwnProperty.call(data.products, id) ? data.products[id] : {};
  }
  function standFor(id) {
    var included = productConfig(id).includes;
    return included && productConfig(included).includedWith === id ? included : null;
  }
  function isStandId(id) {
    return Boolean(productConfig(id).includedWith);
  }

  // The ONE answer to "which stand lines does this cart carry": every stand line is dropped
  // and re-derived from its tablet, directly after it, at the tablet's quantity. The cart
  // display and the checkout payload both read it, so a stand can never be sent on its own,
  // with a stale quantity, or twice.
  function withIncludedStands(lines) {
    var result = [];
    (lines || []).forEach(function (line) {
      if (!line || isStandId(line.id)) return;
      result.push(line);
      var standId = standFor(line.id);
      if (standId) result.push({ id: standId, key: standId, qty: line.qty || 1, variant: null, variantName: null });
    });
    return result;
  }

  // Ids + quantities (+ the case colour) only — the server prices every line (money SSOT).
  function checkoutItems(lines) {
    return withIncludedStands(lines).map(function (line) {
      return { id: line.id, qty: line.qty || 1, variant: line.variant || undefined };
    });
  }

  // HUGO-2182 — installation is sold in whole hours: the line's quantity IS the hours.
  function isHourly(id) {
    return productConfig(id).unit === 'hour';
  }
  function clampQuantity(qty) {
    return Number.isInteger(qty) ? Math.min(data.MAX_QUANTITY, Math.max(1, qty)) : 1;
  }
  // The bag badge counts things, so a 3-hour installation is one item, not three.
  function cartItemCount(lines) {
    return (lines || []).reduce(function (sum, line) { return sum + (isHourly(line.id) ? 1 : (line.qty || 1)); }, 0);
  }

  // "3 900 Kč / hod" — the amount of a product sold per hour. `t` is the page translator.
  function perHour(t, amount) {
    return t('perHour').replace('{amount}', amount);
  }

  // A catalogue card's price, as HTML. Every amount is the server catalogue's; a product
  // that cannot be bought shows no amount at all (HUGO-2182: never a client literal).
  function cardPriceHtml(id, catalogue, t, lang) {
    if (id === 'terminal_case') {
      var extra = catalogue.terminal_case_extra || {};
      return extra.available
        ? formatMoney(extra.price, extra.currency, lang) + '<small>' + t('priceNote') + '</small>'
        : t('unavailable');
    }
    var product = catalogue[id];
    // Never an amount for something that cannot be bought: unpriced by the server, or its
    // 0 Kč companion (the terminal's case, a tablet's stand) is unpriced.
    if (!productIsOrderable(catalogue, id) || !Number.isInteger(product.price)) return t('unavailable');
    // Keyed on the resolved price, never the product id: any product the catalogue
    // prices at 0 gets the localized "free" label instead of `money(0)`.
    if (isZeroPriced(product)) return t('free') + '<small>' + t('freeFeatureNote') + '</small>';
    var amount = formatMoney(product.price, product.currency, lang);
    return (isHourly(id) ? perHour(t, amount) : amount) + '<small>' + t('priceNote') + '</small>';
  }

  function cartLineName(line, product, t) {
    if (line.id === 'terminal_case') return t('freeCase');
    if (line.id === 'terminal_case_extra') return t('extraCaseLabel');
    if (product.includedWith) return t(product.label);
    var copy = t('products');
    return (copy && copy[line.id] && copy[line.id].title) || line.id;
  }

  function cartLinePrice(line, product, t, lang) {
    if (!product.available || !Number.isInteger(product.price)) return t('unavailable');
    if (line.id === 'terminal_case') return t('freeIncluded');
    var money = function (minor) { return formatMoney(minor, product.currency, lang); };
    var times = line.qty > 1 ? line.qty + ' × ' : '';
    // A tablet's stand: the 0 Kč the server will put on the invoice, at the tablet's qty.
    if (product.includedWith) return times + money(product.price);
    if (isZeroPriced(product)) return t('free');
    if (isHourly(line.id)) {
      // Hours × the hourly rate, never a total the client computes (Stripe owns the charge;
      // the Admin shop shows the same).
      return t('hoursLine')
        .replace('{hours}', String(line.qty))
        .replace('{rate}', perHour(t, money(product.price))) + ' ' + t('exclVat');
    }
    return times + money(product.price) + ' ' + t('exclVat');
  }

  // One cart line's text: its name and its price column.
  function cartLineText(line, catalogue, t, lang) {
    var product = catalogue[line.id] || {};
    return { name: cartLineName(line, product, t), price: cartLinePrice(line, product, t, lang) };
  }

  function apiBaseFor(hostname) {
    if (hostname === 'hugopos.eu' || hostname === 'www.hugopos.eu') return 'https://api.hugopos.eu/api';
    if (hostname === 'staging.hugopos.eu') return 'https://staging.api.hugopos.eu/api';
    return 'http://localhost:4471/api';
  }

  function adminBaseFor(hostname) {
    if (hostname === 'staging.hugopos.eu') return 'https://staging.admin.hugopos.eu';
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://' + hostname + ':4470';
    return 'https://admin.hugopos.eu';
  }

  function formatMoney(minor, currency, lang) {
    var hasMinorFraction = minor % 100 !== 0;
    return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'cs-CZ', {
      style: 'currency', currency: (currency || 'czk').toUpperCase(),
      minimumFractionDigits: hasMinorFraction ? 2 : 0,
      maximumFractionDigits: hasMinorFraction ? 2 : 0
    }).format(minor / 100);
  }

  var api = {
    adminBaseFor: adminBaseFor,
    apiBaseFor: apiBaseFor,
    applyServerCatalogue: applyServerCatalogue,
    cardPriceHtml: cardPriceHtml,
    cartHasPhysicalItem: cartHasPhysicalItem,
    cartIsOrderable: cartIsOrderable,
    cartItemCount: cartItemCount,
    cartLineText: cartLineText,
    cartNeedsMealVoucherChoice: cartNeedsMealVoucherChoice,
    checkoutItems: checkoutItems,
    clampQuantity: clampQuantity,
    formatMoney: formatMoney,
    gallerySourcesFor: gallerySourcesFor,
    isHourly: isHourly,
    isStandId: isStandId,
    isZeroPriced: isZeroPriced,
    mealVoucherChoiceComplete: mealVoucherChoiceComplete,
    perHour: perHour,
    productIsOrderable: productIsOrderable,
    standFor: standFor,
    successShippingKey: successShippingKey,
    withIncludedStands: withIncludedStands
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HugoEshopRules = api;
}(typeof window !== 'undefined' ? window : globalThis));
