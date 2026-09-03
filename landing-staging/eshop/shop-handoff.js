(function (root) {
  'use strict';

  var CART_IDS = ['pax_a920', 'belt_holster', 'terminal_case_extra'];
  var CASE_VARIANTS = ['red_impulse', 'mint_current', 'sage_calm', 'sun_spark', 'lagoon_breeze', 'electric_blue'];
  var DELIVERY_METHODS = ['dpd', 'pickup'];

  function deliveryMethod(value) {
    return DELIVERY_METHODS.includes(value) ? value : 'dpd';
  }

  function serializeCartHandoff(lines, caseVariant, extraCaseVariant, selectedDeliveryMethod) {
    var allowedVariant = CASE_VARIANTS.includes(caseVariant) ? caseVariant : 'sun_spark';
    var allowedExtraVariant = CASE_VARIANTS.includes(extraCaseVariant) ? extraCaseVariant : allowedVariant;
    var seen = {};
    var safeCart = (Array.isArray(lines) ? lines : []).filter(function (line) {
      if (!line || !CART_IDS.includes(line.id) || seen[line.id]) return false;
      seen[line.id] = true;
      return true;
    }).map(function (line) {
      var qty = Number.isInteger(line.qty) && line.qty >= 1 && line.qty <= 99 ? line.qty : 1;
      return { id: line.id, qty: qty };
    });
    return JSON.stringify({
      version: 1,
      caseVariant: allowedVariant,
      extraCaseVariant: allowedExtraVariant,
      deliveryMethod: deliveryMethod(selectedDeliveryMethod),
      cart: safeCart
    });
  }

  function parseCartHandoff(value) {
    if (typeof value !== 'string' || value.length === 0 || value.length > 1000) return null;
    try {
      var parsed = JSON.parse(value);
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.cart) || parsed.cart.length > 3) return null;
      var seen = {};
      var safeCart = [];
      for (var i = 0; i < parsed.cart.length; i += 1) {
        var line = parsed.cart[i];
        if (!line || !CART_IDS.includes(line.id) || seen[line.id]) return null;
        var qty = line.qty === undefined ? 1 : line.qty;
        if (!Number.isInteger(qty) || qty < 1 || qty > 99) return null;
        seen[line.id] = true;
        safeCart.push({ id: line.id, qty: qty });
      }
      var caseVariant = CASE_VARIANTS.includes(parsed.caseVariant) ? parsed.caseVariant : 'sun_spark';
      var extraCaseVariant = CASE_VARIANTS.includes(parsed.extraCaseVariant) ? parsed.extraCaseVariant : caseVariant;
      return {
        caseVariant: caseVariant,
        extraCaseVariant: extraCaseVariant,
        deliveryMethod: deliveryMethod(parsed.deliveryMethod),
        cart: safeCart
      };
    } catch (_error) {
      return null;
    }
  }

  var api = {
    deliveryMethod: deliveryMethod,
    parseCartHandoff: parseCartHandoff,
    serializeCartHandoff: serializeCartHandoff
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HugoEshopHandoff = api;
}(typeof window !== 'undefined' ? window : globalThis));
