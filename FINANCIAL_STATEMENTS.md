# Ετήσιες οικονομικές καταστάσεις

Τελευταίος έλεγχος τεκμηρίωσης: **2026-11-11**, έως το `7c0d19e`.

Η [financial-statements.html](financial-statements.html) είναι στατική σελίδα,
με προβολή PDF σε νέα καρτέλα και ξεχωριστή λήψη που λειτουργούν χωρίς
JavaScript. Τα scripts της σελίδας εξυπηρετούν την κοινή πλοήγηση και τα motion
effects. Συνδέεται από το κύριο menu αμέσως μετά τις FAQ, το mobile menu και το
footer της αρχικής. Χρησιμοποιεί Manrope, το κοινό kit και `css/site.css`.
Οι σημαίες EL/EN οδηγούν στα αντίστοιχα archives. Το δημόσιο email και στις δύο
σελίδες είναι `petros.thanasos@gmail.com` από το `c0edc55`.

Εταιρεία: **Π. ΘΑΝΑΣΟΣ ΚΑΙ Α. ΣΤΑΘΟΠΟΥΛΟΥ – ΒΛΑΜΗ Ι.Κ.Ε.**, Γ.Ε.ΜΗ.
**143286501000**. Το ετήσιο αρχείο περιλαμβάνει έξι πρωτότυπα PDF Β5/Β6 για τα
έτη **2020–2025**, ταξινομημένα 2025 → 2020. Τα PDF δεν επεξεργάζονται από τον
generator και πρέπει να διατηρούνται όπως παραδίδονται.

## Υπάρχοντα αρχεία

| Έτος | PDF |
| --- | --- |
| 2025 | [tax14-financial-statements-2025.pdf](assets/financial-statements/tax14-financial-statements-2025.pdf) |
| 2024 | [tax14-financial-statements-2024.pdf](assets/financial-statements/tax14-financial-statements-2024.pdf) |
| 2023 | [tax14-financial-statements-2023.pdf](assets/financial-statements/tax14-financial-statements-2023.pdf) |
| 2022 | [tax14-financial-statements-2022.pdf](assets/financial-statements/tax14-financial-statements-2022.pdf) |
| 2021 | [tax14-financial-statements-2021.pdf](assets/financial-statements/tax14-financial-statements-2021.pdf) |
| 2020 | [tax14-financial-statements-2020.pdf](assets/financial-statements/tax14-financial-statements-2020.pdf) |

## Προσθήκη νέου έτους

1. Αντιγράψτε το νέο PDF στο `assets/financial-statements/` με όνομα
   `tax14-financial-statements-YYYY.pdf`, όπου `YYYY` το έτος της χρήσης.
   Για το επόμενο έτος το όνομα θα είναι `tax14-financial-statements-2026.pdf`.
2. Από τον φάκελο του έργου εκτελέστε:

   ```sh
   python3 scripts/update-financial-statements.py
   ```

3. Ελέγξτε και τις δύο γλώσσες: προβολή/λήψη, νεότερο έτος πρώτο και σωστό
   language link. Εκτελέστε `python3 tests/languages.py` για generation/link/SEO checks.
4. Ενημερώστε το `lastmod` και των δύο archive URLs στο [sitemap.xml](sitemap.xml) και τον
   παραπάνω κατάλογο τεκμηρίωσης. Ο generator δεν τα ενημερώνει αυτόματα.
5. Κάντε commit το νέο PDF και τις δύο ενημερωμένες HTML μαζί με τις αντίστοιχες
   αλλαγές metadata/τεκμηρίωσης και ακολουθήστε το
   [HOSTINGER_DEPLOY.md](HOSTINGER_DEPLOY.md).

## Τι κάνει ο generator

Το [scripts/update-financial-statements.py](scripts/update-financial-statements.py)
χρησιμοποιεί μόνο τη βασική βιβλιοθήκη Python 3. Ελέγχει το ακριβές filename
pattern και την κεφαλίδα `%PDF-`, ταξινομεί τα έτη φθίνοντα, υπολογίζει στρογγυλό
μέγεθος σε KB και αντικαθιστά μόνο το περιεχόμενο ανάμεσα στα
`<!-- STATEMENTS:START -->` / `<!-- STATEMENTS:END -->`.

Απορρίπτει απρόσμενο όνομα PDF, αρχείο χωρίς κεφαλίδα PDF, κατάλογο χωρίς PDF
ή λανθασμένους markers. Δεν ελέγχει τη λογιστική ορθότητα ή όλες τις σελίδες ενός
PDF. Δεν χρειάζεται Python στον server. Το GitHub Actions δεν εκτελεί τον
generator PDF, αλλά ελέγχει ότι τα αγγλικά HTML είναι ενημερωμένα. Οι σελίδες χρησιμοποιούν τα κοινά styles και το
[css/financial-statements.css](css/financial-statements.css).

## English archive

The archive is also available at [en/financial-statements.html](en/financial-statements.html),
introduced in `bee1561`. The update
script regenerates it automatically using `scripts/build-english.py`. PDF files
remain the original Greek documents. Commit both HTML pages and update both
archive URLs in `sitemap.xml`. See [translations/README.md](design-system/translations/README.md).

The latest email, Brevo sender and homepage SEO commits did not add, remove or
modify any financial PDFs. Both archives still publish the same six original
Greek documents for 2020–2025. Canonical and reciprocal el/en/x-default links
are present on both archive pages. The full change record is in [SPECS.md](SPECS.md).
