/* ============================================================
   Hugo Landing — CZ/EN i18n layer
   - Snapshots the English baseline from the DOM on load
   - Applies the active language (default: cs) without touching
     interactive nodes (pricing configurator keeps working)
   ============================================================ */
(function () {
  'use strict';

  /* ---- reusable icon / fragment markup ---- */
  var ARR   = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  var PLAY  = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>';
  var CHK24 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var CHK26 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var CHKSP = '<span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> ';
  var APPLE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.9 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.2 1.9 2.6 3.3 2.5 1.3 0 1.8-.8 3.4-.8 1.6 0 2.1.8 3.4.8 1.4 0 2.3-1.3 3.2-2.5.9-1.2 1.3-2.4 1.3-2.5-.1 0-2.9-1.1-2.9-4.6zM13.9 4.6c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z"/></svg> ';
  var ANDRO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg> ';
  var PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ';
  var WAVE  = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span> ';
  function ICO(x){ return '<span class="ico">' + x + '</span> '; }
  function NUMN(n){ return '<span class="n">' + n + '</span> '; }
  function CNUM(n){ return '<span class="ctrl-num">' + n + '</span>'; }
  function DOT(bg){ return '<span class="d" style="background:' + bg + '"></span>'; }

  /* ---- static text dictionary (cs only; en is read from the DOM) ---- */
  /* type: 'html' (innerHTML) is default; multiple matches use all:true with an array */
  var ENTRIES = [
    /* NAV */
    { sel: '.nav-links a', all: true, cs: ['Produkt', 'AI &amp; Brain', 'Spuštění', 'Ceník', 'Reference'] },
    { sel: '.nav-cta .signin', cs: 'Přihlásit' },
    { sel: '.nav-cta .btn.btn-primary', cs: 'Začít zdarma ' + ARR },

    /* HERO */
    { sel: '.hero-eyebrow', cs: '<span class="pip">★</span> Pro české kavárny, bary a restaurace &nbsp;·&nbsp; připraveno na EET 2027' },
    { sel: '.hero h1', cs: 'Jedna appka řídí <br/> <span class="hl">celý podnik.</span> <em>Na telefonu, co máš.</em>' },
    { sel: '.hero p.lead', cs: 'Hugo je moderní pokladna pro kavárny, bary a restaurace — objednávky, menu, platby kartou, spropitné i účtenky v jedné appce na iPhonu nebo Androidu, který už máš — nebo si k tomu vezmi fakt moderní terminál od nás (žádná ošklivá černá krabice). Tak jako tak prodáváš za 5 minut.' },
    { sel: '.hero-ctas .btn-primary', cs: 'Začít zdarma ' + ARR },
    { sel: '.hero-ctas .btn-ghost', cs: 'Podívat se, jak funguje ' + PLAY },
    { sel: '.hero-meta span', all: true, cs: [CHK24 + ' Bez karty na start', CHK24 + ' Spustíš za 5 minut', CHK24 + ' Zrušíš kdykoli'] },
    { sel: '.fc-fast .sub', cs: 'prům. čas k první tržbě' },

    /* LOGO STRIP */
    { sel: '.strip-label', cs: 'Důvěřují nám v ČR i na Slovensku' },

    /* TRUST */
    { sel: '.trust-chip', all: true, cs: [
      CHK24 + ' Bez smlouvy — zrušíš kdykoli',
      CHK24 + ' Peníze máš další pracovní den',
      CHK24 + ' Připraveni na EET 2027',
      CHK24 + ' Česká podpora 7 dní v týdnu'
    ] },
    { sel: '.quote p', cs: '„Přešli jsme v úterý ráno. Do polední špičky celý tým markoval objednávky <span class="mk">bez jediného dotazu.</span>"' },
    { sel: '.quote .who span:last-child', cs: '<b>Petr Novák</b> · Pivovarská šenkovna, Brno' },

    /* PRODUCT / DEVICES */
    { sel: '#product .section-head .eyebrow', cs: 'Jakékoli zařízení · jedna pokladna' },
    { sel: '#product .section-head h2', cs: 'Jeden Hugo. <em>iPhone, Android, tablet, terminál — všechno prostě funguje.</em>' },
    { sel: '#product .section-head p.lead', cs: 'Žádný proprietární hardware, žádná béžová krabice, co práší u kasy. Podej telefon číšníkovi, opři tablet o bar, na špičku připoj terminál — všechno se synchronizuje v reálném čase.' },
    { sel: '.dev-iphone p', cs: 'Tap to Pay na iPhonu. Žádná čtečka, žádný dongle. Přijmeš jakoukoli bezkontaktní kartu i peněženku.' },
    { sel: '.dev-android p', cs: 'NFC platby na jakémkoli moderním Androidu. Stejná appka, stejná rychlost, stejný Brain.' },
    { sel: '.dev-any .label', cs: '+ všechno ostatní' },
    { sel: '.dev-any h3', cs: 'Kdekoli chceš' },
    { sel: '.dev-any p', cs: 'Tablet na pultu, web v zázemí, terminál na baru, kuchyně na displeji.' },
    { sel: '.dev-any .chip span', all: true, cs: ['Tablet', 'Web', 'Terminál'] },

    /* ON THE FLOOR */
    { sel: '.floor .section-head .eyebrow', cs: 'Na place' },
    { sel: '.floor .section-head h2', cs: 'Dost rychlé i na <em>páteční nával.</em>' },
    { sel: '.floor .section-head p.lead', cs: 'Tvoji lidi nečtou manuály — a s Hugem nemusí. Od první objednávky po zaplacený účet je to pár ťuknutí, takže fronta plyne a stoly se točí rychleji.' },
    { sel: '.floor-card .step', all: true, cs: ['01 · OBJEDNÁVKA', '02 · KUCHYNĚ', '03 · PLATBA'] },
    { sel: '.floor-card h4', all: true, cs: ['Objednávka u stolu', 'Rovnou do kuchyně', 'Rozděl, spropitné, zaplať'] },
    { sel: '.floor-card p', all: true, cs: [
      'Ťukni položky, přidej poznámku a pošli do kuchyně — bez odcházení od hosta a čmárání na blok.',
      'Objednávka je na výdeji ve chvíli, kdy ji potvrdíš. Žádné křičení přes linku, žádné ztracené bonky.',
      'Rozděl podle položek nebo hostů a pak přijmi kartu, bezkontakt nebo QR jedním ťuknutím — výzva na spropitné je v ceně.'
    ] },

    /* RELIABILITY */
    { sel: '.relband .section-head .eyebrow', cs: 'Postavené na spolehlivost' },
    { sel: '.relband .section-head h2', cs: 'Pokladna v telefonu, která <em>nezakolísá.</em>' },
    { sel: '.rel-item h4', all: true, cs: ['Funguje offline', 'Použij, co máš', 'Žádná čtečka k nabíjení', 'Data jsou tvoje'] },
    { sel: '.rel-item p', all: true, cs: [
      'Vypadne wifi ve špičce? Markuj dál objednávky i hotovost — Hugo se sesynchronizuje, až budeš zpátky, a až se EET v roce 2027 vrátí, účtenky se offline zařadí a samy odešlou.',
      'Připoj svou tiskárnu účtenek a pokladní zásuvku, nebo jeď úplně bez papíru. Žádná proprietární krabička ke koupi ani pronájmu.',
      'Tap to Pay na iPhonu, NFC na Androidu. Platební terminál žije v telefonu — nic navíc, co bys ztrácel, nabíjel nebo měnil.',
      'Cokoli kdykoli vyexportuješ. Žádné vázání — odejdeš, kdy chceš, a čísla si vezmeš s sebou.'
    ] },

    /* PIANO BRAIN */
    { sel: '#brain .eyebrow', cs: 'Vestavěná inteligence · pohání Piano' },
    { sel: '#brain h2', cs: 'Řekne ti, co <em>vařit, kdy koho a co naskladnit.</em>' },
    { sel: '#brain p.lead', cs: 'Každá objednávka, každá směna, každá změna menu se potichu sčítá. Hugo z toho udělá srozumitelnou radu — tohohle uvař víc, v pátek přidej lidi, doobjednej, než dojde. Žádné tabulky, žádný analytik, žádný domácí úkol.' },
    { sel: '.brain-callouts .callout h4', all: true, cs: ['Přestaň docházet — i přeobjednávat', 'Naplánuj správné směny', 'Zeptej se vlastními slovy'] },
    { sel: '.brain-callouts .callout p', all: true, cs: [
      'Hugo upozorní, co dnes nejspíš dojde a co připravit, takže míň plýtváš a nikdy nevyprodáš hit uprostřed služby.',
      'Uvidíš příští týden po hodinách rušno i klid dřív, než napíšeš rozpis — míň prostojů, žádná podcezená špička.',
      '„Proč bylo v pátek mrtvo?" — dostaneš přímou odpověď s čísly za ní, česky i anglicky.'
    ] },
    { sel: '.brain-viz .ntag', all: true, cs: [
      ICO('€') + ' Tržby', ICO('✓') + ' Sklad', ICO('★') + ' Recenze',
      ICO('✦') + ' Menu', ICO('●') + ' Spropitné', ICO('▶') + ' Směny'
    ] },
    { sel: '.brain-viz .center .lbl', cs: 'Piano<br/>Brain<small>připojeno</small>' },

    /* SETUP — TAP / TALK / AUTO */
    { sel: '#setup .section-head .eyebrow', cs: 'Od krabice k první tržbě za 5 minut' },
    { sel: '#setup .section-head h2', cs: 'Ťukni, řekni, hotovo. <em>Žádné ruční nastavování. Žádné psaní menu. Žádný den školení.</em>' },
    { sel: '#setup .section-head p.lead', cs: 'Hugo se naučí, co prodáváš, jak to prodáváš a kam patří doplňky — z fotky menu, z tvého hlasu nebo z účtenek z minulého týdne. Žádný technik v polokošili, žádný týden zaškolování, žádný 200stránkový manuál.' },
    { sel: '.setup-card h3', all: true, cs: ['Ťukni', 'Řekni', 'Automaticky'] },
    { sel: '.setup-card > p', all: true, cs: [
      'Vyfoť svoje tištěné menu. Hugo z něj během vteřin vytáhne položky, ceny i doplňky.',
      'Řekni Hugovi, co se změnilo. „Přidej víno Albariño za 89 Kč, u řízku půlporci." Hotovo.',
      'Hugo se postará o daně, DPH, účtenky, spropitné, dělení účtů i foodcost — potichu, na pozadí, napořád.'
    ] },
    { sel: '.bubble.user', cs: WAVE + 'Přidej Albariño 0,15 l za 89 Kč' },
    { sel: '.bubble.ai', cs: 'Přidáno pod <b>Víno bílé</b>. Chceš i lahev 0,75 l?' },
    { sel: '.auto-art .auto-row .name', all: true, cs: ['DPH, účtenky a EET 2027', 'Foodcost z účtenek', 'Dělení spropitného po hodinách', 'Týdenní souhrn'] },
    { sel: '.auto-art .auto-row .meta', all: true, cs: ['nastaveno', '34&nbsp;%', 'připraveno', 'Ne 22:00'] },

    /* SWITCHING */
    { sel: '.switch .eyebrow', cs: 'Přecházíš odjinud' },
    { sel: '.switch h2', cs: 'Už jsi na Dotykačce nebo Storyous? <em>Těžkou práci uděláme my.</em>' },
    { sel: '.switch p.lead', cs: 'Šest let stará pokladna se 140 položkami není práce na pět minut — a my to nepředstíráme. Přeneseme tvoje menu, rozjedeme Hugo vedle stávajícího systému a přepneme, až budeš připravený.' },
    { sel: '.switch .btn-dark', cs: 'Domluvit migraci zdarma ' + ARR },
    { sel: '.switch-point h4', all: true, cs: ['Menu přeneseme za tebe', 'Běh paralelně — bez výpadku', 'Personál zaškolíš za jednu směnu'] },
    { sel: '.switch-point p', all: true, cs: [
      'Pošli fotku nebo export ze starého systému — položky, ceny i doplňky složíme my a ty je jen zkontroluješ.',
      'Nech stávající pokladnu běžet, dokud Hugo zkoušíš. Žádný stresující den spuštění, žádné ztracené tržby ve špičce.',
      'Když tvůj tým umí ovládat telefon, zvládne i Hugo. Většina podniků nepotřebuje den školení — stačí jedna služba.'
    ] },

    /* PRICING — static parts */
    { sel: '#pricing .section-head .eyebrow', cs: 'Ceník — slož si Hugo' },
    { sel: '#pricing .section-head h2', cs: 'Hugo za 190 Kč měsíčně, <em>když platby bereš s námi.</em>' },
    { sel: '#pricing .section-head p.lead', cs: 'Posuň svou tržbu, vyber plán a my ukážeme celkovou měsíční cenu — žádné fixní smlouvy, žádné skryté řádky.' },
    { sel: '.price-explain .pe .k', all: true, cs: [
      DOT('var(--green)') + 'Appka: 0 Kč',
      DOT('var(--yellow)') + 'Jen poplatek z karty',
      DOT('rgba(255,255,255,0.45)') + 'Máš vlastní terminál?'
    ] },
    { sel: '.price-explain .pe p', all: true, cs: [
      'Ber platby kartou přes Hugo a celá pokladna — objednávky, menu, DPH, reporty — tě měsíčně nestojí nic.',
      'Platíš jen malé % z platby kartou — takové, jaké platíš i dnes. Klesá, jak roste tvůj obrat.',
      'Nech si ho. Místo toho platíš jeden pevný měsíční poplatek za Hugo. Žádná překvapení — obojí vidíš níž.'
    ] },
    { sel: '.presets-label', cs: 'Začni od typického provozu:' },
    { sel: '.preset-name', all: true, cs: ['Food truck', 'Malá kavárna', 'Rušné bistro', 'Zavedená restaurace'] },
    { sel: '.preset-meta', all: true, cs: ['~30k Kč / měs', '~80k Kč / měs', '~350k Kč / měs', '~1M Kč / měs'] },
    { sel: '.config-controls .ctrl:nth-child(1) .ctrl-label', cs: CNUM('1') + 'Vyber si plán' },
    { sel: '.config-controls .ctrl:nth-child(2) .ctrl-label', cs: CNUM('2') + 'Platební zařízení' },
    { sel: '#revStep .ctrl-label > span:nth-child(2)', cs: 'Tvoje měsíční tržba z karet' },
    { sel: '#tierSeg .seg-btn:nth-child(1) .seg-sub', cs: 'Pro štíhlé provozy' },
    { sel: '#tierSeg .seg-btn:nth-child(2) .seg-sub', cs: 'AI menu a více poboček' },
    { sel: '#tierSeg .seg-btn:nth-child(3) .seg-sub', cs: 'Hlasové objednávky a agent' },
    { sel: '#payseg .seg-btn:nth-child(1) .seg-title', cs: 'Ano <span class="rec">Hugo zdarma</span>' },
    { sel: '#payseg .seg-btn:nth-child(1) .seg-sub', cs: 'Hugo + Tap to Pay' },
    { sel: '#payseg .seg-btn:nth-child(2) .seg-title', cs: 'Ne, mám vlastní' },
    { sel: '#payseg .seg-btn:nth-child(2) .seg-sub', cs: 'Hotovost, QR nebo jiný PSP' },
    { sel: '.ios-toggle label > span', cs: 'Potřebuju iPhone Tap-to-Pay' },
    { sel: '.ios-toggle small', cs: 'Tap to Pay na iPhonu · 0,99 % + 2,75 Kč za transakci' },
    { sel: '.sum-u', cs: 'Kč / měsíc' },
    { sel: '.summary .btn.btn-primary', cs: 'Začít s tímto nastavením' },
    { sel: '.sum-fine', cs: 'Bez smlouvy. Zrušíš kdykoli. Data zůstanou tvoje.' },

    /* POWER BAND */
    { sel: '.power h2', cs: 'Skutečná síla. <span class="hl">Nula tření.</span>' },
    { sel: '.power-sub .x', all: true, cs: ['Žádné telefonáty.', 'Žádné papírování.', 'Žádné kecy.'] },
    { sel: '.power-tag', cs: 'Hugo je pro provozovatele, kteří byznys řídí <b>daty, ne pocity.</b> Pokud jsi to ty, můžeš jet ještě před polední špičkou. <em>Dnes.</em>' },

    /* WAITLIST / ONBOARDING */
    { sel: '.waitlist .eyebrow', cs: '<span class="live-dot"></span> Onboarding zdarma · bez závazku' },
    { sel: '.waitlist h2', cs: 'Přejdi za den. <span class="hl">Nastavíme to</span> s tebou.' },
    { sel: '.waitlist .lead', cs: 'Založ si účet a bereš platby během pár minut. Chceš pomoct? Domluv si bezplatný 15minutový hovor — naimportujeme tvoje menu a rozjedeš to před další špičkou. <em>Bez karty, bez závazku.</em>' },
    { sel: '.waitlist-perks li', all: true, cs: [
      CHKSP + 'Menu naimportujeme — z fotky nebo ze starého systému',
      CHKSP + '15minutový videohovor — česky, kdy se ti to hodí',
      CHKSP + 'Stávající terminál může běžet, dokud přecházíš',
      CHKSP + 'Zdarma na start — platíš, až když bereš platby'
    ] },
    { sel: '.waitlist-counter', cs: 'Zdarma · bez karty' },
    { sel: '.waitlist-form h3', cs: 'Začni s Hugem.' },
    { sel: '.waitlist-form h3 + p', cs: 'Založ si účet hned, nebo nech kontakt a do 24 hodin zavoláme a nastavíme to s tebou.' },
    { sel: '.waitlist-fields button.btn', cs: 'Založit účet zdarma ' + ARR },
    { sel: '.waitlist-spots .spots-label', cs: 'Už máš jinou pokladnu? <b>Menu ti přeneseme zdarma.</b>' },
    { sel: '.waitlist-fineprint', cs: 'Žádný spam. Tvoje data jsou v bezpečí.' },

    /* FINAL CTA */
    { sel: '.final-card h2', cs: 'První tržba je pět minut daleko.' },
    { sel: '.final-card > p', cs: 'Tři kroky, žádný závazek — a DPH, účtenky i tu nudnou práci, kterou tě staré pokladny nutily dělat ručně, vyřešíme my.' },
    { sel: '.final-step', all: true, cs: [NUMN('1') + 'Stáhni Hugo', NUMN('2') + 'Vyfoť menu', NUMN('3') + 'Vezmi první platbu'] },
    { sel: '.final-ctas a', all: true, cs: [APPLE + 'Stáhnout pro iOS', ANDRO + 'Stáhnout pro Android', PHONE + 'Zavolat &middot; 800 331 122'] },
    { sel: '.final-fine span', all: true, cs: [CHK26 + ' Bez karty na start', CHK26 + ' Zrušíš kdykoli', CHK26 + ' Skuteční lidé, česky, 7 dní v týdnu'] },

    /* FOOTER */
    { sel: '.foot-brand p', cs: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů — ne naopak.' },
    { sel: '.foot-col h5', all: true, cs: ['Produkt', 'Řešení', 'Společnost', 'Podpora'] },
    { sel: '.foot-grid > div:nth-child(3) a', all: true, cs: ['Restaurace', 'Kavárny a bary', 'Hotely', 'Food trucky'] },
    { sel: '.foot-grid > div:nth-child(4) a', all: true, cs: ['O nás', 'Reference', 'Kariéra', 'Pro média'] },
    { sel: '.foot-grid > div:nth-child(5) a', all: true, cs: ['Nápověda', 'Kontakt', 'Stav služeb', 'Vývojáři'] },
    { sel: '.foot-bottom > div:first-child', cs: '© 2026 Hugo. Pohání Piano.' },
    { sel: '.foot-bottom .legal a', all: true, cs: ['Podmínky', 'Soukromí', 'Tiráž', 'English'] },

    /* MOBILE STICKY BAR */
    { sel: '.mb-txt', cs: '<b>Zdarma</b> s našimi platbami<br/>Bez karty · zrušíš kdykoli' },
    { sel: '.mobilebar .btn', cs: 'Začít zdarma ' + ARR },

    /* === CRO additions === */
    /* CRO_ANCHOR */
    { sel: '.guarantee-txt', all: true, cs: [
      '<b>30denní záruka vrácení peněz.</b> Když ti Hugo nesedne, do 30 dnů vrátíme každou korunu — bez formulářů, bez otázek.',
      '<b>30denní záruka vrácení peněz.</b> Když se Hugo nezaplatí, do 30 dnů vrátíme každou korunu — bez formulářů, bez otázek.'
    ] },
    { sel: '.abbar-label', cs: 'Verze pro:' },
    { sel: '.ab-opt', all: true, cs: ['Mikro provoz', 'Kavárna & bar', 'Restaurace & síť'] },
    { sel: '.chk span', cs: 'Potřebuju iPhone Tap to Pay' },
    { sel: '.chk small', cs: 'Tap to Pay na iPhonu · 0,99 % + 0,99 Kč za transakci' },
    { sel: '.pay-note', cs: 'Platby kartou jdou přes Hugo — díky tomu je cena 190 Kč.' },
    { sel: '.config-or', cs: '— nebo si slož vlastní —' },
    { sel: '.price-points li span', all: true, cs: [
      '<b>190 Kč měsíčně</b> — celá pokladna (objednávky, menu, DPH, reporty) i platby kartou v jedné ceně. Nic skrytého.',
      '<b>Plus malý poplatek z karty</b> — takový, jaký platíš i dnes. Klesá automaticky, jak roste obrat.',
      '<b>Chceš terminál?</b> — vezmi si fakt moderní kousek od nás, nebo jeď na telefonu, co máš. Tak jako tak prodáváš za 5 minut.'
    ] },
    { sel: '.midcta-txt h3', cs: 'Připraveno ještě před polední špičkou.' },
    { sel: '.midcta-txt p', cs: 'Za 190 Kč měsíčně &middot; spustíš za 5 minut &middot; bez karty, bez smlouvy.' },
    { sel: '.midcta-actions .btn-primary', cs: 'Začít zdarma ' + ARR },
    { sel: '.annbar-txt', cs: '<b>EET se vrací 1. 1. 2027.</b> Přejdi na Hugo teď a měj klid — se zaváděcí cenou zamčenou napořád.' },
    { sel: '.annbar-cta', cs: 'Zjistit víc &rarr;' },
    { sel: '.form-alt-or', cs: 'nebo spusť za 30 sekund' },
    { sel: '.foot-phone', cs: 'Volej zdarma &middot; 800 331 122 &middot; Po&ndash;Ne 8&ndash;22' },
    { sel: '.form-call', cs: 'Radši zavoláš? <a href="tel:+420800331122">800 331 122</a> &middot; zdarma, 7 dní v týdnu' },
    { sel: '.faq .section-head .eyebrow', cs: 'Než se rozhodneš' },
    { sel: '.faq .section-head h2', cs: 'Otázky, co padají nejčastěji.' },
    { sel: '.faq-item summary .q', all: true, cs: [
      'Kolik Hugo stojí? V čem je háček?',
      'Musím podepsat smlouvu?',
      'Jsem na Dotykačce nebo Storyous — bude přechod peklo?',
      'Musím kupovat hardware?',
      'Kdy dostanu peníze z karet?',
      'Co DPH a EET?'
    ] },
    { sel: '.faq-item .a', all: true, cs: [
      '190 Kč měsíčně, když platby kartou bereš přes nás — k tomu malé % z platby, které klesá, jak rosteš. Spustíš zdarma a platíš, až když reálně prodáváš. Žádný háček, žádná smlouva.',
      'Žádná smlouva ani výpovědní lhůta. Zrušíš kdykoli a data si odneseš.',
      'Menu naimportujeme, Hugo běží vedle stávající pokladny a přepneš, až budeš chtít. Migrace je zdarma.',
      'Ne. Hugo běží na iPhonu nebo Androidu, který už máš. Můžeš připojit vlastní tiskárnu účtenek i pokladní zásuvku.',
      'Další pracovní den — rovnou na tvůj účet.',
      'DPH a účtenky řeší Hugo automaticky a jsme připraveni na návrat EET v roce 2027 — ty nenastavuješ nic.'
    ] },
    { sel: '.tmonials .section-head .eyebrow', cs: 'Oblíbené na place' },
    { sel: '.tmonials .section-head h2', cs: 'České podniky, které <em>přešly a zůstaly.</em>' },
    { sel: '.tm-rnote', cs: '&nbsp;z 320 hodnocení' },
    { sel: '.tm-vnote', cs: '&nbsp;plateb kartou měsíčně' },
    { sel: '.tm-card blockquote', all: true, cs: [
      'Markování zrychlilo tak, že jsme o víkendu zvládli o dva stoly za večer navíc.',
      'Z Dotykačky jsme přešli za odpoledne. Menu naimportovali oni, my ho jen zkontrolovali.',
      'Spropitné nám po zapnutí výzvy vyskočilo skoro o pětinu. Tým je nadšený.'
    ] },
    { sel: '.tm-who .rl', all: true, cs: [
      'provozní &middot; Café Lipa, Olomouc',
      'majitel &middot; Bistro Krug, Plzeň',
      'vedoucí &middot; Mlsná koza, Praha'
    ] },
    { sel: '.stats-grid .stat .l', all: true, cs: [
      'vyšší spropitné, když appka sama nabídne dýško',
      'méně administrativy — DPH, účtenky a foodcost samy',
      'od stažení k první tržbě',
      'podniků v ČR a SK už jede na Hugovi'
    ] },
    { sel: '.stats-grid .stat .u', all: true, cs: ['%', 'h/týd', 'min', '+'] },
    { sel: '__noop__', cs: '' }
  ];

  /* ---- placeholder dictionary ---- */
  var PH = [
    { sel: '.waitlist-fields input', all: true, cs: ['E-mailová adresa', 'Tvoje jméno (nepovinné)'] }
  ];

  /* ---- pricing configurator strings (read by the page's render()) ---- */
  window.HUGO_PRICING = {
    en: {
      payAndroid: 'with card payments · Android',
      payIos: 'with card payments · iPhone Tap to Pay',
      noPay: 'without card payments',
      free: 'FREE', disc: 'DISCOUNTED', paid: 'PAID',
      plusAndroid: '+ 0,99 &rarr; 0,39 % per transaction (Android, tiered)',
      plusIos: '+ 0,99 % + 2,75 Kč per transaction (iPhone)',
      styleInc: ['Unlimited devices &amp; staff', 'Run on any device, scale to any team', 'Unlimited menu &amp; categories', 'Piano Brain summaries'],
      styleEx: ['Daily menus built by AI in seconds', 'Voice ordering &amp; phone agent'],
      execInc: ['Everything in Hugo Style', 'Daily menus built by AI in seconds', 'Forecasts, alerts &amp; Brain Q&amp;A', 'Multi-venue &amp; advanced staff roles', 'Priority support in your language'],
      execEx: ['Voice ordering &amp; phone agent'],
      fullInc: ['Everything in Hugo Executive', 'Voice ordering at the counter', 'AI phone agent takes orders', 'Hands-free voice for kitchen &amp; staff', 'Earliest access to new AI features'],
      feeLine: function (p) { return '+ ' + p + ' per card transaction'; },
      cardIncluded: 'Card payments &amp; Tap to Pay <b style="color:var(--green); font-weight:700;">included</b>',
      cardExcluded: 'Card payments &amp; Tap to Pay',
      freeBig: 'FREE',
      sentHead: function (v) { return 'On <b>' + v + '</b> revenue this month'; },
      rowHugo: 'Hugo costs you', rowProc: 'Card processing', rowAll: 'All-in this month',
      saveRow: 'Saved vs a 1.59% terminal', saveUnit: 'Kč/yr',
      thanks: 'Thanks — we’ll call within 24 hours.'
    },
    cs: {
      payAndroid: 'platby kartou · Android',
      payIos: 'platby kartou · iPhone Tap to Pay',
      noPay: 'bez plateb kartou',
      free: 'ZDARMA', disc: 'SE SLEVOU', paid: 'PLACENO',
      plusAndroid: '+ 0,99 &rarr; 0,39 % z transakce (Android, klesá)',
      plusIos: '+ 0,99 % + 2,75 Kč z transakce (iPhone)',
      styleInc: ['Neomezeně zařízení a lidí', 'Běží na čemkoli, škáluje na jakýkoli tým', 'Neomezené menu a kategorie', 'Souhrny Piano Brain'],
      styleEx: ['Denní menu složí AI během vteřin', 'Hlasové objednávky a telefonní agent'],
      execInc: ['Vše z Hugo Style', 'Denní menu složí AI během vteřin', 'Předpovědi, upozornění a dotazy Brainu', 'Více poboček a pokročilé role personálu', 'Přednostní podpora v tvém jazyce'],
      execEx: ['Hlasové objednávky a telefonní agent'],
      fullInc: ['Vše z Hugo Executive', 'Hlasové objednávky u pultu', 'AI telefonní agent přijímá objednávky', 'Hands-free hlas pro kuchyň i personál', 'Nejdřív přístup k novým AI funkcím'],
      feeLine: function (p) { return '+ ' + p + ' za transakci'; },
      cardIncluded: 'Platby kartou a Tap to Pay <b style="color:var(--green); font-weight:700;">v ceně</b>',
      cardExcluded: 'Platby kartou a Tap to Pay',
      freeBig: 'ZDARMA',
      sentHead: function (v) { return 'Z tržby <b>' + v + '</b> tento měsíc'; },
      rowHugo: 'Hugo tě stojí', rowProc: 'Zpracování karet', rowAll: 'Celkem tento měsíc',
      saveRow: 'Úspora vs terminál 1,59 %', saveUnit: 'Kč/rok',
      thanks: 'Děkujeme — ozveme se do 24 hodin.'
    }
  };

  var TITLES = {
    en: 'Hugo — A POS that pays for itself in 5 minutes',
    cs: 'Hugo — pokladna, která se zaplatí za 5 minut'
  };

  /* ---- runtime ---- */
  window.HUGO_LANG = (function () {
    try { return localStorage.getItem('hugo-lang') || 'cs'; } catch (e) { return 'cs'; }
  })();

  var snapped = false;

  function snapshot() {
    if (snapped) return;
    ENTRIES.forEach(function (e) {
      if (e.all) {
        var nodes = document.querySelectorAll(e.sel);
        e._en = [];
        nodes.forEach(function (n) { e._en.push(n.innerHTML); });
      } else {
        var n = document.querySelector(e.sel);
        e._en = n ? n.innerHTML : null;
      }
    });
    PH.forEach(function (e) {
      var nodes = document.querySelectorAll(e.sel);
      e._en = [];
      nodes.forEach(function (n) { e._en.push(n.getAttribute('placeholder') || ''); });
    });
    snapped = true;
  }

  function applyStatic(lang) {
    ENTRIES.forEach(function (e) {
      if (e.all) {
        var nodes = document.querySelectorAll(e.sel);
        nodes.forEach(function (n, i) {
          var v = (lang === 'en') ? (e._en ? e._en[i] : null) : (e.cs ? e.cs[i] : null);
          if (v != null) n.innerHTML = v;
        });
      } else {
        var node = document.querySelector(e.sel);
        if (!node) return;
        var val = (lang === 'en') ? e._en : e.cs;
        if (val != null) node.innerHTML = val;
      }
    });
    PH.forEach(function (e) {
      var nodes = document.querySelectorAll(e.sel);
      nodes.forEach(function (n, i) {
        var v = (lang === 'en') ? (e._en ? e._en[i] : null) : (e.cs ? e.cs[i] : null);
        if (v != null) n.setAttribute('placeholder', v);
      });
    });
  }

  function syncToggle(lang) {
    var t = document.getElementById('langToggle');
    if (t) {
      t.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('is-on', b.dataset.lang === lang);
      });
    }
    document.documentElement.lang = lang;
    if (TITLES[lang]) document.title = TITLES[lang];
  }

  window.applyHugoLang = function (lang) {
    window.HUGO_LANG = lang;
    try { localStorage.setItem('hugo-lang', lang); } catch (e) {}
    snapshot();
    applyStatic(lang);
    syncToggle(lang);
    if (typeof window.renderPricing === 'function') window.renderPricing();
    if (typeof window.__applyVariant === 'function') window.__applyVariant(lang);
  };

  /* localized waitlist "thanks" message (called from the form's onsubmit) */
  window.hugoFormThanks = function (form) {
    var P = window.HUGO_PRICING[window.HUGO_LANG] || window.HUGO_PRICING.en;
    var btn = form.querySelector('.btn');
    if (btn) btn.textContent = P.thanks;
  };

  function wire() {
    var t = document.getElementById('langToggle');
    if (t) {
      t.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-lang]');
        if (b) window.applyHugoLang(b.dataset.lang);
      });
    }
    // footer "English / Česky" link toggles language
    var legal = document.querySelectorAll('.foot-bottom .legal a');
    if (legal.length) {
      var last = legal[legal.length - 1];
      last.addEventListener('click', function (ev) {
        ev.preventDefault();
        window.applyHugoLang(window.HUGO_LANG === 'cs' ? 'en' : 'cs');
      });
    }
  }

  function boot() {
    snapshot();
    applyStatic(window.HUGO_LANG);
    syncToggle(window.HUGO_LANG);
    wire();
    if (typeof window.renderPricing === 'function') window.renderPricing();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
