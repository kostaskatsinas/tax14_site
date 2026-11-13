# TAX14 — Προδιαγραφές της τρέχουσας υλοποίησης

Τελευταίος έλεγχος τεκμηρίωσης: **2026-11-11**, με βάση τον κώδικα έως το
`7c0d19e`. Το έγγραφο περιγράφει την υπάρχουσα υλοποίηση και αντικαθιστά
παλαιότερα wireframes και προτάσεις copywriting.

## Κατάσταση και στοιχεία γραφείου

| Στοιχείο | Τρέχουσα τιμή |
| --- | --- |
| Ιστότοπος | [tax14.gr](https://tax14.gr/) |
| Repository | [kostaskatsinas/tax14_site](https://github.com/kostaskatsinas/tax14_site) |
| Κλάδος δημοσίευσης | `main` |
| Γλώσσες | Ελληνικά στο `/`, αγγλικά στο `/en/` |
| Σύμβουλος | Πέτρος, με 20 χρόνια εμπειρίας |
| Διεύθυνση | Αχαιών 20, 11852 Άνω Πετράλωνα, Αθήνα |
| Τηλέφωνο | [210 202 4225](tel:+302102024225) |
| Δημόσιο email, παραλήπτης και Brevo sender | [petros.thanasos@gmail.com](mailto:petros.thanasos@gmail.com) |
| Ωράριο | Δευτέρα–Παρασκευή, 09:00–18:00 |
| Αρ. Γ.Ε.ΜΗ. | 143286501000 |
| Πτυχίο | Στατιστική και Ασφαλιστική Επιστήμη, Πανεπιστήμιο Πειραιώς |
| Μεταπτυχιακό | Εφαρμοσμένη Λογιστική, Ελεγκτική και Φορολογία, ΠΑΔΑ |

Η κανονική αποστολή αιτημάτων χρησιμοποιεί Brevo και Cloudflare Turnstile.
Δεν υπάρχει δοκιμαστική ένδειξη ή πρόθεμα `[ΔΟΚΙΜΗ]`. Το δημόσιο email είναι
ίδιο στα links, στα νομικά κείμενα και στα δομημένα δεδομένα και των δύο γλωσσών.

## Πρόσφατες αλλαγές

| Commit | Αλλαγή |
| --- | --- |
| — | Φωτογραφία του εσωτερικού του γραφείου στη hero (WebP 640/960/1086px), ονοματεπώνυμο «Πέτρος Θανασός» και Person στα structured data |
| `85354f6` | Φωτογραφία Ακρόπολης HD από Wikimedia Commons, WebP 960–3840px και ενημέρωση credits |
| `0c45d54` | Βελτίωση split hero, υπηρεσιών, προσομοιωτή, φόρμας και responsive πλοήγησης |
| `bee1561` | Έξι αγγλικές σελίδες, σημαίες EL/EN, τοπικοποίηση φόρμας/CAPTCHA/προσομοιωτή και έλεγχοι γλωσσών |
| `c0edc55` | Αλλαγή δημόσιου email και μοναδικού παραλήπτη σε `petros.thanasos@gmail.com` |
| `5d410e2` | Χρήση του νέου επαληθευμένου Brevo sender και έλεγχοι αγνόησης παλιών sender settings |
| `7c0d19e` | Στόχευση αρχικής στα Πετράλωνα: title, H1, εισαγωγή, description και sharing metadata και στις δύο γλώσσες |

Ο σύνδεσμος της διεύθυνσης οδηγεί πλέον στο Google Maps. Η αλλαγή υπάρχει στο
ελληνικό source και στην παραγόμενη αγγλική αρχική. Η τελευταία δημοσίευση κώδικα
`7c0d19e` ολοκληρώθηκε με το
[workflow 43009243467](https://github.com/kostaskatsinas/tax14_site/actions/runs/43009243467),
και οι δύο live αρχικές επαληθεύτηκαν μετά το upload.

## Τεχνική δομή

Στατικό HTML/CSS/JavaScript με PHP 8.1+ και cURL για τη φόρμα. Δεν υπάρχει
framework, βάση δεδομένων ή Node.js server. Η Python παράγει τις αγγλικές
σελίδες και το ετήσιο αρχείο τοπικά· το Node.js χρησιμοποιείται για ελέγχους.
Στο Hostinger επιβεβαιώθηκαν PHP 8.3 και cURL στις 2026-11-10.

| Αρχείο / φάκελος | Ρόλος |
| --- | --- |
| [index.html](index.html) | Ελληνική αρχική: υπηρεσίες, σύμβουλος, σύγκριση, FAQ και φόρμα |
| [en/](en/) | Έξι παραγόμενες αγγλικές σελίδες |
| [financial-statements.html](financial-statements.html) | Στατικό ετήσιο αρχείο PDF |
| [privacy.html](privacy.html), [terms.html](terms.html), [cookies.html](cookies.html), [credits.html](credits.html) | Αυτοτελείς νομικές σελίδες και πηγές εικόνας |
| [assets/kit/](assets/kit/) | Κοινό runtime layout/UI/motion, χωρίς τοπικές αλλαγές στα αρχεία του kit |
| [css/site.css](css/site.css), [css/fonts.css](css/fonts.css) | Styles του site και self-hosted Manrope |
| [css/financial-statements.css](css/financial-statements.css) | Layout αρχείου οικονομικών καταστάσεων |
| [js/head.js](js/head.js) | Έγκαιρη ενεργοποίηση δυνατοτήτων JavaScript |
| [js/main.js](js/main.js) | Προσομοιωτής, φόρμα και προεπιλογή υπηρεσίας |
| [js/navigation.js](js/navigation.js) | Active sections, focus mobile menu και διατήρηση hash κατά την αλλαγή γλώσσας |
| [js/i18n.mjs](js/i18n.mjs) | Μηνύματα runtime και μορφοποίηση αριθμών EL/EN |
| [js/contact-delivery.mjs](js/contact-delivery.mjs), [js/contact-captcha.mjs](js/contact-captcha.mjs) | JSON αποστολή και lifecycle Turnstile |
| [api/contact.php](api/contact.php) | POST endpoint JSON, όριο 20 KB |
| [api/contact-service.php](api/contact-service.php) | CAPTCHA verification και αποστολή μέσω Brevo |
| [api/contact-settings.php](api/contact-settings.php) | Σταθερές δημόσιες ταυτότητες email και ανάγνωση ιδιωτικών credentials |
| [api/contact-config.php](api/contact-config.php) | Δημόσια ετοιμότητα και δημόσιο CAPTCHA site key |
| [api/contact-validation.php](api/contact-validation.php), [api/contact-rate-limit.php](api/contact-rate-limit.php) | Επικύρωση και περιορισμός αιτημάτων |
| [assets/](assets/) | Φωτογραφίες, flags, icons, fonts, OG εικόνα και PDF |
| [scripts/build-english.py](scripts/build-english.py) | Παραγωγή αγγλικών HTML από ελληνικά και dictionary |
| [scripts/update-financial-statements.py](scripts/update-financial-statements.py) | Αναδημιουργία ετήσιου αρχείου και αγγλικών σελίδων |
| [tests/](tests/) | Έλεγχοι PHP, Python και JavaScript χωρίς πραγματική αποστολή email |

## Περιεχόμενο και πλοήγηση

Το sticky header έχει logo και TAX14, «Υπηρεσίες» (`#services`), «Ο Πέτρος»
(`#petros`), «Σύγκριση» (`#compare`), «Συχνές Ερωτήσεις» (`#faq`),
«Οικονομικές καταστάσεις» και CTA «Επικοινωνία» (`#contact`). Κάτω από 1360px
χρησιμοποιείται menu sheet. Οι σημαίες Ελλάδας/Ηνωμένου Βασιλείου με EL/EN
παραμένουν επάνω δεξιά, έξω από το menu. Αλλάζουν στην αντίστοιχη σελίδα και,
με JavaScript, διατηρούν το section hash. Δεν γίνεται αυτόματο redirect γλώσσας.

1. **Hero:** «Λογιστικό γραφείο στα Πετράλωνα», εισαγωγή με Αχαιών 20 και βασικές
   υπηρεσίες, «Επικοινωνία», τηλεφωνικό link και δωρεάν πρώτη συζήτηση. Η φωτογραφία του
   γραφείου εμφανίζεται δεξιά σε desktop και κάτω από το κείμενο σε tablet/κινητό.
   Ακολουθούν εμπειρία, άδεια και online εξυπηρέτηση.
2. **Υπηρεσίες (`#services`):** δύο ομάδες επιχειρήσεων/ιδιωτών με clickable
   σειρές που οδηγούν στη φόρμα και προεπιλέγουν θέμα. Δεν υπάρχουν φίλτρα ή tabs.
3. **Σύμβουλος (`#petros`):** κείμενο για τον Πέτρο Θανασό (ονοματεπώνυμο στον τίτλο και
   στην πρώτη πρόταση) και κάρτα άδειας, σπουδών και πλατφορμών, χωρίς portrait.
4. **Πρώτη συζήτηση (`#first-call`):** δωρεάν συζήτηση, γραπτή προσφορά και
   word-highlight scroll effect.
5. **Διαδικασία (`#process`):** τέσσερα βήματα συνεργασίας, χωρίς φωτογραφία.
6. **Σύγκριση (`#compare`):** πίνακας Ατομικής, ΟΕ/ΕΕ, ΙΚΕ και ΑΕ που
   μετατρέπεται σε κάρτες ανά γραμμή στα κινητά.
7. **Προσομοιωτής (`#calculator`):** συγχρονισμένα slider/αριθμητικό πεδίο
   15.000–150.000 €, ενδεικτική σύγκριση κύριου φόρου Ατομικής/ΙΚΕ.
   Δεν υπολογίζει συνολικό κόστος επιχείρησης ή φόρο μερισμάτων.
8. **FAQ (`#faq`):** πέντε απαντήσεις πάντα ορατές, όχι accordion.
9. **Επικοινωνία (`#contact`):** στοιχεία γραφείου πρώτα και φόρμα δίπλα σε
   desktop, κάτω από αυτά σε μικρές οθόνες. Η διεύθυνση ανοίγει Google Maps,
   χωρίς ενσωματωμένο χάρτη.
10. **Footer:** CTA, υπηρεσίες/γραφείο/επικοινωνία, οικονομικές καταστάσεις,
    links προς αυτοτελή νομικά κείμενα και πηγές φωτογραφίας.

## Συμβόλαιο φόρμας

| Περίπτωση | Απαραίτητα στοιχεία |
| --- | --- |
| Επιχείρηση | Όνομα/επωνυμία και υπηρεσία ενδιαφέροντος |
| Ιδιώτης | Ονοματεπώνυμο και θέμα ενδιαφέροντος |
| Τηλεφωνική επικοινωνία | Τηλέφωνο 10–15 ψηφίων |
| Επικοινωνία με email | Έγκυρη διεύθυνση email |
| Κάθε αίτημα | Συγκατάθεση και έγκυρο Turnstile token |

Μόνο το επιλεγμένο κανάλι επικοινωνίας είναι απαραίτητο. Νομική μορφή,
δραστηριότητα, προσωπικό, προφίλ ιδιώτη και μήνυμα είναι προαιρετικά μέσα στο
«Προσθέστε λεπτομέρειες». Και οι δύο γλώσσες κρατούν ίδια field names, IDs και
ελληνικά API enum values. Τα ορατά labels και μηνύματα μεταφράζονται.

Ροή: browser → `/api/contact.php` → Cloudflare Siteverify → Brevo.
Όριο 5 αιτημάτων ανά IP ανά 10 λεπτά, με HTTP 429 και `Retry-After`.
Ο server ορίζει sender `TAX14 Website <petros.thanasos@gmail.com>`, μοναδικό
παραλήπτη `petros.thanasos@gmail.com`, θέμα `TAX14 — Νέο αίτημα: <name>` και
tags `tax14`, `contact`. Reply-To προστίθεται μόνο για επικοινωνία με email.
Δεν υπάρχουν CC, αυτόματες απαντήσεις ή marketing email.

Ο sender επαληθεύτηκε στο Brevo στις 2026-11-11. Παλιές private/env τιμές sender
αγνοούνται· API key και CAPTCHA secrets παραμένουν εκτός public root και Git.
Το CAPTCHA ελέγχεται για επιτυχία, hostname και action `tax14_contact`.
Σε αποτυχία διατηρούνται τα στοιχεία. HTTP 202 σημαίνει αποδοχή από την Brevo,
όχι επιβεβαιωμένη παραλαβή στο inbox. Δεν έγινε νέα αποστολή ελέγχου στη νέα
διεύθυνση. Ρυθμίσεις: [BREVO_SETUP.md](BREVO_SETUP.md).

## Οικονομικές καταστάσεις και γλώσσες

Έξι πρωτότυπα PDF 2020–2025, από το νεότερο προς το παλαιότερο, με προβολή
σε νέα καρτέλα, λήψη και μέγεθος. Ελληνικό και αγγλικό archive παραπέμπουν στα
ίδια ελληνικά PDF. Η πρόσβαση στα PDF λειτουργεί χωρίς JavaScript· τα scripts
της σελίδας εξυπηρετούν πλοήγηση και motion.
Οδηγίες: [FINANCIAL_STATEMENTS.md](FINANCIAL_STATEMENTS.md).

Τα έξι ζεύγη HTML είναι αρχική, οικονομικές καταστάσεις, απόρρητο, όροι,
cookies και credits. Μετά από αλλαγή του ελληνικού source ενημερώνεται το
[dictionary](design-system/translations/en.json) και εκτελείται
`python3 scripts/build-english.py`. Οδηγίες:
[translations/README.md](design-system/translations/README.md).

## Οπτική κατεύθυνση και προσβασιμότητα

Self-hosted Manrope (Greek/Latin/Latin Extended, OFL), navy/teal/λευκές επιφάνειες,
εναλλαγές λευκού/slate, σκούρος προσομοιωτής και footer. Οι ενότητες έχουν ύψος
ανάλογο του περιεχομένου. Η hero φωτογραφία είναι πραγματική λήψη του εσωτερικού
του γραφείου, που έδωσε ο ιδιοκτήτης· δεν δημιουργήθηκε με AI. Οι παλιές
φωτογραφίες Ακρόπολης/Φιλοπάππου αφαιρέθηκαν από τα assets. Αναφορές:
[design-system/TAX14.md](design-system/TAX14.md) και
[design-system/IMAGE-PROMPTS.md](design-system/IMAGE-PROMPTS.md).

Υπάρχουν skip link, focus styles, keyboard radios, inline errors/error summary,
menu focus containment και inert background, Escape dismissal,
`prefers-reduced-motion` και language links τουλάχιστον 44 × 44px.
Αυτά περιγράφουν τον κώδικα, δεν πιστοποιούν πλήρη συμμόρφωση.

## SEO και cookies

Η αρχική στοχεύει στο «Λογιστικό γραφείο στα Πετράλωνα», με ακριβή τοποθεσία
Άνω Πετράλωνα στην εισαγωγή, διεύθυνση και business schema.

| Πεδίο | Ελληνικά | Αγγλικά |
| --- | --- | --- |
| Title, OG/Twitter title | Λογιστικό Γραφείο στα Πετράλωνα \| TAX14 | Accounting office in Petralona, Athens \| TAX14 |
| H1 | Λογιστικό γραφείο στα Πετράλωνα | Accounting office in Petralona |

Η ελληνική description είναι «Λογιστικό γραφείο στα Πετράλωνα με 20 χρόνια
εμπειρίας. Βιβλία, myDATA, μισθοδοσία και φορολογικές δηλώσεις. Αχαιών 20 — δωρεάν
πρώτη συζήτηση.». Οι descriptions αναζήτησης/OG/Twitter συμφωνούν ανά γλώσσα.

Και οι 12 σελίδες έχουν localized metadata, canonical και αμοιβαία
`hreflang="el"`, `en`, `x-default`. Η αρχική περιλαμβάνει AccountingService /
LocalBusiness (με αριθμό Γ.Ε.ΜΗ., ContactPoint, γλώσσες, συντεταγμένες και σύνδεσμο Google Maps), WebSite και FAQPage JSON-LD. Το [sitemap.xml](sitemap.xml) καταγράφει
12 URLs με language alternates και `lastmod` 2026-11-11. Το
[robots.txt](robots.txt) παραπέμπει στο sitemap και εξαιρεί το `/api/`. Τα `lastmod` συντηρούνται
χειροκίνητα. Η κοινή OG εικόνα είναι `assets/og-image.png` (1200 × 630), με
source [design-system/og-image-source.html](design-system/og-image-source.html).

Δεν υπάρχει cookie banner, language cookie, analytics ή marketing tracker.
Η ξεχωριστή σελίδα cookies περιγράφει τα αναγκαία στοιχεία της υπηρεσίας
Turnstile. Τα νομικά κείμενα περιλαμβάνουν Brevo και Cloudflare.

### Εκκρεμότητες από τον έλεγχο SEO της 2026-11-11

- Το `www.tax14.gr` παρουσίασε πρόβλημα κάλυψης TLS· απαιτεί νέο έλεγχο και
  επίλυση SSL/CDN πριν θεωρηθεί ολοκληρωμένο. Η [.htaccess](.htaccess) πλέον
  ανακατευθύνει μόνιμα το `www` στο `https://tax14.gr`, αλλά αυτό λειτουργεί μόνο
  αφού το πιστοποιητικό καλύψει και το `www`.
- Τα `/index.html` και `/en/index.html` ανακατευθύνονται με 301 στο `/` και `/en/`,
  και οι εσωτερικοί σύνδεσμοι δείχνουν απευθείας στο canonical URL (`./`).
- Η φορολογική κλίμακα/έτος του προσομοιωτή χρειάζεται επαγγελματικό έλεγχο.
  Οι πρόσφατες αλλαγές αφορούσαν εμφάνιση/μετάφραση, όχι φορολογική επικαιροποίηση.
- Πρόσθετες σελίδες υπηρεσιών, Google Business Profile και Search Console
  παραμένουν προτάσεις, όχι υλοποιημένες αλλαγές αυτού του κύκλου.

## Έλεγχοι και δημοσίευση

Το GitHub Actions τρέχει PHP tests, `python3 tests/languages.py` και
`node --test tests/*.mjs` πριν το FTPS upload του `main` στο Hostinger.
Setup docs, tests, scripts, design-system και private configuration εξαιρούνται.
Οδηγίες: [HOSTINGER_DEPLOY.md](HOSTINGER_DEPLOY.md).

Για το `7c0d19e` πέρασαν οι έλεγχοι CI και deployment. Ελέγχθηκαν οπτικά οι
δύο αρχικές σε 1440px/390px και επαληθεύτηκε ότι τα live HTML συμφωνούν με τον
κώδικα. Αυτό δεν αποτελεί νέο inbox test ή νέα μέτρηση PageSpeed/ranking.
Η παρούσα ενημέρωση συγχρονίζει τα οκτώ Markdown αρχεία με αυτές τις αλλαγές.
Ελέγχθηκαν οι 92 τοπικοί σύνδεσμοι τεκμηρίωσης και τα επτά αναφερόμενα commits,
πέρασαν οι πέντε έλεγχοι του `tests/languages.py` και το `git diff --check`.
Όλα τα Markdown παραμένουν καλυμμένα από τα υπάρχοντα exclusions του deployment.
