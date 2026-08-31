(function () {
  'use strict';
  var en = {
    back: 'Back to shop', badge: 'Working draft — not effective', title: 'Hardware purchase terms',
    lead: 'This document will govern only purchases of terminals and accessories in the Hugo shop. It is separate from the terms for creating and using an account.',
    notice: '<strong>Public checkout is disabled until the final text is approved.</strong> The displayed content is a technical placeholder and cannot form a valid purchase agreement.',
    headings: ['1. Seller and contact', '2. Order and formation of contract', '3. Price, payment and tax document', '4. Delivery and acceptance', '5. Withdrawal, defects and complaints', '6. Personal data'],
    paragraphs: ['Legal team to add: full seller identity, registered office, company ID, contact details and supervisory authority.', 'Legal team to add: when the contract is formed, order confirmation, product availability and correcting errors before submission.', 'Legal team to add: prices, VAT, Stripe payment, due date and issuance of the tax document.', 'Legal team to add: carrier, delivery price and timing, acceptance and inspection of the parcel.', 'Legal team to add according to customer and product type: defect rights, complaint process, warranty and any right of withdrawal.', 'Legal team to add: purposes and retention periods for order data, Stripe and subsequent account creation.'],
    footer: 'Draft version: draft-2026-08-31 · shop terms are maintained separately from onboarding terms.'
  };
  var original = {};
  function nodes(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function snapshot() {
    original.back = document.querySelector('.back').textContent;
    original.badge = document.querySelector('.draft').textContent;
    original.title = document.querySelector('h1').textContent;
    original.lead = document.querySelector('.lead').textContent;
    original.notice = document.querySelector('.notice').innerHTML;
    original.headings = nodes('main h2').map(function (node) { return node.textContent; });
    original.paragraphs = nodes('main > h2 + p').map(function (node) { return node.textContent; });
    original.footer = document.querySelector('footer').textContent;
  }
  function set(selector, value, html) {
    nodes(selector).forEach(function (node, index) {
      var text = Array.isArray(value) ? value[index] : value;
      if (html) node.innerHTML = text; else node.textContent = text;
    });
  }
  function apply(language) {
    var copy = language === 'en' ? en : original;
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'Shop terms — Hugo' : 'Obchodní podmínky e-shopu — Hugo';
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', language === 'en' ? 'Terms for hardware purchases in the Hugo shop.' : 'Obchodní podmínky nákupu hardwaru v e-shopu Hugo.');
    set('.back', copy.back); set('.draft', copy.badge); set('h1', copy.title); set('.lead', copy.lead);
    set('.notice', copy.notice, true); set('main h2', copy.headings); set('main > h2 + p', copy.paragraphs); set('footer', copy.footer);
    nodes('[data-legal-lang]').forEach(function (button) { button.classList.toggle('is-active', button.dataset.legalLang === language); });
    try { localStorage.setItem('hugo-lang', language); } catch (_error) {}
  }
  document.addEventListener('DOMContentLoaded', function () {
    snapshot();
    nodes('[data-legal-lang]').forEach(function (button) { button.addEventListener('click', function () { apply(button.dataset.legalLang); }); });
    var language = 'cs';
    try { language = localStorage.getItem('hugo-lang') === 'en' ? 'en' : 'cs'; } catch (_error) {}
    apply(language);
  });
}());
