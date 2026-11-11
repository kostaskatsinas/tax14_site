# Greek and English pages

Greek is the source language at `/`. The six English pages live at `/en/` and
use the same assets, CSS, JavaScript and contact API. The flag links work without
JavaScript; navigation.js also preserves section hashes. There is no automatic
redirect, language cookie or browser-language override.

After changing Greek HTML, update the corresponding text in `en.json`, then run:

```sh
python3 scripts/build-english.py
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
