(function (root) {
  'use strict';
  // HUGO-2459 — the pure rules of /konzultace/: the closed topic list, validation, the exact
  // checkout body and the hand-off link to the signed-in Admin shop. No DOM, so each is
  // testable on its own (Web/tests/konzultace.test.js). Every amount comes from the server
  // catalogue; nothing here knows a price.
  var PRODUCT_ID = 'online_consultation';
  var NOTE_MAX = 450;
  // Owner rule 12 Nov 2026: an anonymous buyer only gets the "before AML / before card
  // payments" topics. The server refuses the others for anyone without card payments
  // (400 consultation_topic_unavailable); they are shown on the page as locked teasers only.
  var TOPICS = [
    { id: 'registration', title: 'Registrace a účet', desc: 'Projdeme spolu registraci, firmu a provozovnu v Hugovi. Bez formulářů do šuplíku.' },
    { id: 'aml_card', title: 'Ověření firmy a platby kartou', desc: 'Ověření identity (AML), kontrolní platba 1 Kč a zapnutí plateb kartou. Provedeme tě každým krokem.' },
    { id: 'other', title: 'Jiné', desc: 'Máš vlastní téma, třeba víc provozoven? Popiš ho a Hugo se podívá.' }
  ];
  // Never selectable here and never sent: unlocked in the Admin by the account itself.
  var LOCKED_TOPIC_IDS = ['setup', 'payments', 'eet', 'operations', 'ai'];
  var TOPIC_IDS = TOPICS.map(function (topic) { return topic.id; });

  // The one note the server gets: the "Jiné" description (only while that topic is picked)
  // and the free text, joined. The 450 characters are the server's limit on the whole.
  function combineNote(topics, otherText, helpText) {
    var parts = [];
    var other = (otherText || '').trim();
    var help = (helpText || '').trim();
    if (topics.indexOf('other') !== -1 && other) parts.push(other);
    if (help) parts.push(help);
    return parts.join('\n');
  }

  // → null when the order may be sent, else the first problem as a stable code.
  function validate(input) {
    var topics = (input.topics || []).filter(function (id) { return TOPIC_IDS.indexOf(id) !== -1; });
    if (!topics.length) return 'topics';
    if (combineNote(topics, input.otherText, input.helpText).length > NOTE_MAX) return 'note';
    if (!input.termsAccepted || !input.privacyAccepted) return 'consent';
    return null;
  }

  // Selected topics in display order, never in click order.
  function orderedTopics(picked) {
    return TOPIC_IDS.filter(function (id) { return picked.indexOf(id) !== -1; });
  }

  function consultationPayload(input) {
    var topics = orderedTopics(input.topics || []);
    var payload = { topics: topics };
    var note = combineNote(topics, input.otherText, input.helpText);
    if (note) payload.note = note;
    return payload;
  }

  // POST /v1/public/eshop/checkout — ids and the consultation only; the server prices it
  // (money SSOT) and Stripe collects the buyer's name, e-mail, phone and invoicing data.
  function checkoutBody(input, legal, locale) {
    return {
      items: [{ id: PRODUCT_ID, qty: 1 }],
      storefront: 'consultation',
      consultation: consultationPayload(input),
      termsAccepted: true,
      termsVersion: legal.version,
      locale: locale || 'cs'
    };
  }

  function toBase64Url(text) {
    var base64;
    if (typeof Buffer !== 'undefined') base64 = Buffer.from(text, 'utf8').toString('base64');
    else base64 = btoa(unescape(encodeURIComponent(text)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // The Admin shop link for a visitor who already has a Hugo account: the chosen topics
  // and note travel as base64url(JSON); the Admin pays from the signed-in account.
  function adminHandoffUrl(adminBase, input) {
    return adminBase + '/shop?consultation=' + toBase64Url(JSON.stringify(consultationPayload(input)));
  }

  var api = {
    LOCKED_TOPIC_IDS: LOCKED_TOPIC_IDS,
    NOTE_MAX: NOTE_MAX,
    PRODUCT_ID: PRODUCT_ID,
    TOPICS: TOPICS,
    TOPIC_IDS: TOPIC_IDS,
    adminHandoffUrl: adminHandoffUrl,
    checkoutBody: checkoutBody,
    combineNote: combineNote,
    consultationPayload: consultationPayload,
    orderedTopics: orderedTopics,
    toBase64Url: toBase64Url,
    validate: validate
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HugoConsultationRules = api;
}(typeof window !== 'undefined' ? window : globalThis));
