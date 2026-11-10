# Brevo and CAPTCHA setup

The new contact flow is browser → PHP → Cloudflare Turnstile verification → Brevo.
Actual credentials are never included in HTML, JavaScript, Git, logs or API responses.
The recipient stays fixed at `katsinas1986@gmail.com` in server code. No automatic
customer replies, contact-list imports or marketing campaigns are created.

## Account setup

1. Sign in to the free Brevo account and complete any requested phone/account
   verification. Transactional sending may need activation by Brevo.
2. Configure an email sender in Brevo. For customer use, authenticate a domain you
   own using Brevo's DNS records. Preserve existing MX, SPF, DKIM, DMARC and other
   verification records. Never replace the DNS zone as a shortcut.
3. Generate an API key under Settings → SMTP & API → API Keys. Do not paste the
   key in chat or commit it. Save it directly in the private configuration below.
4. Create a free Cloudflare Turnstile widget for the site's actual hostname(s).
   Add local development hostnames when local delivery testing is needed. Use
   the real widget's site key and secret; published always-pass testing keys are
   deliberately rejected by the email handler.

Official references:
- [Brevo email API](https://developers.brevo.com/docs/send-a-transactional-email)
- [Domain authentication](https://help.brevo.com/hc/en-us/articles/12163873383186)
- [Turnstile token verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Private server configuration

Copy the structure in `config/contact.example.php` into a file named
`tax14-contact-config.php` **above** the public website directory:

```text
domain-directory/
├── tax14-contact-config.php   ← private; never served or committed
└── public_html/
    ├── index.html
    └── api/
        └── contact.php
```

Fill in `brevo_api_key`, `sender_email`, `turnstile_site_key`,
`turnstile_secret_key` and `allowed_hostnames` (comma-separated exact hostnames;
no `https://`, port or path). Limit the private file to the hosting account user
where permissions allow. The API loads this file but never returns its values.
Only the public CAPTCHA site key is returned when the full configuration is ready.

Alternatively supply environment variables:

- `TAX14_BREVO_API_KEY`
- `TAX14_BREVO_SENDER_EMAIL`
- `TAX14_BREVO_IP_VERSION` (`ipv4` by default, or `ipv6`; match the authorized server IP)
- `TAX14_TURNSTILE_SITE_KEY`
- `TAX14_TURNSTILE_SECRET_KEY`
- `TAX14_CONTACT_HOSTNAMES`

`TAX14_CONTACT_CONFIG` can specify another absolute private configuration path.
Keep it outside every public web root. The existing FTP workflow deploys the site
files; it does not upload or modify this private file.

## Preview and checks

PHP 8.1+ with the cURL extension is required. A Python static file server cannot
execute this contact flow. Start a PHP preview with:

```sh
TAX14_CONTACT_CONFIG=/absolute/private/path/tax14-contact-config.php php -S 127.0.0.1:8001 -t .
```

Automated checks use injected responses and never send email:

```sh
php tests/contact-validation.php
php tests/contact-service.php
node tests/contact-delivery.mjs
node --test tests/contact-captcha.mjs
```

The handler rejects missing, expired, forged, wrong-host or wrong-action CAPTCHA
tokens before sending to Brevo. It does not retry mail automatically. On failure,
the browser keeps the enquiry, resets the single-use CAPTCHA and explains how to
retry. Brevo's HTTP 201/message ID means accepted for sending, not inbox receipt.

Without complete private settings, `/api/contact-config.php` returns
`{"ready":false,"captchaSiteKey":""}` and sending stays disabled. This is a setup
state, not a functioning CAPTCHA or verified Brevo delivery.

## Finish activation

1. Confirm the sender/account and CAPTCHA widget are ready.
2. Check the CAPTCHA is visible and keyboard accessible on the local/live form.
   A human must complete any interactive challenge; do not bypass it for testing.
3. Submit one clearly labelled fictional test and verify it in Brevo's
   transactional log and at `katsinas1986@gmail.com`.
4. Obtain the owner's confirmation and final customer recipient before changing
   test mode, the recipient, test subjects or the privacy text.
5. Deploy only after the private hosting configuration is ready, then repeat the
   CAPTCHA and inbox check on the live hostname.

The previous FormSubmit delivery test is recorded in `EMAIL_SETUP.md`; that result
does not verify the replacement Brevo integration.

## Account progress — 2026-11-10

- Signed in to the owner's Brevo account. Its Gmail sender is already verified;
  no business sending domain has been authenticated yet.
- Phone verification is complete. Created a restricted key named
  `TAX14 contact form`, with only the Transactional email resource selected.
  The actual key is stored in the private local configuration outside the website
  and Git; it is not included in this document.
- API IP restrictions remain enabled. The owner authorized the local IPv6 address;
  a read-only transactional-statistics request through that address returned HTTP
  200. The local configuration uses IPv6 consistently to match this authorization.
  The hosting environment will need its own actual egress IP authorized.
- The key setup reports a one-year default expiry and automatic expiry after
  90 days of inactivity; account owners should account for this when maintaining
  a low-volume contact form.
- Created a Managed Turnstile widget named `TAX14 contact form`, restricted to
  `localhost` and `127.0.0.1`. Its credentials are saved privately outside the
  website and Git. The owner confirmed `tax14.gr` as the production domain;
  `tax14.gr` and `www.tax14.gr` are now saved in the widget's allowed hostnames.
- A direct provider diagnostic was accepted by Brevo (HTTP 201), followed by a
  real local browser form submission with server-validated Turnstile verification.
  Brevo reports the form email as `delivered` at 12:41:02 Europe/Athens, with
  subject `[ΔΟΚΙΜΗ] TAX14 — Νέο αίτημα: TAX14 TEST — Brevo και CAPTCHA`.
  The owner confirmed receipt of this exact form test email.
- Connected the official Hostinger MCP integration after the owner's approval
  and verified access to the exact `tax14.gr` website.
- Saved `tax14-contact-config.php` in the domain directory above `public_html`
  with owner-only permissions (600). Its public URL returns HTTP 404.
  Production configuration accepts only `tax14.gr` and `www.tax14.gr`, uses
  IPv4 for Brevo and keeps the same fixed test recipient.
- A one-time protected diagnostic measured the hosting server's outgoing IPv4
  as `82.198.229.189`, with PHP 8.3 and cURL available. It read no credentials
  and sent no email. The owner approved running it and it was removed afterward;
  its live URL now returns HTTP 404.
- With the owner's explicit approval, authorized `82.198.229.189` in Brevo and
  verified its presence in the authorized-IP table. Other IP restrictions remain
  enabled. Recheck the actual outgoing IP if hosting infrastructure changes.
- Committed the integration as `24c6275` and pushed it to `main` after the owner
  approved GitHub's additional Workflow permission. Hostinger deployment
  [42805863578](https://github.com/kostaskatsinas/tax14_site/actions/runs/42805863578)
  completed successfully.
- Verified the live configuration endpoint reports ready and the contact endpoint
  rejects GET with HTTP 405. Submitted one real browser test through
  `https://tax14.gr/index.html#contact`, including server-validated Turnstile.
  The live form accepted the request, and the owner confirmed receipt of
  `[ΔΟΚΙΜΗ] TAX14 — Νέο αίτημα: TAX14 LIVE TEST — Brevo και CAPTCHA` at the fixed
  test recipient. This verifies live email receipt, not just API acceptance.
- Customer delivery remains disabled until the owner supplies the final recipient
  and explicitly approves enabling customer use. Do not remove the test notice or
  change recipients on the strength of the successful test alone.
