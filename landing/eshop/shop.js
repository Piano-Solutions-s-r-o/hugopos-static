(function () {
  'use strict';
  // The storefront's entry point. In Node it only re-exports the pure rules, so the rules
  // stay independently testable without booting a DOM (Web/tests/eshop_shop.test.js) and
  // the Admin cross-check can read NON_PHYSICAL_IDS from here. In the browser it is the last
  // deferred script: it wires the page (checkout, thank-you screen, events) and boots it.
  //
  // Modules, in load order: shop-i18n.js, shop-handoff.js, shop-data.js (static catalogue),
  // shop-rules.js (pure rules), shop-core.js (namespace + state), shop-cart.js,
  // shop-catalogue.js, then this file.
  if (typeof module !== 'undefined' && module.exports) {
    var rules = require('./shop-rules');
    var handoffModule = require('./shop-handoff');
    module.exports = {
      cartHasPhysicalItem: rules.cartHasPhysicalItem,
      cartIsOrderable: rules.cartIsOrderable,
      cartItemCount: rules.cartItemCount,
      cartNeedsMealVoucherChoice: rules.cartNeedsMealVoucherChoice,
      checkoutItems: rules.checkoutItems,
      gallerySourcesFor: rules.gallerySourcesFor,
      isZeroPriced: rules.isZeroPriced,
      mealVoucherChoiceComplete: rules.mealVoucherChoiceComplete,
      NON_PHYSICAL_IDS: require('./shop-data').NON_PHYSICAL_IDS,
      parseCartHandoff: handoffModule.parseCartHandoff,
      serializeCartHandoff: handoffModule.serializeCartHandoff,
      successShippingKey: rules.successShippingKey
    };
    return;
  }

  var E = window.HugoEshop;
  var S = E.state;
  var t = E.t;
  var cartHasPhysicalItem = E.rules.cartHasPhysicalItem;
  var cartNeedsMealVoucherChoice = E.rules.cartNeedsMealVoucherChoice;
  var successShippingKey = E.rules.successShippingKey;

  var bagButton = document.getElementById('bag-button');
  var cartBack = document.getElementById('cart-back');
  var reviewButton = document.getElementById('review-button');
  var scrim = document.getElementById('scrim');
  var terms = document.getElementById('terms');
  var checkoutButton = document.getElementById('checkout-button');
  var checkoutNote = document.getElementById('checkout-note');
  var dialog = document.getElementById('product-dialog');
  var dialogContent = document.getElementById('dialog-content');

  function startCheckout() {
    if (checkoutButton.disabled) return;
    checkoutButton.disabled = true;
    checkoutButton.textContent = t('opening');
    // HUGO-1694 — a non-physical-only cart has nothing to deliver, so it never sends a
    // delivery method (mirrors the Admin shop and the server's own rule).
    // HUGO-2182 — `checkoutItems` sends each tablet's stand line at the tablet's quantity.
    var checkoutPayload = { items: E.rules.checkoutItems(S.cart), termsAccepted: true, termsVersion: S.legal.version, locale: window.HUGO_LANG };
    if (cartHasPhysicalItem(S.cart)) checkoutPayload.deliveryMethod = S.selectedDeliveryMethod;
    if (cartNeedsMealVoucherChoice(S.cart)) checkoutPayload.mealVouchers = E.selectedMealVoucherPreference();
    var idempotencyKey = crypto.randomUUID();
    if (E.isEmbedded()) {
      window.parent.postMessage({ type: 'hugo:eshop-checkout', payload: checkoutPayload, idempotencyKey: idempotencyKey }, E.adminBase());
      return;
    }
    fetch(E.apiBase() + '/v1/public/eshop/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(checkoutPayload)
    }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(t(body?.error?.code === 'case_variant_out_of_stock' ? 'restockingCheckout' : 'checkoutError')); return body; }); })
      .then(function (body) { location.assign(body.url); })
      .catch(function (error) { checkoutNote.hidden = false; checkoutNote.textContent = error.message; checkoutButton.textContent = t('checkout'); E.updateCheckoutState(); });
  }

  function showSuccessIfNeeded() {
    var params = new URLSearchParams(location.search);
    var session = params.get('session_id');
    if (!session) return;
    fetch(E.apiBase() + '/v1/public/eshop/sessions/' + encodeURIComponent(session))
      .then(function (response) { if (!response.ok) throw new Error('status'); return response.json(); })
      .then(function (body) {
        // HUGO-1694 — a cart that settles at 0 Kč (e.g. android_tap_to_pay alone)
        // may complete as paymentStatus "no_payment_required" or "paid". The API's
        // `settled` field is the ONE canonical answer to "is this order done" — never
        // re-derive it here from paymentStatus.
        if (body.settled !== true) return;
        S.cart = [];
        E.renderCart();
        try { localStorage.removeItem(E.data.CART_STORAGE_KEY); } catch (_error) {}
        var success = document.getElementById('success');
        var linked = params.get('account') === 'linked';
        var continueLink = document.getElementById('continue-account');
        if (linked) {
          success.querySelector('h2').textContent = t('successLinkedTitle');
          document.getElementById('success-text').textContent = t('successLinkedText');
          continueLink.textContent = t('viewOrders');
          continueLink.href = E.adminBase() + '/orders';
        } else {
          continueLink.href = E.adminBase() + '/login?start=1&eshop_session=' + encodeURIComponent(session);
        }
        var shipping = document.getElementById('success-shipping');
        var shippingKey = successShippingKey(body.deliveryMethod, linked);
        shipping.hidden = shippingKey === null;
        if (shippingKey) shipping.textContent = t(shippingKey);
        success.hidden = false;
      }).catch(function () {});
  }

  document.addEventListener('click', function (event) {
    var add = event.target.closest('[data-add],[data-dialog-add]');
    if (add) E.addProduct(add.dataset.add || add.dataset.dialogAdd);
    var remove = event.target.closest('[data-remove]');
    if (remove) E.removeLine(remove.dataset.remove);
    var step = event.target.closest('[data-qty-step]');
    if (step && !step.disabled) E.stepQuantity(step.dataset.qtyKey, Number(step.dataset.qtyStep));
    var productCard = event.target.closest('[data-product]');
    if (event.target.closest('.product-open') && productCard) E.openProduct(productCard.dataset.product);
    var guide = event.target.closest('[data-open-product]');
    if (guide) E.openProduct(guide.dataset.openProduct);
    var dialogAdd = event.target.closest('[data-dialog-add]');
    if (dialogAdd) dialog.close();
    if (event.target.closest('[data-add-case]')) {
      var preview = dialogContent.querySelector('[data-variant="' + (dialogContent.dataset.previewVariant || S.selectedExtraCaseVariant) + '"]');
      // HUGO-1662 — never add a previewed colour that is restocking; select it instead so
      // the note explains why nothing was added.
      if (!preview) return;
      if (!E.caseInStock(preview.dataset.variant)) { E.selectSwatch(preview); return; }
      E.selectSwatch(preview);
      E.addProduct('terminal_case_extra');
      dialog.close();
    }
    var swatch = event.target.closest('.swatch');
    if (swatch) E.selectSwatch(swatch);
  });
  document.addEventListener('mouseover', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) E.previewSwatch(swatch); });
  document.addEventListener('mouseout', function (event) {
    var group = event.target.closest('.swatches');
    if (!group || group.contains(event.relatedTarget)) return;
    E.previewSwatch(group.querySelector('.swatch.is-active'));
  });
  document.addEventListener('focusin', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) E.previewSwatch(swatch); });
  bagButton.addEventListener('click', E.openCart);
  reviewButton.addEventListener('click', function () { E.showCartStep('review'); });
  cartBack.addEventListener('click', function () { E.showCartStep('items'); });
  document.getElementById('cart-close').addEventListener('click', E.closeCart);
  scrim.addEventListener('click', E.closeCart);
  terms.addEventListener('change', E.updateCheckoutState);
  document.querySelectorAll('[name="meal-voucher-acceptance"], [name="meal-voucher-provider"]').forEach(function (input) {
    input.addEventListener('change', function () {
      E.renderMealVoucherChoice();
      E.updateCheckoutState();
    });
  });
  document.querySelectorAll('[name="delivery-method"]').forEach(function (input) {
    input.addEventListener('change', function () {
      S.selectedDeliveryMethod = E.handoff.deliveryMethod(input.value);
      E.renderDelivery();
      E.renderCart();
    });
  });
  checkoutButton.addEventListener('click', startCheckout);
  document.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  var siteNav = document.getElementById('nav');
  function updateSiteNav() { siteNav?.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', updateSiteNav, { passive: true });
  updateSiteNav();
  window.addEventListener('message', function (event) {
    if (event.origin !== E.adminBase() || event.data?.type !== 'hugo:eshop-checkout-error') return;
    checkoutNote.hidden = false;
    checkoutNote.textContent = t('checkoutError');
    checkoutButton.textContent = t('checkout');
    E.updateCheckoutState();
  });
  document.addEventListener('hugo:language', function () {
    document.querySelectorAll('[data-case-scope] .swatch').forEach(function (node) {
      var variant = E.data.caseVariants.find(function (item) { return item.id === node.dataset.variant; });
      if (variant) node.setAttribute('aria-label', E.caseVariantName(variant));
    });
    E.syncIncludedLines();
    E.renderCataloguePrices();
    E.renderDelivery();
    E.renderCart();
    E.showCartStep(S.cartStep);
    if (dialog.open) dialog.close();
    E.refreshActiveSwatches();
  });
  E.restoreCart();
  E.markRestockingSwatches();
  E.refreshActiveSwatches();
  E.loadCatalogue();
  E.renderCart();
  showSuccessIfNeeded();
})();
