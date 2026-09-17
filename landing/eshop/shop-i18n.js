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
      sectionTitle: 'Pět věcí. <em>Žádný katalog na sto stran.</em>',
      cardKickers: ['All-in-one', 'Accessories', 'Accessories', 'ZJ-5809/BT', 'Android'],
      cardTitles: ['Terminál Hugo', 'Kožené pouzdro na pásek', 'Další obal na terminál', 'Bluetooth tiskárna účtenek', 'Android Tap-to-Pay'],
      cardDescriptions: ['Platby, účtenka a pokladna v jedné lehké krabičce.', 'Terminál po ruce, ruce připravené na tác a plný plac.', 'Měkčí dopad, jistější úchop a barva, která patří k tobě.', 'Papírová účtenka pro hosty, kteří ji chtějí. Bez kabelu přes celý bar.', 'Bezkontaktní platby přímo v telefonu obsluhy. Stačí Android s NFC.'],
      productLeads: ['Lehký terminál, na kterém běží pokladna, platby i účtenka. Bez druhé krabičky a bez kabelového zátiší.', 'Měkká kožená kapsa drží terminál u těla, ale nechá ho vytáhnout jedním pohybem. Na plac, zahrádku i event.', 'Pružný ochranný obal dává terminálu jistější úchop a tvé obsluze vlastní barvu.', 'Kompaktní tiskárna účtenek, která se s terminálem spáruje přes Bluetooth. Když host chce papír, dostane ho — bez kabelu přes celý bar.', 'Android Tap-to-Pay změní kompatibilní telefon obsluhy v bezkontaktní platební terminál — host jednoduše přiloží kartu nebo mobil k zadní straně telefonu. Žádný další hardware neobjednáváš, funkce je součástí Hugo účtu.'],
      productSpecs: [[['Model', 'PAX A920 Pro Core'], ['Systém', 'Android 10 · čtyřjádrový ARM Cortex A53'], ['Displej', '5,5″ kapacitní dotykový'], ['Platby', 'Čip a PIN · bezkontaktní NFC · magnetický proužek'], ['Připojení', '4G · Wi-Fi · Bluetooth'], ['Výdrž a tisk', 'Baterie 5 150 mAh · vestavěná termální tiskárna']], [['Materiál', 'Pravá kůže · finální specifikaci doplníme'], ['Uchycení', 'Poutko na pásek'], ['Kompatibilita', 'Terminál Hugo']], [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Šest odstínů']], [['Model', 'ZJ-5809/BT'], ['Šířka pásky', '58 mm'], ['Připojení', 'Bluetooth · nabíjecí kabel v balení'], ['Příslušenství', 'Včetně pouzdra']], [['Co to je', 'Bezkontaktní platba kartou nebo mobilem přímo na telefonu obsluhy, bez zvláštního terminálu.'], ['Co potřebuješ', 'Telefon s Androidem a podporou NFC — mají ji téměř všechny novější telefony.'], ['Ověření telefonu', 'Při zakládání účtu zadáš model telefonu a kalibrace v onboardingu ti řekne, jestli je pro Tap-to-Pay použitelný.']]],
      details: 'Prohlédnout detail', add: 'Přidat', chooseColour: 'Přidat další obal', freeCase: 'První obal v ceně terminálu', includedCaseNote: 'Jeden obal v ceně terminálu',
      free: 'Zdarma', freeFeatureNote: 'funkce v aplikaci Hugo',
      guideEyebrow: 'Těžký výběr?', guideTitle: 'Nevíš, co vzít? <em>Začni tady.</em>',
      guideSteps: ['01 · Základ', '02 · Ochrana', '03 · Volné ruce'],
      guideTitles: ['Chci rovnou prodávat', 'Terminál mám pořád v ruce', 'Běhám mezi stoly'],
      guideDescriptions: ['Vezmi terminál. Obal je v ceně a držák můžeš doplnit.', 'Obal jistí úchop a tlumí každodenní malé pády.', 'Kožené pouzdro drží terminál na pásku a nepřekáží.'],
      guideLinks: ['Ukázat terminál →', 'Vybrat barvu →', 'Prohlédnout pouzdro →'],
      afterEyebrow: 'Po zaplacení', afterTitle: 'Nákup hotový. <em>Teď už jen krůček.</em>',
      afterText: 'Použij stejný e-mail. Pokud už účet máš, přihlásíš se k němu a objednávku spojíme. Pokud ne, založíme nový — bez opisování nákupu.',
      cartTitle: 'Tvůj košík', reviewTitle: 'Rekapitulace objednávky', reviewOrder: 'Pokračovat k objednávce', backToCart: 'Zpět do košíku', deliveryTitle: 'Doprava', deliveryOptions: ['Doprava DPD', 'Osobní odběr'], termsPrefix: 'Souhlasím s', termsLink: 'obchodními podmínkami nákupu hardwaru',
      draft: 'E-shopové VOP jsou zatím pracovní návrh. Platbu zapneme až po jejich schválení.',
      checkout: 'Pokračovat k bezpečné platbě', accountShortcut: 'Už máš účet? Přihlas se. Košík zůstane a adresu doplníme za tebe.',
      successEyebrow: 'Je to doma', successTitle: 'Nákup je hotový. 🎉',
      successText: 'Teď už jen krůček: přihlas se nebo založ účet stejným e-mailem jako při nákupu.',
      finishAccount: 'Přihlásit nebo založit účet', successLinkedTitle: 'Nákup je hotový a propojený. 🎉',
      successLinkedText: 'Objednávku jsme rovnou přiřadili k tvé firmě a provozovně.',
      viewOrders: 'Zobrazit moje objednávky',
      footerDescription: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů — ne naopak.',
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
      a11y: ['Hugo — domů', 'Hlavní navigace', 'Výhody nákupu', 'Zobrazit detail terminálu Hugo', 'Zobrazit detail koženého pouzdra', 'Zobrazit detail dalšího ochranného obalu', 'Zobrazit detail Bluetooth tiskárny účtenek', 'Barva obalu', 'Košík', 'Zavřít košík', 'Zavřít detail', 'Obsluha přijímá platbu kartou na žlutém terminálu Hugo', 'Terminál Hugo s obalem Rudý impuls', 'Kožené pouzdro na pásek s platebním terminálem', 'Další obal na terminál v barvě Rudý impuls', 'Bluetooth tiskárna účtenek ZJ-5809/BT', 'Zobrazit detail Android Tap-to-Pay', 'Ilustrace bezkontaktní platby telefonem s NFC']
    },
    en: {
      navLinks: ['Product', 'AI & Brain', 'Setup', 'Pricing', 'E-shop', 'Customers'], startFree: 'Start free', cart: 'Bag',
      heroEyebrow: 'Hugo hardware', heroTitle: 'Choose first.<br><em>Finish the account later.</em>',
      heroLead: 'Order your terminal like in any good online shop. After payment, there is only one small step left — sign in and confirm a few details.',
      pickHardware: 'Choose hardware', needAdvice: 'Help me choose',
      trust: ['Secure payment', 'Simplicity', 'Quality'],
      heroCaption: 'A terminal that never gets in the way.', sectionEyebrow: 'Choose your pace',
      sectionTitle: 'Five things. <em>No hundred-page catalogue.</em>',
      cardKickers: ['All-in-one', 'Accessories', 'Accessories', 'ZJ-5809/BT', 'Android'],
      cardTitles: ['Hugo terminal', 'Leather belt holster', 'Additional terminal case', 'Bluetooth receipt printer', 'Android Tap-to-Pay'],
      cardDescriptions: ['Payments, receipts and POS in one light device.', 'Your terminal close by, your hands free for a tray and a busy floor.', 'A softer landing, safer grip and a colour that feels like yours.', 'A paper receipt for the guests who want one. No cable across the bar.', 'Contactless payments right on your staff’s phone. Just Android with NFC.'],
      productLeads: ['A light terminal running your POS, payments and receipts. No second box and no cable clutter.', 'A soft leather pocket keeps the terminal close and releases it in one movement. Built for the floor, terrace and events.', 'A flexible protective case gives the terminal a safer grip and your team a colour of their own.', 'A compact receipt printer that pairs with the terminal over Bluetooth. When a guest wants paper, they get it — with no cable across the bar.', 'Android Tap-to-Pay turns a compatible staff phone into a contactless payment terminal — the guest simply taps their card or phone against the back of it. There is no extra hardware to order; the feature comes with your Hugo account.'],
      productSpecs: [[['Model', 'PAX A920 Pro Core'], ['System', 'Android 10 · quad-core ARM Cortex A53'], ['Display', '5.5″ capacitive touchscreen'], ['Payments', 'Chip & PIN · contactless NFC · magnetic stripe'], ['Connectivity', '4G · Wi-Fi · Bluetooth'], ['Battery and printing', '5,150 mAh battery · built-in thermal printer']], [['Material', 'Genuine leather · final specification to follow'], ['Attachment', 'Belt loop'], ['Compatibility', 'Hugo terminal']], [['Surface', 'Soft non-slip finish'], ['Protection', 'Edges and back'], ['Colours', 'Six shades']], [['Model', 'ZJ-5809/BT'], ['Paper width', '58 mm'], ['Connectivity', 'Bluetooth · charging cable included'], ['Accessories', 'Case included']], [['What it is', 'Contactless card or phone payment directly on your staff’s phone — no separate terminal needed.'], ['What you need', 'An Android phone with NFC support — found on almost every newer phone.'], ['Phone check', 'When you set up your account you enter your phone model, and the onboarding calibration tells you if it works with Tap-to-Pay.']]],
      details: 'View details', add: 'Add', chooseColour: 'Add another case', freeCase: 'First case included with terminal', includedCaseNote: 'One case included with the terminal',
      free: 'Free', freeFeatureNote: 'a feature in the Hugo app',
      guideEyebrow: 'Hard to choose?', guideTitle: 'Not sure what to get? <em>Start here.</em>',
      guideSteps: ['01 · Essentials', '02 · Protection', '03 · Hands free'],
      guideTitles: ['I want to start selling', 'The terminal is always in my hand', 'I move between tables'],
      guideDescriptions: ['Take the terminal. The case is included and you can add the holster.', 'The case improves grip and softens everyday small drops.', 'The leather holster keeps the terminal on your belt and out of the way.'],
      guideLinks: ['Show terminal →', 'Choose colour →', 'View holster →'],
      afterEyebrow: 'After payment', afterTitle: 'Purchase complete. <em>Just one small step left.</em>',
      afterText: 'Use the same email. If you already have an account, sign in and we will link the order. If not, create one without re-entering the purchase.',
      cartTitle: 'Your bag', reviewTitle: 'Order review', reviewOrder: 'Continue to order review', backToCart: 'Back to bag', deliveryTitle: 'Delivery', deliveryOptions: ['DPD delivery', 'Personal pickup'], termsPrefix: 'I agree to the', termsLink: 'hardware purchase terms',
      draft: 'The shop terms are still a draft. Payments will open after approval.', checkout: 'Continue to secure payment',
      accountShortcut: 'Already have an account? Sign in. Your cart stays and we will prefill your address.',
      successEyebrow: 'It is yours', successTitle: 'Purchase complete. 🎉',
      successText: 'Just one small step left: sign in or create an account using the same email as your purchase.',
      finishAccount: 'Sign in or create account', successLinkedTitle: 'Purchase complete and linked. 🎉',
      successLinkedText: 'We assigned the order directly to your business and venue.',
      viewOrders: 'View my orders',
      footerDescription: 'The point-of-sale built around your phone, your menu, and your customers — not the other way around.',
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
      a11y: ['Hugo — home', 'Main navigation', 'Purchase benefits', 'View Hugo terminal details', 'View leather holster details', 'View additional protective case details', 'View Bluetooth receipt printer details', 'Case colour', 'Bag', 'Close bag', 'Close details', 'A server accepts a card payment on a yellow Hugo terminal', 'Hugo terminal with a Red Impulse case', 'Leather belt holster holding a payment terminal', 'Additional terminal case in Red Impulse', 'ZJ-5809/BT Bluetooth receipt printer', 'View Android Tap-to-Pay details', 'Illustration of a contactless payment tapped against an NFC phone']
    }
  };

  var entries = [
    ['.nav .nav-links a', 'allText', 'navLinks'], ['#account-link', 'cta', 'startFree'], ['#bag-button', 'bag', 'cart'],
    ['.hero .eyebrow', 'text', 'heroEyebrow'], ['.hero h1', 'html', 'heroTitle'], ['.hero-lead', 'text', 'heroLead'],
    ['.hero-actions a', 'allText', ['pickHardware', 'needAdvice']], ['.trust li > span', 'allText', 'trust'],
    ['.hero-photo figcaption', 'text', 'heroCaption'], ['.products .section-head .eyebrow', 'text', 'sectionEyebrow'],
    ['.products .section-head h2', 'html', 'sectionTitle'], ['.product-card .kicker', 'allText', 'cardKickers'],
    ['.product-card .product-copy h3', 'allText', 'cardTitles'], ['.product-card .product-desc', 'allText', 'cardDescriptions'],
    ['.included-note', 'text', 'includedCaseNote'],
    ['.product-card .text-link', 'allText', ['details', 'details', 'details', 'details', 'details']],
    ['.product-card [data-add]', 'allText', ['add', 'add', 'add', 'add']], ['.product-card [data-open-product="terminal_case"]', 'text', 'chooseColour'],
    ['.guide-title .eyebrow', 'text', 'guideEyebrow'], ['.guide-title h2', 'html', 'guideTitle'],
    ['.guide-card > span', 'allText', 'guideSteps'], ['.guide-card h3', 'allText', 'guideTitles'],
    ['.guide-card p', 'allText', 'guideDescriptions'], ['.guide-card strong', 'allText', 'guideLinks'],
    ['.aftercare .eyebrow', 'text', 'afterEyebrow'], ['.aftercare h2', 'html', 'afterTitle'], ['.aftercare p:last-child', 'text', 'afterText'],
    ['.cart-head h2', 'text', 'cartTitle'], ['#review-button', 'text', 'reviewOrder'], ['#cart-back', 'aria', 'backToCart'], ['.delivery-choice legend', 'text', 'deliveryTitle'],
    ['.delivery-choice label > span', 'allText', 'deliveryOptions'], ['.terms span', 'terms', null], ['#checkout-note', 'text', 'draft'],
    ['#checkout-button', 'text', 'checkout'], ['.account-shortcut', 'text', 'accountShortcut'],
    ['#success .eyebrow', 'text', 'successEyebrow'], ['#success h2', 'text', 'successTitle'],
    ['#success div > p:last-of-type', 'text', 'successText'], ['#continue-account', 'text', 'finishAccount'],
    ['footer .foot-brand p', 'text', 'footerDescription'],
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
    var accessible = t('a11y');
    [
      ['.brand', 'aria-label'], ['.nav nav', 'aria-label'], ['.trust', 'aria-label'],
      ['[data-product="pax_a920"] .image-button', 'aria-label'], ['[data-product="belt_holster"] .image-button', 'aria-label'],
      ['[data-product="terminal_case"] .image-button', 'aria-label'], ['[data-product="printer_zj5809"] .image-button', 'aria-label'], ['.product-card .swatches', 'aria-label'],
      ['#cart', 'aria-label'], ['#cart-close', 'aria-label'], ['.dialog-close', 'aria-label'],
      ['.hero-photo img', 'alt'], ['[data-product="pax_a920"] .image-button img', 'alt'],
      ['[data-product="belt_holster"] .image-button img', 'alt'], ['[data-product="terminal_case"] .image-button img', 'alt'],
      ['[data-product="printer_zj5809"] .image-button img', 'alt'],
      ['[data-product="android_tap_to_pay"] .image-button', 'aria-label'], ['[data-product="android_tap_to_pay"] .image-button img', 'alt']
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
