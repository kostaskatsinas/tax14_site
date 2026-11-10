<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['ready' => false]);
    exit;
}
require_once __DIR__ . '/contact-settings.php';
$settings = tax14_contact_settings();
$ready = tax14_contact_ready($settings);
echo json_encode([
    'ready' => $ready,
    'captchaSiteKey' => $ready ? $settings['turnstile_site_key'] : '',
], JSON_UNESCAPED_UNICODE);
