(function () {
  'use strict';
  // The cart: what it holds, how it is restored/persisted, and how it renders (lines,
  // delivery choice, meal-voucher question, checkout button state).
  var E = window.HugoEshop;
  var S = E.state;
  var data = E.data;
  var rules = E.rules;
  var products = E.products;
  var handoff = E.handoff;
  var t = E.t;
  var money = E.money;
  var caseVariants = data.caseVariants;
  var cartIsOrderable = rules.cartIsOrderable;
  var cartHasPhysicalItem = rules.cartHasPhysicalItem;
  var cartNeedsMealVoucherChoice = rules.cartNeedsMealVoucherChoice;

  var bagButton = document.getElementById('bag-button');
  var cartPanel = document.getElementById('cart');
  var cartLines = document.getElementById('cart-lines');
  var cartItemsStep = document.getElementById('cart-items-step');
  var cartReviewStep = document.getElementById('cart-review-step');
  var cartBack = document.getElementById('cart-back');
  var deliveryFieldset = document.querySelector('.delivery-choice');
  var dpdShipsWithin = document.getElementById('dpd-ships-within');
  var mealVoucherFieldset = document.querySelector('.meal-voucher-choice');
  var mealVoucherProviders = document.querySelector('.meal-voucher-providers');
  var cartTitle = cartPanel.querySelector('.cart-head h2'), reviewButton = document.getElementById('review-button');
  var scrim = document.getElementById('scrim');
  var terms = document.getElementById('terms');
  var checkoutButton = document.getElementById('checkout-button');

  function selectedMealVoucherPreference() {
    var answer = document.querySelector('[name="meal-voucher-acceptance"]:checked');
    if (!answer) return null;
    var accepts = answer.value === 'yes';
    return {
      accepts: accepts,
      providers: accepts
        ? Array.from(document.querySelectorAll('[name="meal-voucher-provider"]:checked')).map(function (input) { return input.value; })
        : []
    };
  }

  function renderMealVoucherChoice() {
    if (!mealVoucherFieldset) return;
    mealVoucherFieldset.hidden = !cartNeedsMealVoucherChoice(S.cart);
    if (mealVoucherProviders) {
      mealVoucherProviders.hidden = selectedMealVoucherPreference()?.accepts !== true;
    }
  }

  // A 0 Kč line that rides along with its terminal / tablet: never added, removed,
  // persisted or restored on its own.
  function isIncludedLine(id) {
    return id === 'terminal_case' || rules.isStandId(id);
  }

  function restoreCart() {
    try {
      var params = new URLSearchParams(location.search);
      var incomingHandoff = handoff.parseCartHandoff(params.get('cart'));
      var stored = incomingHandoff || JSON.parse(localStorage.getItem(data.CART_STORAGE_KEY) || 'null');
      if (!stored || !Array.isArray(stored.cart)) return;
      if (incomingHandoff) {
        params.delete('cart');
        history.replaceState({}, '', location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash);
      }
      // Stock is not known yet; `applyCaseStock` moves a restocking colour to the default
      // as soon as the catalogue answers.
      var restoredVariant = E.isCaseVariant(stored.caseVariant) ? stored.caseVariant : data.DEFAULT_CASE_VARIANT;
      S.selectedTerminalCaseVariant = restoredVariant;
      S.selectedExtraCaseVariant = E.isCaseVariant(stored.extraCaseVariant) ? stored.extraCaseVariant : restoredVariant;
      S.selectedDeliveryMethod = handoff.deliveryMethod(stored.deliveryMethod);
      // CART_IDS never lists an included line, so a stored stand or case cannot come back
      // on its own; `syncIncludedLines` re-derives them from the restored terminal / tablet.
      S.cart = stored.cart.filter(function (line) { return line && handoff.CART_IDS.includes(line.id); })
        .map(function (line) { return { id: line.id, key: line.id, qty: rules.clampQuantity(line.qty || 1), variant: null, variantName: null }; });
      syncIncludedLines();
    } catch (_error) {}
  }

  function persistCart() {
    try {
      localStorage.setItem(data.CART_STORAGE_KEY, JSON.stringify({
        caseVariant: S.selectedTerminalCaseVariant,
        extraCaseVariant: S.selectedExtraCaseVariant,
        deliveryMethod: S.selectedDeliveryMethod,
        cart: S.cart.filter(function (line) { return !isIncludedLine(line.id); }).map(function (line) { return { id: line.id, qty: line.qty || 1 }; }),
      }));
    } catch (_error) {}
  }

  function openCart() {
    showCartStep('items');
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    bagButton.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
  }

  function showCartStep(step) {
    var reviewing = step === 'review' && cartIsOrderable(S.cart, products);
    S.cartStep = reviewing ? 'review' : 'items';
    cartItemsStep.hidden = reviewing;
    cartReviewStep.hidden = !reviewing;
    cartBack.hidden = !reviewing;
    cartTitle.textContent = t(reviewing ? 'reviewTitle' : 'cartTitle');
  }

  function closeCart() {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    bagButton.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
  }

  // HUGO-2182/2274 — whole 2-hour packages, 1–99 (the same integer rule the server applies to
  // every line); the stepper reads the hours of work, packages × 2.
  function hoursStepper(line) {
    var step = function (delta, label, disabled) {
      return '<button type="button" data-qty-step="' + delta + '" data-qty-key="' + line.key + '" aria-label="' + t(label) + '"' + (disabled ? ' disabled' : '') + '>' + (delta < 0 ? '−' : '+') + '</button>';
    };
    return '<div class="qty-stepper" role="group" aria-label="' + t('hoursLabel') + '">'
      + step(-1, 'removeHour', line.qty <= 1)
      + '<output aria-live="polite">' + t('hoursValue').replace('{hours}', String(line.qty * data.HOURS_PER_PACKAGE)) + '</output>'
      + step(1, 'addHour', line.qty >= data.MAX_QUANTITY) + '</div>';
  }

  function cartLineHtml(line) {
    var p = products[line.id];
    // Name and price text (every amount the server catalogue's) — rules.cartLineText.
    var text = rules.cartLineText(line, products, t, window.HUGO_LANG);
    var name = text.name;
    var variant = line.variantName ? '<small>' + line.variantName + '</small>' : '';
    var remove = isIncludedLine(line.id) ? '' : '<button type="button" data-remove="' + line.key + '" aria-label="' + t('remove') + ' ' + name + '">×</button>';
    var selectedImage = caseVariants.find(function (item) { return item.id === line.variant; });
    var image = selectedImage && ['terminal_case', 'terminal_case_extra'].includes(line.id)
      ? data.ASSET_ROOT + selectedImage.image
      : p.image;
    var stepper = rules.isHourly(line.id) ? hoursStepper(line) : '';
    return '<div class="cart-line' + (isIncludedLine(line.id) ? ' is-included' : '') + '"><img src="' + image + '" alt=""><div><h3>' + name + '</h3>' + variant + '<p>' + text.price + '</p>' + stepper + '</div>' + remove + '</div>';
  }

  function renderCart() {
    persistCart();
    document.getElementById('bag-count').textContent = String(rules.cartItemCount(S.cart));
    if (!S.cart.length) {
      showCartStep('items');
      cartLines.innerHTML = '<p class="empty">' + t('empty') + '</p>';
    } else {
      cartLines.innerHTML = S.cart.map(cartLineHtml).join('');
    }
    // HUGO-1694 — nothing to deliver, nothing to ask: a cart holding only non-physical
    // lines (e.g. android_tap_to_pay, an installation) never shows the delivery-method choice.
    if (deliveryFieldset) deliveryFieldset.hidden = !cartHasPhysicalItem(S.cart);
    // HUGO-2165 — the 2-business-day promise sits inside that fieldset and only applies to DPD.
    if (dpdShipsWithin) dpdShipsWithin.hidden = S.selectedDeliveryMethod !== 'dpd';
    renderMealVoucherChoice();
    updateAccountLinks();
    updateCheckoutState();
  }

  function renderDelivery() {
    document.querySelectorAll('[name="delivery-method"]').forEach(function (input) {
      var option = S.delivery[input.value];
      input.checked = input.value === S.selectedDeliveryMethod;
      input.disabled = option?.available !== true;
      var price = input.closest('label').querySelector('[data-delivery-price]');
      price.textContent = option?.available === true
        ? money(option.amountMinor, option.currency) + (input.value === 'dpd' ? ' ' + t('exclVat') : '')
        : t('unavailable');
    });
  }

  function updateAccountLinks() {
    var cartPath = '/shop';
    if (S.cart.length) {
      cartPath += '?eshop_cart=' + encodeURIComponent(handoff.serializeCartHandoff(S.cart, S.selectedTerminalCaseVariant, S.selectedExtraCaseVariant, S.selectedDeliveryMethod));
    }
    document.querySelectorAll('[data-account-link]').forEach(function (link) {
      link.href = E.adminBase() + '/login?start=1&next=' + encodeURIComponent(cartPath);
      if (E.isEmbedded()) link.hidden = true;
    });
  }

  function updateCheckoutState() {
    var casesInStock = S.cart.every(function (line) { return !line.variant || E.caseInStock(line.variant); });
    // HUGO-1694 — a cart with nothing physical in it needs no delivery choice, so its
    // availability never gates checkout (see also the hidden `.delivery-choice` fieldset
    // in renderCart).
    var physicalCart = cartHasPhysicalItem(S.cart);
    var mealVoucherReady = !cartNeedsMealVoucherChoice(S.cart)
      || rules.mealVoucherChoiceComplete(selectedMealVoucherPreference());
    reviewButton.disabled = !cartIsOrderable(S.cart, products) || !casesInStock;
    checkoutButton.disabled = !casesInStock || !S.checkoutEnabled || S.legal.status !== 'published' || !terms.checked || !mealVoucherReady || !cartIsOrderable(S.cart, products) || (physicalCart && S.delivery[S.selectedDeliveryMethod]?.available !== true);
  }

  function isPriced(id) {
    return rules.productIsOrderable(products, id);
  }

  function canAddProduct(id, previewVariant) {
    if (id === 'pax_a920' && !E.caseInStock(previewVariant || S.selectedTerminalCaseVariant)) return false;
    if (id === 'terminal_case_extra' && !E.caseInStock(previewVariant || S.selectedExtraCaseVariant)) return false;
    // HUGO-2182 — a tablet needs its stand priced as well (`productIsOrderable`).
    return !isIncludedLine(id) && rules.productIsOrderable(products, id);
  }

  function addProduct(id) {
    if (!canAddProduct(id)) return;
    var existing = S.cart.find(function (line) { return line.id === id; });
    if (existing && (id === 'terminal_case_extra' || rules.isHourly(id))) {
      existing.qty = rules.clampQuantity((existing.qty || 1) + 1);
    } else if (!existing) {
      var selected = caseVariants.find(function (variant) { return variant.id === S.selectedExtraCaseVariant; });
      S.cart.push({
        id: id,
        key: id,
        qty: 1,
        variant: id === 'terminal_case_extra' ? selected.id : null,
        variantName: id === 'terminal_case_extra' ? E.caseVariantName(selected) : null
      });
    }
    // The case line is re-derived only when the terminal itself is added, so the free case
    // keeps its place in the cart; stands always follow their tablet directly.
    if (id === 'pax_a920') syncCaseLine();
    S.cart = rules.withIncludedStands(S.cart);
    renderCart();
    openCart();
  }

  function syncCaseLine() {
    var includedVariant = caseVariants.find(function (item) { return item.id === S.selectedTerminalCaseVariant; });
    var extraVariant = caseVariants.find(function (item) { return item.id === S.selectedExtraCaseVariant; });
    S.cart.forEach(function (line) {
      if (line.id === 'terminal_case_extra') {
        line.variant = extraVariant.id;
        line.variantName = E.caseVariantName(extraVariant);
      }
    });
    if (!S.cart.some(function (line) { return line.id === 'pax_a920'; })) {
      S.cart = S.cart.filter(function (line) { return line.id !== 'terminal_case'; });
      return;
    }
    S.cart = S.cart.filter(function (line) { return line.id !== 'terminal_case'; });
    S.cart.push({ id: 'terminal_case', key: 'terminal_case', qty: S.cart.find(function (line) { return line.id === 'pax_a920'; }).qty || 1, variant: includedVariant.id, variantName: E.caseVariantName(includedVariant) });
  }

  // The terminal's case and every tablet's stand, re-derived from the lines they ride with.
  function syncIncludedLines() {
    syncCaseLine();
    S.cart = rules.withIncludedStands(S.cart);
  }

  function removeLine(key) {
    S.cart = S.cart.filter(function (line) { return line.key !== key; });
    syncIncludedLines();
    renderCart();
  }

  function stepQuantity(key, delta) {
    var line = S.cart.find(function (item) { return item.key === key; });
    if (!line || !rules.isHourly(line.id)) return;
    line.qty = rules.clampQuantity((line.qty || 1) + delta);
    renderCart();
  }

  E.selectedMealVoucherPreference = selectedMealVoucherPreference;
  E.renderMealVoucherChoice = renderMealVoucherChoice;
  E.restoreCart = restoreCart;
  E.openCart = openCart;
  E.showCartStep = showCartStep;
  E.closeCart = closeCart;
  E.renderCart = renderCart;
  E.renderDelivery = renderDelivery;
  E.updateCheckoutState = updateCheckoutState;
  E.isPriced = isPriced;
  E.canAddProduct = canAddProduct;
  E.addProduct = addProduct;
  E.syncIncludedLines = syncIncludedLines;
  E.removeLine = removeLine;
  E.stepQuantity = stepQuantity;
}());
