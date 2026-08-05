/* ============================================================
   Hugo Landing — CZ/EN i18n layer
   - Snapshots the English baseline from the DOM on load
   - Applies the active language (default: cs) without touching
     interactive nodes
   ============================================================ */
(function () {
  'use strict';

  /* ---- reusable icon / fragment markup ---- */
  var ARR   = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  var PLAY  = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>';
  var CHK24 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var CHK26 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var CHKF  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ';
  var CHKSP = '<span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> ';
  var APPLE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.9 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.2 1.9 2.6 3.3 2.5 1.3 0 1.8-.8 3.4-.8 1.6 0 2.1.8 3.4.8 1.4 0 2.3-1.3 3.2-2.5.9-1.2 1.3-2.4 1.3-2.5-.1 0-2.9-1.1-2.9-4.6zM13.9 4.6c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z"/></svg> ';
  var ANDRO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg> ';
  var PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ';
  var WAVE  = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span> ';
  function ICO(x){ return '<span class="ico">' + x + '</span> '; }
  function NUMN(n){ return '<span class="n">' + n + '</span> '; }
  function CNUM(n){ return '<span class="ctrl-num">' + n + '</span>'; }

  /* ---- static text dictionary (cs only; en is read from the DOM) ---- */
  /* type: 'html' (innerHTML) is default; multiple matches use all:true with an array */
  var ENTRIES = [
    /* NAV */
    { sel: '.nav-links a', all: true, cs: ['Produkt', 'AI &amp; Brain', 'Spuštění', 'Ceník', 'Reference'] },
    { sel: '.nav-cta .btn.btn-primary', cs: 'Začít zdarma ' + ARR },

    /* HERO */
    { sel: '.hero-eyebrow', cs: '<span class="pip">★</span> Pro české kavárny, bary a restaurace &nbsp;·&nbsp; připraveno na EET 2.0' },
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
      CHK24 + ' Peníze z karet na účtu do 2 dnů',
      CHK24 + ' Připraveno na EET 2.0',
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
    { sel: '.floor-card .step', all: true, cs: ['01 · OBJEDNÁVKA', '02 · ÚČET', '03 · PLATBA'] },
    { sel: '.floor-card h4', all: true, cs: ['Objednávka u stolu', 'Účet přehledně', 'Rozděl, spropitné, zaplať'] },
    { sel: '.floor-card p', all: true, cs: [
      'Ťukni položky, přidej poznámku a pošli do kuchyně — bez odcházení od hosta a čmárání na blok.',
      'Všechny položky, DPH i součet na jednom místě — přidej slevu nebo přiřaď stůl, než objednávku odešleš.',
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

    /* PRICING — one plan */
    { sel: '#pricing .section-head .eyebrow', cs: 'Ceník — jeden tarif, a hotovo' },
    { sel: '#pricing .section-head h2', cs: '190 Kč měsíčně. <em>Jeden tarif, když platby bereš s námi.</em>' },
    { sel: '#pricing .section-head p.lead', cs: 'Žádné porovnávání tarifů, žádná pásma podle obratu, žádný obchodník na telefonu — stejná cena i stejná sazba za karty pro food truck i pro zavedenou restauraci.' },
    { sel: '.config-controls .ctrl:nth-child(1) .ctrl-label', cs: CNUM('1') + 'Poplatky za karty — jedna sazba, navždy' },
    { sel: '.config-controls .ctrl:nth-child(2) .ctrl-label', cs: CNUM('2') + 'Vyber si zařízení' },
    { sel: '.fee-row .fr-k', all: true, cs: ['Hugo terminál nebo tvůj Android', 'Tap to Pay na iPhonu'] },
    { sel: '.devopt .do-t', all: true, cs: ['Telefon, co už máš', 'Hugo terminál all-in-one'] },
    { sel: '.devopt .do-s', all: true, cs: [
      'iOS i Android. Tap to Pay na iPhonu, NFC na Androidu — žádná čtečka, žádný dongle, žádné kabely.',
      'Jednorázově. Terminál, tiskárna účtenek a Hugo v jedné krabičce — nic dalšího nekupuješ.'
    ] },
    { sel: '.devopt .do-tag', cs: '&minus;5 000 Kč příspěvek od státu' },
    { sel: '.sum-tier-meta', cs: 'jeden tarif · všechno v ceně' },
    { sel: '.sum-badge', cs: '14 DNÍ ZDARMA' },
    { sel: '.sum-u', cs: 'Kč / měsíc' },
    { sel: '.sum-plus', cs: '+ 0,9 % + 1 Kč z platby kartou — při jakémkoli obratu' },
    { sel: '.sum-feat li', all: true, cs: [
      CHKF + 'Platby kartou a Tap to Pay <b style="color:var(--green); font-weight:700;">v ceně</b>',
      CHKF + 'Piano Pilot — pomůže ti s řízením podniku',
      CHKF + 'Export pro účetnictví',
      CHKF + 'Zprovozněno do 5 minut',
      CHKF + 'Menu jen vyfotíš — nebo si ho stáhneme z tvého webu',
      CHKF + 'Připraveno na EET 2.0',
      CHKF + 'Neomezeně zařízení, lidí i položek v menu',
      CHKF + 'Česká firma, český produkt, česká podpora'
    ] },
    { sel: '.summary .btn.btn-primary', cs: 'Začít 14 dní zdarma' },
    { sel: '.sum-fine', cs: '14 dní zdarma. Bez smlouvy. Zrušíš kdykoli. Data zůstanou tvoje.' },

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
      CHKSP + '14 dní zdarma — pak 190 Kč měsíčně, zrušíš kdykoli'
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
    { sel: '.final-ctas a', all: true, cs: [APPLE + 'Stáhnout pro iOS', ANDRO + 'Stáhnout pro Android', PHONE + 'Zavolat &middot; +420 770 320 248'] },
    { sel: '.final-fine span', all: true, cs: [CHK26 + ' Bez karty na start', CHK26 + ' Zrušíš kdykoli', CHK26 + ' Skuteční lidé, česky, 7 dní v týdnu'] },

    /* FOOTER */
    { sel: '.foot-brand p', cs: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů — ne naopak.' },
    { sel: '.foot-col h5', all: true, cs: ['Produkt', 'Podpora'] },
    { sel: '.foot-grid > div:nth-child(2) a', all: true, cs: ['Zařízení', 'AI &amp; Brain', 'Spuštění', 'Ceník'] },
    { sel: '.foot-grid > div:nth-child(3) a', all: true, cs: ['hugo@piano.cz', '+420 770 320 248', 'Stav služeb', 'Přihlásit se'] },
    { sel: '.foot-bottom > div:first-child', cs: '© 2026 Hugo &middot; český produkt od Piana &middot; <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>' },
    { sel: '.foot-bottom .legal a', all: true, cs: ['Všeobecné obchodní podmínky', 'Kontakt', 'GDPR', 'English'] },

    /* MOBILE STICKY BAR */
    { sel: '.mb-txt', cs: '<b>Zdarma</b> s našimi platbami<br/>Bez karty · zrušíš kdykoli' },
    { sel: '.mobilebar .btn', cs: 'Začít zdarma ' + ARR },

    /* === CRO additions === */
    /* CRO_ANCHOR */
    { sel: '.guarantee-txt', all: true, cs: [
      '<b>14 dní zdarma, pak 190 Kč měsíčně.</b> A když nebudeš spokojený nebo spokojená, vrátíme ti peníze — bez formulářů, bez otázek.',
      '<b>14 dní zdarma.</b> A když nebudeš spokojený nebo spokojená, vrátíme ti peníze — bez formulářů, bez otázek.'
    ] },
    { sel: '.abbar-label', cs: 'Verze pro:' },
    { sel: '.ab-opt', all: true, cs: ['Mikro provoz', 'Kavárna & bar', 'Restaurace & síť'] },
    { sel: '.pay-note', cs: 'Transparentní ceny v režimu MIF++. Stejná sazba při 30 000 Kč i při 1 000 000 Kč měsíčně — a peníze máš na účtu do 2 dnů, bez měnění banky.' },
    { sel: '.price-points li span', all: true, cs: [
      '<b>190 Kč měsíčně místo 990 Kč</b> — celá pokladna (objednávky, menu, DPH, reporty), když platby kartou bereš s námi. Jedna cena, nic skrytého.',
      '<b>0,9 % + 1 Kč z platby kartou — vždycky</b>, ať máš jakýkoli obrat. Transparentní režim MIF++, žádná sazba, která se ti potichu změní.',
      '<b>Peníze z karet na účtu do 2 dnů</b> — platby kompletně vyřešené a banku si necháš tu svou.'
    ] },
    { sel: '.midcta-txt h3', cs: 'Připraveno ještě před polední špičkou.' },
    { sel: '.midcta-txt p', cs: 'Za 190 Kč měsíčně &middot; spustíš za 5 minut &middot; bez karty, bez smlouvy.' },
    { sel: '.midcta-actions .btn-primary', cs: 'Začít zdarma ' + ARR },
    { sel: '.annbar-txt', cs: '<b>EET se vrací 1. 1. 2027.</b> Přejdi na Hugo teď a měj klid — se zaváděcí cenou zamčenou jen do 1. 12. 2026.' },
    { sel: '.annbar-cta', cs: 'Zjistit víc &rarr;' },
    { sel: '.form-alt-or', cs: 'nebo spusť za 30 sekund' },
    { sel: '.foot-phone', cs: 'Zavolej nám &middot; +420 770 320 248 &middot; Po&ndash;Ne 8&ndash;22' },
    { sel: '.form-call', cs: 'Radši zavoláš? <a href="tel:+420770320248">+420 770 320 248</a> &middot; nebo napiš na <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>' },
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
      'Jeden tarif: 190 Kč měsíčně místo 990 Kč, když platby kartou bereš přes nás — k tomu 0,9 % + 1 Kč z platby kartou, vždycky a při jakémkoli obratu (Tap to Pay na iPhonu 0,9 % + 2,75 Kč). Prvních 14 dní je zdarma, a když nebudeš spokojený nebo spokojená, vrátíme ti peníze. Žádné tarify k porovnávání, žádný háček, žádná smlouva.',
      'Žádná smlouva ani výpovědní lhůta. Zrušíš kdykoli a data si odneseš.',
      'Menu naimportujeme, Hugo běží vedle stávající pokladny a přepneš, až budeš chtít. Migrace je zdarma.',
      'Ne. Hugo běží na iPhonu nebo Androidu, který už máš. Když chceš pořádné zařízení na pult, náš all-in-one terminál s Hugem stojí 4 900 Kč jednorázově — a příspěvek od státu z toho ubere 5 000 Kč. Připojit můžeš i vlastní tiskárnu účtenek a pokladní zásuvku.',
      'Do 2 dnů — rovnou na účet, který už máš. Banku měnit nemusíš.',
      'DPH a účtenky řeší Hugo automaticky a jsme připraveni na EET 2.0 — ty nenastavuješ nic.'
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

  /* ---- localized strings used by inline page scripts ---- */
  window.HUGO_PRICING = {
    en: { thanks: 'Thanks — we’ll call within 24 hours.' },
    cs: { thanks: 'Děkujeme — ozveme se do 24 hodin.' }
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
