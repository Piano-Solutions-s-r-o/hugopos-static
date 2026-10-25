(function (root) {
  'use strict';
  // Product copy for the public e-shop, keyed by catalogue id (HUGO-2182). Every card in
  // index.html takes its kicker/title/description/included note/image labels from here and
  // the detail dialog its lead and specs; the static Czech HTML must equal the `cs` entry
  // (Web/tests/eshop_shop.test.js). Czech uses tykání (Docs: tone of voice, HUGO-1813).
  // Amounts never live here: they come from the server catalogue.
  var productCopy = {
    cs: {
      pax_a920: {
        kicker: 'All-in-one', title: 'Terminál Hugo', description: 'Platby, účtenka a pokladna v jedné lehké krabičce.', included: 'Jeden obal v ceně terminálu',
        lead: 'Lehký terminál, na kterém běží pokladna, platby i účtenka. Bez druhé krabičky a bez kabelového zátiší.',
        specs: [['Model', 'PAX A920 Pro Core'], ['Systém', 'Android 10 · čtyřjádrový ARM Cortex A53'], ['Displej', '5,5″ kapacitní dotykový'], ['Platby', 'Čip a PIN · bezkontaktní NFC · magnetický proužek'], ['Připojení', '4G · Wi-Fi · Bluetooth'], ['Výdrž a tisk', 'Baterie 5 150 mAh · vestavěná termální tiskárna']],
        imageLabel: 'Zobrazit detail terminálu Hugo', imageAlt: 'Terminál Hugo s obalem Rudý impuls'
      },
      terminal_case: {
        kicker: 'Accessories', title: 'Další obal na terminál', description: 'Měkčí dopad, jistější úchop a barva, která patří k tobě.',
        lead: 'Pružný ochranný obal dává terminálu jistější úchop a tvé obsluze vlastní barvu.',
        specs: [['Povrch', 'Měkký protiskluzový'], ['Ochrana', 'Hrany a zadní část'], ['Barvy', 'Šest odstínů']],
        imageLabel: 'Zobrazit detail dalšího ochranného obalu', imageAlt: 'Další obal na terminál v barvě Rudý impuls'
      },
      belt_holster: {
        kicker: 'Accessories', title: 'Kožené pouzdro na pásek', description: 'Terminál po ruce, ruce připravené na tác a plný plac.',
        lead: 'Měkká kožená kapsa drží terminál u těla, ale nechá ho vytáhnout jedním pohybem. Na plac, zahrádku i event.',
        specs: [['Materiál', 'Pravá kůže · finální specifikaci doplníme'], ['Uchycení', 'Poutko na pásek'], ['Kompatibilita', 'Terminál Hugo']],
        imageLabel: 'Zobrazit detail koženého pouzdra', imageAlt: 'Kožené pouzdro na pásek s platebním terminálem'
      },
      charging_base_a920: {
        kicker: 'Accessories', title: 'Nabíjecí základna pro terminál', description: 'Terminál na noc postavíš do základny a ráno je nabitý.',
        lead: 'Nabíjecí základna pro Terminál Hugo. Terminál na noc postavíš do základny a ráno je nabitý — žádné hledání kabelu na konci směny.',
        specs: [['Model', 'L920 Pro-BC'], ['Kompatibilita', 'Terminál Hugo (PAX A920 Pro)'], ['Použití', 'Stojí na pultu, terminál do ní jen postavíš']],
        imageLabel: 'Zobrazit detail nabíjecí základny', imageAlt: 'Nabíjecí základna pro terminál PAX A920 Pro'
      },
      printer_zj5809: {
        kicker: 'ZJ-5809/BT', title: 'Bluetooth tiskárna účtenek', description: 'Papírová účtenka pro hosty, kteří ji chtějí. Bez kabelu přes celý bar.',
        lead: 'Kompaktní tiskárna účtenek, která se s terminálem spáruje přes Bluetooth. Když host chce papír, dostane ho — bez kabelu přes celý bar.',
        specs: [['Model', 'ZJ-5809/BT'], ['Šířka pásky', '58 mm'], ['Připojení', 'Bluetooth · nabíjecí kabel v balení'], ['Příslušenství', 'Včetně pouzdra']],
        imageLabel: 'Zobrazit detail Bluetooth tiskárny účtenek', imageAlt: 'Bluetooth tiskárna účtenek ZJ-5809/BT'
      },
      paper_roll_57: {
        kicker: '57 mm', title: 'Kotoučky do terminálu a BT tiskárny', description: 'Termopapír 57 mm pro terminál a BT tiskárnu, balení 50 ks.',
        lead: 'Termopapír 57 mm do Terminálu Hugo i do Bluetooth tiskárny ZJ-5809/BT. Tiskne bez inkoustu a v balení je 50 kotoučků.',
        specs: [['Rozměr', 'Šířka 57 mm · průměr 40 mm'], ['Papír', 'Termopapír, tiskne bez inkoustu'], ['Balení', '50 ks'], ['Pro', 'Terminál Hugo · tiskárna ZJ-5809/BT']],
        imageLabel: 'Zobrazit detail kotoučků 57 mm', imageAlt: 'Kotoučky termopapíru 57 mm do terminálu'
      },
      printer_rp110: {
        kicker: 'LAN · 80 mm', title: 'Síťová tiskárna Partner RP-110', description: 'Objednávky se tisknou tam, kde se připravují. Zapojíš ji kabelem do sítě.',
        lead: 'Síťová tiskárna na bar i do kuchyně: objednávky se tisknou tam, kde se připravují. Zapojíš ji kabelem do sítě podniku a Hugo na ni posílá bony.',
        specs: [['Model', 'Partner RP-110'], ['Připojení', 'Kabelem do sítě (LAN)'], ['Papír', '80 mm · automatický odřez'], ['Tisk', 'Termotisk, bez inkoustu']],
        imageLabel: 'Zobrazit detail síťové tiskárny', imageAlt: 'Síťová termální tiskárna Partner RP-110'
      },
      paper_roll_80: {
        kicker: '80 mm', title: 'Kotoučky do síťové tiskárny', description: 'Termopapír 80 mm pro síťovou tiskárnu, balení 20 ks.',
        lead: 'Termopapír 80 mm do síťové tiskárny Partner RP-110 na baru i v kuchyni. Tiskne bez inkoustu a v balení je 20 kotoučků.',
        specs: [['Rozměr', 'Šířka 80 mm · průměr 80 mm'], ['Papír', 'Termopapír, tiskne bez inkoustu'], ['Balení', '20 ks'], ['Pro', 'Síťová tiskárna Partner RP-110']],
        imageLabel: 'Zobrazit detail kotoučků 80 mm', imageAlt: 'Kotoučky termopapíru 80 mm do síťové tiskárny'
      },
      android_tap_to_pay: {
        kicker: 'Android', title: 'Android Tap-to-Pay', description: 'Bezkontaktní platby přímo v telefonu obsluhy. Stačí Android s NFC.',
        lead: 'Android Tap-to-Pay změní kompatibilní telefon obsluhy v bezkontaktní platební terminál — host jednoduše přiloží kartu nebo mobil k zadní straně telefonu. Žádný další hardware neobjednáváš, funkce je součástí Hugo účtu.',
        specs: [['Co to je', 'Bezkontaktní platba kartou nebo mobilem přímo na telefonu obsluhy, bez zvláštního terminálu.'], ['Co potřebuješ', 'Telefon s Androidem a podporou NFC — mají ji téměř všechny novější telefony.'], ['Ověření telefonu', 'Při zakládání účtu zadáš model telefonu a kalibrace v onboardingu ti řekne, jestli je pro Tap-to-Pay použitelný.']],
        imageLabel: 'Zobrazit detail Android Tap-to-Pay', imageAlt: 'Ilustrace bezkontaktní platby telefonem s NFC'
      },
      tablet_idea_tab_pro: {
        kicker: 'Android', title: 'Lenovo Idea Tab Pro 12,7″', description: 'Velký tablet s matným displejem, 8 GB/128 GB. Pero Tab Pen Plus a nabíječka v ceně.', included: 'Otočný hliníkový stojánek v ceně',
        lead: 'Velký Android tablet s matným 12,7″ displejem — pokladna, která se dobře čte na baru i u stolu. V ceně je pero Tab Pen Plus, otočný hliníkový stojánek a nabíječka.',
        specs: [['Displej', '12,7″ matný IPS · 2944 × 1840 · 144 Hz'], ['Paměť', '8 GB RAM · úložiště 128 GB'], ['Připojení', 'Wi-Fi · Bluetooth'], ['Baterie', '10 200 mAh · rychlé nabíjení 45 W'], ['V ceně', 'Pero Tab Pen Plus · otočný hliníkový stojánek · nabíječka']],
        imageLabel: 'Zobrazit detail tabletu Lenovo Idea Tab Pro', imageAlt: 'Tablet Lenovo Idea Tab Pro 12,7″ zepředu a zezadu'
      },
      tablet_ipad_11: {
        kicker: 'iPadOS', title: 'Apple iPad 11″', description: 'iPad (2025) s čipem A16 a úložištěm 128 GB.', included: 'Otočný hliníkový stojánek v ceně',
        lead: 'Apple iPad 11″ (2025) s čipem A16 a úložištěm 128 GB — svižná pokladna na pult. V ceně je otočný hliníkový stojánek.',
        specs: [['Model', 'Apple iPad 11″ (2025)'], ['Displej', '11″ IPS · 2360 × 1640'], ['Čip a paměť', 'Apple A16 · úložiště 128 GB'], ['Připojení', 'Wi-Fi · Bluetooth · USB-C'], ['Baterie', '7 698 mAh'], ['V ceně', 'Otočný hliníkový stojánek']],
        imageLabel: 'Zobrazit detail tabletu Apple iPad 11″', imageAlt: 'Stříbrný tablet Apple iPad 11″ zepředu a zezadu'
      },
      tablet_galaxy_tab_a11_plus: {
        kicker: 'Android', title: 'Samsung Galaxy Tab A11+', description: '11″ displej 90 Hz, 6 GB/128 GB, stříbrný.', included: 'Skládací stojánek UGREEN v ceně',
        lead: 'Stříbrný Android tablet Samsung Galaxy Tab A11+ s 11″ displejem 90 Hz, 6 GB RAM a úložištěm 128 GB. V ceně je skládací stojánek UGREEN.',
        specs: [['Displej', '11″ IPS · 1920 × 1200 · 90 Hz'], ['Paměť', '6 GB RAM · úložiště 128 GB (microSD až 2 TB)'], ['Připojení', 'Wi-Fi · Bluetooth'], ['Baterie', '7 040 mAh · rychlé nabíjení 25 W · odolnost IP52'], ['Barva', 'Stříbrná'], ['V ceně', 'Skládací stojánek UGREEN · kabel USB-C']],
        imageLabel: 'Zobrazit detail tabletu Samsung Galaxy Tab A11+', imageAlt: 'Stříbrný tablet Samsung Galaxy Tab A11+ zepředu a zezadu'
      },
      network_install_service: {
        kicker: 'Služba', title: 'Instalace od nás', description: 'Zapojíme a nastavíme pokladnu, tiskárny a síť. Základní balíček jsou 2 hodiny práce na místě; cestovné v ceně do 50 km od centra Prahy nebo Brna.',
        lead: 'Přijedeme, zapojíme a nastavíme pokladnu, tiskárny i síť, aby všechno fungovalo od prvního dne. Platíš předem základní balíček: 2 hodiny práce na místě; v košíku zvolíš počet balíčků.',
        specs: [['Co zapojíme', 'Pokladnu, síťové tiskárny a router'], ['Co nastavíme', 'Tiskárny a pokladnu v Hugu'], ['Cena', 'Základní balíček: 2 hodiny práce na místě, předem'], ['Cestovné', 'V ceně do 50 km od centra Prahy nebo Brna, dál dle ceníku (15 Kč za km tam i zpět)'], ['Doprava', 'Žádná, nic neposíláme']],
        imageLabel: 'Zobrazit detail instalace od nás', imageAlt: 'Ilustrace instalace od nás — práce technika na místě'
      }
    },
    en: {
      pax_a920: {
        kicker: 'All-in-one', title: 'Hugo terminal', description: 'Payments, receipts and POS in one light device.', included: 'One case included with the terminal',
        lead: 'A light terminal running your POS, payments and receipts. No second box and no cable clutter.',
        specs: [['Model', 'PAX A920 Pro Core'], ['System', 'Android 10 · quad-core ARM Cortex A53'], ['Display', '5.5″ capacitive touchscreen'], ['Payments', 'Chip & PIN · contactless NFC · magnetic stripe'], ['Connectivity', '4G · Wi-Fi · Bluetooth'], ['Battery and printing', '5,150 mAh battery · built-in thermal printer']],
        imageLabel: 'View Hugo terminal details', imageAlt: 'Hugo terminal with a Red Impulse case'
      },
      terminal_case: {
        kicker: 'Accessories', title: 'Additional terminal case', description: 'A softer landing, safer grip and a colour that feels like yours.',
        lead: 'A flexible protective case gives the terminal a safer grip and your team a colour of their own.',
        specs: [['Surface', 'Soft non-slip finish'], ['Protection', 'Edges and back'], ['Colours', 'Six shades']],
        imageLabel: 'View additional protective case details', imageAlt: 'Additional terminal case in Red Impulse'
      },
      belt_holster: {
        kicker: 'Accessories', title: 'Leather belt holster', description: 'Your terminal close by, your hands free for a tray and a busy floor.',
        lead: 'A soft leather pocket keeps the terminal close and releases it in one movement. Built for the floor, terrace and events.',
        specs: [['Material', 'Genuine leather · final specification to follow'], ['Attachment', 'Belt loop'], ['Compatibility', 'Hugo terminal']],
        imageLabel: 'View leather holster details', imageAlt: 'Leather belt holster holding a payment terminal'
      },
      charging_base_a920: {
        kicker: 'Accessories', title: 'Terminal charging base', description: 'Stand the terminal in the base overnight and it is charged by morning.',
        lead: 'A charging base for the Hugo terminal. Stand the terminal in it overnight and it is charged by morning — no hunting for a cable at the end of a shift.',
        specs: [['Model', 'L920 Pro-BC'], ['Compatibility', 'Hugo terminal (PAX A920 Pro)'], ['Use', 'Sits on the counter; you just stand the terminal in it']],
        imageLabel: 'View charging base details', imageAlt: 'Charging base for the PAX A920 Pro terminal'
      },
      printer_zj5809: {
        kicker: 'ZJ-5809/BT', title: 'Bluetooth receipt printer', description: 'A paper receipt for the guests who want one. No cable across the bar.',
        lead: 'A compact receipt printer that pairs with the terminal over Bluetooth. When a guest wants paper, they get it — with no cable across the bar.',
        specs: [['Model', 'ZJ-5809/BT'], ['Paper width', '58 mm'], ['Connectivity', 'Bluetooth · charging cable included'], ['Accessories', 'Case included']],
        imageLabel: 'View Bluetooth receipt printer details', imageAlt: 'ZJ-5809/BT Bluetooth receipt printer'
      },
      paper_roll_57: {
        kicker: '57 mm', title: 'Paper rolls for the terminal and BT printer', description: '57 mm thermal paper for the terminal and the BT printer, pack of 50.',
        lead: '57 mm thermal paper for the Hugo terminal and the ZJ-5809/BT Bluetooth printer. It prints without ink and the pack holds 50 rolls.',
        specs: [['Size', '57 mm wide · 40 mm diameter'], ['Paper', 'Thermal paper, prints without ink'], ['Pack', '50 rolls'], ['For', 'Hugo terminal · ZJ-5809/BT printer']],
        imageLabel: 'View 57 mm paper roll details', imageAlt: '57 mm thermal paper rolls for the terminal'
      },
      printer_rp110: {
        kicker: 'LAN · 80 mm', title: 'Partner RP-110 network printer', description: 'Orders print where they are prepared. Connect it to your network with a cable.',
        lead: 'A network printer for the bar and the kitchen: orders print right where they are prepared. Connect it to your venue’s network with a cable and Hugo sends the tickets to it.',
        specs: [['Model', 'Partner RP-110'], ['Connection', 'Wired network (LAN)'], ['Paper', '80 mm · automatic cutter'], ['Printing', 'Thermal, no ink']],
        imageLabel: 'View network printer details', imageAlt: 'Partner RP-110 network thermal printer'
      },
      paper_roll_80: {
        kicker: '80 mm', title: 'Paper rolls for the network printer', description: '80 mm thermal paper for the network printer, pack of 20.',
        lead: '80 mm thermal paper for the Partner RP-110 network printer at the bar and in the kitchen. It prints without ink and the pack holds 20 rolls.',
        specs: [['Size', '80 mm wide · 80 mm diameter'], ['Paper', 'Thermal paper, prints without ink'], ['Pack', '20 rolls'], ['For', 'Partner RP-110 network printer']],
        imageLabel: 'View 80 mm paper roll details', imageAlt: '80 mm thermal paper rolls for the network printer'
      },
      android_tap_to_pay: {
        kicker: 'Android', title: 'Android Tap-to-Pay', description: 'Contactless payments right on your staff’s phone. Just Android with NFC.',
        lead: 'Android Tap-to-Pay turns a compatible staff phone into a contactless payment terminal — the guest simply taps their card or phone against the back of it. There is no extra hardware to order; the feature comes with your Hugo account.',
        specs: [['What it is', 'Contactless card or phone payment directly on your staff’s phone — no separate terminal needed.'], ['What you need', 'An Android phone with NFC support — found on almost every newer phone.'], ['Phone check', 'When you set up your account you enter your phone model, and the onboarding calibration tells you if it works with Tap-to-Pay.']],
        imageLabel: 'View Android Tap-to-Pay details', imageAlt: 'Illustration of a contactless payment tapped against an NFC phone'
      },
      tablet_idea_tab_pro: {
        kicker: 'Android', title: 'Lenovo Idea Tab Pro 12.7″', description: 'A large tablet with a matte display, 8 GB/128 GB. Tab Pen Plus and charger included.', included: 'Swivel aluminium stand included',
        lead: 'A large Android tablet with a matte 12.7″ display — a till that reads well at the bar and at the table. The Tab Pen Plus, a swivel aluminium stand and a charger are included.',
        specs: [['Display', '12.7″ matte IPS · 2944 × 1840 · 144 Hz'], ['Memory', '8 GB RAM · 128 GB storage'], ['Connectivity', 'Wi-Fi · Bluetooth'], ['Battery', '10,200 mAh · 45 W fast charging'], ['Included', 'Tab Pen Plus · swivel aluminium stand · charger']],
        imageLabel: 'View Lenovo Idea Tab Pro tablet details', imageAlt: 'Lenovo Idea Tab Pro 12.7″ tablet, front and back'
      },
      tablet_ipad_11: {
        kicker: 'iPadOS', title: 'Apple iPad 11″', description: 'iPad (2025) with the A16 chip and 128 GB storage.', included: 'Swivel aluminium stand included',
        lead: 'Apple iPad 11″ (2025) with the A16 chip and 128 GB storage — a quick till for the counter. A swivel aluminium stand is included.',
        specs: [['Model', 'Apple iPad 11″ (2025)'], ['Display', '11″ IPS · 2360 × 1640'], ['Chip and storage', 'Apple A16 · 128 GB storage'], ['Connectivity', 'Wi-Fi · Bluetooth · USB-C'], ['Battery', '7,698 mAh'], ['Included', 'Swivel aluminium stand']],
        imageLabel: 'View Apple iPad 11″ tablet details', imageAlt: 'Silver Apple iPad 11″ tablet, front and back'
      },
      tablet_galaxy_tab_a11_plus: {
        kicker: 'Android', title: 'Samsung Galaxy Tab A11+', description: '11″ 90 Hz display, 6 GB/128 GB, silver.', included: 'UGREEN foldable stand included',
        lead: 'The silver Samsung Galaxy Tab A11+ Android tablet with an 11″ 90 Hz display, 6 GB RAM and 128 GB storage. A UGREEN foldable stand is included.',
        specs: [['Display', '11″ IPS · 1920 × 1200 · 90 Hz'], ['Memory', '6 GB RAM · 128 GB storage (microSD up to 2 TB)'], ['Connectivity', 'Wi-Fi · Bluetooth'], ['Battery', '7,040 mAh · 25 W fast charging · IP52 rating'], ['Colour', 'Silver'], ['Included', 'UGREEN foldable stand · USB-C cable']],
        imageLabel: 'View Samsung Galaxy Tab A11+ tablet details', imageAlt: 'Silver Samsung Galaxy Tab A11+ tablet, front and back'
      },
      network_install_service: {
        kicker: 'Service', title: 'Installation by us', description: 'We connect and set up your till, printers and network. The basic package is 2 hours of work on site; travel is included within 50 km of central Prague or Brno.',
        lead: 'We come over, connect and set up your till, printers and network so everything works from day one. You pay up front for the basic package: 2 hours of work on site; choose the number of packages in your bag.',
        specs: [['What we connect', 'Till, network printers and router'], ['What we set up', 'Printers and till in Hugo'], ['Price', 'Basic package: 2 hours of work on site, paid up front'], ['Travel', 'Included within 50 km of central Prague or Brno, beyond that per the price list (CZK 15 per km, both ways)'], ['Delivery', 'None, nothing is shipped']],
        imageLabel: 'View installation details', imageAlt: 'Illustration of installation by us — a technician at work on site'
      }
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = productCopy;
  else root.HugoEshopProductCopy = productCopy;
}(typeof window !== 'undefined' ? window : globalThis));
