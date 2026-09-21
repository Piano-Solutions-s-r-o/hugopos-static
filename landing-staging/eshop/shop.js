(function () {
  'use strict';
  // The terminal photo shown before a colour is chosen (cart line, catalogue image). It is
  // the in-stock default colour; the detail gallery follows the selected colour.
  var TERMINAL_IMAGE = '../assets/eshop/case-red-impulse.jpg';
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
      lead: 'Pružný ochranný obal dává terminálu jistější úchop a tvé obsluze vlastní barvu.',
      gallery: [ASSET_ROOT + 'case-sun-spark.jpg', ASSET_ROOT + 'case-red-impulse.jpg', ASSET_ROOT + 'case-electric-blue.jpg'],
      specs: [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Šest odstínů']],
      available: false, price: null
    },
    terminal_case_extra: {
      id: 'terminal_case_extra', name: 'Další obal na terminál', image: ASSET_ROOT + 'case-sun-spark.jpg',
      available: false, price: null
    },
    printer_zj5809: {
      id: 'printer_zj5809', name: 'Bluetooth tiskárna účtenek', kicker: 'ZJ-5809/BT', image: ASSET_ROOT + 'printer-zj5809.jpg',
      lead: 'Kompaktní tiskárna účtenek, která se s terminálem spáruje přes Bluetooth. Když host chce papír, dostane ho — bez kabelu přes celý bar.',
      gallery: [ASSET_ROOT + 'printer-zj5809.jpg'],
      specs: [['Model', 'ZJ-5809/BT'], ['Šířka pásky', '58 mm'], ['Připojení', 'Bluetooth · nabíjecí kabel v balení'], ['Příslušenství', 'Včetně pouzdra']],
      available: false, price: null
    },
    // A free (0 Kč) software feature sold through the normal cart → checkout → Stripe
    // pipeline like every other product: its own catalogue entry, its own Stripe price
    // (tagged non-physical server-side), just never fulfilled as hardware.
    android_tap_to_pay: {
      id: 'android_tap_to_pay', name: 'Android Tap-to-Pay', kicker: 'Android', image: ASSET_ROOT + 'android-tap-to-pay.svg',
      lead: 'Android Tap-to-Pay změní kompatibilní telefon obsluhy v bezkontaktní platební terminál — host jednoduše přiloží kartu nebo mobil k zadní straně telefonu. Žádný další hardware neobjednáváš, funkce je součástí Hugo účtu.',
      gallery: [ASSET_ROOT + 'android-tap-to-pay.svg'],
      specs: [
        ['Co to je', 'Bezkontaktní platba kartou nebo mobilem přímo na telefonu obsluhy, bez zvláštního terminálu.'],
        ['Co potřebuješ', 'Telefon s Androidem a podporou NFC — mají ji téměř všechny novější telefony.'],
        ['Ověření telefonu', 'Při zakládání účtu zadáš model telefonu a kalibrace v onboardingu ti řekne, jestli je pro Tap-to-Pay použitelný.']
      ],
      available: false, price: null
    }
  };
  var CART_STORAGE_KEY = 'hugo-eshop-cart-v1';
  var cart = [];
  // HUGO-1662 — mirrors the API default, which must be an in-stock colour. Which colours
  // are in stock is never hardcoded here: it arrives with the catalogue
  // (`caseVariants[].inStock`), and the API refuses a restocking colour at checkout.
  var DEFAULT_CASE_VARIANT = 'red_impulse';
  var caseStock = {};
  function caseInStock(id) { return caseStock[id] !== false; }
  function isCaseVariant(id) { return caseVariants.some(function (item) { return item.id === id; }); }
  var selectedTerminalCaseVariant = DEFAULT_CASE_VARIANT;
  var selectedExtraCaseVariant = DEFAULT_CASE_VARIANT;
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
    return caseKind ? [ASSET_ROOT + selected.image].concat(product.gallery.slice(1)) : product.gallery;
  }
  // Single source of truth for "is this catalogue-priced product free": both the
  // catalogue card and the cart line key their free-label rendering on this, never on
  // a product id, so a new 0 Kč SKU (e.g. android_tap_to_pay) needs no per-id branch.
  function isZeroPriced(product) {
    return Boolean(product) && product.price === 0;
  }
  // Products that ship nothing (HUGO-1694) — mirrors the server's `physical: false` flag
  // (API/src/config/eshop_prices.js). A cart containing ONLY these needs no delivery
  // method choice and is never charged the DPD fee; the server enforces the same rule
  // independently, this only keeps the storefront from asking a question it doesn't need to.
  var NON_PHYSICAL_IDS = ['android_tap_to_pay'];
  var MEAL_VOUCHER_PRODUCT_IDS = ['pax_a920', 'android_tap_to_pay'];
  function cartHasPhysicalItem(lines) {
    return (lines || []).some(function (line) { return !NON_PHYSICAL_IDS.includes(line.id); });
  }
  function cartNeedsMealVoucherChoice(lines) {
    return (lines || []).some(function (line) { return MEAL_VOUCHER_PRODUCT_IDS.includes(line.id); });
  }
  function mealVoucherChoiceComplete(preference) {
    return Boolean(preference)
      && typeof preference.accepts === 'boolean'
      && (!preference.accepts || preference.providers.length > 0);
  }
  var serializeCartHandoff = handoff.serializeCartHandoff;
  var parseCartHandoff = handoff.parseCartHandoff;
  // Keep the availability rule independently testable without booting a DOM.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cartHasPhysicalItem, cartIsOrderable, cartNeedsMealVoucherChoice, gallerySourcesFor, isZeroPriced, mealVoucherChoiceComplete, NON_PHYSICAL_IDS, parseCartHandoff, serializeCartHandoff };
    return;
  }

  var bagButton = document.getElementById('bag-button');
  var cartPanel = document.getElementById('cart');
  var cartLines = document.getElementById('cart-lines');
  var cartItemsStep = document.getElementById('cart-items-step');
  var cartReviewStep = document.getElementById('cart-review-step');
  var cartBack = document.getElementById('cart-back');
  var deliveryFieldset = document.querySelector('.delivery-choice');
  var mealVoucherFieldset = document.querySelector('.meal-voucher-choice');
  var mealVoucherProviders = document.querySelector('.meal-voucher-providers');
  var cartTitle = cartPanel.querySelector('.cart-head h2'), reviewButton = document.getElementById('review-button');
  var scrim = document.getElementById('scrim');
  var terms = document.getElementById('terms');
  var checkoutButton = document.getElementById('checkout-button');
  var checkoutNote = document.getElementById('checkout-note');
  var dialog = document.getElementById('product-dialog');
  var dialogContent = document.getElementById('dialog-content');
  var productOrder = ['pax_a920', 'belt_holster', 'terminal_case', 'printer_zj5809', 'android_tap_to_pay'];

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
    mealVoucherFieldset.hidden = !cartNeedsMealVoucherChoice(cart);
    if (mealVoucherProviders) {
      mealVoucherProviders.hidden = selectedMealVoucherPreference()?.accepts !== true;
    }
  }

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
      // Stock is not known yet; `applyCaseStock` moves a restocking colour to the default
      // as soon as the catalogue answers.
      var restoredVariant = isCaseVariant(stored.caseVariant) ? stored.caseVariant : DEFAULT_CASE_VARIANT;
      selectedTerminalCaseVariant = restoredVariant;
      selectedExtraCaseVariant = isCaseVariant(stored.extraCaseVariant) ? stored.extraCaseVariant : restoredVariant;
      selectedDeliveryMethod = handoff.deliveryMethod(stored.deliveryMethod);
      cart = stored.cart.filter(function (line) { return line && ['pax_a920', 'belt_holster', 'terminal_case_extra', 'printer_zj5809', 'android_tap_to_pay'].includes(line.id); })
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
        applyCaseStock(data.caseVariants);
        renderDelivery();
        document.querySelectorAll('[data-add]').forEach(function (add) {
          add.disabled = !canAddProduct(add.dataset.add);
        });
        document.querySelectorAll('[data-case-scope] .swatch.is-active').forEach(previewSwatch); refreshStockNotes();
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
    ['pax_a920', 'belt_holster', 'terminal_case', 'printer_zj5809', 'android_tap_to_pay'].forEach(function (id) {
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
      // Keyed on the resolved price, never the product id: any product the catalogue
      // prices at 0 gets the localized "free" label instead of `money(0)`.
      priceNode.innerHTML = isZeroPriced(product)
        ? t('free') + '<small>' + t('freeFeatureNote') + '</small>'
        : money(product.price, product.currency) + '<small>' + t('priceNote') + '</small>';
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
            : (isZeroPriced(p)
              ? t('free')
              : (line.qty > 1 ? line.qty + ' × ' : '') + money(p.price, p.currency) + ' ' + t('exclVat')));
        var remove = line.id === 'terminal_case' ? '' : '<button type="button" data-remove="' + line.key + '" aria-label="' + t('remove') + ' ' + name + '">×</button>';
        var selectedImage = caseVariants.find(function (item) { return item.id === line.variant; });
        var image = selectedImage && ['terminal_case', 'terminal_case_extra'].includes(line.id)
          ? ASSET_ROOT + selectedImage.image
          : p.image;
        return '<div class="cart-line"><img src="' + image + '" alt=""><div><h3>' + name + '</h3>' + variant + '<p>' + price + '</p></div>' + remove + '</div>';
      }).join('');
    }
    // HUGO-1694 — nothing to deliver, nothing to ask: a cart holding only non-physical
    // lines (e.g. android_tap_to_pay) never shows the delivery-method choice.
    if (deliveryFieldset) deliveryFieldset.hidden = !cartHasPhysicalItem(cart);
    renderMealVoucherChoice();
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
    var casesInStock = cart.every(function (line) { return !line.variant || caseInStock(line.variant); });
    // HUGO-1694 — a cart with nothing physical in it needs no delivery choice, so its
    // availability never gates checkout (see also the hidden `.delivery-choice` fieldset
    // in renderCart).
    var physicalCart = cartHasPhysicalItem(cart);
    var mealVoucherReady = !cartNeedsMealVoucherChoice(cart)
      || mealVoucherChoiceComplete(selectedMealVoucherPreference());
    reviewButton.disabled = !cartIsOrderable(cart, products) || !casesInStock;
    checkoutButton.disabled = !casesInStock || !checkoutEnabled || legal.status !== 'published' || !terms.checked || !mealVoucherReady || !cartIsOrderable(cart, products) || (physicalCart && delivery[selectedDeliveryMethod]?.available !== true);
  }

  function isPriced(id) {
    var product = products[id];
    if (!product || !product.available) return false;
    return id !== 'pax_a920' || products.terminal_case.available === true;
  }

  function canAddProduct(id, previewVariant) {
    var product = products[id];
    if (id === 'pax_a920' && !caseInStock(previewVariant || selectedTerminalCaseVariant)) return false;
    if (id === 'terminal_case_extra' && !caseInStock(previewVariant || selectedExtraCaseVariant)) return false;
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
    var selected = caseVariants.find(function (variant) { return variant.id === selectedId; }) || caseVariants[0];
    var gallerySources = gallerySourcesFor(p, caseKind, selected);
    var gallery = gallerySources.map(function (src, index) { return '<img src="' + src + '" alt="' + (index ? name + (window.HUGO_LANG === 'en' ? ' in use' : ' v provozu') : name) + '">'; }).join('');
    var specs = productSpecs.map(function (row) { return '<li><span>' + row[0] + '</span><strong>' + row[1] + '</strong></li>'; }).join('');
    var swatches = '';
    if (caseKind) {
      swatches = '<div class="swatches dialog-swatches" role="radiogroup" aria-label="' + t('caseColour') + '">' + caseVariants.map(function (variant) {
        var active = variant.id === selected.id;
        var variantName = caseVariantName(variant);
        return '<button class="swatch' + (active ? ' is-active' : '') + '" style="--swatch:' + variant.color + '" data-variant="' + variant.id + '" data-image="' + variant.image + '" type="button" aria-label="' + variantName + '" aria-checked="' + (active ? 'true' : 'false') + '" role="radio"></button>';
      }).join('') + '<span class="swatch-name" aria-live="polite">' + caseVariantName(selected) + '</span></div><p class="stock-note" aria-live="polite" hidden></p>';
    }
    // HUGO-1662 — a priced product always gets its real add button; for case products
    // `renderStockNote` then enables/labels it for the SELECTED colour, so switching from
    // a restocking colour to an in-stock one inside the dialog makes it buyable again.
    var orderId = p.id === 'terminal_case' ? 'terminal_case_extra' : p.id;
    var button = !isPriced(orderId)
      ? '<button class="add-button" type="button" disabled>' + t('preparing') + '</button>'
      : (p.id === 'terminal_case'
        ? '<button class="add-button" data-add-case type="button">' + t('addExtraCase') + '</button>'
        : '<button class="add-button" data-dialog-add="' + p.id + '" type="button">' + t('addToCart') + '</button>');
    var interactiveGallery = caseKind ? gallery.replace('<img ', '<img data-case-image ') : gallery;
    dialogContent.innerHTML = '<div class="dialog-layout"' + (caseKind ? ' data-case-scope data-case-kind="' + caseKind + '"' : '') + '><div class="dialog-gallery">' + interactiveGallery + '</div><div class="dialog-copy"><p class="eyebrow">' + kicker + '</p><h2 id="product-dialog-title">' + name + '</h2><p class="lead">' + lead + '</p>' + swatches + '<ul class="specs">' + specs + '</ul>' + button + '</div></div>';
    if (caseKind) { markRestockingSwatches(); previewSwatch(dialogContent.querySelector('[data-variant="' + selected.id + '"]')); refreshStockNotes(); }
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

  function applyCaseStock(list) {
    caseStock = Object.fromEntries((Array.isArray(list) ? list : [])
      .filter(function (item) { return item && typeof item.id === 'string'; })
      .map(function (item) { return [item.id, item.inStock === true]; }));
    if (!caseInStock(selectedTerminalCaseVariant)) selectedTerminalCaseVariant = DEFAULT_CASE_VARIANT;
    if (!caseInStock(selectedExtraCaseVariant)) selectedExtraCaseVariant = DEFAULT_CASE_VARIANT;
    ['included', 'extra'].forEach(function (kind) {
      var selectedId = kind === 'included' ? selectedTerminalCaseVariant : selectedExtraCaseVariant;
      document.querySelectorAll('[data-case-kind="' + kind + '"] .swatch').forEach(function (node) {
        var active = node.dataset.variant === selectedId;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    });
    markRestockingSwatches();
    syncCaseLine();
  }

  function addLabelFor(btn) {
    if (btn.hasAttribute('data-add-case')) return t('addExtraCase');
    if (btn.hasAttribute('data-dialog-add')) return t('addToCart');
    return t('add');
  }

  function renderStockNote(scope, variant) {
    if (!scope) return;
    var note = scope.querySelector('.stock-note');
    var inStock = caseInStock(variant.id);
    if (note) {
      note.hidden = inStock;
      note.textContent = '';
      if (!inStock) {
        var names = caseVariants.filter(function (item) { return caseStock[item.id] === true; }).map(caseVariantName).join(', ');
        var lead = document.createElement('b');
        lead.textContent = t('restocking');
        note.appendChild(lead);
        note.appendChild(document.createTextNode(' ' + t('restockingText').replace('{name}', caseVariantName(variant)).replace('{inStock}', names)));
      }
    }
    scope.querySelectorAll('[data-add], [data-dialog-add], [data-add-case]').forEach(function (btn) {
      var id = btn.dataset.add || btn.dataset.dialogAdd || (btn.hasAttribute('data-add-case') ? 'terminal_case_extra' : null);
      if (!id) return;
      btn.disabled = !canAddProduct(id, variant.id);
      btn.textContent = inStock ? addLabelFor(btn) : t('restockingButton');
    });
  }

  function refreshStockNotes() {
    document.querySelectorAll('[data-case-scope]').forEach(function (scope) {
      var active = scope.querySelector('.swatch.is-active');
      var variant = active && caseVariants.find(function (item) { return item.id === active.dataset.variant; });
      if (variant) renderStockNote(scope, variant);
    });
  }

  function markRestockingSwatches() {
    document.querySelectorAll('.swatch[data-variant]').forEach(function (node) {
      node.classList.toggle('is-restocking', !caseInStock(node.dataset.variant));
    });
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
    refreshStockNotes();
    syncCaseLine();
    renderCart();
  }

  function startCheckout() {
    if (checkoutButton.disabled) return;
    checkoutButton.disabled = true;
    checkoutButton.textContent = t('opening');
    // HUGO-1694 — a non-physical-only cart has nothing to deliver, so it never sends a
    // delivery method (mirrors the Admin shop and the server's own rule).
    var checkoutPayload = { items: cart.map(function (line) { return { id: line.id, qty: line.qty || 1, variant: line.variant || undefined }; }), termsAccepted: true, termsVersion: legal.version, locale: window.HUGO_LANG };
    if (cartHasPhysicalItem(cart)) checkoutPayload.deliveryMethod = selectedDeliveryMethod;
    if (cartNeedsMealVoucherChoice(cart)) checkoutPayload.mealVouchers = selectedMealVoucherPreference();
    var idempotencyKey = crypto.randomUUID();
    if (window.self !== window.top && new URLSearchParams(location.search).get('embedded') === '1') {
      window.parent.postMessage({ type: 'hugo:eshop-checkout', payload: checkoutPayload, idempotencyKey: idempotencyKey }, adminBase());
      return;
    }
    fetch(apiBase() + '/v1/public/eshop/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(checkoutPayload)
    }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(t(body?.error?.code === 'case_variant_out_of_stock' ? 'restockingCheckout' : 'checkoutError')); return body; }); })
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
        // HUGO-1694 — a cart that settles at 0 Kč (e.g. android_tap_to_pay alone)
        // may complete as paymentStatus "no_payment_required" or "paid". The API's
        // `settled` field is the ONE canonical answer to "is this order done" — never
        // re-derive it here from paymentStatus.
        if (body.settled !== true) return;
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
      // HUGO-1662 — never add a previewed colour that is restocking; select it instead so
      // the note explains why nothing was added.
      if (!preview) return;
      if (!caseInStock(preview.dataset.variant)) { selectSwatch(preview); return; }
      selectSwatch(preview);
      addProduct('terminal_case_extra');
      dialog.close();
    }
    var swatch = event.target.closest('.swatch');
    if (swatch) selectSwatch(swatch);
  });
  document.addEventListener('mouseover', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  document.addEventListener('mouseout', function (event) {
    var group = event.target.closest('.swatches');
    if (!group || group.contains(event.relatedTarget)) return;
    previewSwatch(group.querySelector('.swatch.is-active'));
  });
  document.addEventListener('focusin', function (event) { var swatch = event.target.closest('.swatch'); if (swatch) previewSwatch(swatch); });
  bagButton.addEventListener('click', openCart);
  reviewButton.addEventListener('click', function () { showCartStep('review'); });
  cartBack.addEventListener('click', function () { showCartStep('items'); });
  document.getElementById('cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  terms.addEventListener('change', updateCheckoutState);
  document.querySelectorAll('[name="meal-voucher-acceptance"], [name="meal-voucher-provider"]').forEach(function (input) {
    input.addEventListener('change', function () {
      renderMealVoucherChoice();
      updateCheckoutState();
    });
  });
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
    document.querySelectorAll('[data-case-scope] .swatch.is-active').forEach(previewSwatch); refreshStockNotes();
  });
  restoreCart();
  markRestockingSwatches();
  document.querySelectorAll('[data-case-scope] .swatch.is-active').forEach(previewSwatch); refreshStockNotes();
  loadCatalogue();
  renderCart();
  showSuccessIfNeeded();
})();
