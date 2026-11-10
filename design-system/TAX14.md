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
  500 with tight tracking; 60px maximum hero heading, 44px maximum section heading.
- **Colour:** the client's own colours: white ground, navy ink `#0A1628`, teal action `#087F75`, light
  surface `#F0F5F6`; on navy, links use `#14B8A6`. One dark band (the calculator) and the dark footer.
- **Buttons:** one look (`data-buttons="arrow"`): the filled teal primary and a text secondary.
- **Icons:** Lucide interface glyphs in `assets/icons/` (ISC, see `icons-credits.json`), inline.

## Page (index.html), content-height sections

1. Hero: text and Acropolis photograph in separate columns, followed by three compact facts. The image
   stacks below the text on tablets and phones. Photograph from Philopappos Hill by A.Savin, Wikipedia,
   via Wikimedia Commons, CC BY-SA 3.0, credited on `credits.html`.
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
9. Contact: stacked phone, email, address and hours beside a bordered enquiry form with an introductory
   heading and clear focus states (Turnstile + Brevo, unchanged API).
10. Footer: one closing call, link columns, legal row.

The main action reads "Επικοινωνία" in the nav, the hero, the footer and the phone action bar. The
phone bar also carries "Καλέστε".

## Header branding and navigation

The header presents the logo icon and TAX14 left to right, vertically centred, without a tagline.
The home menu contains «Υπηρεσίες», «Ο Πέτρος», «Σύγκριση», «Συχνές Ερωτήσεις» and
«Οικονομικές καταστάσεις» (immediately after FAQ), plus «Επικοινωνία».
The same financial archive link and branding appear on the inner pages and in the mobile menu.
The menu sheet is used below 1200px; on phones the contact action is inside the menu.
`js/navigation.js` adds active section states, focus containment while the menu is open, and an inert
page background. Escape and link selection close the menu through the unchanged kit runtime.

Main sections use 96px vertical padding on desktop and 64px on phones. This preserves the owner's
content-height layout and alternating white/slate sections. Split grids collapse below 1024px; the
comparison becomes labelled two-column cards, and the form fields stack on phones.

## Language readiness

`<html lang="el">`, `hreflang` el and x-default in the head, and a commented EN slot in the nav actions.
No string is baked into CSS; form option values stay the Greek values the server expects.

## Inner pages

`privacy.html`, `terms.html`, `cookies.html`, `credits.html` and `financial-statements.html` use the
same kit with a slim footer. The legal texts used to be modals on the home page; the cookie banner is
gone because the site sets no analytics or marketing cookies.
