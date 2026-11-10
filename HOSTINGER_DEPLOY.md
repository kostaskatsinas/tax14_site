# Δημοσίευση TAX14 στο Hostinger

Τελευταίος έλεγχος: **2026-11-10**. Η παραγωγή είναι στο
[https://tax14.gr/](https://tax14.gr/), σε Business Web Hosting. Το έργο είναι
HTML/CSS/JavaScript με PHP για τη φόρμα· δεν χρειάζεται build, Node.js server ή
βάση δεδομένων. Απαιτούνται PHP 8.1+ και cURL. Στον live server επιβεβαιώθηκαν
PHP 8.3 και cURL στις 2026-11-10. Δεν έχει τεκμηριωθεί βαθμολογία PageSpeed 100/100.

## Τρέχων στόχος

- Repository: [kostaskatsinas/tax14_site](https://github.com/kostaskatsinas/tax14_site).
- Κλάδος: `main`.
- Hostinger username: `u635942677`.
- Public root: `/home/u635942677/domains/tax14.gr/public_html`.
- Τοπικά στοιχεία σύνδεσης στόχου: [.hostinger/site.json](.hostinger/site.json).
- Ρυθμίσεις email: [BREVO_SETUP.md](BREVO_SETUP.md).
- Παραλήπτης και δημόσιο email: `katsinas1986@gmail.com`, σε κανονική λειτουργία.

## Κανονική δημοσίευση μέσω GitHub Actions

Το [.github/workflows/deploy.yml](.github/workflows/deploy.yml) εκτελείται σε push
στο `main`, σε pull request ή με `workflow_dispatch`. Το job `test` τρέχει πρώτα
όλα τα `tests/*.php` και `node --test tests/*.mjs`· το job `deploy` ξεκινά μόνο αν
περάσουν και μόνο για το `main` (όχι για pull requests). Χρησιμοποιεί
`SamKirkland/FTP-Deploy-Action@v4.3.5` με τα υπάρχοντα repository secrets
`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Η ρύθμιση είναι FTPS (FTP over TLS),
port 21, `security: loose`, με `server-dir: ./` στον ήδη ρυθμισμένο FTP λογαριασμό.
Αν ο server αρνηθεί TLS, το deploy αποτυγχάνει χωρίς να αλλάξει το live site·
τότε ελέγξτε τη ρύθμιση FTPS στο hPanel πριν επιστρέψετε σε `protocol: ftp`.

1. Ελέγξτε το diff και εκτελέστε τους σχετικούς ελέγχους.
2. Κάντε commit και push στο `main`.
3. Περιμένετε ολοκλήρωση του workflow και ελέγξτε το πραγματικό live περιεχόμενο.
4. Για αλλαγές JavaScript/CSS, αλλάξτε το query version όπου φορτώνεται το
   αλλαγμένο asset και τα imports που το χρειάζονται. Η τρέχουσα έκδοση κοινών
   assets είναι `contact2`, ενώ το archive CSS είναι `v=1`.

Τα exclusions κρατούν εκτός upload: `.git*`, `.github`, `.hostinger`, τα πέντε
κύρια Markdown έγγραφα, `config/`, `tests/`, `scripts/`, `design-system/`,
`.env*`, `tax14-contact-config.php` και `tax14_site.zip`. Προσθέστε νέο αρχείο
τεκμηρίωσης στα exclusions αν δημιουργηθεί εκτός αυτών των φακέλων. Τα exclusions
δεν αποτελούν εγγύηση ότι παλιό αντίγραφο αρχείου διαγράφηκε από τον server.

Για να αλλάξει το ίδιο το workflow χρειάζεται GitHub authorization με
`workflow` scope. Η τρέχουσα εξουσιοδότηση εγκρίθηκε στις 2026-11-10.

## Δημόσια και ιδιωτικά αρχεία

```text
/home/u635942677/domains/tax14.gr/
├── tax14-contact-config.php  # ιδιωτικό, permissions 600, εκτός Git
└── public_html/
    ├── index.html
    ├── financial-statements.html
    ├── .htaccess
    ├── sitemap.xml
    ├── robots.txt
    ├── assets/              # SVG, WebP και financial-statements/*.pdf
    ├── css/                 # styles.css, financial-statements.css
    ├── js/                  # main.js, contact-delivery.mjs, contact-captcha.mjs
    └── api/                 # contact.php, contact-config.php, contact-service.php,
                             # contact-settings.php, contact-validation.php
```

Το workflow δεν ανεβάζει ούτε τροποποιεί το ιδιωτικό configuration. Ο server
διαβάζει από αυτό Brevo/Turnstile keys, sender, hostnames και IP family.
Μην το βάλετε στο `public_html`, στα source files ή σε commit. Το template είναι
[config/contact.example.php](config/contact.example.php).

Το production configuration δέχεται `tax14.gr` και `www.tax14.gr`. Η Brevo
χρησιμοποιεί IPv4, με outgoing IP `82.198.229.189` που μετρήθηκε και εγκρίθηκε
στις 2026-11-10. Η IP του DNS/CDN δεν αποδεικνύει το outgoing IP. Σε αλλαγή hosting
ελέγξτε ξανά την πραγματική έξοδο και την allowlist της Brevo. Δεν υπάρχει πλέον
προσωρινό diagnostic endpoint στο site.

## Χειροκίνητη δημοσίευση, όταν χρειάζεται

Στο hPanel ανοίξτε το συγκεκριμένο `tax14.gr`, μετά Files → File Manager.
Μεταφέρετε στο `public_html` μόνο τα δημόσια αρχεία του παραπάνω δέντρου,
διατηρώντας την ίδια δομή. Μην ανεβάζετε ολόκληρο τον φάκελο του repository,
αρχεία credentials ή ZIP με ιδιωτικά δεδομένα. Μην διαγράφετε υπάρχοντα αρχεία
ή reset ρυθμίσεων ως μέρος μιας συνηθισμένης ενημέρωσης.

Για το ιδιωτικό αρχείο, ο website-specific File Manager εμφανίζει τον γονικό
φάκελο που περιέχει το `public_html`. Η τελική θέση και τα permissions πρέπει
να συμφωνούν με το παραπάνω δέντρο. Η ενεργή Hostinger MCP σύνδεση επιτρέπει
έλεγχο του site· το upload operation της περιορίζεται στο public root, οπότε
δεν χρησιμοποιείται για το ιδιωτικό αρχείο.

## Έλεγχος μετά τη δημοσίευση

- Οι δύο HTML σελίδες φορτώνουν με HTTPS και τα αναμενόμενα στοιχεία TAX14.
- Όλα τα δημόσια `mailto:` links είναι `mailto:katsinas1986@gmail.com`.
- Δεν υπάρχει δοκιμαστική ένδειξη στη φόρμα.
- `GET /api/contact-config.php` επιστρέφει `ready: true` και το δημόσιο site key.
- `GET /api/contact.php` απορρίπτεται με HTTP 405· απαιτεί POST JSON.
- Το Turnstile φορτώνει και επαληθεύεται στον server πριν από την Brevo.
- Τα PDF 2020–2025 ανοίγουν και έχουν σύνδεσμο λήψης.
- Η δημόσια διεύθυνση `/tax14-contact-config.php` επιστρέφει HTTP 404.
- Η κονσόλα του browser δεν δείχνει μηνύματα «Refused to load» (CSP) και η
  γραμματοσειρά φορτώνει από `assets/fonts/`.
- Μετά από 5 αιτήματα φόρμας σε 10 λεπτά από την ίδια IP, το έκτο παίρνει HTTP 429.

Η [.htaccess](.htaccess) περιέχει HTTPS redirect (με εξαίρεση local development),
UTF-8, MIME types για `.mjs` και `.woff2`, security headers (HSTS, Content-Security-Policy
που επιτρέπει μόνο το ίδιο origin και το Cloudflare Turnstile, Permissions-Policy),
compression και static caching,
όταν τα αντίστοιχα modules είναι διαθέσιμα. Τα `sitemap.xml`/`lastmod` χρειάζονται
χειροκίνητη συντήρηση. Για νέο ετήσιο PDF δείτε
[FINANCIAL_STATEMENTS.md](FINANCIAL_STATEMENTS.md).

Η τελευταία λειτουργική αλλαγή είναι το `f818456`, με επιτυχή δημοσίευση
[42806779923](https://github.com/kostaskatsinas/tax14_site/actions/runs/42806779923).
Αυτή είναι καταγραφή ελέγχου στις 2026-11-10, όχι σταθερός αριθμός μελλοντικού HEAD.
