# Brevo and CAPTCHA setup

Last checked: **2026-11-10**, against the current source and live configuration.

The contact flow is browser → PHP → Cloudflare Turnstile verification → Brevo.
Actual credentials are never included in HTML, JavaScript, Git, logs or API responses.
The permanent recipient is `katsinas1986@gmail.com`, fixed in server code. The same
address is used in all public email links and structured data. No automatic
customer replies, contact-list imports or marketing campaigns are created.

## Account setup

1. Sign in to the Brevo account and complete any requested phone/account
   verification. Transactional sending may need activation by Brevo.
2. Configure and verify an email sender in Brevo. The current site uses its
   existing verified Gmail sender. Gmail is not an owned custom sending domain
   and cannot be authenticated through your DNS. For a new custom-domain sender,
   authenticate the domain you own with Brevo's records. Preserve existing MX,
   SPF, DKIM, DMARC and verification records; never reset the DNS zone.
3. For a new installation, generate a restricted Transactional email API key under
   Settings → SMTP & API → API Keys. The live site already has one; do not create
   duplicates for a normal deployment. Do not paste the
   key in chat or commit it. Save it directly in the private configuration below.
4. Create a free Cloudflare Turnstile widget for the site's actual hostname(s).
   Add local development hostnames when local delivery testing is needed. Use
   the real widget's site key and secret; published always-pass testing keys are
   deliberately rejected by the email handler.

Official references:
- [Brevo email API](https://developers.brevo.com/docs/send-a-transactional-email)
- [Domain authentication](https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC)
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
node --test tests/contact-delivery.mjs tests/contact-captcha.mjs
```

The handler rejects missing, expired, forged, wrong-host or wrong-action CAPTCHA
tokens before sending to Brevo. It does not retry mail automatically. On failure,
the browser keeps the enquiry, resets the single-use CAPTCHA and explains how to
retry. Brevo's HTTP 201/message ID means accepted for sending, not inbox receipt.

Without complete private settings, `/api/contact-config.php` returns
`{"ready":false,"captchaSiteKey":""}` and sending stays disabled. This is a setup
state, not a functioning CAPTCHA or verified Brevo delivery.

## Live configuration — 2026-11-10

The owner approved normal customer use with `katsinas1986@gmail.com` as the sole
recipient. There is no test-mode flag, test subject prefix, test body label or
test-only notice. Email subjects use `TAX14 — Νέο αίτημα: <name>`.

- Website: `https://tax14.gr/` (Hostinger account `u635942677`).
- Private configuration: domain directory above `public_html`, owner-only mode
  600. Its public URL returns HTTP 404. Credentials stay outside the repository.
- Production server-accepted CAPTCHA hostnames: `tax14.gr`, `www.tax14.gr`.
  The widget also allows `localhost` and `127.0.0.1` for local development; the
  production PHP configuration accepts only the two production hosts.
- Brevo sender: existing verified `katsinas1986@gmail.com` sender.
- Brevo transport: IPv4; authorized hosting egress IP `82.198.229.189`.
  IP restrictions remain enabled. Recheck egress if hosting infrastructure changes.
- Restricted API key: `TAX14 contact form`, Transactional email permission only.
  At creation on 2026-11-10 the UI reported expiry on 2027-11-10 and expiry after
  90 inactive days. Check its current status in Brevo during maintenance.
- The local and live CAPTCHA-protected form deliveries were verified, with inbox
  receipt confirmed by the owner before enabling customer use.
- GitHub deploys pushes to `main` using `.github/workflows/deploy.yml`. Private
  configuration is managed separately; setup documents and tests are excluded.
- No CC, marketing contact imports or automatic replies to visitors are enabled.
  Reply-To uses the visitor's email only when they select email contact.

## Deployment verification

Confirm the configuration endpoint reports ready, the CAPTCHA loads on the live
hostname, and the form displays a normal acknowledgement after submission. Use a
clearly identified fictional enquiry for any maintenance delivery check and
verify receipt at the permanent mailbox. Do not bypass CAPTCHA verification.

Automated test fixtures remain isolated from production settings and never send
real email. Published always-pass CAPTCHA keys remain blocked by the handler.

## Current source and verification record

Normal delivery and public email links were enabled in commit `f818456`.
[Deployment 42806779923](https://github.com/kostaskatsinas/tax14_site/actions/runs/42806779923)
succeeded. The owner confirmed inbox receipt from the live CAPTCHA-protected
flow before normal customer use was enabled. The subsequent production-mode
change passed 30 service checks, 19 request-validation cases and both JavaScript
test files; it did not change the provider credentials or destination.

The current response is “Το αίτημά σας υποβλήθηκε. Θα επικοινωνήσουμε μαζί σας με
τον τρόπο που επιλέξατε.” Email bodies start with “Νέο αίτημα επικοινωνίας TAX14”
and use the tags `tax14`, `contact`. Error text gives a retry/telephone route
instead of asking a visitor to check the business mailbox.

`GET /api/contact.php` returns HTTP 405. Malformed JSON, oversized requests and
invalid fields fail before provider delivery. `GET /api/contact-config.php`
returns only readiness and the public site key; credentials are never returned.
The main handler's readiness check also rejects published always-pass CAPTCHA
keys. Backend logic is split across `api/contact.php`, `api/contact-service.php`,
`api/contact-settings.php` and `api/contact-validation.php`.

For deployment and a complete public/private file layout, see
[HOSTINGER_DEPLOY.md](HOSTINGER_DEPLOY.md). For the short operational summary, see
[EMAIL_SETUP.md](EMAIL_SETUP.md).
