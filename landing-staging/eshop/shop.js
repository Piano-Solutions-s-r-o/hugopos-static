(function () {
  'use strict';

  var TERMINAL_IMAGE = '../assets/eshop/terminal-product-temp.jpg';
  var ASSET_ROOT = '../assets/eshop/';
  var caseVariants = [
    { id: 'electric_blue', color: '#274b83', filter: 'none', names: { cs: 'Elektrická modř', en: 'Electric Blue' } },
    { id: 'red_impulse', color: '#a7262f', filter: 'hue-rotate(105deg) saturate(1.35)', names: { cs: 'Rudý impuls', en: 'Red Impulse' } },
    { id: 'sun_spark', color: '#e8c62c', filter: 'hue-rotate(175deg) saturate(1.4) brightness(1.18)', names: { cs: 'Sluneční jiskra', en: 'Sun Spark' } },
    { id: 'night_ink', color: '#17191c', filter: 'grayscale(1) brightness(.42)', names: { cs: 'Noční inkoust', en: 'Night Ink' } },
    { id: 'sage_calm', color: '#71806a', filter: 'hue-rotate(255deg) saturate(.55) brightness(.95)', names: { cs: 'Šalvějový klid', en: 'Sage Calm' } }
  ];
  var products = {
    pax_a920: {
      id: 'pax_a920', name: 'Terminál Hugo', kicker: 'All-in-one', image: TERMINAL_IMAGE,
      lead: 'Lehký terminál, na kterém běží pokladna, platby i účtenka. Bez druhé krabičky a bez kabelového zátiší.',
      gallery: [TERMINAL_IMAGE, ASSET_ROOT + 'terminal-cafe-temp.jpg', ASSET_ROOT + 'case-blue-temp.jpg'],
      specs: [['Model', 'PAX A920 Pro'], ['Připojení', 'Wi-Fi · 4G · Bluetooth'], ['Použití', 'Pokladna · platby · účtenky']],
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
      id: 'terminal_case', name: 'Obal na terminál', kicker: 'Každý den jinak', image: ASSET_ROOT + 'case-blue-temp.jpg',
      lead: 'Pružný ochranný obal dává terminálu jistější úchop a vaší obsluze vlastní barvu.',
      gallery: [ASSET_ROOT + 'case-blue-temp.jpg', ASSET_ROOT + 'terminal-cafe-temp.jpg'],
      specs: [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Pět odstínů']],
      available: false, price: null
    }
  };
  var CART_STORAGE_KEY = 'hugo-eshop-cart-v1';
  var cart = [];
  var selectedCaseVariant = 'sun_spark';
  var checkoutEnabled = false;
  var legal = { version: 'draft-2026-08-31', status: 'draft' };

  function cartIsOrderable(lines, catalogue) {
    return lines.length > 0 && lines.every(function (line) {
      var product = catalogue[line.id];
      return product && product.available === true && Number.isInteger(product.price);
    });
  }

  function serializeCartHandoff(lines, caseVariant) {
    var allowedVariant = caseVariants.some(function (item) { return item.id === caseVariant; })
      ? caseVariant
      : 'sun_spark';
    var seen = {};
    var safeCart = (Array.isArray(lines) ? lines : []).filter(function (line) {
      if (!line || (line.id !== 'pax_a920' && line.id !== 'belt_holster') || seen[line.id]) return false;
      seen[line.id] = true;
      return true;
    }).map(function (line) { return { id: line.id }; });
    return JSON.stringify({ version: 1, caseVariant: allowedVariant, cart: safeCart });
  }

  function parseCartHandoff(value) {
    if (typeof value !== 'string' || value.length === 0 || value.length > 1000) return null;
    try {
      var parsed = JSON.parse(value);
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.cart) || parsed.cart.length > 2) return null;
      var seen = {};
      var safeCart = [];
      for (var i = 0; i < parsed.cart.length; i += 1) {
        var line = parsed.cart[i];
        if (!line || (line.id !== 'pax_a920' && line.id !== 'belt_holster') || seen[line.id]) return null;
        seen[line.id] = true;
        safeCart.push({ id: line.id });
      }
      var caseVariant = caseVariants.some(function (item) { return item.id === parsed.caseVariant; })
        ? parsed.caseVariant
        : 'sun_spark';
      return { caseVariant: caseVariant, cart: safeCart };
    } catch (_error) {
      return null;
    }
  }

  // Keep the availability rule independently testable without booting a DOM.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      cartIsOrderable: cartIsOrderable,
      parseCartHandoff: parseCartHandoff,
      serializeCartHandoff: serializeCartHandoff
    };
    return;
  }

  var bagButton = document.getElementById('bag-button');
  var cartPanel = document.getElementById('cart');
  var cartLines = document.getElementById('cart-lines');
  var scrim = document.getElementById('scrim');
  var terms = document.getElementById('terms');
  var checkoutButton = document.getElementById('checkout-button');
  var dialog = document.getElementById('product-dialog');
  var dialogContent = document.getElementById('dialog-content');
  var productOrder = ['pax_a920', 'belt_holster', 'terminal_case'];

  function restoreCart() {
    try {
      var params = new URLSearchParams(location.search);
      var handoff = parseCartHandoff(params.get('cart'));
      var stored = handoff || JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null');
      if (!stored || !Array.isArray(stored.cart)) return;
      if (handoff) {
        params.delete('cart');
        history.replaceState({}, '', location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash);
      }
      var restoredVariant = caseVariants.some(function (item) { return item.id === stored.caseVariant; })
        ? stored.caseVariant
        : 'sun_spark';
      selectedCaseVariant = restoredVariant;
      cart = stored.cart.filter(function (line) { return line && (line.id === 'pax_a920' || line.id === 'belt_holster'); })
        .map(function (line) { return { id: line.id, key: line.id, variant: null, variantName: null }; });
      syncCaseLine();
    } catch (_error) {}
  }

  function persistCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        caseVariant: selectedCaseVariant,
        cart: cart.filter(function (line) { return line.id !== 'terminal_case'; }).map(function (line) { return { id: line.id }; }),
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
        (data.products || []).forEach(function (item) {
          if (!products[item.id]) return;
          products[item.id].available = item.available === true;
          products[item.id].price = item.amountMinor;
          products[item.id].currency = item.currency;
        });
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
    Object.keys(products).forEach(function (id) {
      var product = products[id];
      var priceNode = document.querySelector('[data-price="' + id + '"]');
      if (!priceNode) return;
      if (!product.available) {
        priceNode.textContent = t('unavailable');
        return;
      }
      priceNode.innerHTML = id === 'terminal_case'
        ? t('freeCase') + '<small>' + t('freeHint') + '</small>'
        : money(product.price, product.currency) + '<small>' + (id === 'belt_holster' ? t('priceNoteInclusive') : t('priceNote')) + '</small>';
    });
  }

  function openCart() {
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    bagButton.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
  }

  function closeCart() {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    bagButton.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
  }

  function renderCart() {
    persistCart();
    document.getElementById('bag-count').textContent = String(cart.length);
    if (!cart.length) {
      cartLines.innerHTML = '<p class="empty">' + t('empty') + '</p>';
    } else {
      cartLines.innerHTML = cart.map(function (line) {
        var p = products[line.id];
        var name = productValue(line.id, 'cardTitles', p.name);
        var variant = line.variantName ? '<small>' + line.variantName + '</small>' : '';
        var price = !p.available || !Number.isInteger(p.price)
          ? t('unavailable')
          : (line.id === 'terminal_case'
            ? t('freeIncluded')
            : money(p.price, p.currency) + ' ' + (line.id === 'belt_holster' ? t('inclVat') : t('exclVat')));
        var remove = line.id === 'terminal_case' ? '' : '<button type="button" data-remove="' + line.key + '" aria-label="' + t('remove') + ' ' + name + '">×</button>';
        return '<div class="cart-line"><img src="' + p.image + '" alt=""><div><h3>' + name + '</h3>' + variant + '<p>' + price + '</p></div>' + remove + '</div>';
      }).join('');
    }
    updateAccountLinks();
    updateCheckoutState();
  }

  function updateAccountLinks() {
    var cartPath = '/shop';
    if (cart.length) {
      cartPath += '?eshop_cart=' + encodeURIComponent(serializeCartHandoff(cart, selectedCaseVariant));
    }
    document.querySelectorAll('[data-account-link]').forEach(function (link) {
      link.href = adminBase() + '/login?start=1&next=' + encodeURIComponent(cartPath);
      if (window.self !== window.top && new URLSearchParams(location.search).get('embedded') === '1') link.hidden = true;
    });
  }

  function updateCheckoutState() {
    checkoutButton.disabled = !checkoutEnabled || legal.status !== 'published' || !terms.checked || !cartIsOrderable(cart, products);
  }

  function canAddProduct(id) {
    var product = products[id];
    if (!product || !product.available) return false;
    return id !== 'pax_a920' || products.terminal_case.available === true;
  }

  function addProduct(id) {
    if (!canAddProduct(id)) return;
    if (id === 'terminal_case') return;
    if (!cart.some(function (line) { return line.id === id; })) {
      cart.push({ id: id, key: id, variant: null, variantName: null });
    }
    if (id === 'pax_a920') {
      syncCaseLine();
    }
    renderCart();
    openCart();
  }

  function syncCaseLine() {
    if (!cart.some(function (line) { return line.id === 'pax_a920'; })) {
      cart = cart.filter(function (line) { return line.id !== 'terminal_case'; });
      return;
    }
    var variant = caseVariants.find(function (item) { return item.id === selectedCaseVariant; });
    cart = cart.filter(function (line) { return line.id !== 'terminal_case'; });
    cart.push({ id: 'terminal_case', key: 'terminal_case', variant: variant.id, variantName: caseVariantName(variant) });
  }

  function openProduct(id) {
    var p = products[id];
    if (!p) return;
    var name = productValue(id, 'cardTitles', p.name);
    var lead = productValue(id, 'productLeads', p.lead);
    var productSpecs = productValue(id, 'productSpecs', p.specs);
    var kicker = productValue(id, 'cardKickers', p.kicker);
    var gallery = p.gallery.map(function (src, index) { return '<img src="' + src + '" alt="' + (index ? name + (window.HUGO_LANG === 'en' ? ' in use' : ' v provozu') : name) + '">'; }).join('');
    var specs = productSpecs.map(function (row) { return '<li><span>' + row[0] + '</span><strong>' + row[1] + '</strong></li>'; }).join('');
    var swatches = '';
    if (p.id === 'terminal_case') {
      var selected = caseVariants.find(function (variant) { return variant.id === selectedCaseVariant; }) || caseVariants[0];
      swatches = '<div class="swatches dialog-swatches" role="radiogroup" aria-label="' + t('caseColour') + '">' + caseVariants.map(function (variant) {
        var active = variant.id === selected.id;
        var variantName = caseVariantName(variant);
        return '<button class="swatch' + (active ? ' is-active' : '') + '" style="--swatch:' + variant.color + '" data-variant="' + variant.id + '" data-filter="' + variant.filter + '" type="button" aria-label="' + variantName + '" aria-checked="' + (active ? 'true' : 'false') + '" role="radio"></button>';
      }).join('') + '<span class="swatch-name" aria-live="polite">' + caseVariantName(selected) + '</span></div>';
    }
    var button = p.id === 'terminal_case'
      ? '<button class="add-button" data-use-case type="button">' + t('useColour') + '</button>'
      : (canAddProduct(p.id) ? '<button class="add-button" data-dialog-add="' + p.id + '" type="button">' + t('addToCart') + '</button>' : '<button class="add-button" type="button" disabled>' + t('preparing') + '</button>');
    dialogContent.innerHTML = '<div class="dialog-layout"' + (p.id === 'terminal_case' ? ' data-case-scope' : '') + '><div class="dialog-gallery">' + gallery.replace('<img ', '<img data-case-image ') + '</div><div class="dialog-copy"><p class="eyebrow">' + kicker + '</p><h2 id="product-dialog-title">' + name + '</h2><p class="lead">' + lead + '</p>' + swatches + '<ul class="specs">' + specs + '</ul>' + button + '</div></div>';
    if (p.id === 'terminal_case') previewSwatch(dialogContent.querySelector('[data-variant="' + selectedCaseVariant + '"]'));
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
    image.style.filter = button.dataset.filter;
    image.alt = name + ' — ' + t('caseAlt');
    if (button.closest('#dialog-content')) dialogContent.dataset.previewVariant = variant.id;
  }

  function selectSwatch(button) {
    selectedCaseVariant = button.dataset.variant;
    document.querySelectorAll('.swatch').forEach(function (node) {
      var active = node.dataset.variant === selectedCaseVariant;
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
    var checkoutPayload = { items: cart.map(function (line) { return { id: line.id, qty: 1, variant: line.variant || undefined }; }), termsAccepted: true, termsVersion: legal.version, locale: window.HUGO_LANG };
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
      .catch(function (error) { document.getElementById('checkout-note').textContent = error.message; checkoutButton.textContent = t('checkout'); updateCheckoutState(); });
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
    if (event.target.closest('[data-use-case]')) {
      var preview = dialogContent.querySelector('[data-variant="' + (dialogContent.dataset.previewVariant || selectedCaseVariant) + '"]');
      selectSwatch(preview);
      dialog.close();
    }
    var swatch = event.target.closest('.swatch');
    if (swatch) selectSwatch(swatch);
  });
  document.addEventListener('mouseover', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  document.addEventListener('focusin', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  bagButton.addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  terms.addEventListener('change', updateCheckoutState);
  checkoutButton.addEventListener('click', startCheckout);
  document.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  var siteNav = document.getElementById('nav');
  function updateSiteNav() { siteNav?.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', updateSiteNav, { passive: true });
  updateSiteNav();
  window.addEventListener('message', function (event) {
    if (event.origin !== adminBase() || event.data?.type !== 'hugo:eshop-checkout-error') return;
    document.getElementById('checkout-note').textContent = t('checkoutError');
    checkoutButton.textContent = t('checkout');
    updateCheckoutState();
  });
  document.addEventListener('hugo:language', function () {
    document.querySelectorAll('.case-card .swatch').forEach(function (node) {
      var variant = caseVariants.find(function (item) { return item.id === node.dataset.variant; });
      if (variant) node.setAttribute('aria-label', caseVariantName(variant));
    });
    syncCaseLine();
    renderCataloguePrices();
    renderCart();
    if (dialog.open) dialog.close();
    var active = document.querySelector('.case-card .swatch.is-active');
    if (active) previewSwatch(active);
  });
  restoreCart();
  loadCatalogue();
  renderCart();
  showSuccessIfNeeded();
})();
