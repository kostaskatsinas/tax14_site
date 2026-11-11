# Δημοσίευση TAX14 στο Hostinger

Τελευταίος έλεγχος τεκμηρίωσης: **2026-11-11**, έως το `7c0d19e`. Η παραγωγή είναι στο
[https://tax14.gr/](https://tax14.gr/), σε Business Web Hosting. Το έργο είναι
HTML/CSS/JavaScript με PHP για τη φόρμα. Δεν χρειάζεται framework build, Node.js
server ή βάση δεδομένων. Οι αγγλικές σελίδες παράγονται τοπικά με Python και
γίνονται commit μαζί με τα ελληνικά source. Απαιτούνται PHP 8.1+ και cURL. Στον live server επιβεβαιώθηκαν
PHP 8.3 και cURL στις 2026-11-10. Δεν έχει τεκμηριωθεί βαθμολογία PageSpeed 100/100.

## Τρέχων στόχος

- Repository: [kostaskatsinas/tax14_site](https://github.com/kostaskatsinas/tax14_site).
- Κλάδος: `main`.
- Hostinger username: `u635942677`.
- Public root: `/home/u635942677/domains/tax14.gr/public_html`.
- Τοπικά στοιχεία σύνδεσης στόχου: [.hostinger/site.json](.hostinger/site.json).
- Ρυθμίσεις email: [BREVO_SETUP.md](BREVO_SETUP.md).
- Παραλήπτης και δημόσιο email: `petros.thanasos@gmail.com`, σε κανονική λειτουργία.
- Brevo sender: `TAX14 Website <petros.thanasos@gmail.com>`, επαληθευμένος στις 2026-11-11.
- Έξι ελληνικές σελίδες στο `/` και έξι αγγλικές στο `/en/`.

## Κανονική δημοσίευση μέσω GitHub Actions

Το [.github/workflows/deploy.yml](.github/workflows/deploy.yml) εκτελείται σε push
στο `main`, σε pull request ή με `workflow_dispatch`. Το job `test` τρέχει πρώτα
όλα τα `tests/*.php`, `python3 tests/languages.py` και `node --test tests/*.mjs`.
Το Python test ελέγχει επίσης ότι τα παραγόμενα αγγλικά HTML είναι ενημερωμένα.
Το job `deploy` ξεκινά μόνο αν
περάσουν και μόνο για το `main` (όχι για pull requests). Χρησιμοποιεί
`SamKirkland/FTP-Deploy-Action@v4.3.5` με τα υπάρχοντα repository secrets
`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Η ρύθμιση είναι FTPS (FTP over TLS),
port 21, `security: loose`, με `server-dir: ./` στον ήδη ρυθμισμένο FTP λογαριασμό.
Αν ο server αρνηθεί TLS, το deploy αποτυγχάνει χωρίς να αλλάξει το live site·
τότε ελέγξτε τη ρύθμιση FTPS στο hPanel πριν επιστρέψετε σε `protocol: ftp`.

1. Ελέγξτε το diff. Αν αλλάξατε ελληνικό HTML, ενημερώστε το
   [dictionary](design-system/translations/en.json), εκτελέστε
   `python3 scripts/build-english.py` και τους σχετικούς ελέγχους.
2. Κάντε commit και push στο `main`.
3. Περιμένετε ολοκλήρωση του workflow και ελέγξτε το πραγματικό live περιεχόμενο.
4. Για αλλαγές JavaScript/CSS, αλλάξτε το query version όπου φορτώνεται το
   αλλαγμένο asset και τα imports που το χρειάζονται. Στο τρέχον source,
   `css/site.css`, `js/main.js`, `js/navigation.js` και τα contact-module imports
   χρησιμοποιούν `v=language1`, τα fonts και archive CSS `v=2`, το kit και το
   `js/i18n.mjs` `v=1`. Ελέγχετε τα πραγματικά URLs των αρχείων που αλλάζουν.

Τα exclusions κρατούν εκτός upload: `.git*`, `.github`, `.hostinger`, τα πέντε
κύρια Markdown έγγραφα, `config/`, `tests/`, `scripts/`, `design-system/`,
`.env*`, `tax14-contact-config.php`, `.taste-skill/` και `tax14_site.zip`. Προσθέστε νέο αρχείο
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
    ├── privacy.html, terms.html, cookies.html, credits.html
    ├── en/                  # οι ίδιες έξι σελίδες στα αγγλικά
    ├── .htaccess
    ├── sitemap.xml
    ├── robots.txt
    ├── assets/              # kit/, fonts/, flags/, icons/, img/, OG και PDF
    ├── css/                 # fonts.css, site.css, financial-statements.css
    ├── js/                  # head.js, main.js, navigation.js, i18n.mjs,
    │                        # contact-delivery.mjs, contact-captcha.mjs
    └── api/                 # contact.php, contact-config.php, contact-service.php,
                             # contact-settings.php, contact-validation.php,
                             # contact-rate-limit.php
```

Το workflow δεν ανεβάζει ούτε τροποποιεί το ιδιωτικό configuration. Ο server
διαβάζει από αυτό Brevo/Turnstile keys, hostnames και IP family.
Ο sender και ο παραλήπτης είναι σταθερές δημόσιες ταυτότητες στο
`api/contact-settings.php`. Τα παλιά `sender_email` / `TAX14_BREVO_SENDER_EMAIL`
αγνοούνται από το `5d410e2` και μετά· η αλλαγή email δεν απαιτεί αλλαγή των secrets.
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

- Και οι 12 canonical HTML σελίδες φορτώνουν με HTTPS και τα αναμενόμενα στοιχεία TAX14.
- Οι σημαίες EL/EN οδηγούν στην αντίστοιχη σελίδα και διατηρούν το hash με JavaScript.
- Οι δύο αρχικές περιέχουν τα εγκεκριμένα title/H1/intro για Πετράλωνα· τα
  canonical, hreflang και οι 12 εγγραφές sitemap συμφωνούν.
- Η φωτογραφία Ακρόπολης φορτώνει στα αναμενόμενα μεγέθη και υπάρχουν credits.
- Η διεύθυνση επικοινωνίας οδηγεί σε Google Maps.
- Όλα τα δημόσια `mailto:` links είναι `mailto:petros.thanasos@gmail.com`.
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

## Πρόσφατες δημοσιεύσεις και εκκρεμότητες

| Commit | Περιεχόμενο | Επιτυχές workflow |
| --- | --- | --- |
| `c0edc55` | Νέο δημόσιο email και παραλήπτης και στις 12 σελίδες | [43003366462](https://github.com/kostaskatsinas/tax14_site/actions/runs/43003366462) |
| `5d410e2` | Νέος επαληθευμένος Brevo sender | [43004967884](https://github.com/kostaskatsinas/tax14_site/actions/runs/43004967884) |
| `7c0d19e` | Σαφέστερο homepage SEO, ελληνικά και αγγλικά | [43009243467](https://github.com/kostaskatsinas/tax14_site/actions/runs/43009243467) |

Το `7c0d19e` επαληθεύτηκε μετά το upload συγκρίνοντας τα live HTML των δύο
αρχικών με τα τοπικά αρχεία. Αυτή είναι ιστορική καταγραφή στις 2026-11-11,
όχι σταθερός αριθμός μελλοντικού HEAD. Η πλήρης σύνοψη αλλαγών είναι στο
[SPECS.md](SPECS.md).

Ο έλεγχος SEO της 2026-11-11 κατέγραψε πρόβλημα TLS στο `www.tax14.gr`, ενώ το
canonical `https://tax14.gr/` λειτουργούσε. Η αποδοχή του `www` στις ρυθμίσεις
CAPTCHA δεν επιβεβαιώνει SSL κάλυψη. Επαναλάβετε τον έλεγχο πριν θεωρήσετε το
θέμα λυμένο. Δεν εφαρμόστηκε αλλαγή DNS ή redirect για τα `/index.html` aliases.
Για live έλεγχο αρχείων CSS/JS χρησιμοποιείτε τα versioned URLs της HTML, ώστε
παλιό cache να μην εκληφθεί ως αποτυχία deployment. Αν η τοπική σύνδεση έχει
πρόβλημα IPv6, δοκιμάστε `curl -4` χωρίς απενεργοποίηση ελέγχου TLS.
