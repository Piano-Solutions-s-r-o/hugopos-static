(function () {
  'use strict';

  var copy = {
    cs: {
      navLinks: ['Produkt', 'AI & Brain', 'Spuštění', 'Ceník', 'E-shop', 'Reference'], startFree: 'Začít zdarma', cart: 'Košík',
      heroEyebrow: 'Hugo hardware', heroTitle: 'Nejdřív si <span class="hl">vyberte.</span><br><em>Účet doladíme potom.</em>',
      heroLead: 'Terminál objednáte jako v každém dobrém e-shopu. Po zaplacení už zbývá jen krůček — přihlásit se a doklikat pár údajů.',
      pickHardware: 'Vybrat hardware', needAdvice: 'Potřebuji poradit',
      trust: ['Platba bezpečně přes Stripe', 'Firemní údaje doplníte až potom', 'Již máte účet? Adresu předvyplníme'],
      heroCaption: 'Terminál, který na place nepřekáží.', sectionEyebrow: 'Vyberte si svoje tempo',
      sectionTitle: 'Tři věci. <em>Žádný katalog na sto stran.</em>',
      cardKickers: ['All-in-one', 'Volné ruce', 'Každý den jinak'],
      cardTitles: ['Terminál Hugo', 'Kožené pouzdro na pásek', 'Obal na terminál'],
      cardDescriptions: ['Platby, účtenka a pokladna v jedné lehké krabičce.', 'Terminál po ruce, ruce připravené na tác a plný plac.', 'Měkčí dopad, jistější úchop a barva, která patří k vám.'],
      productLeads: ['Lehký terminál, na kterém běží pokladna, platby i účtenka. Bez druhé krabičky a bez kabelového zátiší.', 'Měkká kožená kapsa drží terminál u těla, ale nechá ho vytáhnout jedním pohybem. Na plac, zahrádku i event.', 'Pružný ochranný obal dává terminálu jistější úchop a vaší obsluze vlastní barvu.'],
      productSpecs: [[['Model', 'PAX A920 Pro'], ['Připojení', 'Wi-Fi · 4G · Bluetooth'], ['Použití', 'Pokladna · platby · účtenky']], [['Materiál', 'Pravá kůže · finální specifikaci doplníme'], ['Uchycení', 'Poutko na pásek'], ['Kompatibilita', 'Terminál Hugo']], [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Pět odstínů']]],
      details: 'Prohlédnout detail', add: 'Přidat', chooseColour: 'Vybrat barvu', freeCase: 'Zdarma k terminálu',
      guideEyebrow: 'Těžký výběr?', guideTitle: 'Nevíte, co vzít? <em>Začněte tady.</em>',
      guideSteps: ['01 · Základ', '02 · Ochrana', '03 · Volné ruce'],
      guideTitles: ['Chci rovnou prodávat', 'Terminál mám pořád v ruce', 'Běhám mezi stoly'],
      guideDescriptions: ['Vezměte terminál. Obal je v ceně a držák můžete doplnit.', 'Obal jistí úchop a tlumí každodenní malé pády.', 'Kožené pouzdro drží terminál na pásku a nepřekáží.'],
      guideLinks: ['Ukázat terminál →', 'Vybrat barvu →', 'Prohlédnout pouzdro →'],
      afterEyebrow: 'Po zaplacení', afterTitle: 'Nákup hotový. <em>Teď už jen krůček.</em>',
      afterText: 'Použijte stejný e-mail. Pokud už účet máte, přihlásíte se k němu a objednávku spojíme. Pokud ne, založíme nový — bez opisování nákupu.',
      cartTitle: 'Váš košík', termsPrefix: 'Souhlasím s', termsLink: 'obchodními podmínkami nákupu hardwaru',
      draft: 'E-shopové VOP jsou zatím pracovní návrh. Platbu zapneme až po jejich schválení.',
      checkout: 'Pokračovat k bezpečné platbě', accountShortcut: 'Už máte účet? Přihlaste se — košík zůstane a adresu doplníme za vás.',
      successEyebrow: 'Je to doma', successTitle: 'Nákup je hotový. 🎉',
      successText: 'Teď už jen krůček: přihlaste se nebo založte účet stejným e-mailem, který jste použili při nákupu.',
      finishAccount: 'Přihlásit nebo založit účet', successLinkedTitle: 'Nákup je hotový a propojený. 🎉',
      successLinkedText: 'Objednávku jsme rovnou přiřadili k vaší firmě a provozovně.',
      viewOrders: 'Zobrazit moje objednávky',
      footerDescription: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů — ne naopak.',
      footerPhone: 'Zavolej nám · +420 770 320 248 · Po–Ne 8–22', footerHeadings: ['Produkt', 'Podpora'],
      footerLinks: ['Zařízení', 'AI & Brain', 'Spuštění', 'Ceník', 'hugo@piano.cz', '+420 770 320 248', 'Stav služeb', 'Přihlásit se'],
      footerCopyright: '© 2026 Hugo · český produkt od Piana · <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>',
      footerLegal: ['Všeobecné obchodní podmínky', 'Kontakt', 'GDPR', 'English', 'VOP e-shopu'],
      empty: 'Zatím je tu vzdušno.', unavailable: 'Cena je právě nedostupná', freeIncluded: 'Zdarma · součást terminálu',
      freeHint: 'Vyberte barvu, jinak pošleme žlutou.', priceNote: 'bez DPH · finální částku spočítá Stripe',
      priceNoteInclusive: 'včetně DPH', inclVat: 'včetně DPH', exclVat: 'bez DPH',
      opening: 'Otevírám bezpečnou platbu…', checkoutError: 'Platbu se nepodařilo otevřít. Zkuste to prosím znovu.',
      useColour: 'Použít tuto barvu', addToCart: 'Přidat do košíku', preparing: 'Připravujeme',
      remove: 'Odebrat', caseColour: 'Barva obalu', caseAlt: 'ochranný obal na platební terminál'
      ,title: 'E-shop — terminály a příslušenství Hugo', description: 'Vyberte si terminál a příslušenství Hugo. Nejdřív nákup, potom už jen pár kliknutí k hotovému účtu.',
      a11y: ['Hugo — domů', 'Hlavní navigace', 'Výhody nákupu', 'Zobrazit detail terminálu Hugo', 'Zobrazit detail koženého pouzdra', 'Zobrazit detail ochranného obalu', 'Barva obalu', 'Košík', 'Zavřít košík', 'Zavřít detail', 'Obsluha podává hostovi platební terminál', 'Černý platební terminál PAX A920 Pro', 'Kožené pouzdro na pásek s platebním terminálem', 'Žlutý ochranný obal na platební terminál']
    },
    en: {
      navLinks: ['Product', 'AI & Brain', 'Setup', 'Pricing', 'E-shop', 'Customers'], startFree: 'Start free', cart: 'Bag',
      heroEyebrow: 'Hugo hardware', heroTitle: 'Choose first.<br><em>Finish the account later.</em>',
      heroLead: 'Order your terminal like in any good online shop. After payment, there is only one small step left — sign in and confirm a few details.',
      pickHardware: 'Choose hardware', needAdvice: 'Help me choose',
      trust: ['Secure payment with Stripe', 'Add company details afterwards', 'Already have an account? We prefill the address'],
      heroCaption: 'A terminal that never gets in the way.', sectionEyebrow: 'Choose your pace',
      sectionTitle: 'Three things. <em>No hundred-page catalogue.</em>',
      cardKickers: ['All-in-one', 'Hands free', 'A new look every day'],
      cardTitles: ['Hugo terminal', 'Leather belt holster', 'Terminal case'],
      cardDescriptions: ['Payments, receipts and POS in one light device.', 'Your terminal close by, your hands free for a tray and a busy floor.', 'A softer landing, safer grip and a colour that feels like yours.'],
      productLeads: ['A light terminal running your POS, payments and receipts. No second box and no cable clutter.', 'A soft leather pocket keeps the terminal close and releases it in one movement. Built for the floor, terrace and events.', 'A flexible protective case gives the terminal a safer grip and your team a colour of their own.'],
      productSpecs: [[['Model', 'PAX A920 Pro'], ['Connectivity', 'Wi-Fi · 4G · Bluetooth'], ['Use', 'POS · payments · receipts']], [['Material', 'Genuine leather · final specification to follow'], ['Attachment', 'Belt loop'], ['Compatibility', 'Hugo terminal']], [['Surface', 'Soft non-slip finish'], ['Protection', 'Edges and back'], ['Colours', 'Five shades']]],
      details: 'View details', add: 'Add', chooseColour: 'Choose colour', freeCase: 'Free with terminal',
      guideEyebrow: 'Hard to choose?', guideTitle: 'Not sure what to get? <em>Start here.</em>',
      guideSteps: ['01 · Essentials', '02 · Protection', '03 · Hands free'],
      guideTitles: ['I want to start selling', 'The terminal is always in my hand', 'I move between tables'],
      guideDescriptions: ['Take the terminal. The case is included and you can add the holster.', 'The case improves grip and softens everyday small drops.', 'The leather holster keeps the terminal on your belt and out of the way.'],
      guideLinks: ['Show terminal →', 'Choose colour →', 'View holster →'],
      afterEyebrow: 'After payment', afterTitle: 'Purchase complete. <em>Just one small step left.</em>',
      afterText: 'Use the same email. If you already have an account, sign in and we will link the order. If not, create one without re-entering the purchase.',
      cartTitle: 'Your bag', termsPrefix: 'I agree to the', termsLink: 'hardware purchase terms',
      draft: 'The shop terms are still a draft. Payments will open after approval.', checkout: 'Continue to secure payment',
      accountShortcut: 'Already have an account? Sign in — your cart stays and we will prefill your address.',
      successEyebrow: 'It is yours', successTitle: 'Purchase complete. 🎉',
      successText: 'Just one small step left: sign in or create an account using the same email as your purchase.',
      finishAccount: 'Sign in or create account', successLinkedTitle: 'Purchase complete and linked. 🎉',
      successLinkedText: 'We assigned the order directly to your business and venue.',
      viewOrders: 'View my orders',
      footerDescription: 'The point-of-sale built around your phone, your menu, and your customers — not the other way around.',
      footerPhone: 'Call us · +420 770 320 248 · Mon–Sun 8–22', footerHeadings: ['Product', 'Support'],
      footerLinks: ['Devices', 'AI & Brain', 'Getting started', 'Pricing', 'hugo@piano.cz', '+420 770 320 248', 'Service status', 'Sign in'],
      footerCopyright: '© 2026 Hugo · a Czech product by Piano · <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>',
      footerLegal: ['Terms & conditions', 'Contact', 'GDPR', 'Česky', 'Shop terms'],
      empty: 'Nothing here yet.', unavailable: 'Price is temporarily unavailable', freeIncluded: 'Free · included with terminal',
      freeHint: 'Choose a colour or we will send yellow.', priceNote: 'excl. VAT · Stripe calculates the final amount',
      priceNoteInclusive: 'incl. VAT', inclVat: 'incl. VAT', exclVat: 'excl. VAT',
      opening: 'Opening secure payment…', checkoutError: 'Payment could not be opened. Please try again.',
      useColour: 'Use this colour', addToCart: 'Add to bag', preparing: 'Coming soon',
      remove: 'Remove', caseColour: 'Case colour', caseAlt: 'protective payment-terminal case'
      ,title: 'Shop — Hugo terminals and accessories', description: 'Choose your Hugo terminal and accessories. Purchase first, then finish your account in a few clicks.',
      a11y: ['Hugo — home', 'Main navigation', 'Purchase benefits', 'View Hugo terminal details', 'View leather holster details', 'View protective case details', 'Case colour', 'Bag', 'Close bag', 'Close details', 'A server presents a payment terminal to a guest', 'Black PAX A920 Pro payment terminal', 'Leather belt holster holding a payment terminal', 'Yellow protective payment-terminal case']
    }
  };

  var entries = [
    ['.nav .nav-links a', 'allText', 'navLinks'], ['#account-link', 'cta', 'startFree'], ['#bag-button', 'bag', 'cart'],
    ['.hero .eyebrow', 'text', 'heroEyebrow'], ['.hero h1', 'html', 'heroTitle'], ['.hero-lead', 'text', 'heroLead'],
    ['.hero-actions a', 'allText', ['pickHardware', 'needAdvice']], ['.trust li', 'allText', 'trust'],
    ['.hero-photo figcaption', 'text', 'heroCaption'], ['.products .section-head .eyebrow', 'text', 'sectionEyebrow'],
    ['.products .section-head h2', 'html', 'sectionTitle'], ['.product-card .kicker', 'allText', 'cardKickers'],
    ['.product-card .product-copy h3', 'allText', 'cardTitles'], ['.product-card .product-desc', 'allText', 'cardDescriptions'],
    ['.product-card .text-link', 'allText', ['details', 'details', 'details']],
    ['.product-card [data-add]', 'allText', ['add', 'add']], ['.product-card [data-open-product="terminal_case"]', 'text', 'chooseColour'],
    ['.guide-title .eyebrow', 'text', 'guideEyebrow'], ['.guide-title h2', 'html', 'guideTitle'],
    ['.guide-card > span', 'allText', 'guideSteps'], ['.guide-card h3', 'allText', 'guideTitles'],
    ['.guide-card p', 'allText', 'guideDescriptions'], ['.guide-card strong', 'allText', 'guideLinks'],
    ['.aftercare .eyebrow', 'text', 'afterEyebrow'], ['.aftercare h2', 'html', 'afterTitle'], ['.aftercare p:last-child', 'text', 'afterText'],
    ['.cart-head h2', 'text', 'cartTitle'], ['.terms span', 'terms', null], ['#checkout-note', 'text', 'draft'],
    ['#checkout-button', 'text', 'checkout'], ['.account-shortcut', 'text', 'accountShortcut'],
    ['#success .eyebrow', 'text', 'successEyebrow'], ['#success h2', 'text', 'successTitle'],
    ['#success div > p:last-of-type', 'text', 'successText'], ['#continue-account', 'text', 'finishAccount'],
    ['footer .foot-brand p', 'text', 'footerDescription'], ['footer .foot-phone', 'text', 'footerPhone'],
    ['footer .foot-col h5', 'allText', 'footerHeadings'], ['footer .foot-col a', 'allText', 'footerLinks'],
    ['footer .foot-bottom > div:first-child', 'html', 'footerCopyright'], ['footer .foot-bottom .legal a', 'allText', 'footerLegal']
  ];

  function lang() {
    try { return localStorage.getItem('hugo-lang') === 'en' ? 'en' : 'cs'; } catch (_error) { return 'cs'; }
  }

  function t(key) { return (copy[window.HUGO_LANG] || copy.cs)[key] || key; }

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
    var accessible = t('a11y');
    [
      ['.brand', 'aria-label'], ['.nav nav', 'aria-label'], ['.trust', 'aria-label'],
      ['[data-product="pax_a920"] .image-button', 'aria-label'], ['[data-product="belt_holster"] .image-button', 'aria-label'],
      ['[data-product="terminal_case"] .image-button', 'aria-label'], ['.product-card .swatches', 'aria-label'],
      ['#cart', 'aria-label'], ['#cart-close', 'aria-label'], ['.dialog-close', 'aria-label'],
      ['.hero-photo img', 'alt'], ['[data-product="pax_a920"] .image-button img', 'alt'],
      ['[data-product="belt_holster"] .image-button img', 'alt'], ['[data-product="terminal_case"] .image-button img', 'alt']
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
