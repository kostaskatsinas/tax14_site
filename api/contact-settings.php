<?php
declare(strict_types=1);

/** Private config lives above public_html, never inside the website or Git. */
function tax14_contact_settings(): array {
    $path = getenv('TAX14_CONTACT_CONFIG') ?: dirname(__DIR__, 2) . '/tax14-contact-config.php';
    $private = is_file($path) ? require $path : [];
    if (!is_array($private)) $private = [];
    $setting = static function (string $name, string $key) use ($private): string {
        $environment = getenv($name);
        return trim(is_string($environment) && $environment !== '' ? $environment : (string) ($private[$key] ?? ''));
    };
    return [
        'recipient' => 'katsinas1986@gmail.com',
        'brevo_api_key' => $setting('TAX14_BREVO_API_KEY', 'brevo_api_key'),
        'sender_email' => $setting('TAX14_BREVO_SENDER_EMAIL', 'sender_email'),
        'brevo_ip_version' => $setting('TAX14_BREVO_IP_VERSION', 'brevo_ip_version') ?: 'ipv4',
        'turnstile_site_key' => $setting('TAX14_TURNSTILE_SITE_KEY', 'turnstile_site_key'),
        'turnstile_secret_key' => $setting('TAX14_TURNSTILE_SECRET_KEY', 'turnstile_secret_key'),
        'allowed_hostnames' => array_values(array_filter(array_map('trim', explode(',', $setting('TAX14_CONTACT_HOSTNAMES', 'allowed_hostnames'))))),
    ];
}

function tax14_contact_ready(array $settings): bool {
    foreach (['brevo_api_key', 'sender_email', 'turnstile_site_key', 'turnstile_secret_key'] as $key) {
        if (!is_string($settings[$key] ?? null) || $settings[$key] === '') return false;
    }
    // Cloudflare's published testing keys must never authorize real emails.
    if (preg_match('/^[123]x0{15,}/', $settings['turnstile_site_key'])) return false;
    if (preg_match('/^[123]x0{15,}/', $settings['turnstile_secret_key'])) return false;
    return ($settings['recipient'] ?? '') === 'katsinas1986@gmail.com'
        && filter_var($settings['sender_email'], FILTER_VALIDATE_EMAIL) !== false
        && in_array($settings['brevo_ip_version'] ?? 'ipv4', ['ipv4', 'ipv6'], true)
        && !empty($settings['allowed_hostnames']);
}
