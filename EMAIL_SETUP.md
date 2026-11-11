# Contact email

Documentation checked against source through `7c0d19e`: **2026-11-11**.
Contact address and verified sender updated on **2026-11-11**.

The live site uses Brevo with server-side Cloudflare Turnstile verification.
The permanent and only delivery recipient is **petros.thanasos@gmail.com**.
The same address appears in public `mailto:` links on all 12 Greek/English pages,
the privacy text and business structured data.

Normal customer delivery is enabled. Test-mode notices, subject prefixes and
message labels have been removed. Form input cannot change the recipient.

Both languages send JSON to `/api/contact.php`. The server validates the selected
contact channel, consent and Turnstile token before using Brevo's transactional
API. Phone enquiries contain the phone number; email enquiries include the
visitor's email as Reply-To. No CC or automatic visitor reply is configured.

Subjects use `TAX14 — Νέο αίτημα: <name>`, with a normal acknowledgement in the
form in the visitor's selected language. Labels, errors and CAPTCHA are localized;
the underlying field names and API values are shared, and notification emails
keep Greek subjects/body labels. Failed submissions retain entered information and provide retry/phone
instructions. Mail acceptance is distinct from inbox delivery.

The original CAPTCHA-protected flow was verified at launch. Normal mode was
enabled in `f818456`, deployed successfully by
[run 42806779923](https://github.com/kostaskatsinas/tax14_site/actions/runs/42806779923).
The recipient/public email change was deployed in `c0edc55`
([run 43003366462](https://github.com/kostaskatsinas/tax14_site/actions/runs/43003366462));
the sender change followed in `5d410e2`
([run 43004967884](https://github.com/kostaskatsinas/tax14_site/actions/runs/43004967884)).
The configuration reported ready after deployment. The sending identity is also
`TAX14 Website <petros.thanasos@gmail.com>`, verified in Brevo on 2026-11-11.
The sender is selected in `api/contact-settings.php`; legacy private sender
settings are ignored. API and CAPTCHA credentials remain private. Inbox receipt
at the new recipient has not been confirmed by a new delivery test.

The subsequent homepage SEO update `7c0d19e` changed titles, headings, opening
copy and descriptions in both languages; it did not change email delivery.
The full recent change record is in [SPECS.md](SPECS.md).

See [BREVO_SETUP.md](BREVO_SETUP.md) for private configuration, hosting details,
maintenance and automated checks. FormSubmit is no longer used by the site.
