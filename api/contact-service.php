<?php
declare(strict_types=1);

require_once __DIR__ . '/contact-validation.php';
require_once __DIR__ . '/contact-settings.php';

/** Fixed HTTPS destinations only; credentials and provider errors never reach the browser. */
function tax14_contact_http(string $url, array $payload, array $headers = [], string $brevoIpVersion = 'ipv4'): array {
    if (!function_exists('curl_init')) throw new RuntimeException('HTTP transport unavailable');
    $handle = curl_init($url);
    if ($url === 'https://api.brevo.com/v3/smtp/email') {
        // Match the IP family authorized for this particular hosting environment.
        curl_setopt($handle, CURLOPT_IPRESOLVE, $brevoIpVersion === 'ipv6' ? CURL_IPRESOLVE_V6 : CURL_IPRESOLVE_V4);
    }
    curl_setopt_array($handle, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json', 'Accept: application/json'], $headers),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $body = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    if ($body === false) throw new RuntimeException('Provider connection failed');
    $data = json_decode($body, true);
    return ['status' => $status, 'data' => is_array($data) ? $data : []];
}

function tax14_contact_message(array $data, array $settings): array {
    $value = static fn(string $key): string => is_string($data[$key] ?? null) ? trim($data[$key]) : '';
    $business = $value('client_segment') === 'Επιχείρηση (B2B)';
    $emailMode = $value('preferred_mode') === 'Απάντηση μέσω Email';
    $name = $value($business ? 'b2b_company_name' : 'b2c_full_name');
    $lines = [
        'Νέο αίτημα επικοινωνίας TAX14',
        'Κατηγορία: ' . $value('client_segment'),
        'Όνομα / Επωνυμία: ' . $name,
        'Υπηρεσία: ' . $value($business ? 'b2b_service_topic' : 'b2c_topic'),
        'Τρόπος επικοινωνίας: ' . $value('preferred_mode'),
        ($emailMode ? 'Email: ' . $value('contact_email') : 'Τηλέφωνο: ' . $value('contact_phone')),
    ];
    $optional = $business
        ? ['b2b_legal_form' => 'Νομική μορφή', 'b2b_activity' => 'Δραστηριότητα', 'b2b_staff_count' => 'Εργαζόμενοι']
        : ['b2c_profile' => 'Προφίλ φορολογούμενου'];
    $optional['contact_message'] = 'Μήνυμα';
    foreach ($optional as $key => $label) {
        if ($value($key) !== '') $lines[] = $label . ': ' . $value($key);
    }
    $lines[] = 'Συγκατάθεση επικοινωνίας: Ναι';
    $message = [
        'sender' => ['name' => 'TAX14 Website', 'email' => $settings['sender_email']],
        'to' => [['email' => 'petros.thanasos@gmail.com']],
        'subject' => 'TAX14 — Νέο αίτημα: ' . str_replace(["\r", "\n"], ' ', $name),
        'textContent' => implode("\n\n", $lines),
        'tags' => ['tax14', 'contact'],
    ];
    if ($emailMode) $message['replyTo'] = ['email' => $value('contact_email')];
    return $message;
}

/** Verify CAPTCHA before sending; tests inject a transport that never sends email. */
function tax14_handle_contact(array $data, array $settings, callable $http): array {
    $fail = static fn(int $status, string $message): array => ['status' => $status, 'body' => ['success' => false, 'message' => $message]];
    if (!empty($data['website_url'])) return $fail(400, 'Το αίτημα δεν έγινε δεκτό.');
    $error = validate_contact_request($data);
    if ($error !== '') return $fail(400, $error);
    foreach ($data as $key => $value) {
        if (!is_string($value) && $key !== 'gdpr_consent') return $fail(400, 'Ελέγξτε τα στοιχεία της φόρμας.');
        $limit = in_array($key, ['contact_message', 'captcha_token'], true) ? 4096 : 600;
        if (is_string($value) && strlen($value) > $limit) return $fail(400, 'Μειώστε το μέγεθος του κειμένου στη φόρμα.');
    }
    if (!tax14_contact_ready($settings)) return $fail(503, 'Η φόρμα δεν είναι ακόμη διαθέσιμη για αποστολή. Καλέστε μας στο 210 202 4225.');
    $token = is_string($data['captcha_token'] ?? null) ? trim($data['captcha_token']) : '';
    if ($token === '' || strlen($token) > 2048) return $fail(400, 'Ολοκληρώστε τον έλεγχο ασφαλείας και δοκιμάστε ξανά.');
    try {
        $verification = $http('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => $settings['turnstile_secret_key'], 'response' => $token,
        ], []);
        $result = $verification['data'] ?? [];
        if (($verification['status'] ?? 0) !== 200) return $fail(503, 'Ο έλεγχος ασφαλείας δεν είναι διαθέσιμος. Δοκιμάστε ξανά σε λίγο.');
        if (($result['success'] ?? false) !== true || ($result['action'] ?? '') !== 'tax14_contact'
            || !in_array($result['hostname'] ?? '', $settings['allowed_hostnames'], true)) {
            return $fail(400, 'Ο έλεγχος ασφαλείας έληξε ή δεν ήταν έγκυρος. Επαναλάβετε τον έλεγχο.');
        }
        $delivery = $http('https://api.brevo.com/v3/smtp/email', tax14_contact_message($data, $settings), ['api-key: ' . $settings['brevo_api_key']]);
        if (($delivery['status'] ?? 0) !== 201 || !is_string($delivery['data']['messageId'] ?? null) || $delivery['data']['messageId'] === '') {
            return $fail(502, 'Δεν επιβεβαιώθηκε η αποστολή. Τα στοιχεία σας παραμένουν στη φόρμα. Δοκιμάστε ξανά σε λίγο ή καλέστε στο 210 202 4225.');
        }
    } catch (Throwable $exception) {
        // Do not log request data, provider payloads or credentials.
        error_log('TAX14 contact: provider request could not be completed.');
        return $fail(502, 'Δεν επιβεβαιώθηκε η αποστολή. Τα στοιχεία σας παραμένουν στη φόρμα. Δοκιμάστε ξανά σε λίγο ή καλέστε στο 210 202 4225.');
    }
    return ['status' => 202, 'body' => ['success' => true, 'message' => 'Το αίτημά σας υποβλήθηκε. Θα επικοινωνήσουμε μαζί σας με τον τρόπο που επιλέξατε.']];
}
