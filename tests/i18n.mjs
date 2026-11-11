import test from 'node:test';
import assert from 'node:assert/strict';
import { createTranslator, formatEuro, localizeServerError } from '../js/i18n.mjs';
import { sendContactEnquiry } from '../js/contact-delivery.mjs';

test('calculator uses the correct currency and interpolated copy for both languages', () => {
  assert.equal(formatEuro(45000, 'en'), '€45,000');
  assert.equal(formatEuro(45000, 'el'), '45.000 €');
  const values = { profit: formatEuro(45000, 'en'), difference: formatEuro(1800, 'en') };
  assert.equal(createTranslator('en')('ikeVerdict', values), 'At €45,000 net profit, an IKE saves about €1,800 a year in main tax.');
  assert.match(createTranslator('el')('manyErrors', { count: 3 }), /3 πεδία/);
});

test('English enquiries use the root endpoint and preserve the server field contract', async () => {
  const fields = { client_segment: 'Ιδιώτης (B2C)', b2c_full_name: 'English visitor', b2c_topic: 'Κάτοικος Εξωτερικού', preferred_mode: 'Απάντηση μέσω Email', contact_email: 'visitor@example.com', gdpr_consent: 'on', captcha_token: 'test-only' };
  const options = { sourceUrl: 'https://tax14.gr/en/#contact', language: 'en' };
  const result = await sendContactEnquiry(fields, { ...options, fetchImpl: async (url, request) => {
    assert.equal(url, '/api/contact.php');
    assert.deepEqual(JSON.parse(request.body), fields);
    return new Response('{"success":true}', { status: 202, headers: { 'Content-Type': 'application/json' } });
  } });
  assert.deepEqual(result, { accepted: true });
  await assert.rejects(sendContactEnquiry(fields, { ...options, fetchImpl: async () => new Response(JSON.stringify({ success: false, message: 'Λάβαμε πολλά αιτήματα σε λίγο χρόνο.' }), { status: 429, headers: { 'Content-Type': 'application/json' } }) }), error => {
    assert.match(error.userMessage, /Too many enquiries/);
    assert.doesNotMatch(error.userMessage, /[\u0370-\u03ff]/);
    return true;
  });
});

test('server errors remain useful and never leak Greek copy into the English form', () => {
  const message = 'Ο έλεγχος ασφαλείας έληξε ή δεν ήταν έγκυρος. Επαναλάβετε τον έλεγχο.';
  assert.match(localizeServerError(message, 400, 'en'), /expired or was invalid/);
  assert.equal(localizeServerError(message, 400, 'el'), message);
  for (const status of [400, 405, 413, 429, 500, 502, 503]) {
    const text = localizeServerError('Άγνωστο σφάλμα', status, 'en');
    assert.ok(text.length > 10);
    assert.doesNotMatch(text, /[\u0370-\u03ff]/);
  }
});
