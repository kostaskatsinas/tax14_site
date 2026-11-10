# Contact email

Last checked: **2026-11-10**.

The live site uses Brevo with server-side Cloudflare Turnstile verification.
The permanent and only delivery recipient is **katsinas1986@gmail.com**.
The same address appears in all public `mailto:` links.

Normal customer delivery is enabled. Test-mode notices, subject prefixes and
message labels have been removed. Form input cannot change the recipient.

The browser sends JSON to `api/contact.php`. The server validates the selected
contact channel, consent and Turnstile token before using Brevo's transactional
API. Phone enquiries contain the phone number; email enquiries include the
visitor's email as Reply-To. No CC or automatic visitor reply is configured.

Subjects use `TAX14 — Νέο αίτημα: <name>`, with a normal acknowledgement in the
form. Failed submissions retain the entered information and provide retry/phone
instructions. Mail acceptance is distinct from inbox delivery.

The live CAPTCHA-protected flow was received and confirmed by the owner. Normal
mode was enabled in `f818456`, deployed successfully by
[run 42806779923](https://github.com/kostaskatsinas/tax14_site/actions/runs/42806779923).
The current live configuration reports ready and both HTML pages use only
`mailto:katsinas1986@gmail.com`.

See [BREVO_SETUP.md](BREVO_SETUP.md) for private configuration, hosting details,
maintenance and automated checks. FormSubmit is no longer used by the site.
