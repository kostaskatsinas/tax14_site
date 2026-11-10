# Ετήσιες οικονομικές καταστάσεις

Τελευταίος έλεγχος: **2026-11-10**.

Η [financial-statements.html](financial-statements.html) είναι στατική σελίδα,
χωρίς JavaScript, με προβολή PDF σε νέα καρτέλα και ξεχωριστή λήψη. Συνδέεται από
το footer της αρχικής, κάτω από τα διαπιστευτήρια, με έντονα χρυσά γράμματα και
περίγραμμα. Το δημόσιο email της είναι `katsinas1986@gmail.com`.

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

3. Ελέγξτε ότι η προβολή/λήψη δουλεύει και ότι το νέο έτος εμφανίζεται πρώτο.
4. Ενημερώστε το `lastmod` της σελίδας στο [sitemap.xml](sitemap.xml) και τον
   παραπάνω κατάλογο τεκμηρίωσης. Ο generator δεν τα ενημερώνει αυτόματα.
5. Κάντε commit το νέο PDF και την ενημερωμένη HTML μαζί με τις αντίστοιχες
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
PDF. Δεν χρειάζεται Python στον server και το GitHub Actions δεν εκτελεί τον
generator. Οι σελίδες χρησιμοποιούν τα κοινά styles και το
[css/financial-statements.css](css/financial-statements.css).
