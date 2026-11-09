// Customer delivery stays disabled until the owner confirms the test and
// supplies the final recipient. Form input never controls the destination.
export const CONTACT_DELIVERY = Object.freeze({
  endpoint: 'https://formsubmit.co/ajax/katsinas1986@gmail.com',
  mode: 'test',
});

export function buildContactPayload(fields, sourceUrl) {
  const value = key => typeof fields[key] === 'string' ? fields[key].trim() : '';
  if (value('website_url')) throw new Error('Honeypot filled');
  const business = value('client_segment') === 'Επιχείρηση (B2B)';
  if (!business && value('client_segment') !== 'Ιδιώτης (B2C)') throw new Error('Invalid segment');
  const name = value(business ? 'b2b_company_name' : 'b2c_full_name');
  const topic = value(business ? 'b2b_service_topic' : 'b2c_topic');
  const mode = value('preferred_mode');
  if (!name || !topic || value('gdpr_consent') !== 'on') throw new Error('Incomplete enquiry');
  const emailSelected = mode === 'Απάντηση μέσω Email';
  if (!emailSelected && mode !== 'Τηλεφωνική Επικοινωνία') throw new Error('Invalid contact method');
  const email = value('contact_email');
  const phone = value('contact_phone');
  if (emailSelected ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    : !/^\+?[0-9\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 10 || phone.replace(/\D/g, '').length > 15) {
    throw new Error('Invalid contact details');
  }

  // Allowlist fields. Never forward arbitrary _cc, _webhook or _autoresponse.
  const payload = {
    _subject: `[ΔΟΚΙΜΗ] TAX14 — Νέο αίτημα: ${name.replace(/[\r\n]/g, ' ')}`,
    _template: 'table',
    'Λειτουργία': 'Δοκιμή — δεν είναι αίτημα πελάτη',
    'Κατηγορία': value('client_segment'),
    'Όνομα / Επωνυμία': name,
    'Υπηρεσία ενδιαφέροντος': topic,
    'Τρόπος επικοινωνίας': mode,
    'Συγκατάθεση επικοινωνίας': 'Ναι',
  };
  if (emailSelected) {
    payload.email = email;
    payload._replyto = email;
  } else {
    payload['Τηλέφωνο'] = phone;
  }
  const optional = business
    ? { b2b_legal_form: 'Νομική μορφή', b2b_activity: 'Δραστηριότητα', b2b_staff_count: 'Αριθμός εργαζομένων' }
    : { b2c_profile: 'Προφίλ φορολογούμενου' };
  optional.contact_message = 'Μήνυμα';
  for (const [key, label] of Object.entries(optional)) {
    if (value(key)) payload[label] = value(key);
  }
  const source = new URL(sourceUrl);
  if (!['http:', 'https:'].includes(source.protocol)) throw new Error('Use a web server');
  // Query strings and fragments can contain personal data.
  payload._url = source.origin + source.pathname;
  return payload;
}

export async function sendContactEnquiry(fields, { sourceUrl, signal, fetchImpl = fetch }) {
  if (CONTACT_DELIVERY.mode !== 'test') throw new Error('Customer delivery is not enabled');
  const response = await fetchImpl(CONTACT_DELIVERY.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'omit',
    body: JSON.stringify(buildContactPayload(fields, sourceUrl)),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Delivery request failed (HTTP ${response.status})`);
  }
  // FormSubmit can return JSON labelled text/html. Parse it as data; an HTML
  // error page still fails JSON parsing and can never be treated as success.
  const result = await response.json();
  if (result?.success !== true && result?.success !== 'true') throw new Error('Provider rejected enquiry');
  // Acceptance is not proof of inbox delivery. First use needs email activation.
  return { accepted: true };
}
