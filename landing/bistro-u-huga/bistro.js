(function () {
  'use strict';
  // ---------- helpers ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var parseIso = function (s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return iso(d) === s ? d : null;
  };
  var addDays = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  var today0 = function () { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  var hhmm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  // The stylesheet gives some elements an explicit display, which beats the hidden attribute.
  var show = function (el, on) { if (el) { el.hidden = !on; el.style.display = on ? '' : 'none'; } };
  // [open hour, close hour] by Date.getDay(); null = closed
  var HOURS = { 0: [11, 20], 1: null, 2: [11, 22], 3: [11, 22], 4: [11, 22], 5: [11, 23], 6: [11, 23] };
  var DAY_NOM = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  var DAY_ACC = ['v neděli', 'v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu'];
  var DAY_SHORT = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  var SEAT_LABEL = { uvnitr: 'uvnitř', zahradka: 'zahrádka', vycep: 'u výčepu', salonek: 'salonek' };
  var DAILY = [
    'Česnečka + Kuře na paprice s těstovinami',
    'Bramborová polévka + Svíčková na smetaně s knedlíkem',
    'Hovězí vývar s nudlemi + Vepřový řízek s bramborovým salátem',
    'Gulášová polévka + Smažený sýr s vařeným bramborem a tatarkou'
  ];
  var LOCATION = 'Náves 12, 588 31 Horní Hugovice';
  var hoursOf = function (d) { return HOURS[d.getDay()]; };
  // ---------- 1. live status + hours table + daily dish ----------
  function renderStatus() {
    var el = $('[data-status]'), txt = $('[data-status-text]');
    if (!el || !txt) return;
    var now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    var h = hoursOf(now), msg, open = false;
    if (h && mins >= h[0] * 60 && mins < h[1] * 60) {
      open = true;
      msg = 'Teď máme otevřeno · kuchyně do ' + hhmm((h[1] - 1) * 60);
    } else if (h && mins < h[0] * 60) {
      msg = 'Teď máme zavřeno · otevíráme dnes v ' + hhmm(h[0] * 60);
    } else {
      for (var i = 1; i <= 7; i++) {
        var d = addDays(now, i), nh = hoursOf(d);
        if (nh) {
          msg = 'Teď máme zavřeno · otevíráme ' + (i === 1 ? 'zítra' : DAY_ACC[d.getDay()]) + ' v ' + hhmm(nh[0] * 60);
          break;
        }
      }
    }
    txt.textContent = msg;
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
  }
  function renderToday() {
    var dow = new Date().getDay();
    $$('[data-hours] tr[data-dow]').forEach(function (tr) {
      tr.classList.toggle('is-today', +tr.getAttribute('data-dow') === dow);
    });
    var dish = $('[data-daily-dish]');
    if (dish) {
      dish.textContent = dow >= 2 && dow <= 5 ? 'Dnes: ' + DAILY[dow - 2] : 'V úterý: ' + DAILY[0];
    }
  }
  // ---------- reservation ----------
  function initBooking() {
    var form = $('[data-book]');
    if (!form) return;
    var dateIn = $('[data-date]'), dateHint = $('[data-date-hint]'), chipsBox = $('[data-day-chips]');
    var slotsBox = $('[data-slots]'), slotHint = $('[data-slot-hint]');
    var peopleIn = $('[data-people]'), unitEl = $('[data-people-unit]'), peopleHint = $('[data-people-hint]');
    var seatHint = $('[data-seat-hint]'), gardenNote = $('[data-garden-note]'), dog = $('[data-dog]'), occasion = $('[data-occasion]'), ico = $('[data-ico]'), phone = $('[data-phone]'), nameIn = $('[data-name]');
    var summary = $('[data-summary]'), errEl = $('[data-error]'), done = $('[data-done]');
    var seats = $$('input[name="seat"]', form);
    var seat = function (v) { return seats.filter(function (s) { return s.value === v; })[0]; };
    var selected = null, wasGroup = false, icsUrl = null;
    var people = function () {
      var n = parseInt(peopleIn.value, 10);
      return isNaN(n) ? 1 : Math.min(24, Math.max(1, n));
    };
    var checkedSeat = function () { var s = seats.filter(function (x) { return x.checked; })[0]; return s ? s.value : 'uvnitr'; };
    function occupancy(dateIso, time, d) {
      var s = dateIso + ' ' + time, h = 7;
      for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      var occ = h % 10, m = +time.slice(0, 2) * 60 + +time.slice(3), dow = d.getDay();
      if ((dow === 5 || dow === 6) && m >= 1020 && m <= 1200) occ += 4;
      if (dow === 0 && m >= 690 && m <= 780) occ += 2;
      return occ;
    }
    // [{time, state: 'ok'|'few'|'full'}] for one calendar day (today skips past slots)
    function slotsFor(dateIso, n) {
      var d = parseIso(dateIso), h = d && hoursOf(d), out = [];
      if (!h) return out;
      var now = new Date(), from = h[0] * 60;
      var isToday = dateIso === iso(now), minStart = now.getHours() * 60 + now.getMinutes() + 30;
      for (var m = from; m <= h[1] * 60 - 90; m += 30) {
        if (isToday && m < minStart) continue;
        var time = hhmm(m), occ = occupancy(dateIso, time, d);
        var state = occ >= (n >= 6 ? 6 : 9) ? 'full' : (occ >= 7 ? 'few' : 'ok');
        out.push({ time: time, state: state });
      }
      return out;
    }
    var bookable = function (dateIso, n) {
      return slotsFor(dateIso, n).some(function (s) { return s.state !== 'full'; });
    };
    // first date from `start` (a Date) onwards that is open and has a free slot, '' if none within the window
    function nextBookable(start, n) {
      var t0 = today0();
      for (var i = 0; i < 61; i++) {
        var d = addDays(start, i), diff = Math.round((d - t0) / 864e5);
        if (diff > 60) break;
        if (diff >= 0 && bookable(iso(d), n)) return iso(d);
      }
      return '';
    }
    function setHint(el, text, warn, label, fn) {
      el.textContent = text;
      el.classList.toggle('hint-warn', !!warn);
      if (label && text) el.appendChild(document.createTextNode(' '));
      if (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', fn);
        el.appendChild(b);
      }
    }
    function setDate(v) { dateIn.value = v; update(); }
    function keepFocus(box, attr, build) {
      var a = document.activeElement, keep = a && box.contains(a) ? a.getAttribute(attr) : null;
      build();
      if (keep) {
        var again = $('[' + attr + '="' + keep + '"]', box);
        if (again && !again.disabled) again.focus();
      }
    }
    function renderChips(dateIso, n) {
      var list = [], t0 = today0();
      for (var i = 0; i <= 60 && list.length < 5; i++) {
        var d = addDays(t0, i), key = iso(d);
        if (hoursOf(d) && bookable(key, n)) list.push({ d: d, key: key, i: i });
      }
      keepFocus(chipsBox, 'data-iso', function () {
        chipsBox.textContent = '';
        list.forEach(function (it) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip';
          b.setAttribute('data-iso', it.key);
          b.setAttribute('aria-pressed', it.key === dateIso ? 'true' : 'false');
          b.textContent = it.i === 0 ? 'Dnes' : it.i === 1 ? 'Zítra'
            : DAY_SHORT[it.d.getDay()] + ' ' + it.d.getDate() + '. ' + (it.d.getMonth() + 1) + '.';
          chipsBox.appendChild(b);
        });
      });
    }
    function renderSlots(dateIso, d, n) {
      var h = d && hoursOf(d), list = h ? slotsFor(dateIso, n) : [];
      if (selected && !list.some(function (s) { return s.time === selected && s.state !== 'full'; })) selected = null;
      var firstOk = list.filter(function (s) { return s.state !== 'full'; })[0];
      keepFocus(slotsBox, 'data-time', function () {
        slotsBox.textContent = '';
        list.forEach(function (s) {
          var b = document.createElement('button'), small = document.createElement('small');
          b.type = 'button';
          b.className = 'slot' + (s.state === 'few' ? ' is-few' : '');
          b.setAttribute('role', 'radio');
          b.setAttribute('data-time', s.time);
          b.setAttribute('aria-checked', s.time === selected ? 'true' : 'false');
          b.tabIndex = (selected ? s.time === selected : firstOk && s.time === firstOk.time) ? 0 : -1;
          b.disabled = s.state === 'full';
          b.appendChild(document.createTextNode(s.time));
          small.textContent = s.state === 'full' ? 'plno' : s.state === 'few' ? 'poslední stoly' : '';
          b.appendChild(small);
          slotsBox.appendChild(b);
        });
      });
      if (h && !firstOk) {
        var isToday = dateIso === iso(new Date());
        setHint(slotHint, isToday ? 'Dnes už další stůl nestihneme. Co zítra?' : 'Na tento den už nemáme volný stůl. Co jiný den?',
          true, 'Najít nejbližší volný den', function () {
            var next = nextBookable(addDays(d, 1), people());
            if (next) setDate(next);
          });
      } else if (h && n >= 6) {
        setHint(slotHint, 'Pro 6 a více osob ukazujeme jen časy s volným velkým stolem.', false);
      } else {
        setHint(slotHint, '', false);
      }
    }
    function renderSeats(d, n) {
      var month = (d || new Date()).getMonth() + 1, inSeason = month >= 5 && month <= 9;
      seat('zahradka').disabled = !inSeason;
      seat('vycep').disabled = n > 4;
      if (gardenNote) gardenNote.textContent = inSeason ? 'pod lípou' : 'otevřeno květen–září';
      var cur = seats.filter(function (s) { return s.checked; })[0];
      if (!cur || cur.disabled || (cur.value === 'salonek' && n < 9)) seat('uvnitr').checked = true;
      var where = checkedSeat();
      if (dog.checked && (where === 'uvnitr' || where === 'salonek')) {
        var target = !seat('zahradka').disabled ? 'zahradka' : (!seat('vycep').disabled ? 'vycep' : null);
        setHint(seatHint, 'Pejsci jsou vítáni u výčepu a na zahrádce.', true,
          target === 'zahradka' ? 'Přesadit na zahrádku' : target ? 'Přesadit k výčepu' : '', function () {
            seat(target).checked = true;
            update();
          });
      } else {
        setHint(seatHint, '', false);
      }
    }
    function renderAllergy() {
      var el = $('[data-allergy-hint]');
      var vals = $$('[data-allergy]').filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
      if (!vals.length) { el.textContent = ''; return; }
      var col = $$('.menu-col')[1], list = col && $('.dishes', col);
      var safe = list ? $$('li', list).filter(function (li) {
        var has = (li.getAttribute('data-allergens') || '').split(',').map(function (s) { return s.trim(); });
        return !vals.some(function (v) { return has.indexOf(v) !== -1; });
      }).map(function (li) { return $('.d-name', li).textContent; }) : [];
      el.textContent = safe.length
        ? 'Kuchyni dáme vědět. Bez obav si můžete dát: ' + safe.join(', ')
        : 'Kuchyni dáme vědět a uvaří vám něco na míru.';
    }
    // returns {head, rest[]} or null until both date and time are chosen
    function summaryParts() {
      var d = parseIso(dateIn.value);
      if (!d || !selected || !hoursOf(d)) return null;
      var n = people(), unit = n === 1 ? 'osoba' : n < 5 ? 'osoby' : 'osob';
      var day = cap(new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' }).format(d));
      var rest = [n + ' ' + unit, SEAT_LABEL[checkedSeat()]];
      if (dog.checked) rest.push('se psem');
      if (occasion.value) rest.push(occasion.options[occasion.selectedIndex].text.toLowerCase());
      return { head: day + ' v ' + selected, rest: rest };
    }
    function update() {
      errEl.textContent = '';
      var n = people();
      if (String(n) !== peopleIn.value && peopleIn.value !== '') peopleIn.value = n;
      unitEl.textContent = n === 1 ? 'osoba' : n < 5 ? 'osoby' : 'osob';
      var group = n >= 9;
      $$('[data-group-only]', form).forEach(function (el) { show(el, group); });
      if (group && !wasGroup) seat('salonek').checked = true;
      wasGroup = group;
      peopleHint.textContent = group ? 'Pro 9 a více osob máme salonek. Ozveme se kvůli menu předem.' : '';
      var dateIso = dateIn.value, d = parseIso(dateIso);
      var h = d && hoursOf(d);
      var t0 = today0(), diff = d ? Math.round((d - t0) / 864e5) : 0;
      renderSeats(d, n);
      if (d && (diff < 0 || diff > 60)) {
        setHint(dateHint, 'Rezervovat můžeme od dneška na 60 dní dopředu.', true);
      } else if (d && !h) {
        setHint(dateHint, 'V pondělí máme zavřeno.', true, 'Vybrat úterý', function () { setDate(iso(addDays(d, 1))); });
      } else if (d) {
        setHint(dateHint, DAY_NOM[d.getDay()] + ': otevřeno ' + hhmm(h[0] * 60) + '–' + hhmm(h[1] * 60), false);
      } else {
        setHint(dateHint, '', false);
      }
      renderChips(dateIso, n);
      renderSlots(dateIso, d && diff >= 0 && diff <= 60 ? d : null, n);
      renderAllergy();
      $$('[data-when]', form).forEach(function (el) { show(el, el.getAttribute('data-when') === occasion.value); });
      var sp = summaryParts();
      summary.innerHTML = sp ? '<strong>' + esc(sp.head) + '</strong> · ' + sp.rest.map(esc).join(' · ') +
        '<small>Stůl vám podržíme 15 minut po domluveném čase.</small>' : '';
    }
    function initDefaults() {
      var t0 = today0();
      dateIn.min = iso(t0);
      dateIn.max = iso(addDays(t0, 60));
      dateIn.value = nextBookable(t0, people()) || iso(t0);
    }
    // ----- events -----
    dateIn.addEventListener('input', update);
    dateIn.addEventListener('change', update);
    chipsBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-iso]') : null;
      if (b) setDate(b.getAttribute('data-iso'));
    });
    slotsBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.slot') : null;
      if (!b || b.disabled) return;
      selected = b.getAttribute('data-time');
      update();
      var again = $('[data-time="' + selected + '"]', slotsBox);
      if (again) again.focus();
    });
    slotsBox.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
      var ok = $$('.slot:not(:disabled)', slotsBox);
      var i = ok.indexOf(document.activeElement);
      if (!ok.length) return;
      e.preventDefault();
      var back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
      var next = ok[i === -1 ? 0 : (i + (back ? -1 : 1) + ok.length) % ok.length];
      selected = next.getAttribute('data-time');
      update();
      var again = $('[data-time="' + selected + '"]', slotsBox);
      if (again) again.focus();
    });
    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        peopleIn.value = Math.min(24, Math.max(1, people() + parseInt(b.getAttribute('data-step'), 10)));
        update();
      });
    });
    $$('[data-salon-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        peopleIn.value = 10; update();
        var salon = seats.filter(function (s) { return s.value === 'salonek'; })[0];
        if (salon) { salon.checked = true; update(); }
      });
    });
    peopleIn.addEventListener('input', update);
    peopleIn.addEventListener('change', function () { peopleIn.value = people(); update(); });
    seats.forEach(function (s) { s.addEventListener('change', update); });
    dog.addEventListener('change', update);
    occasion.addEventListener('change', update);
    $$('[data-allergy]', form).forEach(function (c) { c.addEventListener('change', update); });
    ico.addEventListener('input', function () {
      var v = ico.value.replace(/\D/g, '');
      if (v !== ico.value) ico.value = v;
    });
    function nationalPhone(v) {
      var s = String(v).replace(/[\s\-().\/]/g, '');
      if (s.indexOf('+420') === 0) s = s.slice(4);
      else if (s.indexOf('00420') === 0) s = s.slice(5);
      return /^\d{9}$/.test(s) ? s : null;
    }
    phone.addEventListener('blur', function () {
      var p = nationalPhone(phone.value);
      if (p) phone.value = '+420 ' + p.slice(0, 3) + ' ' + p.slice(3, 6) + ' ' + p.slice(6);
    });
    [phone, nameIn, dateIn].forEach(function (el) {
      el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
    });
    // ----- submit -----
    function ics(d, time, n) {
      var h = +time.slice(0, 2), m = +time.slice(3);
      var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
      var end = new Date(start.getTime() + 2 * 3600e3);
      var fmt = function (x) {
        return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()) + 'T' + pad(x.getHours()) + pad(x.getMinutes()) + '00';
      };
      var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      var uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + '@hugopos.eu';
      return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bistro U Huga//Rezervace//CS', 'CALSCALE:GREGORIAN',
        'BEGIN:VTIMEZONE', 'TZID:Europe/Prague',        'BEGIN:STANDARD', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
        'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'END:STANDARD',
        'BEGIN:DAYLIGHT', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
        'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'END:DAYLIGHT',
        'END:VTIMEZONE',
        'BEGIN:VEVENT', 'UID:' + uid, 'DTSTAMP:' + stamp,
        'DTSTART;TZID=Europe/Prague:' + fmt(start), 'DTEND;TZID=Europe/Prague:' + fmt(end),
        'SUMMARY:Bistro U Huga – stůl pro ' + n,
        'LOCATION:' + LOCATION.replace(/,/g, '\\,'),
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n') + '\r\n';
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      [dateIn, nameIn, phone].forEach(function (el) { el.removeAttribute('aria-invalid'); });
      var d = parseIso(dateIn.value), diff = d ? Math.round((d - today0()) / 864e5) : -1;
      var err = '', target = null;
      if (!d || !hoursOf(d) || diff < 0 || diff > 60) {
        err = 'Vyberte prosím den, kdy máme otevřeno.'; target = dateIn;
      } else if (!selected) {
        err = 'Vyberte prosím čas příchodu.';
        target = $('.slot:not(:disabled)', slotsBox) || dateIn;
      } else if (nameIn.value.trim().length < 2) {
        err = 'Napište prosím jméno, na které stůl připravíme.'; target = nameIn;
      } else if (!nationalPhone(phone.value)) {
        err = 'Zkontrolujte prosím telefon, potřebujeme 9 číslic.'; target = phone;
      }
      errEl.textContent = err;
      if (err) {
        if (target.tagName === 'INPUT') target.setAttribute('aria-invalid', 'true');
        target.focus();
        return;
      }
      var sp = summaryParts(), next = ['Stůl vám podržíme 15 minut.'];
      if (form.elements.reminder.checked) next.push('Den předem vám pošleme SMS. Kdyby se něco změnilo, stačí odpovědět ZRUŠIT.');
      next.push('Parkovat můžete zdarma za bistrem, 14 míst.');
      $('[data-done-next]').innerHTML = next.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      $('[data-done-sum]').textContent = sp.head + ' · ' + sp.rest.join(' · ') + '. Rezervace na jméno ' + nameIn.value.trim() + '.';
      if (icsUrl) URL.revokeObjectURL(icsUrl);
      icsUrl = URL.createObjectURL(new Blob([ics(d, selected, people())], { type: 'text/calendar;charset=utf-8' }));
      $('[data-ics]').setAttribute('href', icsUrl);
      show(form, false);
      show(done, true);
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      done.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    });
    $('[data-again]').addEventListener('click', function () {
      if (icsUrl) { URL.revokeObjectURL(icsUrl); icsUrl = null; }
      $('[data-ics]').setAttribute('href', '#');
      form.reset();
      selected = null;
      wasGroup = false;
      errEl.textContent = '';
      [dateIn, nameIn, phone].forEach(function (el) { el.removeAttribute('aria-invalid'); });
      initDefaults();
      update();
      show(done, false);
      show(form, true);
      form.scrollIntoView({ block: 'start' });
    });
    initDefaults();
    update();
    return update;
  }
  // ---------- boot ----------
  function boot() {
    var updateBooking;
    renderStatus();
    renderToday();
    updateBooking = initBooking();
    setInterval(function () {
      renderStatus();
      renderToday();
      var f = $('[data-book]');
      if (updateBooking && f && !f.hidden) updateBooking();
    }, 60000);
  }
  boot();
})();
