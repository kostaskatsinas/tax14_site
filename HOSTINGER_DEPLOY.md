# Οδηγός Φιλοξενίας στο Hostinger (Web Hosting Unlimited)

Η ιστοσελίδα **TAX14 — Λογιστική & Φοροτεχνική Συμβουλευτική** έχει κατασκευαστεί ειδικά ώστε να λειτουργεί με μέγιστη ταχύτητα (100/100 PageSpeed) στον **LiteSpeed Web Server** του πακέτου **Hostinger Web Hosting Unlimited**, χωρίς να απαιτείται καμία περίπλοκη εγκατάσταση Node.js ή βάσης δεδομένων.

---

## 1. Δομή Αρχείων προς Ανέβασμα στο `public_html`

Ανεβάστε όλα τα αρχεία του φακέλου του έργου (`tax14`) απευθείας μέσα στον φάκελο **`public_html/`** του domain σας στο **Hostinger hPanel -> Files -> File Manager**:

```text
public_html/
├── index.html          # Κύρια ιστοσελίδα (Πλήρες Ελληνικό Copy, SEO, JSON-LD)
├── .htaccess           # Ρυθμίσεις LiteSpeed (HTTPS redirect, Gzip, Caching, UTF-8)
├── sitemap.xml         # Χάρτης ιστοτόπου για Google Search Console
├── robots.txt          # Οδηγίες ευρετηρίασης μηχανών αναζήτησης
├── assets/
│   └── favicon.svg     # Εταιρικό έμβλημα / Vector Favicon
├── css/
│   └── styles.css      # Art-Directed Design System (Responsive Desktop/Mobile)
├── js/
│   └── main.js         # Δυναμική Φόρμα B2B/B2C, Υπολογιστής Φόρου, FAQ, Modals
└── api/
    └── contact.php     # PHP 8.1+ / cURL — CAPTCHA και αποστολή μέσω Brevo
```

---

## 2. Βήμα-Βήμα Ανέβασμα στο Hostinger (σε 3 Λεπτά)

1. Συνδεθείτε στο **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Μεταβείτε στην ενότητα **Websites** και πατήστε **Manage** δίπλα στο domain σας.
3. Από το αριστερό μενού επιλέξτε **Files -> File Manager**.
4. Ανοίξτε τον φάκελο **`public_html`** (διαγράψτε τυχόν προεγκατεστημένο `default.php`).
5. Σύρετε (Drag & Drop) τα αρχεία και τους φακέλους (`index.html`, `financial-statements.html`, `.htaccess`, `sitemap.xml`, `robots.txt`, `assets`, `css`, `js`, `api`) μέσα στο `public_html`. Ο φάκελος `assets/financial-statements/` περιέχει τα PDF του ετήσιου αρχείου. Για προσθήκη νέου έτους δείτε το `FINANCIAL_STATEMENTS.md`.
6. **Ρύθμιση Email Φόρμας:**
   - Η νέα υλοποίηση χρησιμοποιεί Brevo και Cloudflare Turnstile, με σταθερό παραλήπτη `katsinas1986@gmail.com` στον server.
   - Χρειάζεται ιδιωτικό αρχείο `tax14-contact-config.php` **πάνω από** το `public_html`, με τα κλειδιά και τον επαληθευμένο αποστολέα. Δεν ανεβαίνει στο Git και δεν μπαίνει μέσα στον δημόσιο φάκελο. Αναλυτικά βήματα στο `BREVO_SETUP.md`.
7. **Ενεργοποίηση SSL (HTTPS):**
   - Στο hPanel -> **Security -> SSL**, βεβαιωθείτε ότι το δωρεάν Lifetime SSL είναι **Active**. Το αρχείο `.htaccess` θα ανακατευθύνει αυτόματα όλους τους επισκέπτες σε ασφαλές `https://`.
