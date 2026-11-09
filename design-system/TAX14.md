# TAX14 interface direction

Audience: Greek business owners and individuals looking for an accountant in Athens or remote support. The main job is to find the right service and request a conversation.

## Tokens
- Ink navy #0A1628: headings, service selector, footer.
- Aegean teal #087F75: primary actions and selection, with white text.
- Mist #EDF4F7: hero and supporting surfaces.
- Paper #FFFFFF: reading and form surfaces.
- Slate #475569: secondary text.
- Bronze #E2BA78: restrained brand detail on navy only.

Typography: Inter throughout, with native Greek system fallbacks. Strong 40–64px hero, 28–40px section titles, 16px body, 14px secondary labels. Tabular numbers for the existing comparison tool. Remove decorative monospace and capitalized labels.

## Layout exploration
A. Keep the current dark dashboard hero: familiar, but duplicates service navigation and implies live client data.
B. Clear, left-aligned introduction beside a navy service folder: makes audience choice the memorable interaction. Selected.

    [Brand]    [Businesses | Individuals | Company guide | FAQ] [Contact]
    [Athens / online]             [How can we help?              ]
    [Short Greek headline]        [Business | Individual         ]
    [Brief introduction]          [Three relevant service links  ]
    [Request conversation]        [Personal contact reassurance  ]
    [Credentials and connections, quieter supporting strip]
    [Service overview with expandable detail]
    [Existing comparison tool / reasons / process / FAQ]
    [Contact information]         [Segmented form + inline errors]

## Review against the brief
The skill search matched accessible professional services and low-friction contact. Keep those principles, but reject the generic serif legal-office pairing and orange CTA: they do not fit TAX14's existing Greek navy/teal identity. Replace the fictitious status dashboard with a useful service folder. Preserve the existing service content and tax calculation behavior; this is an interface revision, not a review of tax advice.

Use fewer badges, no decorative glow, no repeated card-lift animation. Keep service detail available through native disclosures. Respect reduced motion; support keyboard tabs, radio selection, modal focus containment and mobile Escape dismissal. Failed requests retain entered details and never claim success. Verify desktop, narrow mobile, tablet, keyboard flows, deep links, validation and server failures.

## Follow-up usability improvements

Supporting text has a 14px minimum; key explanatory copy uses 16px. On mobile, service shortcuts follow the headline. Contact form markup and visual order are identical, with the form first. Initial required fields are name, service, selected contact channel and consent. Business/profile details remain optional in a disclosure. The server validates the same short-form contract and reports mail handoff failures. A numeric amount field and the range input share the existing tax simulation without changing its rates. Navigation reflects the section currently in view with aria-current="location". Repeated promotional copy in the benefits and process sections is condensed.

Validation: JavaScript syntax, HTML structure and references, mobile/desktop overflow and interaction checks. Pure PHP validation cases live in tests/contact-validation.php; run with PHP 8.x. A PHP interpreter is required to execute those tests and check the delivery handler.

## Frontend design refinement

Retain the six palette tokens and Inter. Keep the navy service folder as the focal point. Use the logo's ledger columns and rising line only as a small section-heading rule, plus a matching inset line on sequential process markers. Main headings use 650–700 weight, component titles 600, and secondary labels 400–500. This avoids a new decorative theme and grounds the detail in TAX14's own mark.

Layout: left-aligned reading copy beside wider, top-aligned photography (16:9) in the requested right-hand positions. Short service titles sit above their technical scope; detailed explanations remain expandable. On mobile the two audience shortcuts remain early, while the service folder opens on demand. Its content remains visible without JavaScript and fully available on desktop.

    [Section rule + short heading]  [Wide office / handshake photo]
    [Brief explanation]            [Top aligned with introduction]
    [Services / benefits / actual sequential process]

Use “Ζητήστε επικοινωνία” consistently for enquiry entry points, with service-specific accessible labels and the same existing form prefill. The submit action is “Στείλτε αίτημα επικοινωνίας”. Short FAQ questions retain their existing answer context and matching structured-data names. No tax rates or delivery logic change in this refinement.

## Advisor profile refinement

Keep Inter and the existing navy, teal, mist, paper, slate and bronze tokens. Introduce Petros with a short third-person biography and a single prominent 20-year experience figure, without a new card or decorative badge. Keep both photographs unchanged. Place the two degrees below the introduction in two aligned columns on desktop and one column on mobile; separate qualification level, subject and institution. Compact mobile institutional cards with 30px icons, 8px gaps and shorter descriptions while retaining readable 14px text.

    [Petros + 20 years + introduction] [Existing office photograph]
    [Degree / subject / university]    [Master's / subject / university]
    [Existing service benefits]

The figure is explicitly requested and belongs to the advisor's experience. No invented surname, employment history, awards or new credential claims.

## Financial statements archive

Use the existing navy, teal, white, slate and bronze palette and Inter. A separate page, linked under the company credentials in the home footer, presents one chronological list from newest to oldest. Large year labels anchor each row; document descriptions and file sizes support two explicit actions: preview in a new tab and download. Use separators instead of six separate cards. On mobile, actions wrap beneath each document description. Preserve original PDFs byte for byte. A local Python script rebuilds static rows from year-based filenames, so browsing requires no JavaScript and adding a year requires no layout changes.
