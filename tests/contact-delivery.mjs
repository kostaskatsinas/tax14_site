import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactPayload, CONTACT_DELIVERY, sendContactEnquiry } from '../js/contact-delivery.mjs';

const sourceUrl = 'http://127.0.0.1:8000/index.html?private=value#contact';
const business = {
  client_segment: 'Επιχείρηση (B2B)', b2b_company_name: 'Δοκιμαστική επιχείρηση',
  b2b_service_topic: 'Στρατηγικός Φορολογικός Σχεδιασμός',
  preferred_mode: 'Τηλεφωνική Επικοινωνία', contact_phone: '+30 690 000 0000',
  gdpr_consent: 'on', captcha_token: 'test-token-not-a-real-challenge',
};
const individual = {
  client_segment: 'Ιδιώτης (B2C)', b2c_full_name: 'Δοκιμαστικός επισκέπτης',
  b2c_topic: 'Φορολογική Δήλωση Εισοδήματος (Ε1 / Ε2)',
  preferred_mode: 'Απάντηση μέσω Email', contact_email: 'test@example.com',
  gdpr_consent: 'on', captcha_token: 'test-token-not-a-real-challenge',
};

test('business phone enquiry sends only selected segment and channel', () => {
  const payload = buildContactPayload({ ...business, contact_email: 'unused@example.com', b2c_profile: 'unused', b2b_activity: 'Δοκιμή' }, sourceUrl);
  assert.equal(payload.contact_phone, business.contact_phone);
  assert.equal(payload.b2b_activity, 'Δοκιμή');
  assert.equal(payload.b2c_profile, undefined);
  assert.equal(payload.contact_email, undefined);
});

test('both audiences can choose either contact channel', () => {
  const email = buildContactPayload({ ...individual, contact_phone: 'unused', b2b_activity: 'unused' }, sourceUrl);
  assert.equal(email.contact_email, individual.contact_email);
  assert.equal(email.contact_phone, undefined);
  assert.equal(email.b2b_activity, undefined);
  assert.equal(buildContactPayload({ ...business, preferred_mode: 'Απάντηση μέσω Email', contact_email: 'test@example.com' }, sourceUrl).contact_email, 'test@example.com');
  assert.equal(buildContactPayload({ ...individual, preferred_mode: 'Τηλεφωνική Επικοινωνία', contact_phone: '2100000000' }, sourceUrl).contact_phone, '2100000000');
});

test('form fields cannot set credentials, recipients, sender or provider controls', () => {
  const payload = buildContactPayload({ ...individual, _cc: 'other@example.com', recipient: 'other@example.com', sender_email: 'other@example.com', brevo_api_key: 'unsafe', _captcha: 'false' }, sourceUrl);
  for (const key of ['_cc', 'recipient', 'sender_email', 'brevo_api_key', '_captcha', '_url']) assert.equal(payload[key], undefined);
  assert.equal(CONTACT_DELIVERY.endpoint, '/api/contact.php');
  assert.equal(Object.isFrozen(CONTACT_DELIVERY), true);
  assert.equal(payload.captcha_token, individual.captcha_token);
});

test('invalid requests and missing CAPTCHA never contact the server', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw new Error('Unexpected request'); };
  for (const fields of [
    { ...individual, gdpr_consent: '' }, { ...individual, b2c_full_name: '' },
    { ...individual, b2c_topic: '' }, { ...individual, contact_email: 'bad@' },
    { ...individual, contact_email: 'test@example.com\r\nBcc:other@example.com' },
    { ...individual, contact_email: ['bad'] }, { ...individual, website_url: 'bot' },
    { ...business, contact_phone: '123' }, { ...business, contact_phone: '1234567890123456' },
    { ...business, contact_phone: '6900000000abc' }, { ...business, preferred_mode: 'unknown' },
    { ...business, client_segment: 'unknown' }, { ...individual, captcha_token: '' },
    { ...individual, captcha_token: 'x'.repeat(2049) },
  ]) await assert.rejects(sendContactEnquiry(fields, { sourceUrl, fetchImpl }));
  assert.equal(calls, 0);
});

test('server acceptance is distinct from inbox delivery', async () => {
  const controller = new AbortController();
  const result = await sendContactEnquiry(individual, {
    sourceUrl, signal: controller.signal,
    fetchImpl: async (url, options) => {
      assert.equal(url, '/api/contact.php');
      assert.equal(options.credentials, 'same-origin');
      assert.equal(options.signal, controller.signal);
      assert.equal(JSON.parse(options.body).captcha_token, individual.captcha_token);
      return new Response('{"success":true}', { status: 202, headers: { 'Content-Type': 'application/json' } });
    },
  });
  assert.deepEqual(result, { accepted: true });
});

test('server and network errors never become success', async () => {
  for (const response of [
    new Response('unavailable', { status: 503 }), new Response('<html>error</html>'),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    ...[false, 'true', undefined].map(success => new Response(JSON.stringify({ success }), { headers: { 'Content-Type': 'application/json' } })),
  ]) await assert.rejects(sendContactEnquiry(individual, { sourceUrl, fetchImpl: async () => response }));
  await assert.rejects(sendContactEnquiry(individual, { sourceUrl, fetchImpl: async () => { throw new TypeError('Network failure'); } }));
  await assert.rejects(sendContactEnquiry(individual, {
    sourceUrl, fetchImpl: async () => new Response('{"success":false,"message":"Επαναλάβετε τον έλεγχο."}', { status: 400, headers: { 'Content-Type': 'application/json' } }),
  }), error => error.userMessage === 'Επαναλάβετε τον έλεγχο.');
});
