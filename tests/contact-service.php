<?php
declare(strict_types=1);
require_once __DIR__ . '/../api/contact-service.php';

$settings = [
    'recipient' => 'petros.thanasos@gmail.com',
    'brevo_api_key' => 'fake-key-for-tests-only', 'sender_email' => 'forms@example.com',
    'turnstile_site_key' => 'fake-site-key', 'turnstile_secret_key' => 'fake-secret-key',
    'allowed_hostnames' => ['localhost'],
];
$business = [
    'client_segment' => 'Επιχείρηση (B2B)', 'b2b_company_name' => 'Test company',
    'b2b_service_topic' => 'Στρατηγικός Φορολογικός Σχεδιασμός',
    'preferred_mode' => 'Τηλεφωνική Επικοινωνία', 'contact_phone' => '2100000000',
    'gdpr_consent' => 'on', 'captcha_token' => 'fake-token',
];
$individual = [
    'client_segment' => 'Ιδιώτης (B2C)', 'b2c_full_name' => "Test\r\nvisitor", 'b2c_topic' => 'Test service',
    'preferred_mode' => 'Απάντηση μέσω Email', 'contact_email' => 'test@example.com',
    'gdpr_consent' => 'on', 'captcha_token' => 'fake-token',
];
$verified = ['status' => 200, 'data' => ['success' => true, 'hostname' => 'localhost', 'action' => 'tax14_contact']];
$accepted = ['status' => 201, 'data' => ['messageId' => '<fake@example.com>']];
$count = 0;
$check = static function (bool $condition, string $label) use (&$count): void {
    $count++;
    if (!$condition) throw new RuntimeException('FAIL: ' . $label);
};
$run = static function (array $data, array $config, array $responses) use (&$calls): array {
    $calls = [];
    return tax14_handle_contact($data, $config, static function ($url, $body, $headers) use (&$calls, $responses): array {
        $calls[] = ['url' => $url, 'body' => $body, 'headers' => $headers];
        return $responses[count($calls) - 1] ?? [];
    });
};

// An existing deployment can retain a retired sender in private settings.
// The verified business identity must still be selected by the deployed code.
$previousSender = getenv('TAX14_BREVO_SENDER_EMAIL');
putenv('TAX14_BREVO_SENDER_EMAIL=retired@example.com');
$deployedSettings = tax14_contact_settings();
$check($deployedSettings['sender_email'] === 'petros.thanasos@gmail.com', 'legacy sender override cannot retain the retired address');
$senderMessage = tax14_contact_message($business, $deployedSettings);
$check($senderMessage['sender'] === ['name' => 'TAX14 Website', 'email' => 'petros.thanasos@gmail.com'], 'deployed settings select the verified TAX14 sender');
putenv($previousSender === false ? 'TAX14_BREVO_SENDER_EMAIL' : 'TAX14_BREVO_SENDER_EMAIL=' . $previousSender);

$result = $run(array_merge($business, ['recipient' => 'other@example.com', '_cc' => 'other@example.com']), $settings, [$verified, $accepted]);
$check($result['status'] === 202 && $result['body']['success'] === true, 'valid business enquiry accepted');
$check(count($calls) === 2 && str_contains($calls[0]['url'], 'siteverify') && str_contains($calls[1]['url'], 'api.brevo.com'), 'CAPTCHA verified before Brevo');
$check($calls[1]['body']['to'] === [['email' => 'petros.thanasos@gmail.com']] && !isset($calls[1]['body']['cc']), 'input cannot redirect mail');
$check($calls[1]['body']['subject'] === 'TAX14 — Νέο αίτημα: Test company', 'customer subject has no test prefix');
$check(str_starts_with($calls[1]['body']['textContent'], 'Νέο αίτημα επικοινωνίας TAX14'), 'customer email is not labelled as a test');
$check($calls[1]['body']['tags'] === ['tax14', 'contact'] && !str_contains($result['body']['message'], 'δοκιμαστικό'), 'normal delivery tags and acknowledgement');
$check(!isset($calls[1]['body']['replyTo']), 'phone enquiries do not invent Reply-To');
$check(!str_contains(json_encode($result), 'fake-key'), 'credentials not exposed');
$run($individual, $settings, [$verified, $accepted]);
$check($calls[1]['body']['replyTo']['email'] === 'test@example.com', 'email enquiry Reply-To');
$check(!preg_match('/[\r\n]/', $calls[1]['body']['subject']), 'subject cannot inject headers');
$check(!str_contains($calls[1]['body']['textContent'], 'Τηλέφωνο:'), 'unselected channel omitted');

foreach ([
    array_merge($business, ['gdpr_consent' => false]),
    array_merge($business, ['captcha_token' => '']),
    array_merge($business, ['captcha_token' => str_repeat('x', 2049)]),
    array_merge($business, ['website_url' => 'bot']),
    array_merge($business, ['b2b_company_name' => str_repeat('x', 601)]),
] as $invalid) {
    $result = $run($invalid, $settings, [$verified, $accepted]);
    $check($result['status'] === 400 && count($calls) === 0, 'invalid request never contacts a provider');
}
foreach ([
    ['success' => false, 'error-codes' => ['timeout-or-duplicate']],
    ['success' => 'true', 'hostname' => 'localhost', 'action' => 'tax14_contact'],
    ['success' => true, 'hostname' => 'other.example', 'action' => 'tax14_contact'],
    ['success' => true, 'hostname' => 'localhost', 'action' => 'other_action'],
] as $invalidCaptcha) {
    $result = $run($business, $settings, [['status' => 200, 'data' => $invalidCaptcha], $accepted]);
    $check($result['status'] === 400 && count($calls) === 1, 'invalid CAPTCHA prevents sending');
}
$result = $run($business, $settings, [['status' => 503, 'data' => []], $accepted]);
$check($result['status'] === 503 && count($calls) === 1, 'CAPTCHA outage fails closed');
foreach ([['status' => 401, 'data' => ['message' => 'private error']], ['status' => 201, 'data' => []]] as $failure) {
    $result = $run($business, $settings, [$verified, $failure]);
    $check($result['status'] === 502 && !str_contains(json_encode($result), 'private error'), 'Brevo failure does not leak or claim success');
}
foreach ([
    ['brevo_api_key' => ''], ['sender_email' => 'invalid'], ['allowed_hostnames' => []],
    ['recipient' => 'other@example.com'],
    ['brevo_ip_version' => 'invalid'],
    ['turnstile_site_key' => '1x00000000000000000000AA'],
    ['turnstile_secret_key' => '1x0000000000000000000000000000000AA'],
] as $override) {
    $result = $run($business, array_merge($settings, $override), [$verified, $accepted]);
    $check($result['status'] === 503 && count($calls) === 0, 'incomplete or test CAPTCHA configuration cannot send real mail');
}
echo $count . " Brevo/CAPTCHA checks passed. No emails sent.\n";
