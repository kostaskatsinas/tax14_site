# TAX14 — Current interface reference

Last checked against source: **2026-11-11**, through `7c0d19e`. Describes the implemented interface after the design pass built on the
design-taste-frontend skill. The CSS files are authoritative for exact values.

## System

- **Kit:** `assets/kit/` holds the skill's runtime files, copied unchanged: `system.css` and `system.js`
  (grid, type scale, buttons, nav, phone sheet, action bar, footer), `motion/` (hover, press, the hero's
  entrance), `layout/` (the photo hero), `ui/` (loaded by system.js) and `moments/` (the word-highlight
  statement). Do not edit them; page rules go in `css/site.css`.
- **Page CSS:** `css/site.css` holds the palette and only the page's own parts: logo, service rows,
  credentials card, steps, comparison table, calculator, enquiry form, inner pages.
- **Type:** Manrope, self-hosted (Greek, Latin, Latin Extended) in `assets/fonts/`, headings at weight
  500 with tight tracking; 60px maximum hero heading, 44px maximum section heading.
- **Colour:** the client's own colours: white ground, navy ink `#0A1628`, teal action `#087F75`, light
  surface `#F0F5F6`; on navy, links use `#14B8A6`. One dark band (the calculator) and the dark footer.
- **Buttons:** one look (`data-buttons="arrow"`): the filled teal primary and a text secondary.
- **Icons:** Lucide interface glyphs in `assets/icons/` (ISC, see `icons-credits.json`), inline.

## Page (index.html), content-height sections

1. Hero: H1 «Λογιστικό γραφείο στα Πετράλωνα», an introduction naming Αχαιών 20, Άνω Πετράλωνα
   and core services, contact/phone actions and the free first consultation. Text and Acropolis photograph
   sit in separate columns, followed by three compact facts. The image
   stacks below the text on tablets and phones. Photograph from Philopappos Hill by A.Savin, Wikipedia,
   via Wikimedia Commons, CC BY-SA 3.0, credited on `credits.html` and `en/credits.html`.
   Responsive WebP widths are 960, 1280, 1920, 2560 and 3840px; full asset details are in
   [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md).
2. Services: two bordered groups (επιχειρήσεις / ιδιώτες), with a pale header and icon rows. The whole
   service row links to the form and preselects the enquiry subject. Secondary tags disappear on phones.
3. Ο Πέτρος: short story beside a card with 20 years, O.E.E. licence, degrees and platforms. First name
   only, no portrait (owner's decision).
4. Statement: a short heading about the free first call, with supporting details in a second column.
   The heading retains the word-highlight scroll effect.
5. Steps: four numbered steps across desktop, two columns on tablets, a vertical sequence on phones.
6. Comparison table of Ατομική, Ο.Ε./Ε.Ε., Ι.Κ.Ε., Α.Ε. (stacks per row on phones).
7. Calculator (dark band): a bordered input panel, full-width profit input and labelled slider endpoints,
   main tax for each form, and a link to the form. Calculation rules are unchanged by the design update.
8. FAQ: five questions, answers always open (matching the FAQPage JSON-LD).
9. Contact: stacked phone, email, Google Maps address link and hours beside a bordered enquiry form
   with an introductory heading and clear focus states (Turnstile + Brevo, shared API across languages).
   The public email, sole recipient and verified Brevo sender use `petros.thanasos@gmail.com`.
10. Footer: one closing call, link columns, legal row.

The main action reads "Επικοινωνία" in the nav, the hero, the footer and the phone action bar. The
phone bar also carries "Καλέστε".

## Header branding and navigation

The header presents the logo icon and TAX14 left to right, vertically centred, without a tagline.
The home menu contains «Υπηρεσίες», «Ο Πέτρος», «Σύγκριση», «Συχνές Ερωτήσεις» and
«Οικονομικές καταστάσεις» (immediately after FAQ), plus «Επικοινωνία».
The same financial archive link and branding appear on the inner pages and in the mobile menu.
The menu sheet is used below 1360px; on phones the contact action is inside the menu.
The Greek/UK flags and EL/EN labels remain visible at the top right outside the menu, with
44 × 44px minimum targets and an active-language state. Desktop nav links retain their light borders.
`js/navigation.js` adds active section states, focus containment while the menu is open, and an inert
page background. Escape and link selection close the menu through the unchanged kit runtime.

Main sections use 96px vertical padding on desktop and 64px on phones. This preserves the owner's
content-height layout and alternating white/slate sections. Split grids collapse below 1024px; the
comparison becomes labelled two-column cards, and the form fields stack on phones.

## Greek and English interface

Six Greek pages have six generated equivalents under `/en/`. The native language links work without
JavaScript; `js/navigation.js` preserves the current section hash when available. There is no automatic
language redirect or preference cookie. Both locales share CSS, kit, images and the contact API.
`js/i18n.mjs` localizes runtime messages, calculator currency/rates and errors; Turnstile uses the page
language. Form IDs, option values and service prefill values keep the existing server contract.
After changing Greek copy, update the dictionary and regenerate English pages as described in
[translations/README.md](translations/README.md).

## Homepage SEO copy

Commit `7c0d19e` aligned the page title and OG/Twitter title to
«Λογιστικό Γραφείο στα Πετράλωνα | TAX14». The English equivalent is
“Accounting office in Petralona, Athens | TAX14”, with H1 “Accounting office in Petralona”.
The address stays precise in the introduction and business information. Meta/OG/Twitter descriptions
match within each locale. Preserve natural heading wrapping and do not add forced line breaks for SEO.

## Inner pages

`privacy.html`, `terms.html`, `cookies.html`, `credits.html` and `financial-statements.html` use the
same kit with a slim footer. The legal texts used to be modals on the home page; the cookie banner is
gone because the site sets no analytics or marketing cookies.

## Verification record

The `7c0d19e` copy was visually checked at 1440px and 390px in both languages; CI passed and both live
homepages matched the deployed HTML. This records layout checks, not a performance score or a full
accessibility certification. The calculator's tax rules still need a separate professional/year review;
the design and translation changes did not update them. Recent commits and outstanding SEO items are
recorded in [SPECS.md](../SPECS.md).
