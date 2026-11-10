// Customer delivery stays disabled until the owner confirms the test and
// supplies the final recipient. Form input never controls the destination.
export const CONTACT_DELIVERY = Object.freeze({
  endpoint: 'api/contact.php',
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

  // The server determines sender and recipient. Only send known enquiry fields.
  const payload = {
    client_segment: value('client_segment'),
    [business ? 'b2b_company_name' : 'b2c_full_name']: name,
    [business ? 'b2b_service_topic' : 'b2c_topic']: topic,
    preferred_mode: mode,
    gdpr_consent: 'on',
    captcha_token: value('captcha_token'),
  };
  if (!payload.captcha_token || payload.captcha_token.length > 2048) throw new Error('Complete the security check');
  if (emailSelected) {
    payload.contact_email = email;
  } else {
    payload.contact_phone = phone;
  }
  const optional = business
    ? ['b2b_legal_form', 'b2b_activity', 'b2b_staff_count']
    : ['b2c_profile'];
  for (const key of [...optional, 'contact_message']) {
    if (value(key)) payload[key] = value(key);
  }
  const source = new URL(sourceUrl);
  if (!['http:', 'https:'].includes(source.protocol)) throw new Error('Use a web server');
  return payload;
}

export async function sendContactEnquiry(fields, { sourceUrl, signal, fetchImpl = fetch }) {
  if (CONTACT_DELIVERY.mode !== 'test') throw new Error('Customer delivery is not enabled');
  const response = await fetchImpl(CONTACT_DELIVERY.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(buildContactPayload(fields, sourceUrl)),
    signal,
  });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Unexpected server response');
  const result = await response.json();
  if (!response.ok || result?.success !== true) {
    // Only the same-origin server supplies this message, never a provider body.
    const error = new Error('Enquiry was not accepted');
    error.userMessage = typeof result?.message === 'string' ? result.message : '';
    throw error;
  }
  // Brevo acceptance is not proof of inbox delivery.
  return { accepted: true };
}
