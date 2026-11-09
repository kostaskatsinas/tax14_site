<?php
declare(strict_types=1);

require_once __DIR__ . '/../api/contact-validation.php';

// Run with: php tests/contact-validation.php. These cases never send mail.
$business = [
    'client_segment' => 'Επιχείρηση (B2B)',
    'b2b_company_name' => 'Test business',
    'b2b_service_topic' => 'Στρατηγικός Φορολογικός Σχεδιασμός',
    'preferred_mode' => 'Τηλεφωνική Επικοινωνία',
    'contact_phone' => '+30 691 234 5678',
    'gdpr_consent' => 'on',
];
$individual = [
    'client_segment' => 'Ιδιώτης (B2C)',
    'b2c_full_name' => 'Test individual',
    'b2c_topic' => 'Φορολογική Δήλωση Εισοδήματος (Ε1 / Ε2)',
    'preferred_mode' => 'Απάντηση μέσω Email',
    'contact_email' => 'preview@example.invalid',
    'gdpr_consent' => 'on',
];

$cases = [
    ['Business can request a call without email or business details', $business, true],
    ['Individual can request email without a phone or taxpayer profile', $individual, true],
    ['Business can choose email only', array_replace($business, ['preferred_mode' => 'Απάντηση μέσω Email', 'contact_phone' => '', 'contact_email' => 'preview@example.invalid']), true],
    ['Individual can choose phone only', array_replace($individual, ['preferred_mode' => 'Τηλεφωνική Επικοινωνία', 'contact_email' => '', 'contact_phone' => '6912345678']), true],
    ['An unselected channel does not block the selected valid channel', array_replace($business, ['contact_email' => 'unused']), true],
    ['Missing selected phone is rejected', array_replace($business, ['contact_phone' => '']), false],
    ['Short phone is rejected', array_replace($business, ['contact_phone' => '123']), false],
    ['Phone letters are rejected', array_replace($business, ['contact_phone' => '6912345678abc']), false],
    ['Overlong phone is rejected', array_replace($business, ['contact_phone' => '1234567890123456']), false],
    ['Missing selected email is rejected', array_replace($individual, ['contact_email' => '']), false],
    ['Malformed email is rejected', array_replace($individual, ['contact_email' => 'invalid@']), false],
    ['Header newlines are rejected', array_replace($individual, ['contact_email' => "preview@example.invalid\r\nBcc: other@example.invalid"]), false],
    ['Missing name is rejected', array_replace($business, ['b2b_company_name' => ' ']), false],
    ['Missing service is rejected', array_replace($individual, ['b2c_topic' => '']), false],
    ['Missing consent is rejected', array_diff_key($business, ['gdpr_consent' => true]), false],
    ['False consent is rejected', array_replace($business, ['gdpr_consent' => false]), false],
    ['Unknown contact method is rejected', array_replace($individual, ['preferred_mode' => 'unknown']), false],
    ['Unknown segment is rejected', array_replace($business, ['client_segment' => 'unknown']), false],
    ['Non-string contact data is rejected without a type error', array_replace($individual, ['contact_email' => ['invalid']]), false],
];

$failures = 0;
foreach ($cases as [$description, $payload, $expected]) {
    $valid = validate_contact_request($payload) === '';
    if ($valid !== $expected) {
        fwrite(STDERR, "FAIL: {$description}\n");
        $failures++;
    }
}
if ($failures > 0) {
    exit(1);
}
echo count($cases) . " contact validation cases passed.\n";
