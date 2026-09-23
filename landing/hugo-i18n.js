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
  var WAVE  = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span> ';
  function ICO(x){ return '<span class="ico">' + x + '</span> '; }
  function NUMN(n){ return '<span class="n">' + n + '</span> '; }
  function CNUM(n){ return '<span class="ctrl-num">' + n + '</span>'; }

  /* ---- static text dictionary (cs only; en is read from the DOM) ---- */
  /* type: 'html' (innerHTML) is default; multiple matches use all:true with an array */
  var ENTRIES = [
    /* NAV */
    { sel: '.nav-links a', all: true, cs: ['Produkt', 'AI &amp; Brain', 'Spuštění', 'Srovnání', 'Ceník', 'E-shop', 'Reference'] },
    { sel: '.nav-cta .btn.btn-primary', cs: 'Začít zdarma ' + ARR },

    /* HERO */
    { sel: '.hero-eyebrow', cs: '<span class="pip">★</span> Pro kavárny, bary a restaurace, které nemají čas čekat na technika' },
    { sel: '.hero h1', cs: 'Pokladna, která <br/> <span class="hl">nečeká na technika.</span> <em>Stačí telefon a pět minut.</em>' },
    { sel: '.hero p.lead', cs: 'Objednávky, menu, spropitné, DPH i účtenky v jedné appce na zařízení, které už máš. Kartu přijmeš na Androidu nebo na terminálu Hugo. Béžová krabice, smlouva na roky a zaškolovací den zůstávají u konkurence.' },
    { sel: '.hero-ctas .btn-primary', cs: 'Začít zdarma ' + ARR },
    { sel: '.hero-ctas .btn-ghost', cs: 'Ukaž mi to ' + PLAY },
    { sel: '.hero-meta span', all: true, cs: [CHK24 + ' Bez karty na start', CHK24 + ' Prodáváš za 5 minut', CHK24 + ' Zrušíš kdykoli'] },
    { sel: '.fc-fast .sub', cs: 'prům. čas k první tržbě' },

    /* LOGO STRIP */
    { sel: '.strip-label', cs: 'Už na Hugovi kasírují v Česku i na Slovensku' },

    /* TRUST */
    { sel: '.trust-chip', all: true, cs: [
      CHK24 + ' Žádná smlouva, žádná výpovědní lhůta',
      CHK24 + ' Peníze z karet na účtu do 2 dnů',
      CHK24 + ' Připraveno na EET 2.0'
    ] },
    { sel: '.quote p', cs: '„Přešli jsme v úterý ráno. Do polední špičky celý tým markoval objednávky <span class="mk">bez jediného dotazu.</span>“' },
    { sel: '.quote .who span:last-child', cs: '<b>Petr Novák</b> · Pivovarská šenkovna, Brno' },

    /* PRODUCT / DEVICES */
    { sel: '#product .section-head .eyebrow', cs: 'Jakékoli zařízení · jedna pokladna' },
    { sel: '#product .section-head h2', cs: 'Jeden Hugo. <em>iPhone, Android, tablet i terminál. Nic z toho nemusíš kupovat na leasing.</em>' },
    { sel: '#product .section-head p.lead', cs: 'Žádný proprietární hardware a žádná krabice, co u kasy sbírá prach od roku 2014. Telefon podej číšníkovi, tablet opři o bar, na špičku připoj terminál. Všechno se synchronizuje v reálném čase.' },
    { sel: '.dev-iphone p', cs: 'Na iPhonu běží Hugo stejně svižně. Objednávky, menu, dýška i účtenky máš v jedné appce.' },
    { sel: '.dev-android p', cs: 'Platby kartou přiložením na jakémkoli moderním Androidu. Stejná appka, stejná rychlost, stejný Brain.' },
    { sel: '.dev-any .label', cs: '+ všechno ostatní' },
    { sel: '.dev-any h3', cs: 'Kde se ti to hodí' },
    { sel: '.dev-any p', cs: 'Tablet na pultu, web v kanceláři, terminál na baru, objednávky na displeji v kuchyni.' },
    { sel: '.dev-any .chip span', all: true, cs: ['Tablet', 'Web', 'Terminál'] },

    /* TERMINAL COLOURS */
    { sel: '.tc .eyebrow', cs: 'Terminál po tvém' },
    { sel: '.tc h2', cs: 'Sedí k baru.<br/><em>I k tvému vkusu.</em>' },
    { sel: '.tc p.lead', cs: 'Šest barev obalu, jeden rychlý terminál. Vyber tu, která ladí s podnikem. Nebo s náladou obsluhy.' },
    { sel: '.tc-note', cs: 'Jeden obal je v ceně terminálu. Skladem je Rudý impuls, další barvy naskladňujeme.' },
    { sel: '.tc-cta', cs: 'Vybrat barvu v e-shopu' },

    /* ON THE FLOOR */
    { sel: '.floor .section-head .eyebrow', cs: 'Na place' },
    { sel: '.floor .section-head h2', cs: 'Páteční nával? <em>Hugo se nezapotí.</em>' },
    { sel: '.floor .section-head p.lead', cs: 'Tvoji lidé nečtou manuály, a s Hugem nemusí. Od objednávky po zaplacený účet je to pár ťuknutí, takže fronta plyne a stoly se točí rychleji.' },
    { sel: '.floor-card .step', all: true, cs: ['01 · OBJEDNÁVKA', '02 · ÚČET', '03 · PLATBA'] },
    { sel: '.floor-card h4', all: true, cs: ['Objednávka rovnou u stolu', 'Účet, kterému rozumí i host', 'Rozdělit, dýško, zaplaceno'] },
    { sel: '.floor-card p', all: true, cs: [
      'Ťukneš položky, přidáš poznámku a pošleš do kuchyně. Bez běhání k pultu a luštění vlastního písma z bloku.',
      'Položky, DPH i součet na jednom místě. Slevu nebo stůl přidáš dřív, než objednávku odešleš.',
      'Rozdělíš podle položek nebo hostů a přijmeš kartu, bezkontakt nebo QR jedním ťuknutím. Výzva na spropitné je v ceně.'
    ] },

    /* RELIABILITY */
    { sel: '.relband .section-head .eyebrow', cs: 'Postavené na spolehlivost' },
    { sel: '.relband .section-head h2', cs: 'Pokladna v telefonu, která <em>nezakolísá.</em>' },
    { sel: '.rel-item h4', all: true, cs: ['Funguje i při výpadku internetu', 'Použiješ, co máš', 'Žádná čtečka k nabíjení', 'Nic tě nezamyká'] },
    { sel: '.rel-item p', all: true, cs: [
      'Vypadne wifi ve špičce? Markuješ dál objednávky i hotovost. Hugo se sesynchronizuje, až bude signál, a až se v roce 2027 vrátí EET, účtenky se odešlou samy.',
      'Připoj svou tiskárnu účtenek a pokladní zásuvku, nebo jeď úplně bez papíru. Žádnou proprietární krabičku nekupuješ ani nepronajímáš.',
      'Hugo běží na zařízení, které už máš. Kartu přijmeš na Androidu nebo na terminálu Hugo.',
      'Menu, tržby i reporty si kdykoli vyexportuješ. Když odejdeš, čísla si vezmeš s sebou. Rukojmí z tebe neděláme.'
    ] },

    /* PIANO BRAIN */
    { sel: '#brain .eyebrow', cs: 'Vestavěná inteligence · pohání Piano' },
    { sel: '#brain h2', cs: 'Poradí ti, co <em>uvařit, kdo má přijít na směnu a co objednat.</em>' },
    { sel: '#brain p.lead', cs: 'Každá objednávka, směna i změna menu se potichu sčítá. Hugo z toho udělá srozumitelnou radu: tohle uvař víc, v pátek přidej lidi, objednej dřív, než dojde. Bez tabulek, bez analytika, bez domácích úkolů.' },
    { sel: '.brain-callouts .callout h4', all: true, cs: ['Nic ti nedojde, nic nezbude', 'Směny sedí na provoz', 'Zeptej se vlastními slovy'] },
    { sel: '.brain-callouts .callout p', all: true, cs: [
      'Hugo upozorní, co dnes nejspíš dojde a co připravit. Méně vyhodíš a hit ti nedojde uprostřed služby.',
      'Uvidíš, kdy bude příští týden rušno a kdy klid, ještě než napíšeš rozpis. Méně postávání, žádná podceněná špička.',
      '„Proč bylo v pátek mrtvo?“ Dostaneš přímou odpověď i s čísly, česky nebo anglicky.'
    ] },
    { sel: '.brain-viz .ntag', all: true, cs: [
      ICO('€') + ' Tržby', ICO('✓') + ' Sklad', ICO('★') + ' Recenze',
      ICO('✦') + ' Menu', ICO('●') + ' Spropitné', ICO('▶') + ' Směny'
    ] },
    { sel: '.brain-viz .center .lbl', cs: 'Piano<br/>Brain<small>připojeno</small>' },

    /* SETUP — TAP / TALK / AUTO */
    { sel: '#setup .section-head .eyebrow', cs: 'Od krabice k první tržbě za 5 minut' },
    { sel: '#setup .section-head h2', cs: 'Vyfoť, řekni, hotovo. <em>Bez přepisování menu. Bez školicího dne. Bez technika.</em>' },
    { sel: '#setup .section-head p.lead', cs: 'Hugo se naučí, co prodáváš, jak to prodáváš a kam patří doplňky. Stačí fotka menu, pár vět nebo účtenky z minulého týdne. Technik v polokošili, týden zaškolování a 200stránkový manuál si může nechat konkurence.' },
    { sel: '.setup-card h3', all: true, cs: ['Vyfoť', 'Řekni', 'Automaticky'] },
    { sel: '.setup-card > p', all: true, cs: [
      'Vyfoť tištěné menu. Hugo z něj za pár vteřin vytáhne položky, ceny i doplňky.',
      'Řekni Hugovi, co se změnilo. „Přidej Albariño za 89 Kč a k řízku půlporci.“ Hotovo.',
      'Daně, DPH, účtenky, spropitné, dělení účtů i foodcost řeší Hugo potichu na pozadí. Ty řešíš hosty.'
    ] },
    { sel: '.bubble.user', cs: WAVE + 'Přidej Albariño 0,15 l za 89 Kč' },
    { sel: '.bubble.ai', cs: 'Přidáno pod <b>Víno bílé</b>. Chceš i lahev 0,75 l?' },
    { sel: '.auto-art .auto-row .name', all: true, cs: ['DPH, účtenky a EET 2027', 'Foodcost z účtenek', 'Dělení spropitného po hodinách', 'Týdenní souhrn'] },
    { sel: '.auto-art .auto-row .meta', all: true, cs: ['nastaveno', '34&nbsp;%', 'připraveno', 'Ne 22:00'] },

    /* SWITCHING */
    { sel: '.switch .eyebrow', cs: 'Přecházíš odjinud' },
    { sel: '.switch h2', cs: 'Máš Dotykačku nebo Storyous? <em>Stěhování uděláme za tebe.</em>' },
    { sel: '.switch p.lead', cs: 'Šest let stará pokladna se 140 položkami není práce na pět minut a nebudeme předstírat, že je. Menu přeneseme, Hugo rozjedeme vedle stávajícího systému a přepneš, až budeš chtít.' },
    { sel: '.switch .btn-dark', cs: 'Domluvit migraci zdarma ' + ARR },
    { sel: '.switch-point h4', all: true, cs: ['Menu přeneseme za tebe', 'Obě pokladny běží vedle sebe', 'Obsluha to zvládne za jednu směnu'] },
    { sel: '.switch-point p', all: true, cs: [
      'Pošli fotku nebo export ze starého systému. Položky, ceny i doplňky složíme my, ty je jen zkontroluješ.',
      'Stávající pokladna může běžet, dokud Hugo zkoušíš. Žádný nervózní den D, žádné ztracené tržby ve špičce.',
      'Kdo umí ovládat telefon, zvládne i Hugo. Většina podniků nepotřebuje školicí den, stačí jedna služba.'
    ] },

    /* HUGO VS OLD TILL */
    { sel: '.vs .section-head .eyebrow', cs: 'Hugo proti staré pokladně' },
    { sel: '.vs .section-head h2', cs: 'Porovnej si to. <em>My si výsledek tipneme.</em>' },
    { sel: '.vs .section-head p.lead', cs: 'Staré pokladny nejsou špatné. Jen vznikly v době, kdy se menu psalo křídou a technik byl součást dodávky. Tady je, co se od té doby změnilo.' },
    { sel: '.vs-head span', all: true, cs: ['Disciplína', 'Stará pokladna', 'Hugo'] },
    { sel: '.vs-row .vs-k', all: true, cs: ['Od rozhodnutí k první platbě', 'Smlouva', 'Menu', 'Poplatek za kartu', 'Měsíčně', 'Hardware', 'Zaškolení obsluhy'] },
    { sel: '.vs-row .vs-old', all: true, cs: ['Až dorazí technik', 'Na roky, s výpovědní lhůtou', 'Přepíšeš ručně', 'Podle obratu a „individuální nabídky“', 'Podle balíčku a doplňků', 'Krabice na pronájem', 'Celý den'] },
    { sel: '.vs-row .vs-new', all: true, cs: ['5 minut', 'Žádná, zrušíš kdykoli', 'Vyfotíš', '<span>0,9 % + 1&nbsp;Kč&nbsp;(<a class="mif-link" href="#mif">MIF++</a>)</span>', '<span>190 Kč <small class="vat">bez&nbsp;DPH</small></span>', 'Tvůj telefon nebo terminál Hugo', 'Jedna směna'] },
    { sel: '.vs-foot p', cs: 'Pořád váháš? Prvních 14 dní je zdarma a když se ti Hugo nebude líbit, vrátíme peníze. Bez formulářů, bez výslechu.' },
    { sel: '.vs-foot .btn', cs: 'Vyzkoušet zdarma ' + ARR },

    /* PRICING — one plan */
    { sel: '#pricing .section-head .eyebrow', cs: 'Ceník. Jeden tarif a hotovo' },
    { sel: '#pricing .section-head h2', cs: '190 Kč měsíčně <small class="vat">bez&nbsp;DPH</small>. <em>Jeden tarif, když platby přijímáš s námi.</em>' },
    { sel: '#pricing .section-head p.lead', cs: 'Žádná tabulka tarifů, žádná pásma podle obratu, žádný obchodník, co „zavolá zpátky“. Stejná cena i stejný náš poplatek za karty pro food truck i pro zavedenou restauraci.' },
    { sel: '.config-controls .ctrl:nth-child(1) .ctrl-label', cs: CNUM('1') + 'Poplatky za karty. Náš poplatek je jeden, navždy' },
    { sel: '.config-controls .ctrl:nth-child(2) .ctrl-label', cs: CNUM('2') + 'Vyber zařízení' },
    { sel: '.fee-row .fr-k', all: true, cs: ['Terminál Hugo nebo tvůj Android'] },
    { sel: '.devopt .do-t', all: true, cs: ['Telefon, co už máš', 'Terminál Hugo all-in-one'] },
    { sel: '.devopt .do-s', all: true, cs: [
      'Hugo funguje na iOS i Androidu. Kartu přijmeš na Androidu nebo s terminálem Hugo.',
      'Jednorázově. Terminál, tiskárna účtenek a Hugo v jedné krabičce. Nic dalšího nekupuješ.'
    ] },
    { sel: '.devopt .do-p', all: true, cs: ['0 Kč', '4 900 Kč <small class="vat">bez&nbsp;DPH</small>'] },
    { sel: '.devopt .do-tag', cs: 'Připravovaný daňový bonus 5 000 Kč' },
    { sel: '.sum-tier-meta', cs: 'jeden tarif · všechno v ceně' },
    { sel: '.sum-badge', cs: '14 DNÍ ZDARMA' },
    { sel: '.sum-u', cs: 'Kč / měsíc bez DPH' },
    { sel: '.sum-plus', cs: '+ 0,9 % + 1 Kč z platby kartou. Náš poplatek je stejný při jakémkoli obratu.' },
    { sel: '.sum-feat li', all: true, cs: [
      CHKF + 'Platby kartou na Androidu <b style="color:var(--green); font-weight:700;">v ceně</b>',
      CHKF + 'Piano Pilot ti pomůže řídit podnik',
      CHKF + 'Export pro účetní',
      CHKF + 'Spuštěno do 5 minut',
      CHKF + 'Menu vyfotíš, nebo si ho stáhneme z tvého webu',
      CHKF + 'Připraveno na EET 2.0',
      CHKF + 'Neomezeně zařízení, lidí i položek v menu',
      CHKF + 'Česká firma, český produkt, česká podpora'
    ] },
    { sel: '.summary .btn.btn-primary', cs: 'Začít 14 dní zdarma' },
    { sel: '.sum-fine', cs: '14 dní zdarma. Bez smlouvy. Zrušíš kdykoli. Data si kdykoli vyexportuješ.' },

    /* POWER BAND */
    { sel: '.power h2', cs: 'Skutečná síla. <span class="hl">Nulové tření.</span>' },
    { sel: '.power-sub .x', all: true, cs: ['Žádné telefonáty.', 'Žádné papírování.', 'Žádné kecy.'] },
    { sel: '.power-tag', cs: 'Hugo je pro provozovatele, kteří podnik řídí <b>podle čísel, ne podle pocitu.</b> Jestli jsi to ty, můžeš jet ještě před polední špičkou. <em>Dnes.</em>' },

    /* WAITLIST / CONTACT */
    { sel: '.waitlist .eyebrow', cs: '<span class="live-dot"></span> Pomoc s přechodem zdarma · bez závazku' },
    { sel: '.waitlist h2', cs: 'Přejdi za den. <span class="hl">Nastavíme to</span> s tebou.' },
    { sel: '.waitlist .lead', cs: 'Nech nám kontakt a přechod projdeme s tebou: menu, terminál i první směnu. Nebo si Hugo stáhni a začni bez nás. <em>Obojí je zdarma.</em>' },
    { sel: '.waitlist-perks li', all: true, cs: [
      CHKSP + 'Menu naimportujeme z fotky nebo ze starého systému',
      CHKSP + 'Stávající terminál může běžet, dokud přecházíš',
      CHKSP + '<span>14 dní zdarma, pak 190 Kč měsíčně bez DPH, zrušíš kdykoli</span>'
    ] },
    { sel: '.waitlist-counter', cs: 'Nezávazně · zdarma' },
    { sel: '.waitlist-form h3', cs: 'Chceš, ať se ti ozveme?' },
    { sel: '.waitlist-form h3 + p', cs: 'Nech nám e-mail a ozve se ti člověk z Hugo týmu. Tímhle si účet nezakládáš.' },
    { sel: '.waitlist-fields button.btn', cs: 'Ozvi se mi ' + ARR },
    { sel: '.waitlist-spots .spots-label', cs: 'Máš jinou pokladnu? <b>Menu ti přeneseme zdarma.</b>' },
    { sel: '.waitlist-fineprint', cs: 'Žádný spam. E-mail použijeme jen k tomu, abychom se ti ozvali.' },

    /* FINAL CTA */
    { sel: '.final-card h2', cs: 'První tržba je pět minut daleko.' },
    { sel: '.final-card > p', cs: 'Tři kroky a žádný závazek. DPH, účtenky a tu nudnou práci, kterou tě staré pokladny nutily dělat ručně, převezme Hugo.' },
    { sel: '.final-step', all: true, cs: [NUMN('1') + 'Stáhni Hugo', NUMN('2') + 'Vyfoť menu', NUMN('3') + 'Přijmi první platbu'] },
    { sel: '.final-ctas a', all: true, cs: [APPLE + 'Stáhnout pro iOS', ANDRO + 'Stáhnout pro Android'] },
    { sel: '.final-fine span', all: true, cs: [CHK26 + ' Bez karty na start', CHK26 + ' Zrušíš kdykoli', CHK26 + ' Skuteční lidé, česky'] },

    /* SOCIALS */
    { sel: '.social-kicker', cs: 'Hugo mimo kasu' },
    { sel: '.social-copy h2', cs: 'Co funguje v provozu. <em>Bez omáčky.</em>' },
    { sel: '.social-copy > p', cs: 'Krátké tipy k platbám, každodennímu provozu a funkcím Huga, které ti ušetří pár kliknutí.' },
    { sel: '.social-main-cta', cs: 'Mrknout na tipy na Instagramu &rarr;' },
    { sel: '.social-elsewhere-label', cs: 'Hugo najdeš i tady' },
    { sel: '.instagram-note', cs: 'Tři poslední příspěvky' },
    { sel: '.instagram-slide-label', all: true, cs: ['Příspěvek 1 na Instagramu', 'Příspěvek 2 na Instagramu', 'Příspěvek 3 na Instagramu'] },
    { sel: '.ig-prev-label', cs: 'Předchozí příspěvek' },
    { sel: '.ig-next-label', cs: 'Další příspěvek' },

    /* FOOTER */
    { sel: '.foot-brand p', cs: 'Pokladna postavená kolem tvého telefonu, tvého menu a tvých hostů. Ne naopak.' },
    { sel: '.foot-col h5', all: true, cs: ['Produkt', 'Podpora'] },
    { sel: '.foot-grid > div:nth-child(2) a', all: true, cs: ['Zařízení', 'AI &amp; Brain', 'Spuštění', 'Ceník'] },
    { sel: '.foot-grid > div:nth-child(3) a', all: true, cs: ['hugo@piano.cz', 'Stav služeb', 'Přihlásit se'] },
    { sel: '.foot-bottom > div:first-child', cs: '© 2026 Hugo &middot; český produkt od Piana &middot; <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>' },
    { sel: '.foot-bottom .legal a', all: true, cs: ['Všeobecné obchodní podmínky', 'Kontakt', 'GDPR', 'English'] },

    /* MOBILE STICKY BAR */
    { sel: '.mb-txt', cs: '<b>Zdarma</b> s našimi platbami<br/>Bez karty · zrušíš kdykoli' },
    { sel: '.mobilebar .btn', cs: 'Začít zdarma ' + ARR },

    /* === CRO additions === */
    /* CRO_ANCHOR */
    { sel: '.guarantee-txt', all: true, cs: [
      '<b>14 dní zdarma, pak 190 Kč měsíčně.</b> Když ti Hugo nesedne, vrátíme ti peníze. Bez formulářů, bez otázek.',
      '<b>14 dní zdarma.</b> Když ti Hugo nesedne, vrátíme ti peníze. Bez formulářů, bez otázek.'
    ] },
    { sel: '.abbar-label', cs: 'Verze pro:' },
    { sel: '.ab-opt', all: true, cs: ['Mikro provoz', 'Kavárna & bar', 'Restaurace & síť'] },
    { sel: '.pay-note', cs: 'Transparentní ceny. Náš poplatek je stejný při 30 000 Kč i při 1 000 000 Kč měsíčně. Peníze máš na účtu do 2 dnů a banku měnit nemusíš.' },
    { sel: '.price-points li span', all: true, cs: [
      '<b>190 Kč měsíčně místo 990 Kč</b> <small class="vat">bez&nbsp;DPH</small>. Celá pokladna (objednávky, menu, DPH, reporty), když platby kartou přijímáš s námi. Jedna cena, nic skrytého.',
      '<b>0,9 % + 1 Kč (<a class="mif-link" href="#mif">MIF++</a>) z platby kartou, vždycky</b>, ať máš jakýkoli obrat. Náš poplatek se ti potichu nezmění.',
      '<b>Peníze z karet na účtu do 2 dnů.</b> Platby vyřešené od začátku do konce a banku si necháš svou.'
    ] },
    { sel: '.midcta-txt h3', cs: 'Hotovo ještě před polední špičkou.' },
    { sel: '.midcta-txt p', cs: 'Za 190 Kč měsíčně <small class="vat">bez&nbsp;DPH</small> &middot; spustíš za 5 minut &middot; bez karty, bez smlouvy.' },
    { sel: '.midcta-actions .btn-primary', cs: 'Začít zdarma ' + ARR },
    { sel: '.annbar-txt', cs: '<b>EET se vrací 1. 1. 2027.</b> Přejdi na Hugo teď a měj klid. Zaváděcí cena platí jen do 1. 12. 2026.' },
    { sel: '.annbar-cta', cs: 'Zjistit víc &rarr;' },
    { sel: '.form-alt-or', cs: 'Chceš začít rovnou? Stáhni appku' },
    { sel: '.form-call', cs: 'Dotazy? Napiš na <a href="mailto:hugo@piano.cz">hugo@piano.cz</a>.' },
    { sel: '.faq .section-head .eyebrow', cs: 'Než se rozhodneš' },
    { sel: '.faq .section-head h2', cs: 'Na tohle se ptáš nejčastěji.' },
    { sel: '.faq-item summary .q', all: true, cs: [
      'Kolik Hugo stojí? Kde je háček?',
      'Co znamená MIF++? Je to něco navíc?',
      'Musím podepsat smlouvu?',
      'Mám Dotykačku nebo Storyous. Bude přechod peklo?',
      'Musím kupovat hardware?',
      'Kdy dostanu peníze z karet?',
      'Co DPH a EET?'
    ] },
    { sel: '.faq-item .a', all: true, cs: [
      'Jeden tarif: 190 Kč měsíčně bez DPH místo 990 Kč, když platby kartou přijímáš přes nás, a k tomu 0,9 % + 1 Kč z platby kartou. To je náš poplatek, vždycky stejný při jakémkoli obratu; k němu se přičítají poplatky třetích stran, které <a class="mif-link" href="#mif">rozepisujeme níž</a>. Prvních 14 dní je zdarma, a když ti Hugo nesedne, vrátíme ti peníze. Háček jsme hledali, nenašli.',
      'MIF++ je způsob, jak se poplatek za platbu kartou rozepisuje, aby bylo vidět, komu a za co platíš. Nic navíc si nepřičítáme: jsou v něm stejné položky jako v jedné souhrnné sazbě („blended“), jen nejsou schované v jednom čísle. Z každé platby kartou jde:<ul class="a-list"><li><b>0,9 % + 1 Kč nám</b> za zpracování platby — vždycky stejně, ať máš jakýkoli obrat.</li><li><b>Mezibankovní poplatek (MIF)</b> bance, která tvému hostovi vydala kartu.</li><li><b>Poplatek karetní asociaci</b> Visa nebo Mastercard.</li></ul>Poslední dva neurčujeme my a nejsou naším příjmem, posíláme je dál v plné výši. U spotřebitelských karet vydaných v Evropském hospodářském prostoru je mezibankovní poplatek zastropovaný evropským nařízením na 0,2 % u debetních a 0,3 % u kreditních karet. Sazby se liší podle typu karty a u stravenkových karet a karet AMEX a Diners se přidává dodatečný poplatek. Všechny ceny a poplatky jsou bez DPH. Papírování a předpisů máš i bez nás dost, tak jsme se ti to snažili napsat na jedno přečtení. Strop na mezibankovní poplatek za tebe naštěstí vyřídili úředníci v Bruselu: jediný formulář, který nikdy neuvidíš.',
      'Ne. Žádná smlouva ani výpovědní lhůta. Zrušíš kdykoli a data si vyexportuješ.',
      'Nebude. Menu naimportujeme, Hugo poběží vedle stávající pokladny a přepneš, až budeš chtít. Migrace je zdarma.',
      'Ne. Hugo běží na iPhonu nebo Androidu, který už máš. Když chceš pořádné zařízení na pult, náš all-in-one terminál s Hugem stojí 4 900 Kč bez DPH jednorázově. Na pokladní zařízení se navíc připravuje daňový bonus 5 000 Kč. Připojit můžeš i vlastní tiskárnu účtenek a pokladní zásuvku.',
      'Do 2 dnů, rovnou na účet, který už máš. Banku měnit nemusíš.',
      'DPH a účtenky řeší Hugo automaticky a na EET 2.0 jsme připraveni. Ty nenastavuješ nic.'
    ] },
    { sel: '.tmonials .section-head .eyebrow', cs: 'Oblíbené na place' },
    { sel: '.tmonials .section-head h2', cs: 'České podniky, které <em>přešly a už se nevrátily.</em>' },
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
    { sel: '__noop__', cs: '' }
  ];

  /* ---- placeholder dictionary ---- */
  var PH = [
    { sel: '.waitlist-fields input', all: true, cs: ['E-mailová adresa', 'Tvoje jméno (nepovinné)'] }
  ];

  /* ---- localized strings used by inline page scripts ---- */
  window.HUGO_PRICING = {
    en: { thanks: 'Thanks, we will be in touch soon.' },
    cs: { thanks: 'Díky, brzy se ti ozveme.' }
  };

  var TITLES = {
    en: 'Hugo — A POS that pays for itself in 5 minutes',
    cs: 'Hugo — pokladna, která nečeká na technika'
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
