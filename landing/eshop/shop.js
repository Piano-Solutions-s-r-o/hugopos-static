(function () {
  'use strict';
  var TERMINAL_IMAGE = '../assets/eshop/terminal-hugo-yellow.png';
  var ASSET_ROOT = '../assets/eshop/';
  var caseVariants = [
    { id: 'red_impulse', color: '#d93645', image: 'case-red-impulse.jpg', names: { cs: 'Rudý impuls', en: 'Red Impulse' } },
    { id: 'mint_current', color: '#16b89d', image: 'case-mint-current.jpg', names: { cs: 'Mátový proud', en: 'Mint Current' } },
    { id: 'sage_calm', color: '#58ad63', image: 'case-sage-calm.jpg', names: { cs: 'Šalvějový klid', en: 'Sage Calm' } },
    { id: 'sun_spark', color: '#f2ca28', image: 'case-sun-spark.jpg', names: { cs: 'Luční med', en: 'Meadow Honey' } },
    { id: 'lagoon_breeze', color: '#22a9cf', image: 'case-lagoon-breeze.jpg', names: { cs: 'Laguna', en: 'Lagoon' } },
    { id: 'electric_blue', color: '#315f91', image: 'case-electric-blue.jpg', names: { cs: 'Hluboký oceán', en: 'Deep Ocean' } }
  ];
  var products = {
    pax_a920: {
      id: 'pax_a920', name: 'Terminál Hugo', kicker: 'All-in-one', image: TERMINAL_IMAGE,
      lead: 'Lehký terminál, na kterém běží pokladna, platby i účtenka. Bez druhé krabičky a bez kabelového zátiší.',
      gallery: [TERMINAL_IMAGE, ASSET_ROOT + 'terminal-in-use.jpg', ASSET_ROOT + 'terminal-hugo-views.jpg'],
      specs: [['Model', 'PAX A920 Pro Core'], ['Systém', 'Android 10 · čtyřjádrový ARM Cortex A53'], ['Displej', '5,5″ kapacitní dotykový'], ['Platby', 'Čip a PIN · bezkontaktní NFC · magnetický proužek'], ['Připojení', '4G · Wi-Fi · Bluetooth'], ['Výdrž a tisk', 'Baterie 5 150 mAh · vestavěná termální tiskárna']],
      available: false, price: null
    },
    belt_holster: {
      id: 'belt_holster', name: 'Kožený držák na pásek', kicker: 'Volné ruce', image: ASSET_ROOT + 'belt-holster-temp.jpg',
      lead: 'Měkká kožená kapsa drží terminál u těla, ale nechá ho vytáhnout jedním pohybem. Na plac, zahrádku i event.',
      gallery: [ASSET_ROOT + 'belt-holster-temp.jpg', ASSET_ROOT + 'terminal-cafe-temp.jpg'],
      specs: [['Materiál', 'Pravá kůže · finální specifikace bude doplněna'], ['Uchycení', 'Poutko na pásek'], ['Kompatibilita', 'Terminál Hugo']],
      available: false, price: null
    },
    terminal_case: {
      id: 'terminal_case', name: 'Další obal na terminál', kicker: 'Accessories', image: ASSET_ROOT + 'case-sun-spark.jpg',
      lead: 'Pružný ochranný obal dává terminálu jistější úchop a vaší obsluze vlastní barvu.',
      gallery: [ASSET_ROOT + 'case-sun-spark.jpg', ASSET_ROOT + 'case-red-impulse.jpg', ASSET_ROOT + 'case-electric-blue.jpg'],
      specs: [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Šest odstínů']],
      available: false, price: null
    },
    terminal_case_extra: {
      id: 'terminal_case_extra', name: 'Další obal na terminál', image: ASSET_ROOT + 'case-sun-spark.jpg',
      available: false, price: null
    }
  };
  var CART_STORAGE_KEY = 'hugo-eshop-cart-v1';
  var cart = [];
  var selectedTerminalCaseVariant = 'sun_spark';
  var selectedExtraCaseVariant = 'sun_spark';
  var selectedDeliveryMethod = 'dpd';
  var cartStep = 'items';
  var delivery = {};
  var checkoutEnabled = false;
  var legal = { version: '2026-09-15', status: 'published' };
  var handoff = typeof module !== 'undefined' && module.exports
    ? require('./shop-handoff')
    : window.HugoEshopHandoff;

  function cartIsOrderable(lines, catalogue) {
    return lines.length > 0 && lines.every(function (line) {
      var product = catalogue[line.id];
      return product && product.available === true && Number.isInteger(product.price);
    });
  }

  function gallerySourcesFor(product, caseKind, selected) {
    return caseKind === 'extra' ? [ASSET_ROOT + selected.image].concat(product.gallery.slice(1)) : product.gallery;
  }
  var serializeCartHandoff = handoff.serializeCartHandoff;
  var parseCartHandoff = handoff.parseCartHandoff;
  // Keep the availability rule independently testable without booting a DOM.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cartIsOrderable, gallerySourcesFor, parseCartHandoff, serializeCartHandoff };
    return;
  }

  var bagButton = document.getElementById('bag-button');
  var cartPanel = document.getElementById('cart');
  var cartLines = document.getElementById('cart-lines');
  var cartItemsStep = document.getElementById('cart-items-step');
  var cartReviewStep = document.getElementById('cart-review-step');
  var cartBack = document.getElementById('cart-back');
  var cartTitle = cartPanel.querySelector('.cart-head h2'), reviewButton = document.getElementById('review-button');
  var scrim = document.getElementById('scrim');
  var terms = document.getElementById('terms');
  var checkoutButton = document.getElementById('checkout-button');
  var checkoutNote = document.getElementById('checkout-note');
  var dialog = document.getElementById('product-dialog');
  var dialogContent = document.getElementById('dialog-content');
  var productOrder = ['pax_a920', 'belt_holster', 'terminal_case'];

  function restoreCart() {
    try {
      var params = new URLSearchParams(location.search);
      var incomingHandoff = parseCartHandoff(params.get('cart'));
      var stored = incomingHandoff || JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null');
      if (!stored || !Array.isArray(stored.cart)) return;
      if (incomingHandoff) {
        params.delete('cart');
        history.replaceState({}, '', location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash);
      }
      var restoredVariant = caseVariants.some(function (item) { return item.id === stored.caseVariant; })
        ? stored.caseVariant
        : 'sun_spark';
      selectedTerminalCaseVariant = restoredVariant;
      selectedExtraCaseVariant = caseVariants.some(function (item) { return item.id === stored.extraCaseVariant; })
        ? stored.extraCaseVariant
        : restoredVariant;
      selectedDeliveryMethod = handoff.deliveryMethod(stored.deliveryMethod);
      cart = stored.cart.filter(function (line) { return line && ['pax_a920', 'belt_holster', 'terminal_case_extra'].includes(line.id); })
        .map(function (line) { return { id: line.id, key: line.id, qty: line.qty || 1, variant: null, variantName: null }; });
      syncCaseLine();
    } catch (_error) {}
  }

  function persistCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        caseVariant: selectedTerminalCaseVariant,
        extraCaseVariant: selectedExtraCaseVariant,
        deliveryMethod: selectedDeliveryMethod,
        cart: cart.filter(function (line) { return line.id !== 'terminal_case'; }).map(function (line) { return { id: line.id, qty: line.qty || 1 }; }),
      }));
    } catch (_error) {}
  }

  function t(key) { return typeof window.shopT === 'function' ? window.shopT(key) : key; }
  function caseVariantName(variant) { return variant.names[window.HUGO_LANG === 'en' ? 'en' : 'cs']; }
  function productValue(id, key, fallback) {
    var values = t(key);
    var index = productOrder.indexOf(id);
    return Array.isArray(values) && index >= 0 ? values[index] : fallback;
  }

  function apiBase() {
    if (location.hostname === 'hugopos.eu' || location.hostname === 'www.hugopos.eu') return 'https://api.hugopos.eu/api';
    if (location.hostname === 'staging.hugopos.eu') return 'https://staging.api.hugopos.eu/api';
    return 'http://localhost:4471/api';
  }

  function adminBase() {
    if (location.hostname === 'staging.hugopos.eu') return 'https://staging.admin.hugopos.eu';
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return 'http://' + location.hostname + ':4470';
    return 'https://admin.hugopos.eu';
  }

  function money(minor, currency) {
    var hasMinorFraction = minor % 100 !== 0;
    return new Intl.NumberFormat(window.HUGO_LANG === 'en' ? 'en-GB' : 'cs-CZ', {
      style: 'currency', currency: (currency || 'czk').toUpperCase(),
      minimumFractionDigits: hasMinorFraction ? 2 : 0,
      maximumFractionDigits: hasMinorFraction ? 2 : 0
    }).format(minor / 100);
  }

  function loadCatalogue() {
    fetch(apiBase() + '/v1/public/eshop/catalogue')
      .then(function (response) { if (!response.ok) throw new Error('catalogue'); return response.json(); })
      .then(function (data) {
        checkoutEnabled = data.checkoutEnabled === true;
        legal = data.legal || legal;
        checkoutNote.hidden = legal.status === 'published';
        (data.products || []).forEach(function (item) {
          if (!products[item.id]) return;
          products[item.id].available = item.available === true;
          products[item.id].price = item.amountMinor;
          products[item.id].currency = item.currency;
        });
        delivery = Object.fromEntries((data.delivery || []).map(function (item) { return [item.id, item]; }));
        renderDelivery();
        document.querySelectorAll('[data-add]').forEach(function (add) {
          add.disabled = !canAddProduct(add.dataset.add);
        });
        renderCataloguePrices();
        // A restored cart renders before this async response. Re-render with
        // authoritative Stripe availability/prices so its totals and checkout
        // state move together.
        renderCart();
      })
      .catch(function () {
        renderCataloguePrices();
      });
  }

  function renderCataloguePrices() {
    ['pax_a920', 'belt_holster', 'terminal_case'].forEach(function (id) {
      var product = products[id];
      var priceNode = document.querySelector('[data-price="' + id + '"]');
      if (!priceNode) return;
      if (id === 'terminal_case') {
        var extra = products.terminal_case_extra;
        priceNode.innerHTML = extra.available
          ? money(extra.price, extra.currency) + '<small>' + t('priceNote') + '</small>'
          : t('unavailable');
        return;
      }
      if (!product.available) {
        priceNode.textContent = t('unavailable');
        return;
      }
      priceNode.innerHTML = money(product.price, product.currency) + '<small>' + t('priceNote') + '</small>';
    });
  }

  function openCart() {
    showCartStep('items');
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    bagButton.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
  }

  function showCartStep(step) {
    var reviewing = step === 'review' && cartIsOrderable(cart, products);
    cartStep = reviewing ? 'review' : 'items';
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

  function renderCart() {
    persistCart();
    var cartCount = cart.reduce(function (sum, line) { return sum + (line.qty || 1); }, 0);
    document.getElementById('bag-count').textContent = String(cartCount);
    if (!cart.length) {
      showCartStep('items');
      cartLines.innerHTML = '<p class="empty">' + t('empty') + '</p>';
    } else {
      cartLines.innerHTML = cart.map(function (line) {
        var p = products[line.id];
        var name = line.id === 'terminal_case'
          ? t('freeCase')
          : (line.id === 'terminal_case_extra' ? t('extraCaseLabel') : productValue(line.id, 'cardTitles', p.name));
        var variant = line.variantName ? '<small>' + line.variantName + '</small>' : '';
        var price = !p.available || !Number.isInteger(p.price)
          ? t('unavailable')
          : (line.id === 'terminal_case'
            ? t('freeIncluded')
            : (line.qty > 1 ? line.qty + ' × ' : '') + money(p.price, p.currency) + ' ' + t('exclVat'));
        var remove = line.id === 'terminal_case' ? '' : '<button type="button" data-remove="' + line.key + '" aria-label="' + t('remove') + ' ' + name + '">×</button>';
        var selectedImage = caseVariants.find(function (item) { return item.id === line.variant; });
        var image = selectedImage && ['terminal_case', 'terminal_case_extra'].includes(line.id)
          ? ASSET_ROOT + selectedImage.image
          : p.image;
        return '<div class="cart-line"><img src="' + image + '" alt=""><div><h3>' + name + '</h3>' + variant + '<p>' + price + '</p></div>' + remove + '</div>';
      }).join('');
    }
    updateAccountLinks();
    updateCheckoutState();
  }

  function renderDelivery() {
    document.querySelectorAll('[name="delivery-method"]').forEach(function (input) {
      var option = delivery[input.value];
      input.checked = input.value === selectedDeliveryMethod;
      input.disabled = option?.available !== true;
      var price = input.closest('label').querySelector('[data-delivery-price]');
      price.textContent = option?.available === true
        ? money(option.amountMinor, option.currency) + (input.value === 'dpd' ? ' ' + t('exclVat') : '')
        : t('unavailable');
    });
  }

  function updateAccountLinks() {
    var cartPath = '/shop';
    if (cart.length) {
      cartPath += '?eshop_cart=' + encodeURIComponent(serializeCartHandoff(cart, selectedTerminalCaseVariant, selectedExtraCaseVariant, selectedDeliveryMethod));
    }
    document.querySelectorAll('[data-account-link]').forEach(function (link) {
      link.href = adminBase() + '/login?start=1&next=' + encodeURIComponent(cartPath);
      if (window.self !== window.top && new URLSearchParams(location.search).get('embedded') === '1') link.hidden = true;
    });
  }

  function updateCheckoutState() {
    reviewButton.disabled = !cartIsOrderable(cart, products);
    checkoutButton.disabled = !checkoutEnabled || legal.status !== 'published' || !terms.checked || !cartIsOrderable(cart, products) || delivery[selectedDeliveryMethod]?.available !== true;
  }

  function canAddProduct(id) {
    var product = products[id];
    if (!product || !product.available) return false;
    return id !== 'pax_a920' || products.terminal_case.available === true;
  }

  function addProduct(id) {
    if (!canAddProduct(id)) return;
    if (id === 'terminal_case') return;
    var existing = cart.find(function (line) { return line.id === id; });
    if (existing && id === 'terminal_case_extra') {
      existing.qty = Math.min(99, (existing.qty || 1) + 1);
    } else if (!existing) {
      var selected = caseVariants.find(function (variant) { return variant.id === selectedExtraCaseVariant; });
      cart.push({
        id: id,
        key: id,
        qty: 1,
        variant: id === 'terminal_case_extra' ? selected.id : null,
        variantName: id === 'terminal_case_extra' ? caseVariantName(selected) : null
      });
    }
    if (id === 'pax_a920') {
      syncCaseLine();
    }
    renderCart();
    openCart();
  }

  function syncCaseLine() {
    var includedVariant = caseVariants.find(function (item) { return item.id === selectedTerminalCaseVariant; });
    var extraVariant = caseVariants.find(function (item) { return item.id === selectedExtraCaseVariant; });
    cart.forEach(function (line) {
      if (line.id === 'terminal_case_extra') {
        line.variant = extraVariant.id;
        line.variantName = caseVariantName(extraVariant);
      }
    });
    if (!cart.some(function (line) { return line.id === 'pax_a920'; })) {
      cart = cart.filter(function (line) { return line.id !== 'terminal_case'; });
      return;
    }
    cart = cart.filter(function (line) { return line.id !== 'terminal_case'; });
    cart.push({ id: 'terminal_case', key: 'terminal_case', qty: cart.find(function (line) { return line.id === 'pax_a920'; }).qty || 1, variant: includedVariant.id, variantName: caseVariantName(includedVariant) });
  }

  function openProduct(id) {
    var p = products[id];
    if (!p) return;
    var name = productValue(id, 'cardTitles', p.name);
    var lead = productValue(id, 'productLeads', p.lead);
    var productSpecs = productValue(id, 'productSpecs', p.specs);
    var kicker = productValue(id, 'cardKickers', p.kicker);
    var caseKind = p.id === 'pax_a920' ? 'included' : p.id === 'terminal_case' ? 'extra' : null;
    var selectedId = caseKind === 'included' ? selectedTerminalCaseVariant : selectedExtraCaseVariant;
    var selected = caseVariants.find(function (variant) { return variant.id === selectedId; }) || caseVariants[3];
    var gallerySources = gallerySourcesFor(p, caseKind, selected);
    var gallery = gallerySources.map(function (src, index) { return '<img src="' + src + '" alt="' + (index ? name + (window.HUGO_LANG === 'en' ? ' in use' : ' v provozu') : name) + '">'; }).join('');
    var specs = productSpecs.map(function (row) { return '<li><span>' + row[0] + '</span><strong>' + row[1] + '</strong></li>'; }).join('');
    var swatches = '';
    if (caseKind) {
      swatches = '<div class="swatches dialog-swatches" role="radiogroup" aria-label="' + t('caseColour') + '">' + caseVariants.map(function (variant) {
        var active = variant.id === selected.id;
        var variantName = caseVariantName(variant);
        return '<button class="swatch' + (active ? ' is-active' : '') + '" style="--swatch:' + variant.color + '" data-variant="' + variant.id + '" data-image="' + variant.image + '" type="button" aria-label="' + variantName + '" aria-checked="' + (active ? 'true' : 'false') + '" role="radio"></button>';
      }).join('') + '<span class="swatch-name" aria-live="polite">' + caseVariantName(selected) + '</span></div>';
    }
    var button = p.id === 'terminal_case'
      ? (canAddProduct('terminal_case_extra')
        ? '<button class="add-button" data-add-case type="button">' + t('addExtraCase') + '</button>'
        : '<button class="add-button" type="button" disabled>' + t('preparing') + '</button>')
      : (canAddProduct(p.id) ? '<button class="add-button" data-dialog-add="' + p.id + '" type="button">' + t('addToCart') + '</button>' : '<button class="add-button" type="button" disabled>' + t('preparing') + '</button>');
    var interactiveGallery = caseKind === 'extra' ? gallery.replace('<img ', '<img data-case-image ') : gallery;
    dialogContent.innerHTML = '<div class="dialog-layout"' + (caseKind ? ' data-case-scope data-case-kind="' + caseKind + '"' : '') + '><div class="dialog-gallery">' + interactiveGallery + '</div><div class="dialog-copy"><p class="eyebrow">' + kicker + '</p><h2 id="product-dialog-title">' + name + '</h2><p class="lead">' + lead + '</p>' + swatches + '<ul class="specs">' + specs + '</ul>' + button + '</div></div>';
    if (caseKind) previewSwatch(dialogContent.querySelector('[data-variant="' + selected.id + '"]'));
    dialog.showModal();
  }

  function previewSwatch(button) {
    if (!button) return;
    var group = button.closest('.swatches');
    var variant = caseVariants.find(function (item) { return item.id === button.dataset.variant; });
    if (!variant) return;
    var name = caseVariantName(variant);
    group.querySelector('.swatch-name').textContent = name;
    var image = button.closest('[data-case-scope]').querySelector('[data-case-image]');
    if (image) {
      image.src = ASSET_ROOT + button.dataset.image;
      image.alt = name + ' — ' + t('caseAlt');
    }
    if (button.closest('#dialog-content')) dialogContent.dataset.previewVariant = variant.id;
  }

  function selectSwatch(button) {
    var kind = button.closest('[data-case-kind]').dataset.caseKind;
    if (kind === 'included') selectedTerminalCaseVariant = button.dataset.variant;
    else selectedExtraCaseVariant = button.dataset.variant;
    document.querySelectorAll('[data-case-kind="' + kind + '"] .swatch').forEach(function (node) {
      var active = node.dataset.variant === button.dataset.variant;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-checked', active ? 'true' : 'false');
      if (active) previewSwatch(node);
    });
    syncCaseLine();
    renderCart();
  }

  function startCheckout() {
    if (checkoutButton.disabled) return;
    checkoutButton.disabled = true;
    checkoutButton.textContent = t('opening');
    var checkoutPayload = { items: cart.map(function (line) { return { id: line.id, qty: line.qty || 1, variant: line.variant || undefined }; }), deliveryMethod: selectedDeliveryMethod, termsAccepted: true, termsVersion: legal.version, locale: window.HUGO_LANG };
    var idempotencyKey = crypto.randomUUID();
    if (window.self !== window.top && new URLSearchParams(location.search).get('embedded') === '1') {
      window.parent.postMessage({ type: 'hugo:eshop-checkout', payload: checkoutPayload, idempotencyKey: idempotencyKey }, adminBase());
      return;
    }
    fetch(apiBase() + '/v1/public/eshop/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(checkoutPayload)
    }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(t('checkoutError')); return body; }); })
      .then(function (body) { location.assign(body.url); })
      .catch(function (error) { checkoutNote.hidden = false; checkoutNote.textContent = error.message; checkoutButton.textContent = t('checkout'); updateCheckoutState(); });
  }

  function showSuccessIfNeeded() {
    var params = new URLSearchParams(location.search);
    var session = params.get('session_id');
    if (!session) return;
    fetch(apiBase() + '/v1/public/eshop/sessions/' + encodeURIComponent(session))
      .then(function (response) { if (!response.ok) throw new Error('status'); return response.json(); })
      .then(function (body) {
        if (body.paymentStatus !== 'paid') return;
        cart = [];
        renderCart();
        try { localStorage.removeItem(CART_STORAGE_KEY); } catch (_error) {}
        var success = document.getElementById('success');
        var linked = params.get('account') === 'linked';
        var continueLink = document.getElementById('continue-account');
        if (linked) {
          success.querySelector('h2').textContent = t('successLinkedTitle');
          success.querySelector('div > p:last-of-type').textContent = t('successLinkedText');
          continueLink.textContent = t('viewOrders');
          continueLink.href = adminBase() + '/orders';
        } else {
          continueLink.href = adminBase() + '/login?start=1&eshop_session=' + encodeURIComponent(session);
        }
        success.hidden = false;
      }).catch(function () {});
  }

  document.addEventListener('click', function (event) {
    var add = event.target.closest('[data-add],[data-dialog-add]');
    if (add) addProduct(add.dataset.add || add.dataset.dialogAdd);
    var remove = event.target.closest('[data-remove]');
    if (remove) { cart = cart.filter(function (line) { return line.key !== remove.dataset.remove; }); syncCaseLine(); renderCart(); }
    var productCard = event.target.closest('[data-product]');
    if (event.target.closest('.product-open') && productCard) openProduct(productCard.dataset.product);
    var guide = event.target.closest('[data-open-product]');
    if (guide) openProduct(guide.dataset.openProduct);
    var dialogAdd = event.target.closest('[data-dialog-add]');
    if (dialogAdd) dialog.close();
    if (event.target.closest('[data-add-case]')) {
      var preview = dialogContent.querySelector('[data-variant="' + (dialogContent.dataset.previewVariant || selectedExtraCaseVariant) + '"]');
      selectSwatch(preview);
      addProduct('terminal_case_extra');
      dialog.close();
    }
    var swatch = event.target.closest('.swatch');
    if (swatch) selectSwatch(swatch);
  });
  document.addEventListener('mouseover', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  document.addEventListener('focusin', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  bagButton.addEventListener('click', openCart);
  reviewButton.addEventListener('click', function () { showCartStep('review'); });
  cartBack.addEventListener('click', function () { showCartStep('items'); });
  document.getElementById('cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  terms.addEventListener('change', updateCheckoutState);
  document.querySelectorAll('[name="delivery-method"]').forEach(function (input) {
    input.addEventListener('change', function () {
      selectedDeliveryMethod = handoff.deliveryMethod(input.value);
      renderDelivery();
      renderCart();
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
    if (event.origin !== adminBase() || event.data?.type !== 'hugo:eshop-checkout-error') return;
    checkoutNote.hidden = false;
    checkoutNote.textContent = t('checkoutError');
    checkoutButton.textContent = t('checkout');
    updateCheckoutState();
  });
  document.addEventListener('hugo:language', function () {
    document.querySelectorAll('[data-case-scope] .swatch').forEach(function (node) {
      var variant = caseVariants.find(function (item) { return item.id === node.dataset.variant; });
      if (variant) node.setAttribute('aria-label', caseVariantName(variant));
    });
    syncCaseLine();
    renderCataloguePrices();
    renderDelivery();
    renderCart();
    showCartStep(cartStep);
    if (dialog.open) dialog.close();
    document.querySelectorAll('[data-case-scope] .swatch.is-active').forEach(previewSwatch);
  });
  restoreCart();
  loadCatalogue();
  renderCart();
  showSuccessIfNeeded();
})();
