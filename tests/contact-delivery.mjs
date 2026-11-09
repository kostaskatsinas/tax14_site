import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactPayload, CONTACT_DELIVERY, sendContactEnquiry } from '../js/contact-delivery.mjs';

const sourceUrl = 'http://127.0.0.1:8000/index.html?private=value#contact';
const business = {
  client_segment: 'Επιχείρηση (B2B)', b2b_company_name: 'Δοκιμαστική επιχείρηση',
  b2b_service_topic: 'Στρατηγικός Φορολογικός Σχεδιασμός',
  preferred_mode: 'Τηλεφωνική Επικοινωνία', contact_phone: '+30 690 000 0000', gdpr_consent: 'on',
};
const individual = {
  client_segment: 'Ιδιώτης (B2C)', b2c_full_name: 'Δοκιμαστικός επισκέπτης',
  b2c_topic: 'Φορολογική Δήλωση Εισοδήματος (Ε1 / Ε2)',
  preferred_mode: 'Απάντηση μέσω Email', contact_email: 'test@example.com', gdpr_consent: 'on',
};

test('business phone enquiry sends only the selected segment and channel', () => {
  const payload = buildContactPayload({ ...business, contact_email: 'unused@example.com', b2c_profile: 'unused', b2b_activity: 'Δοκιμή' }, sourceUrl);
  assert.equal(payload['Τηλέφωνο'], business.contact_phone);
  assert.equal(payload['Δραστηριότητα'], 'Δοκιμή');
  assert.equal(payload['Προφίλ φορολογούμενου'], undefined);
  assert.equal(payload.email, undefined);
  assert.equal(payload._replyto, undefined);
});

test('individual email enquiry sets Reply-To and omits phone and business details', () => {
  const payload = buildContactPayload({ ...individual, contact_phone: 'unused', b2b_activity: 'unused', contact_message: 'Δοκιμαστικό μήνυμα' }, sourceUrl);
  assert.equal(payload.email, individual.contact_email);
  assert.equal(payload._replyto, individual.contact_email);
  assert.equal(payload['Μήνυμα'], 'Δοκιμαστικό μήνυμα');
  assert.equal(payload['Τηλέφωνο'], undefined);
  assert.equal(payload['Δραστηριότητα'], undefined);
  const businessEmail = buildContactPayload({ ...business, preferred_mode: 'Απάντηση μέσω Email', contact_email: 'test@example.com', contact_phone: '' }, sourceUrl);
  assert.equal(businessEmail._replyto, 'test@example.com');
  assert.equal(businessEmail['Τηλέφωνο'], undefined);
  const individualPhone = buildContactPayload({ ...individual, preferred_mode: 'Τηλεφωνική Επικοινωνία', contact_phone: '2100000000', contact_email: '' }, sourceUrl);
  assert.equal(individualPhone['Τηλέφωνο'], '2100000000');
  assert.equal(individualPhone.email, undefined);
});

test('input cannot redirect delivery, add copies or trigger autoresponses', () => {
  const payload = buildContactPayload({ ...individual, _cc: 'other@example.com', _webhook: 'https://example.com', _autoresponse: 'unsafe', _subject: 'override', recipient: 'other@example.com' }, sourceUrl);
  for (const key of ['_cc', '_webhook', '_autoresponse', 'recipient']) assert.equal(payload[key], undefined);
  assert.match(payload._subject, /^\[ΔΟΚΙΜΗ\] TAX14/);
  assert.equal(CONTACT_DELIVERY.endpoint, 'https://formsubmit.co/ajax/katsinas1986@gmail.com');
  assert.equal(CONTACT_DELIVERY.mode, 'test');
  assert.equal(Object.isFrozen(CONTACT_DELIVERY), true);
});

test('source URL excludes queries and fragments; email subject has no newlines', () => {
  const payload = buildContactPayload({ ...individual, b2c_full_name: 'Test\r\nname' }, sourceUrl);
  assert.equal(payload._url, 'http://127.0.0.1:8000/index.html');
  assert.doesNotMatch(payload._subject, /[\r\n]/);
});

test('invalid requests fail before the provider is contacted', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw new Error('Unexpected request'); };
  for (const payload of [
    { ...individual, gdpr_consent: '' }, { ...individual, b2c_full_name: '' },
    { ...individual, b2c_topic: '' }, { ...individual, contact_email: 'bad@' },
    { ...individual, contact_email: 'test@example.com\r\nBcc:other@example.com' },
    { ...individual, contact_email: ['bad'] }, { ...individual, website_url: 'bot' },
    { ...business, contact_phone: '123' }, { ...business, contact_phone: '1234567890123456' },
    { ...business, contact_phone: '6900000000abc' }, { ...business, preferred_mode: 'unknown' },
    { ...business, client_segment: 'unknown' },
  ]) await assert.rejects(sendContactEnquiry(payload, { sourceUrl, fetchImpl }));
  assert.equal(calls, 0);
});

test('both documented success formats are acknowledgements, never inbox receipts', async () => {
  const controller = new AbortController();
  for (const success of [true, 'true']) {
    const result = await sendContactEnquiry(individual, {
      sourceUrl, signal: controller.signal,
      fetchImpl: async (url, options) => {
        assert.equal(url, CONTACT_DELIVERY.endpoint);
        assert.equal(options.credentials, 'omit');
        assert.equal(options.signal, controller.signal);
        assert.equal(JSON.parse(options.body).email, individual.contact_email);
        return new Response(JSON.stringify({ success }), { headers: { 'Content-Type': 'application/json' } });
      },
    });
    assert.deepEqual(result, { accepted: true });
  }
});

test('provider errors, HTML, invalid JSON and network failures never show success', async () => {
  for (const response of [
    new Response('unavailable', { status: 503 }),
    new Response('<html>error</html>', { headers: { 'Content-Type': 'text/html' } }),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    ...[false, 'false', undefined, 1].map(success => new Response(JSON.stringify({ success }), { headers: { 'Content-Type': 'application/json' } })),
  ]) await assert.rejects(sendContactEnquiry(individual, { sourceUrl, fetchImpl: async () => response }));
  await assert.rejects(sendContactEnquiry(individual, { sourceUrl, fetchImpl: async () => { throw new TypeError('Network failure'); } }));
});

test('accepts the provider\'s actual JSON response even when labelled text/html', async () => {
  const result = await sendContactEnquiry(individual, {
    sourceUrl,
    fetchImpl: async () => new Response('{"success":"true","message":"The form was submitted successfully."}', {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    }),
  });
  assert.deepEqual(result, { accepted: true });
});
