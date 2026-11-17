(function () {
  'use strict';
  // HUGO-2459 — /konzultace/: pick topics, pay by card on Stripe. The page
  // sends ids and the consultation details only; the server prices the order and Stripe asks
  // for the buyer's name, e-mail, phone and invoicing data. Pure rules: konzultace-rules.js.
  var R = window.HugoConsultationRules;
  var shop = window.HugoEshopRules;
  var $ = function (id) { return document.getElementById(id); };
  var picked = [];
  var catalogue = { available: false, amountMinor: null, currency: 'czk', checkoutEnabled: false };
  var legal = { version: '2026-09-15', status: 'published', url: '/obchodni-podminky-eshop/' };
  var busy = false;

  var payButton = $('pay-button');
  var formError = $('form-error');
  var params = new URLSearchParams(location.search);

  var apiBase = shop.apiBaseFor(location.hostname);
  var adminBase = shop.adminBaseFor(location.hostname);

  function input() {
    return {
      topics: picked,
      otherText: $('other-text').value, helpText: $('help').value,
      termsAccepted: $('terms').checked, privacyAccepted: $('privacy').checked
    };
  }
  function priced() { return catalogue.available && Number.isInteger(catalogue.amountMinor); }
  function money() { return shop.formatMoney(catalogue.amountMinor, catalogue.currency, 'cs'); }

  function showError(node, text) { node.textContent = text; node.hidden = !text; }

  function render() {
    var topicsList = R.TOPICS.filter(function (topic) { return picked.indexOf(topic.id) !== -1; });
    document.querySelectorAll('.topic').forEach(function (button) {
      button.setAttribute('aria-pressed', picked.indexOf(button.dataset.topic) !== -1 ? 'true' : 'false');
    });
    $('other-box').hidden = picked.indexOf('other') === -1;
    $('sum-count-label').textContent = 'Vybraná témata (' + topicsList.length + ')';
    $('sum-topics').textContent = topicsList.length ? topicsList.map(function (topic) { return topic.title; }).join(', ') : 'Zatím nic nevybráno';
    var used = R.combineNote(picked, $('other-text').value, $('help').value).length;
    var counter = $('counter');
    counter.textContent = used + ' / ' + R.NOTE_MAX;
    counter.classList.toggle('over', used > R.NOTE_MAX);
    document.querySelectorAll('[data-price]').forEach(function (node) {
      node.textContent = priced() ? money() : 'Cena je právě nedostupná';
    });
    payButton.textContent = priced() ? 'Zaplatit kartou ' + money() + ' + DPH' : 'Zaplatit kartou';
    $('terms-link').href = legal.url;
    payButton.disabled = busy || !priced() || catalogue.checkoutEnabled !== true || legal.status !== 'published';
  }

  var MESSAGES = {
    topics: 'Vyber prosím alespoň jedno téma.',
    note: 'Poznámky jsou dohromady delší než ' + R.NOTE_MAX + ' znaků. Zkrať je prosím.',
    consent: 'Pro objednávku potvrď oba souhlasy.'
  };
  var API_ERRORS = {
    consultation_topics_required: 'Vyber prosím alespoň jedno téma.',
    invalid_consultation: 'Poznámku se nepodařilo přijmout. Zkontroluj je prosím a zkus to znovu.',
    consultation_only: 'Tuhle objednávku se nepodařilo odeslat. Obnov prosím stránku a zkus to znovu.',
    consultation_topic_unavailable: 'Tohle téma je k dispozici až s účtem v Hugovi a zapnutými platbami kartou. Vyber jiné nebo se zaregistruj.',
    price_unavailable: 'Cena konzultace je právě nedostupná. Zkus to prosím za chvíli.'
  };

  function submit(event) {
    event.preventDefault();
    if (busy) return;
    var problem = R.validate(input());
    showError($('topics-error'), problem === 'topics' ? MESSAGES.topics : '');
    showError(formError, problem && problem !== 'topics' ? MESSAGES[problem] : '');
    if (problem) {
      if (problem === 'topics') $('topics-error').scrollIntoView({ block: 'center' });
      return;
    }
    busy = true;
    payButton.textContent = 'Otevírám bezpečnou platbu…';
    render();
    var body = R.checkoutBody(input(), legal, 'cs');
    fetch(apiBase + '/v1/public/eshop/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify(body)
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok || typeof data.url !== 'string') {
          var error = new Error(API_ERRORS[data && data.error && data.error.code] || 'Platbu se nepodařilo otevřít. Zkus to prosím znovu.');
          throw error;
        }
        return data;
      });
    }).then(function (data) { location.assign(data.url); })
      .catch(function (error) {
        busy = false;
        showError(formError, error.message);
        render();
      });
  }

  // A visitor with a Hugo account continues in the Admin shop with the same choices.
  function continueInHugo(event) {
    event.preventDefault();
    // No topic picked here is fine: the Admin offers exactly the topics the account unlocks.
    location.assign(picked.length ? R.adminHandoffUrl(adminBase, input()) : adminBase + '/shop');
  }

  function loadCatalogue() {
    fetch(apiBase + '/v1/public/eshop/catalogue')
      .then(function (response) { if (!response.ok) throw new Error('catalogue'); return response.json(); })
      .then(function (data) {
        var item = (data.products || []).filter(function (entry) { return entry && entry.id === R.PRODUCT_ID; })[0];
        catalogue = {
          available: Boolean(item) && item.available === true,
          amountMinor: item ? item.amountMinor : null,
          currency: item ? item.currency : 'czk',
          checkoutEnabled: data.checkoutEnabled === true
        };
        if (data.legal && typeof data.legal.version === 'string') legal = { version: data.legal.version, status: data.legal.status, url: data.legal.url || legal.url };
        render();
      }).catch(render);
  }

  // Stripe's return: success → the thank-you once the server says the order is settled.
  function showReturn() {
    if (params.get('checkout') === 'cancelled') $('cancelled').hidden = false;
    var session = params.get('session_id');
    if (!session) return;
    fetch(apiBase + '/v1/public/eshop/sessions/' + encodeURIComponent(session))
      .then(function (response) { if (!response.ok) throw new Error('status'); return response.json(); })
      .then(function (data) {
        if (data.settled !== true) return;
        $('order-flow').hidden = true;
        var done = $('done');
        done.hidden = false;
        if (params.get('termin') === '1') {
          $('done-call').hidden = true;
          $('done-booked').hidden = false;
        }
        if (params.get('account') === 'linked') {
          var back = document.createElement('a');
          back.className = 'btn btn-primary';
          back.href = adminBase + '/';
          back.textContent = 'Zpátky do Huga';
          done.insertBefore(back, done.querySelector('.btn-ghost'));
        }
      }).catch(function () {});
  }

  document.querySelectorAll('.topic').forEach(function (button) {
    button.addEventListener('click', function () {
      var id = button.dataset.topic;
      picked = picked.indexOf(id) === -1 ? picked.concat(id) : picked.filter(function (item) { return item !== id; });
      showError($('topics-error'), '');
      render();
    });
  });
  ['other-text', 'help'].forEach(function (id) { $(id).addEventListener('input', render); });
  $('order-form').addEventListener('submit', submit);
  document.querySelectorAll('[data-account-link]').forEach(function (link) { link.addEventListener('click', continueInHugo); });
  render();
  loadCatalogue();
  showReturn();
}());
