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
    └── contact.php     # PHP 8.x Script αποστολής email της φόρμας επικοινωνίας
```

---

## 2. Βήμα-Βήμα Ανέβασμα στο Hostinger (σε 3 Λεπτά)

1. Συνδεθείτε στο **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Μεταβείτε στην ενότητα **Websites** και πατήστε **Manage** δίπλα στο domain σας.
3. Από το αριστερό μενού επιλέξτε **Files -> File Manager**.
4. Ανοίξτε τον φάκελο **`public_html`** (διαγράψτε τυχόν προεγκατεστημένο `default.php`).
5. Σύρετε (Drag & Drop) τα αρχεία και τους φακέλους (`index.html`, `.htaccess`, `sitemap.xml`, `robots.txt`, `assets`, `css`, `js`, `api`) μέσα στο `public_html`.
6. **Ρύθμιση Email Φόρμας:**
   - Ο παραλήπτης στο `public_html/api/contact.php` είναι ήδη ορισμένος σε `$recipientEmail = 'petros.thanasos@gmail.com';`.
   - Μετά το ανέβασμα, ελέγξτε την παραλαβή ενός αιτήματος στο συγκεκριμένο γραμματοκιβώτιο.
7. **Ενεργοποίηση SSL (HTTPS):**
   - Στο hPanel -> **Security -> SSL**, βεβαιωθείτε ότι το δωρεάν Lifetime SSL είναι **Active**. Το αρχείο `.htaccess` θα ανακατευθύνει αυτόματα όλους τους επισκέπτες σε ασφαλές `https://`.
