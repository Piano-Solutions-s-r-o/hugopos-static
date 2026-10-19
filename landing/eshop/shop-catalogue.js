(function () {
  'use strict';
  // The catalogue side of the page: the server catalogue (availability, every amount, case
  // stock), the product cards' prices, the product detail dialog and the case-colour
  // swatches with their restocking notes.
  var E = window.HugoEshop;
  var S = E.state;
  var shopData = E.data;
  var products = E.products;
  var t = E.t;
  var caseVariants = shopData.caseVariants;

  var checkoutNote = document.getElementById('checkout-note');
  var dialog = document.getElementById('product-dialog');
  var dialogContent = document.getElementById('dialog-content');

  function loadCatalogue() {
    fetch(E.apiBase() + '/v1/public/eshop/catalogue')
      .then(function (response) { if (!response.ok) throw new Error('catalogue'); return response.json(); })
      .then(function (data) {
        S.checkoutEnabled = data.checkoutEnabled === true;
        S.legal = data.legal || S.legal;
        checkoutNote.hidden = S.legal.status === 'published';
        E.rules.applyServerCatalogue(products, data.products);
        S.delivery = Object.fromEntries((data.delivery || []).map(function (item) { return [item.id, item]; }));
        applyCaseStock(data.caseVariants);
        E.renderDelivery();
        document.querySelectorAll('[data-add]').forEach(function (add) {
          add.disabled = !E.canAddProduct(add.dataset.add);
        });
        refreshActiveSwatches();
        renderCataloguePrices();
        // A restored cart renders before this async response. Re-render with
        // authoritative Stripe availability/prices so its totals and checkout
        // state move together.
        E.renderCart();
      })
      .catch(function () {
        renderCataloguePrices();
      });
  }

  // Every card's price comes from the server catalogue (rules.cardPriceHtml).
  function renderCataloguePrices() {
    shopData.productOrder.forEach(function (id) {
      var priceNode = document.querySelector('[data-price="' + id + '"]');
      if (priceNode) priceNode.innerHTML = E.rules.cardPriceHtml(id, products, t, window.HUGO_LANG);
    });
  }

  function openProduct(id) {
    var p = products[id];
    if (!p) return;
    var copy = E.copy(id);
    var name = E.productName(id);
    var lead = copy.lead || '';
    var productSpecs = copy.specs || [];
    var kicker = copy.kicker || '';
    var caseKind = p.id === 'pax_a920' ? 'included' : p.id === 'terminal_case' ? 'extra' : null;
    var selectedId = caseKind === 'included' ? S.selectedTerminalCaseVariant : S.selectedExtraCaseVariant;
    var selected = caseVariants.find(function (variant) { return variant.id === selectedId; }) || caseVariants[0];
    var gallerySources = E.rules.gallerySourcesFor(p, caseKind, selected);
    var gallery = gallerySources.map(function (src, index) { return '<img src="' + src + '" alt="' + (index ? name + (window.HUGO_LANG === 'en' ? ' in use' : ' v provozu') : name) + '">'; }).join('');
    // HUGO-2182 — a tablet's detail also shows the stand that comes with it.
    var stand = products[E.rules.standFor(id)];
    var included = stand ? '<p class="included-note">' + t(stand.label) + '</p>' : '';
    if (stand) gallery += stand.gallery.map(function (src) { return '<img src="' + src + '" alt="' + t(stand.label) + '">'; }).join('');
    var specs = productSpecs.map(function (row) { return '<li><span>' + row[0] + '</span><strong>' + row[1] + '</strong></li>'; }).join('');
    var swatches = '';
    if (caseKind) {
      swatches = '<div class="swatches dialog-swatches" role="radiogroup" aria-label="' + t('caseColour') + '">' + caseVariants.map(function (variant) {
        var active = variant.id === selected.id;
        var variantName = E.caseVariantName(variant);
        return '<button class="swatch' + (active ? ' is-active' : '') + '" style="--swatch:' + variant.color + '" data-variant="' + variant.id + '" data-image="' + variant.image + '" type="button" aria-label="' + variantName + '" aria-checked="' + (active ? 'true' : 'false') + '" role="radio"></button>';
      }).join('') + '<span class="swatch-name" aria-live="polite">' + E.caseVariantName(selected) + '</span></div><p class="stock-note" aria-live="polite" hidden></p>';
    }
    // HUGO-1662 — a priced product always gets its real add button; for case products
    // `renderStockNote` then enables/labels it for the SELECTED colour, so switching from
    // a restocking colour to an in-stock one inside the dialog makes it buyable again.
    var orderId = p.id === 'terminal_case' ? 'terminal_case_extra' : p.id;
    var button = !E.isPriced(orderId)
      ? '<button class="add-button" type="button" disabled>' + t('preparing') + '</button>'
      : (p.id === 'terminal_case'
        ? '<button class="add-button" data-add-case type="button">' + t('addExtraCase') + '</button>'
        : '<button class="add-button" data-dialog-add="' + p.id + '" type="button">' + t('addToCart') + '</button>');
    var interactiveGallery = caseKind ? gallery.replace('<img ', '<img data-case-image ') : gallery;
    dialogContent.innerHTML = '<div class="dialog-layout"' + (caseKind ? ' data-case-scope data-case-kind="' + caseKind + '"' : '') + '><div class="dialog-gallery">' + interactiveGallery + '</div><div class="dialog-copy"><p class="eyebrow">' + kicker + '</p><h2 id="product-dialog-title">' + name + '</h2><p class="lead">' + lead + '</p>' + included + swatches + '<ul class="specs">' + specs + '</ul>' + button + '</div></div>';
    if (caseKind) { markRestockingSwatches(); previewSwatch(dialogContent.querySelector('[data-variant="' + selected.id + '"]')); refreshStockNotes(); }
    dialog.showModal();
  }

  function previewSwatch(button) {
    if (!button) return;
    var group = button.closest('.swatches');
    var variant = caseVariants.find(function (item) { return item.id === button.dataset.variant; });
    if (!variant) return;
    var name = E.caseVariantName(variant);
    group.querySelector('.swatch-name').textContent = name;
    var image = button.closest('[data-case-scope]').querySelector('[data-case-image]');
    if (image) {
      image.src = shopData.ASSET_ROOT + button.dataset.image;
      image.alt = name + ' — ' + t('caseAlt');
    }
    if (button.closest('#dialog-content')) dialogContent.dataset.previewVariant = variant.id;
  }

  function applyCaseStock(list) {
    S.caseStock = Object.fromEntries((Array.isArray(list) ? list : [])
      .filter(function (item) { return item && typeof item.id === 'string'; })
      .map(function (item) { return [item.id, item.inStock === true]; }));
    if (!E.caseInStock(S.selectedTerminalCaseVariant)) S.selectedTerminalCaseVariant = shopData.DEFAULT_CASE_VARIANT;
    if (!E.caseInStock(S.selectedExtraCaseVariant)) S.selectedExtraCaseVariant = shopData.DEFAULT_CASE_VARIANT;
    ['included', 'extra'].forEach(function (kind) {
      var selectedId = kind === 'included' ? S.selectedTerminalCaseVariant : S.selectedExtraCaseVariant;
      document.querySelectorAll('[data-case-kind="' + kind + '"] .swatch').forEach(function (node) {
        var active = node.dataset.variant === selectedId;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    });
    markRestockingSwatches();
    E.syncIncludedLines();
  }

  function addLabelFor(btn) {
    if (btn.hasAttribute('data-add-case')) return t('addExtraCase');
    if (btn.hasAttribute('data-dialog-add')) return t('addToCart');
    return t('add');
  }

  function renderStockNote(scope, variant) {
    if (!scope) return;
    var note = scope.querySelector('.stock-note');
    var inStock = E.caseInStock(variant.id);
    if (note) {
      note.hidden = inStock;
      note.textContent = '';
      if (!inStock) {
        var names = caseVariants.filter(function (item) { return S.caseStock[item.id] === true; }).map(E.caseVariantName).join(', ');
        var lead = document.createElement('b');
        lead.textContent = t('restocking');
        note.appendChild(lead);
        note.appendChild(document.createTextNode(' ' + t('restockingText').replace('{name}', E.caseVariantName(variant)).replace('{inStock}', names)));
      }
    }
    scope.querySelectorAll('[data-add], [data-dialog-add], [data-add-case]').forEach(function (btn) {
      var id = btn.dataset.add || btn.dataset.dialogAdd || (btn.hasAttribute('data-add-case') ? 'terminal_case_extra' : null);
      if (!id) return;
      btn.disabled = !E.canAddProduct(id, variant.id);
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
      node.classList.toggle('is-restocking', !E.caseInStock(node.dataset.variant));
    });
  }

  function selectSwatch(button) {
    var kind = button.closest('[data-case-kind]').dataset.caseKind;
    if (kind === 'included') S.selectedTerminalCaseVariant = button.dataset.variant;
    else S.selectedExtraCaseVariant = button.dataset.variant;
    document.querySelectorAll('[data-case-kind="' + kind + '"] .swatch').forEach(function (node) {
      var active = node.dataset.variant === button.dataset.variant;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-checked', active ? 'true' : 'false');
      if (active) previewSwatch(node);
    });
    refreshStockNotes();
    E.syncIncludedLines();
    E.renderCart();
  }

  // Swatches change state in several places; this is the one "make every active swatch
  // show its colour and stock" step they all end with.
  function refreshActiveSwatches() {
    document.querySelectorAll('[data-case-scope] .swatch.is-active').forEach(previewSwatch); refreshStockNotes();
  }

  E.loadCatalogue = loadCatalogue;
  E.renderCataloguePrices = renderCataloguePrices;
  E.openProduct = openProduct;
  E.previewSwatch = previewSwatch;
  E.selectSwatch = selectSwatch;
  E.markRestockingSwatches = markRestockingSwatches;
  E.refreshActiveSwatches = refreshActiveSwatches;
}());
