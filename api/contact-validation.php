<?php
declare(strict_types=1);

/** Validate the short enquiry form before preparing or sending any email. */
function validate_contact_request(array $data): string {
    $string = static fn(string $key): string => is_string($data[$key] ?? null) ? trim($data[$key]) : '';
    $segment = $string('client_segment');
    if (!in_array($segment, ['Επιχείρηση (B2B)', 'Ιδιώτης (B2C)'], true)) {
        return 'Επιλέξτε επιχείρηση ή ιδιώτη.';
    }
    $business = $segment === 'Επιχείρηση (B2B)';
    if ($string($business ? 'b2b_company_name' : 'b2c_full_name') === '') {
        return 'Συμπληρώστε το όνομα ή την επωνυμία σας.';
    }
    if ($string($business ? 'b2b_service_topic' : 'b2c_topic') === '') {
        return 'Επιλέξτε την υπηρεσία που σας ενδιαφέρει.';
    }
    if (!in_array($data['gdpr_consent'] ?? null, ['on', '1', 1, true], true)) {
        return 'Χρειάζεται η συγκατάθεσή σας για να επικοινωνήσουμε μαζί σας.';
    }
    $mode = $string('preferred_mode');
    if ($mode === 'Τηλεφωνική Επικοινωνία') {
        $phone = $string('contact_phone');
        $digits = preg_replace('/\D/', '', $phone);
        if (!preg_match('/^\+?[0-9\s().-]+$/', $phone) || strlen($digits) < 10 || strlen($digits) > 15) {
            return 'Συμπληρώστε τηλέφωνο με 10 έως 15 ψηφία.';
        }
    } elseif ($mode === 'Απάντηση μέσω Email') {
        if (!filter_var($string('contact_email'), FILTER_VALIDATE_EMAIL)) {
            return 'Συμπληρώστε έγκυρη διεύθυνση email.';
        }
    } else {
        return 'Επιλέξτε αν θέλετε να επικοινωνήσουμε τηλεφωνικά ή με email.';
    }
    return '';
}
