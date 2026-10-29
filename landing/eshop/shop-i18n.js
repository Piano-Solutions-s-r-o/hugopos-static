(function () {
  'use strict';

  var copy = {
    cs: {
      navLinks: ['Produkt', 'AI & Brain', 'Spuštění', 'Ceník', 'E-shop', 'Reference'], startFree: 'Začít zdarma', cart: 'Košík',
      heroEyebrow: 'Hugo hardware', heroTitle: 'Nejdřív si <span class="hl">vyber.</span><br><em>Účet doladíme potom.</em>',
      heroLead: 'Terminál objednáš jako v každém dobrém e-shopu. Po zaplacení už zbývá jen krůček — přihlásit se a doklikat pár údajů.',
      pickHardware: 'Vybrat hardware', needAdvice: 'Potřebuji poradit',
      trust: ['Bezpečná platba', 'Jednoduchost', 'Kvalita'],
      heroCaption: 'Terminál, který na place nepřekáží.', sectionEyebrow: 'Vyber si svoje tempo',
      sectionTitle: 'Vše, co tvůj podnik potřebuje. <em>Žádný katalog na sto stran.</em>',
      shelfTitles: ['Terminál a příslušenství', 'Tiskárny a papír', 'Telefon a tablety', 'Instalace'],
      details: 'Prohlédnout detail', add: 'Přidat', chooseColour: 'Přidat další obal', freeCase: 'První obal v ceně terminálu',
      standSwivelIncluded: 'Otočný hliníkový stojánek v ceně', standUgreenIncluded: 'Skládací stojánek UGREEN v ceně',
      perHour: '{amount} / 2 hod', hoursLine: '{hours} × {rate}', hoursValue: '{hours} hod', hoursLabel: 'Počet hodin', addHour: 'Přidat další 2 hodiny', removeHour: 'Ubrat 2 hodiny',
      free: 'Zdarma', freeFeatureNote: 'funkce v aplikaci Hugo',
      guideEyebrow: 'Těžký výběr?', guideTitle: 'Nevíš, co vzít? <em>Začni tady.</em>',
      guideSteps: ['01 · Základ', '02 · Ochrana', '03 · Volné ruce'],
      guideTitles: ['Chci rovnou prodávat', 'Terminál mám pořád v ruce', 'Běhám mezi stoly'],
      guideDescriptions: ['Vezmi terminál. Obal je v ceně a držák můžeš doplnit.', 'Obal jistí úchop a tlumí každodenní malé pády.', 'Kožené pouzdro drží terminál na pásku a nepřekáží.'],
      guideLinks: ['Ukázat terminál →', 'Vybrat barvu →', 'Prohlédnout pouzdro →'],
      afterEyebrow: 'Po zaplacení', afterTitle: 'Nákup hotový. <em>Teď už jen krůček.</em>',
      afterText: 'Použij stejný e-mail. Pokud už účet máš, přihlásíš se k němu a objednávku spojíme. Pokud ne, založíme nový — bez opisování nákupu.',
      cartTitle: 'Tvůj košík', reviewTitle: 'Rekapitulace objednávky', reviewOrder: 'Pokračovat k objednávce', backToCart: 'Zpět do košíku', deliveryTitle: 'Doprava', deliveryOptions: ['Doprava DPD', 'Osobní odběr'], shipsWithin: 'Odesíláme do 2 pracovních dnů od zaplacení. Spěcháš? Objednej v pracovní den do 10:30 a odešleme to ještě ten samý den. Číslo zásilky DPD pak uvidíš v Hugo Adminu.', termsPrefix: 'Souhlasím s', termsLink: 'obchodními podmínkami nákupu hardwaru',
      mealVoucherTitle: 'Přijímáš stravenky?', mealVoucherHint: 'Volbu předáme supportu v poznámce objednávky, aby mohl zařídit smlouvy.', mealVoucherAnswers: ['Ano', 'Ne'], mealVoucherProvidersTitle: 'Vyber alespoň jednoho poskytovatele', mealVoucherProviders: ['Edenred', 'UP', 'Pluxee', 'Benefit Plus'], mealVoucherPreparing: 'Připravujeme',
      draft: 'E-shopové VOP jsou zatím pracovní návrh. Platbu zapneme až po jejich schválení.',
      checkout: 'Pokračovat k bezpečné platbě', accountShortcut: 'Už máš účet? Přihlas se. Košík zůstane a adresu doplníme za tebe.',
      successEyebrow: 'Je to doma', successTitle: 'Nákup je hotový. 🎉',
      successText: 'Teď už jen krůček: přihlas se nebo založ účet stejným e-mailem jako při nákupu.',
      finishAccount: 'Přihlásit nebo založit účet', successLinkedTitle: 'Nákup je hotový a propojený. 🎉',
      successLinkedText: 'Objednávku jsme rovnou přiřadili k tvé firmě a provozovně.',
      successShipsLinked: 'Zásilku odešleme do 2 pracovních dnů. Číslo zásilky DPD pak najdeš v Hugo Adminu v sekci Předplatné a fakturace, i s odkazem na sledování u DPD.',
      successShipsGuest: 'Zásilku odešleme do 2 pracovních dnů. Až se přihlásíš, najdeš číslo zásilky DPD v Hugo Adminu v sekci Předplatné a fakturace.',
      viewOrders: 'Zobrazit moje objednávky',
      footerDescription: 'Pokladna postavená kolem tvého menu a tvých hostů, na terminálu 3\u00a0v\u00a01, telefonu i tabletu. Ne naopak.',
      footerHeadings: ['Produkt', 'Podpora'],
      footerLinks: ['Zařízení', 'AI & Brain', 'Spuštění', 'Ceník', 'hugo@piano.cz', 'Stav služeb', 'Přihlásit se'],
      footerCopyright: '© 2026 Hugo · český produkt od Piana · <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>',
      footerLegal: ['Všeobecné obchodní podmínky', 'Kontakt', 'GDPR', 'English', 'VOP e-shopu'],
      empty: 'Zatím je tu vzdušno.', unavailable: 'Cena je právě nedostupná', freeIncluded: 'V ceně terminálu',
      freeHint: 'Výchozí barva je Rudý impuls.', extraCasePrice: 'Každý další', extraCaseLabel: 'Další obal na terminál',
      priceNote: 'bez DPH', priceNoteInclusive: 'včetně DPH', inclVat: 'včetně DPH', exclVat: 'bez DPH',
      opening: 'Otevírám bezpečnou platbu…', checkoutError: 'Platbu se nepodařilo otevřít. Zkus to prosím znovu.',
      useColour: 'Použít tuto barvu', addExtraCase: 'Přidat další obal', addToCart: 'Přidat do košíku', preparing: 'Připravujeme', restocking: 'Naskladňujeme.', restockingButton: 'Naskladňujeme', restockingCheckout: 'Vybraná barva obalu se právě naskladňuje. Zvol barvu skladem a zkus to znovu.', restockingText: '{name} je na cestě k nám. Hned můžeme poslat: {inStock}.',
      remove: 'Odebrat', caseColour: 'Barva obalu', caseAlt: 'ochranný obal na platební terminál',
      title: 'E-shop — terminály a příslušenství Hugo', description: 'Vyber si terminál a příslušenství Hugo. Nejdřív nákup, potom už jen pár kliknutí k hotovému účtu.',
      a11y: ['Hugo — domů', 'Hlavní navigace', 'Výhody nákupu', 'Barva obalu', 'Košík', 'Zavřít košík', 'Zavřít detail', 'Obsluha přijímá platbu kartou na žlutém terminálu Hugo']
    },
    en: {
      navLinks: ['Product', 'AI & Brain', 'Setup', 'Pricing', 'E-shop', 'Customers'], startFree: 'Start free', cart: 'Bag',
      heroEyebrow: 'Hugo hardware', heroTitle: 'Choose first.<br><em>Finish the account later.</em>',
      heroLead: 'Order your terminal like in any good online shop. After payment, there is only one small step left — sign in and confirm a few details.',
      pickHardware: 'Choose hardware', needAdvice: 'Help me choose',
      trust: ['Secure payment', 'Simplicity', 'Quality'],
      heroCaption: 'A terminal that never gets in the way.', sectionEyebrow: 'Choose your pace',
      sectionTitle: 'Everything your venue needs. <em>No hundred-page catalogue.</em>',
      shelfTitles: ['Terminal and accessories', 'Printers and paper', 'Phone and tablets', 'Installation'],
      details: 'View details', add: 'Add', chooseColour: 'Add another case', freeCase: 'First case included with terminal',
      standSwivelIncluded: 'Swivel aluminium stand included', standUgreenIncluded: 'UGREEN foldable stand included',
      perHour: '{amount} / 2 hours', hoursLine: '{hours} × {rate}', hoursValue: '{hours} h', hoursLabel: 'Hours', addHour: 'Add 2 more hours', removeHour: 'Remove 2 hours',
      free: 'Free', freeFeatureNote: 'a feature in the Hugo app',
      guideEyebrow: 'Hard to choose?', guideTitle: 'Not sure what to get? <em>Start here.</em>',
      guideSteps: ['01 · Essentials', '02 · Protection', '03 · Hands free'],
      guideTitles: ['I want to start selling', 'The terminal is always in my hand', 'I move between tables'],
      guideDescriptions: ['Take the terminal. The case is included and you can add the holster.', 'The case improves grip and softens everyday small drops.', 'The leather holster keeps the terminal on your belt and out of the way.'],
      guideLinks: ['Show terminal →', 'Choose colour →', 'View holster →'],
      afterEyebrow: 'After payment', afterTitle: 'Purchase complete. <em>Just one small step left.</em>',
      afterText: 'Use the same email. If you already have an account, sign in and we will link the order. If not, create one without re-entering the purchase.',
      cartTitle: 'Your bag', reviewTitle: 'Order review', reviewOrder: 'Continue to order review', backToCart: 'Back to bag', deliveryTitle: 'Delivery', deliveryOptions: ['DPD delivery', 'Personal pickup'], shipsWithin: 'We ship within 2 business days of payment. In a hurry? Order on a business day by 10:30 and we ship the same day. You\'ll then see the DPD tracking number in Hugo Admin.', termsPrefix: 'I agree to the', termsLink: 'hardware purchase terms',
      mealVoucherTitle: 'Do you accept meal vouchers?', mealVoucherHint: 'We will add this choice to the order note so support can arrange the contracts.', mealVoucherAnswers: ['Yes', 'No'], mealVoucherProvidersTitle: 'Choose at least one provider', mealVoucherProviders: ['Edenred', 'UP', 'Pluxee', 'Benefit Plus'], mealVoucherPreparing: 'Coming soon',
      draft: 'The shop terms are still a draft. Payments will open after approval.', checkout: 'Continue to secure payment',
      accountShortcut: 'Already have an account? Sign in. Your cart stays and we will prefill your address.',
      successEyebrow: 'It is yours', successTitle: 'Purchase complete. 🎉',
      successText: 'Just one small step left: sign in or create an account using the same email as your purchase.',
      finishAccount: 'Sign in or create account', successLinkedTitle: 'Purchase complete and linked. 🎉',
      successLinkedText: 'We assigned the order directly to your business and venue.',
      successShipsLinked: 'We\'ll ship within 2 business days. You\'ll then find the DPD tracking number in Hugo Admin under Subscription & invoicing, with a link to track it on the DPD website.',
      successShipsGuest: 'We\'ll ship within 2 business days. Once you sign in, you\'ll find the DPD tracking number in Hugo Admin under Subscription & invoicing.',
      viewOrders: 'View my orders',
      footerDescription: 'The point-of-sale built around your menu and your customers — on a 3-in-1 terminal, a phone or a tablet. Not the other way around.',
      footerHeadings: ['Product', 'Support'],
      footerLinks: ['Devices', 'AI & Brain', 'Getting started', 'Pricing', 'hugo@piano.cz', 'Service status', 'Sign in'],
      footerCopyright: '© 2026 Hugo · a Czech product by Piano · <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>',
      footerLegal: ['Terms & conditions', 'Contact', 'GDPR', 'Česky', 'Shop terms'],
      empty: 'Nothing here yet.', unavailable: 'Price is temporarily unavailable', freeIncluded: 'Included with terminal',
      freeHint: 'Red Impulse is the default colour.', extraCasePrice: 'Each additional case', extraCaseLabel: 'Additional terminal case',
      priceNote: 'excl. VAT',
      priceNoteInclusive: 'incl. VAT', inclVat: 'incl. VAT', exclVat: 'excl. VAT',
      opening: 'Opening secure payment…', checkoutError: 'Payment could not be opened. Please try again.',
      useColour: 'Use this colour', addExtraCase: 'Add another case', addToCart: 'Add to bag', preparing: 'Coming soon', restocking: 'Restocking.', restockingButton: 'Restocking', restockingCheckout: 'The chosen case colour is being restocked. Pick an in-stock colour and try again.', restockingText: '{name} is on its way to us. Ready to ship now: {inStock}.',
      remove: 'Remove', caseColour: 'Case colour', caseAlt: 'protective payment-terminal case',
      title: 'Shop — Hugo terminals and accessories', description: 'Choose your Hugo terminal and accessories. Purchase first, then finish your account in a few clicks.',
      a11y: ['Hugo — home', 'Main navigation', 'Purchase benefits', 'Case colour', 'Bag', 'Close bag', 'Close details', 'A server accepts a card payment on a yellow Hugo terminal']
    }
  };
  // Product copy is keyed by catalogue id in shop-i18n-products.js (loaded first).
  var productCopy = window.HugoEshopProductCopy || { cs: {}, en: {} };
  copy.cs.products = productCopy.cs;
  copy.en.products = productCopy.en;

  var entries = [
    ['.nav .nav-links a', 'allText', 'navLinks'], ['#account-link', 'cta', 'startFree'], ['#bag-button', 'bag', 'cart'],
    ['.hero .eyebrow', 'text', 'heroEyebrow'], ['.hero h1', 'html', 'heroTitle'], ['.hero-lead', 'text', 'heroLead'],
    ['.hero-actions a', 'allText', ['pickHardware', 'needAdvice']], ['.trust li > span', 'allText', 'trust'],
    ['.hero-photo figcaption', 'text', 'heroCaption'], ['.products .section-head .eyebrow', 'text', 'sectionEyebrow'],
    ['.products .section-head h2', 'html', 'sectionTitle'], ['.shelf-title', 'allText', 'shelfTitles'],
    ['.product-card .text-link', 'text', 'details'],
    ['.product-card [data-add]', 'text', 'add'], ['.product-card [data-open-product="terminal_case"]', 'text', 'chooseColour'],
    ['.guide-title .eyebrow', 'text', 'guideEyebrow'], ['.guide-title h2', 'html', 'guideTitle'],
    ['.guide-card > span', 'allText', 'guideSteps'], ['.guide-card h3', 'allText', 'guideTitles'],
    ['.guide-card p', 'allText', 'guideDescriptions'], ['.guide-card strong', 'allText', 'guideLinks'],
    ['.aftercare .eyebrow', 'text', 'afterEyebrow'], ['.aftercare h2', 'html', 'afterTitle'], ['.aftercare p:last-child', 'text', 'afterText'],
    ['.cart-head h2', 'text', 'cartTitle'], ['#review-button', 'text', 'reviewOrder'], ['#cart-back', 'aria', 'backToCart'], ['.delivery-choice legend', 'text', 'deliveryTitle'],
    ['.meal-voucher-choice legend', 'text', 'mealVoucherTitle'], ['.meal-voucher-hint', 'text', 'mealVoucherHint'], ['.meal-voucher-answer span', 'allText', 'mealVoucherAnswers'],
    ['.meal-voucher-providers > strong', 'text', 'mealVoucherProvidersTitle'], ['.meal-voucher-providers label > span', 'allText', 'mealVoucherProviders'], ['.meal-voucher-providers small', 'text', 'mealVoucherPreparing'],
    ['.delivery-choice label > span', 'allText', 'deliveryOptions'], ['#dpd-ships-within', 'text', 'shipsWithin'], ['.terms span', 'terms', null], ['#checkout-note', 'text', 'draft'],
    ['#checkout-button', 'text', 'checkout'], ['.account-shortcut', 'text', 'accountShortcut'],
    ['#success .eyebrow', 'text', 'successEyebrow'], ['#success h2', 'text', 'successTitle'],
    ['#success-text', 'text', 'successText'], ['#continue-account', 'text', 'finishAccount'],
    ['footer .foot-brand p', 'text', 'footerDescription'],
    ['footer .foot-col h5', 'allText', 'footerHeadings'], ['footer .foot-col a', 'allText', 'footerLinks'],
    ['footer .foot-bottom > div:first-child', 'html', 'footerCopyright'], ['footer .foot-bottom .legal a', 'allText', 'footerLegal']
  ];

  function lang() {
    try { return localStorage.getItem('hugo-lang') === 'en' ? 'en' : 'cs'; } catch (_error) { return 'cs'; }
  }

  function t(key) { return (copy[window.HUGO_LANG] || copy.cs)[key] || key; }

  // Each card takes its copy from `products.<data-product>` — never from its position.
  function applyProductCards() {
    var all = t('products');
    document.querySelectorAll('.product-card[data-product]').forEach(function (card) {
      var item = all[card.dataset.product] || {};
      [['.kicker', 'kicker'], ['.product-copy h4', 'title'], ['.product-desc', 'description'], ['.included-note', 'included']].forEach(function (row) {
        var node = card.querySelector(row[0]);
        if (node && item[row[1]]) node.textContent = item[row[1]];
      });
      var open = card.querySelector('.image-button');
      if (open && item.imageLabel) open.setAttribute('aria-label', item.imageLabel);
      var image = card.querySelector('.image-button img');
      if (image && item.imageAlt) image.setAttribute('alt', item.imageAlt);
    });
  }

  function apply(next) {
    window.HUGO_LANG = next === 'en' ? 'en' : 'cs';
    try { localStorage.setItem('hugo-lang', window.HUGO_LANG); } catch (_error) {}
    document.documentElement.lang = window.HUGO_LANG;
    document.title = t('title');
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('description'));
    entries.forEach(function (entry) {
      var nodes = document.querySelectorAll(entry[0]);
      var type = entry[1];
      var value = entry[2];
      if (type === 'terms') {
        if (nodes[0]) nodes[0].innerHTML = t('termsPrefix') + ' <a href="/obchodni-podminky-eshop/" target="_blank" rel="noopener">' + t('termsLink') + '</a>.';
        return;
      }
      if (type === 'bag') {
        if (nodes[0] && nodes[0].firstChild) nodes[0].firstChild.textContent = t(value) + ' ';
        return;
      }
      if (type === 'cta') {
        if (nodes[0] && nodes[0].firstChild) nodes[0].firstChild.textContent = t(value) + ' ';
        return;
      }
      if (type === 'aria') {
        if (nodes[0]) nodes[0].setAttribute('aria-label', t(value));
        return;
      }
      if (type === 'allText') value = Array.isArray(value) ? value.map(t) : t(value);
      else value = t(value);
      nodes.forEach(function (node, index) {
        var nextValue = Array.isArray(value) ? value[index] : value;
        if (nextValue == null) return;
        if (type === 'html') node.innerHTML = nextValue;
        else node.textContent = nextValue;
      });
    });
    document.querySelectorAll('[data-shop-lang]').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.shopLang === window.HUGO_LANG);
    });
    applyProductCards();
    var accessible = t('a11y');
    [
      ['.brand', 'aria-label'], ['.nav nav', 'aria-label'], ['.trust', 'aria-label'], ['.product-card .swatches', 'aria-label'],
      ['#cart', 'aria-label'], ['#cart-close', 'aria-label'], ['.dialog-close', 'aria-label'], ['.hero-photo img', 'alt']
    ].forEach(function (row, index) {
      var node = document.querySelector(row[0]);
      if (node) node.setAttribute(row[1], accessible[index]);
    });
    document.dispatchEvent(new CustomEvent('hugo:language', { detail: { lang: window.HUGO_LANG } }));
  }

  window.shopT = t;
  window.applyShopLang = apply;
  window.HUGO_LANG = lang();
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-shop-lang]').forEach(function (button) {
      button.addEventListener('click', function () { apply(button.dataset.shopLang); });
    });
    document.querySelector('[data-footer-lang]')?.addEventListener('click', function (event) {
      event.preventDefault();
      apply(window.HUGO_LANG === 'cs' ? 'en' : 'cs');
    });
    apply(window.HUGO_LANG);
  });
}());
