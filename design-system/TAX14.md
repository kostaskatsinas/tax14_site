# TAX14 — Current interface reference

Last checked: **2026-11-10**. This document describes the implemented interface,
not an open design proposal. The CSS files are authoritative for exact values.
See [../SPECS.md](../SPECS.md) for content, form behavior and technical structure.

## Audience and purpose

Greek business owners and individuals need to identify the right accounting
service and request a conversation with Petros. The interface uses concise Greek
copy, explicit audience choices and a short form with optional extra details.

## Implemented visual system

| Role | Value / implementation |
| --- | --- |
| Primary navy | `--navy-900: #0A1628`; darker `#060D1A`, supporting `#0F213C` |
| Primary action teal | `--emerald-600: #087F75`, with white text |
| Supporting teal | `#10B981`, `#14B8A6` |
| Hero mist surface | `#EDF4F7` on `.hero-section` |
| Page / subtle surfaces | `--bg-page: #F8FAFC`, `--bg-subtle: #F1F5F9` |
| Reading surface | `--surface-white: #FFFFFF` |
| Body / supporting text | `#0F172A`, `#334155`, muted `#526176` |
| Bronze detail | `--gold-400: #E2BA78` and `--gold-500: #C89D54` |
| Typography | Inter for headings, body and UI, with system fallbacks |
| Numeric data | Tabular numbers in the comparison tool and archive year labels |

Both `--font-display` and `--font-sans` use Inter. `--font-mono` aliases the same
sans family; Plus Jakarta Sans and JetBrains Mono are not loaded. Body text is
based on 16px; supporting text commonly uses `.875rem` (14px). Responsive and
component rules determine heading sizes and weights.

## Page composition

- Sticky logo/header with boxed navigation links, four main section choices and
  an “Επικοινωνία” action. The active section uses `aria-current="location"`.
- Left-aligned hero introduction beside a navy service folder headed
  “Τι σας απασχολεί;”. The folder chooses business/individual journeys and never
  represents real customer data or a live compliance dashboard.
- Bordered location badge and enlarged audience badges make important labels
  visible. The small ledger rule comes from [../assets/ledger-rule.svg](../assets/ledger-rule.svg).
- Services use concise titles, supporting scope and native expandable details.
  Enquiry actions have service-specific accessible labels and form prefill.
- The advisor section introduces Petros with a single 20-year experience figure,
  a short biography and the two supplied degrees. It does not invent a surname,
  awards or additional credentials.
- Existing office and handshake photos stay at the top right of their sections
  on desktop. Source images are 960 × 640 (3:2); `.section-photo` presents them
  with a 16:9 crop. Do not replace either photo without a new request.
- Contact form comes first in both DOM and visual order. Contact information is
  beside it on desktop and stacks below on small screens. Main layout changes
  use 1120px, 960px and 760px ranges; the archive has its own 760px layout rule.

## Contact form and feedback

Normal customer delivery is enabled. The sole recipient and every public email
link use `katsinas1986@gmail.com`. No test banner, subject prefix or test-only
acknowledgement is displayed. See [../EMAIL_SETUP.md](../EMAIL_SETUP.md).

Initial required information is name, service, the selected phone/email contact
channel and consent. Business/profile details and the message stay optional in a
disclosure. Do not make both phone and email mandatory. Keep field errors and the
error summary associated with the relevant input; failed submissions retain data.

The compact, light Cloudflare Turnstile widget is labelled “Έλεγχος ασφαλείας”.
Loading, success, expiry and error states use status text. “Νέος έλεγχος” allows
recovery. The server verifies the token before calling Brevo. A successful send
shows “Το αίτημά σας υποβλήθηκε. Θα επικοινωνήσουμε μαζί σας με τον τρόπο που
επιλέξατε.” API acceptance does not independently establish inbox receipt.

Use “Ζητήστε επικοινωνία” for enquiry entry points and “Στείλτε αίτημα
επικοινωνίας” for form submission. Header navigation uses “Επικοινωνία”.

## Financial statements

[../financial-statements.html](../financial-statements.html) is a separate static
archive. The footer entry sits under the credentials as a gold, bold outlined
link. Six rows cover 2025–2020, with a large year, document description, file size,
preview in a new tab and download. Separators replace repeated cards. Mobile
actions wrap beneath the description. The page works without JavaScript.
Adding a year uses [../FINANCIAL_STATEMENTS.md](../FINANCIAL_STATEMENTS.md).

## Accessibility and maintenance checks

Implemented patterns include skip links, visible focus, keyboard tabs/radios,
modal focus containment, mobile menu Escape handling, disclosure controls,
reduced-motion rules and status/error feedback. These are implementation features,
not a claim of full accessibility certification.

For a UI change, check desktop/narrow-mobile layout, keyboard focus, deep links,
form validation, CAPTCHA recovery and the changed component's actual behavior.
Use existing automated contact checks when delivery logic changes; see
[../BREVO_SETUP.md](../BREVO_SETUP.md). Preserve the original tax-comparison
behavior unless a separate change is requested. The current interface assets use
`contact2` cache versions; bump affected asset URLs when their contents change.

Photo files and archived creative briefs are documented separately in
[IMAGE-PROMPTS.md](IMAGE-PROMPTS.md).
