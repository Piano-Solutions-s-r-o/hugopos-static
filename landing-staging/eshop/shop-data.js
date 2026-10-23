(function (root) {
  'use strict';
  // The storefront's static catalogue: which products exist, how they are grouped and
  // which photos they show. Availability and every amount are never written here — they
  // arrive from GET /v1/public/eshop/catalogue (shop-catalogue.js), and a product the
  // server does not price stays unavailable. Product copy (names, descriptions, specs) is
  // in shop-i18n.js under `products.<id>`.
  //
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
  function product(id, image, extra) {
    var entry = { id: id, image: ASSET_ROOT + image, gallery: [ASSET_ROOT + image], available: false, price: null };
    Object.keys(extra || {}).forEach(function (key) { entry[key] = extra[key]; });
    return entry;
  }
  var SWIVEL_STAND_PHOTOS = [ASSET_ROOT + 'tablet-stand-swivel.webp', ASSET_ROOT + 'tablet-stand-swivel-tablet.webp'];
  var UGREEN_STAND_PHOTOS = [ASSET_ROOT + 'tablet-stand-aluminium.webp', ASSET_ROOT + 'tablet-stand-aluminium-desk.webp'];
  var products = {
    // `includes` — a 0 Kč line that rides along with this product (HUGO-1662 case,
    // HUGO-2182 tablet stands). The product is orderable only while that line is too.
    pax_a920: product('pax_a920', 'case-red-impulse.jpg', {
      image: TERMINAL_IMAGE,
      gallery: [TERMINAL_IMAGE, ASSET_ROOT + 'terminal-in-use.jpg', ASSET_ROOT + 'terminal-hugo-views.jpg'],
      includes: 'terminal_case'
    }),
    terminal_case: product('terminal_case', 'case-sun-spark.jpg', {
      gallery: [ASSET_ROOT + 'case-sun-spark.jpg', ASSET_ROOT + 'case-red-impulse.jpg', ASSET_ROOT + 'case-electric-blue.jpg']
    }),
    terminal_case_extra: product('terminal_case_extra', 'case-sun-spark.jpg'),
    belt_holster: product('belt_holster', 'belt-holster-temp.jpg', {
      gallery: [ASSET_ROOT + 'belt-holster-temp.jpg', ASSET_ROOT + 'terminal-cafe-temp.jpg']
    }),
    charging_base_a920: product('charging_base_a920', 'charging-base-a920.webp'),
    printer_zj5809: product('printer_zj5809', 'printer-zj5809.jpg'),
    paper_roll_57: product('paper_roll_57', 'paper-roll-57.svg'),
    printer_rp110: product('printer_rp110', 'printer-rp110.webp'),
    paper_roll_80: product('paper_roll_80', 'paper-roll-80.svg'),
    // A free (0 Kč) software feature sold through the normal cart → checkout → Stripe
    // pipeline like every other product: its own catalogue entry, its own Stripe price
    // (tagged non-physical server-side), just never fulfilled as hardware.
    android_tap_to_pay: product('android_tap_to_pay', 'android-tap-to-pay.svg'),
    // HUGO-2182 — a tablet is a bundle: the tablet line plus its own 0 Kč stand line at the
    // same quantity, mirroring `terminal_case` 1:1 (one stand SKU per tablet, server rule in
    // API/src/routes/eshop_public_cart.js). The Lenovo and the iPad come with the swivel
    // aluminium stand, the Samsung with the UGREEN foldable one.
    tablet_idea_tab_pro: product('tablet_idea_tab_pro', 'tablet-idea-tab-pro.webp', { includes: 'tablet_idea_tab_pro_stand' }),
    tablet_ipad_11: product('tablet_ipad_11', 'tablet-ipad-11.webp', { includes: 'tablet_ipad_11_stand' }),
    tablet_galaxy_tab_a11_plus: product('tablet_galaxy_tab_a11_plus', 'tablet-galaxy-tab-a11-plus.webp', {
      gallery: [ASSET_ROOT + 'tablet-galaxy-tab-a11-plus.webp', ASSET_ROOT + 'tablet-galaxy-tab-a11-plus-side.webp'],
      includes: 'tablet_galaxy_tab_a11_plus_stand'
    }),
    // Stands are never a card and never added, persisted or restored on their own: the
    // cart derives them from their tablet (`withIncludedStands`). `label` names the copy key.
    tablet_idea_tab_pro_stand: product('tablet_idea_tab_pro_stand', 'tablet-stand-swivel.webp', { includedWith: 'tablet_idea_tab_pro', label: 'standSwivelIncluded', gallery: SWIVEL_STAND_PHOTOS }),
    tablet_ipad_11_stand: product('tablet_ipad_11_stand', 'tablet-stand-swivel.webp', { includedWith: 'tablet_ipad_11', label: 'standSwivelIncluded', gallery: SWIVEL_STAND_PHOTOS }),
    tablet_galaxy_tab_a11_plus_stand: product('tablet_galaxy_tab_a11_plus_stand', 'tablet-stand-aluminium.webp', { includedWith: 'tablet_galaxy_tab_a11_plus', label: 'standUgreenIncluded', gallery: UGREEN_STAND_PHOTOS }),
    // A service sold as a 2-hour package (HUGO-2274): quantity = packages (1–99), the server
    // catalogue prices one package; the stepper shows the hours of work (packages × 2).
    network_install_service: product('network_install_service', 'network-install-service.svg', { unit: 'hour' })
  };
  // HUGO-2182 — the grid is grouped like the Admin shop (Admin/src/pages/shop/catalogue.js
  // PRODUCT_SECTIONS). The cards in index.html follow this order exactly (test-pinned).
  // HUGO-2252 — the Lenovo (`tablet_idea_tab_pro`) is temporarily withdrawn: no card, no cart
  // line (shop-handoff.js), and the server refuses it. Its product entry above stays, so
  // selling it again means putting it back here, in index.html and in CART_IDS.
  var PRODUCT_SECTIONS = [
    { id: 'terminal', productIds: ['pax_a920', 'terminal_case', 'belt_holster', 'charging_base_a920'] },
    { id: 'printers', productIds: ['printer_zj5809', 'paper_roll_57', 'printer_rp110', 'paper_roll_80'] },
    { id: 'mobile', productIds: ['android_tap_to_pay', 'tablet_ipad_11', 'tablet_galaxy_tab_a11_plus'] },
    { id: 'installation', productIds: ['network_install_service'] }
  ];
  var productOrder = PRODUCT_SECTIONS.reduce(function (ids, section) { return ids.concat(section.productIds); }, []);
  // Products that ship nothing (HUGO-1694) — mirrors the server's `physical: false` flag
  // (API/src/config/eshop_prices.js). A cart containing ONLY these needs no delivery
  // method choice and is never charged the DPD fee; the server enforces the same rule
  // independently, this only keeps the storefront from asking a question it doesn't need to.
  // Admin/src/pages/shop/nonPhysicalIds.crossCheck.test.js keeps all three lists identical.
  var NON_PHYSICAL_IDS = ['android_tap_to_pay', 'network_install_service'];
  var MEAL_VOUCHER_PRODUCT_IDS = ['pax_a920', 'android_tap_to_pay'];
  // HUGO-1662 — mirrors the API default, which must be an in-stock colour. Which colours
  // are in stock is never hardcoded here: it arrives with the catalogue
  // (`caseVariants[].inStock`), and the API refuses a restocking colour at checkout.
  var DEFAULT_CASE_VARIANT = 'red_impulse';
  var CART_STORAGE_KEY = 'hugo-eshop-cart-v1';
  var MAX_QUANTITY = 99;
  var HOURS_PER_PACKAGE = 2;

  var api = {
    ASSET_ROOT: ASSET_ROOT,
    CART_STORAGE_KEY: CART_STORAGE_KEY,
    caseVariants: caseVariants,
    DEFAULT_CASE_VARIANT: DEFAULT_CASE_VARIANT,
    MAX_QUANTITY: MAX_QUANTITY,
    HOURS_PER_PACKAGE: HOURS_PER_PACKAGE,
    MEAL_VOUCHER_PRODUCT_IDS: MEAL_VOUCHER_PRODUCT_IDS,
    NON_PHYSICAL_IDS: NON_PHYSICAL_IDS,
    PRODUCT_SECTIONS: PRODUCT_SECTIONS,
    productOrder: productOrder,
    products: products,
    TERMINAL_IMAGE: TERMINAL_IMAGE
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HugoEshopData = api;
}(typeof window !== 'undefined' ? window : globalThis));
