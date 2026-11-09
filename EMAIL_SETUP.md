# Contact email — test setup

Provider: [FormSubmit](https://formsubmit.co/documentation), free form-to-email service.
No paid mailbox, SMTP password, PHP runtime or API key is needed for the active form.

## Current destination

- Test recipient: **katsinas1986@gmail.com**.
- Configuration: `CONTACT_DELIVERY` in `js/contact-delivery.mjs`.
- Mode: `test`. All subjects start with `[ΔΟΚΙΜΗ]` and the form visibly asks for test data only.
- The site's public business contact details stay separate from this test destination.
- No automatic replies or copies are sent to people who submit the form.
- `api/contact.php` now returns HTTP 410 instead of sending to the previous recipient.

## Activate and verify

1. Open the local website through `http://127.0.0.1:8000/index.html#contact`.
2. Submit an enquiry containing only fictional test data.
3. FormSubmit sends an activation email to the test recipient. Check Spam too.
4. The mailbox owner clicks the activation link. Until then delivery is pending;
   provider acceptance is not confirmation that an enquiry arrived in the inbox.
5. Submit again and check that the `[ΔΟΚΙΜΗ] TAX14` email contains the correct
   name, service, selected contact channel and optional details.
6. Test both Business and Individual, and both phone and email contact modes.
   Email mode sets Reply-To to the submitted email; phone mode does not invent one.

FormSubmit may require separate activation when the website URL changes from
localhost to the live site. See [activation help](https://formsubmit.co/help).

## After the owner approves customer delivery

Do not switch destinations automatically. Wait for explicit approval and the final
recipient. Then update the fixed endpoint, remove the test-only guard and subject
prefix, update the form notice and success feedback, and review the privacy text
for the actual customer workflow. Activate the new destination and verify receipt
there before considering it ready. Changing the public business email is a
separate content decision.

The provider receives submitted fields and states that submissions are retained
for 30 days. Only use fictional test data during setup. Read its
[privacy policy](https://formsubmit.co/privacy.pdf) before customer use.

## Checks

```sh
node --test tests/contact-delivery.mjs
```

These tests use a fake transport and do not send email. A real browser submission
and mailbox receipt are required for delivery verification. Keep the page open
if a request times out: fields are preserved so the user can retry, after checking
the inbox to avoid duplicate submissions.

## Verification record — 2026-11-09

- Eight automated delivery tests passed, including malformed provider responses,
  failure handling and protection against changing the recipient through form fields.
- The owner confirmed FormSubmit activation.
- A fresh business enquiry was submitted through the local browser after activation:
  `[ΔΟΚΙΜΗ] TAX14 — Νέο αίτημα: TAX14 TEST — μετά την ενεργοποίηση`.
- FormSubmit accepted that request and the browser displayed the acknowledgement.
- The owner confirmed receipt of that post-activation test at
  `katsinas1986@gmail.com`. Local form-to-inbox delivery is verified.
- These changes have not been deployed to the live website. Customer delivery
  remains disabled until the owner supplies and approves the final recipient.
