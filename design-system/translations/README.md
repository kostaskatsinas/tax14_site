# Greek and English pages

Last checked against source: **2026-11-11**, through `7c0d19e`. Bilingual support
was introduced in `bee1561`.

Greek is the source language at `/`. The six English pages live at `/en/` and
use the same assets, CSS, JavaScript and contact API. The flag links work without
JavaScript; navigation.js also preserves section hashes. There is no automatic
redirect, language cookie or browser-language override.

| Greek source | Generated English page |
| --- | --- |
| [index.html](../../index.html) | [en/index.html](../../en/index.html) |
| [financial-statements.html](../../financial-statements.html) | [en/financial-statements.html](../../en/financial-statements.html) |
| [privacy.html](../../privacy.html) | [en/privacy.html](../../en/privacy.html) |
| [terms.html](../../terms.html) | [en/terms.html](../../en/terms.html) |
| [cookies.html](../../cookies.html) | [en/cookies.html](../../en/cookies.html) |
| [credits.html](../../credits.html) | [en/credits.html](../../en/credits.html) |

After changing Greek HTML, update the corresponding text in `en.json`, then run:

```sh
python3 scripts/build-english.py
python3 scripts/build-english.py --check
python3 tests/languages.py
node --test tests/*.mjs
```

Commit both the source and generated pages. The builder rejects missing Greek
translations. CI checks that the English files are current, links resolve, SEO
language pairs match, and form values remain identical in both languages.

Runtime messages and number formatting live in `js/i18n.mjs`. Keep option values,
IDs and `data-prefill-*` values unchanged: the contact API uses the existing Greek
values even when visitors see English labels. Both languages call `/api/` at the
site root. English server errors are translated on the client.

`scripts/update-financial-statements.py` rebuilds the Greek archive and then the
English pages. New archive years and PDF sizes are translated automatically.
Original financial PDFs remain in Greek; the English archive says so explicitly.
Update both sitemap entries when changing an archive or other page. Each page
has its own canonical URL and reciprocal el/en/x-default alternates.

The language selector sits outside the collapsible menu. The shared header uses
the menu below 1360px so the Greek navigation and both 44px flag links fit.
The active language has `aria-current="page"`; native language names label the
links, with Greek/UK flags and EL/EN text. Localized accessible names and alt text
are generated with the page copy. No external translation service is called.

## Latest synchronized copy

Commit `c0edc55` updated the public email on all 12 pages to
`petros.thanasos@gmail.com`, including legal text and business structured data.
The verified Brevo sender was switched in `5d410e2`. Neither change alters the
form's shared field names or Greek enum values. Runtime form messages, Turnstile
language, calculator currency/rates and navigation labels follow the HTML language;
server notification email subjects/body labels remain Greek.

Commit `7c0d19e` updated both homepages:

| Field | Greek | English |
| --- | --- | --- |
| Page / OG / Twitter title | Λογιστικό Γραφείο στα Πετράλωνα \| TAX14 | Accounting office in Petralona, Athens \| TAX14 |
| H1 | Λογιστικό γραφείο στα Πετράλωνα | Accounting office in Petralona |
| Opening text | Αχαιών 20, Άνω Πετράλωνα and core services | 20 Achaion Street, Ano Petralona and the same services |

Meta/OG/Twitter descriptions match within each language. Update the exact Greek
keys and reviewed English values in [en.json](en.json) whenever this copy changes;
do not patch generated English HTML directly. Both homepages retain the Acropolis
photo and Google Maps office link. The six PDF documents remain untranslated.

The SEO copy passed desktop/mobile visual checks at 1440px/390px in both languages
and was verified live after deployment. Full source/deployment history and pending
SEO work are in [SPECS.md](../../SPECS.md) and
[HOSTINGER_DEPLOY.md](../../HOSTINGER_DEPLOY.md).
