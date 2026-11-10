# TAX14 — Current interface reference

Last checked: **2026-11-10**. Describes the implemented interface after the design pass built on the
design-taste-frontend skill. The CSS files are authoritative for exact values.

## System

- **Kit:** `assets/kit/` holds the skill's runtime files, copied unchanged: `system.css` and `system.js`
  (grid, type scale, buttons, nav, phone sheet, action bar, footer), `motion/` (hover, press, the hero's
  entrance), `layout/` (the photo hero), `ui/` (loaded by system.js) and `moments/` (the word-highlight
  statement). Do not edit them; page rules go in `css/site.css`.
- **Page CSS:** `css/site.css` holds the palette and only the page's own parts: logo, service rows,
  credentials card, steps, comparison table, calculator, enquiry form, inner pages.
- **Type:** Manrope, self-hosted (Greek, Latin, Latin Extended) in `assets/fonts/`, headings at weight
  400 with tight tracking.
- **Colour:** the client's own colours: white ground, navy ink `#0A1628`, teal action `#087F75`, light
  surface `#F1F5F9`; on navy, links use `#14B8A6`. One dark band (the calculator) and the dark footer.
- **Buttons:** one look (`data-buttons="arrow"`): the filled teal primary and a text secondary.
- **Icons:** Lucide interface glyphs in `assets/icons/` (ISC, see `icons-credits.json`), inline.

## Page (index.html), one section per screen at 1440x900

1. Hero: full-bleed photograph of the Acropolis from Philopappos Hill (A.Savin, Wikipedia, via Wikimedia Commons, CC BY-SA 3.0, credited on
   `credits.html`), the words in a white box: h1, one line, "Ζητήστε κλήση" and the phone.
2. Services: two lists (επιχειρήσεις / ιδιώτες); each service links to the form and preselects it.
3. Ο Πέτρος: short story beside a card with 20 years, O.E.E. licence, degrees and platforms. First name
   only, no portrait (owner's decision).
4. Statement: the free first call and the written quote, lit word by word as it scrolls (word-highlight).
5. Steps: the four steps of working together.
6. Comparison table of Ατομική, Ο.Ε./Ε.Ε., Ι.Κ.Ε., Α.Ε. (stacks per row on phones).
7. Calculator (dark band): profit input and slider, main tax for each form, a link to the form.
8. FAQ: five questions, answers always open (matching the FAQPage JSON-LD).
9. Contact: phone, email, address, hours, and the enquiry form (Turnstile + Brevo, unchanged API).
10. Footer: one closing call, link columns, legal row.

The main action reads "Επικοινωνία" in the nav, the hero, the footer and the phone action bar. The
phone bar also carries "Καλέστε".

## Header branding and navigation

The header presents the logo icon and TAX14 left to right, vertically centred, without a tagline.
The home menu contains «Υπηρεσίες», «Ο Πέτρος», «Σύγκριση», «Συχνές Ερωτήσεις» and
«Οικονομικές καταστάσεις» (immediately after FAQ), plus «Επικοινωνία».
The same financial archive link and branding appear on the inner pages and in the mobile menu.
The menu sheet is used below 1200px; on phones the contact action is inside the menu.

## Language readiness

`<html lang="el">`, `hreflang` el and x-default in the head, and a commented EN slot in the nav actions.
No string is baked into CSS; form option values stay the Greek values the server expects.

## Inner pages

`privacy.html`, `terms.html`, `cookies.html`, `credits.html` and `financial-statements.html` use the
same kit with a slim footer. The legal texts used to be modals on the home page; the cookie banner is
gone because the site sets no analytics or marketing cookies.
