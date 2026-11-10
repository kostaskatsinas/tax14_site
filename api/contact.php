<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'message' => 'Μη επιτρεπτή μέθοδος αιτήματος.'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'Το αίτημα είναι πολύ μεγάλο.'], JSON_UNESCAPED_UNICODE);
    exit;
}
$raw = file_get_contents('php://input', false, null, 0, 20001);
$data = json_decode($raw ?: '', true);
if (strlen($raw ?: '') > 20000 || !is_array($data) || array_is_list($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Μη έγκυρα στοιχεία φόρμας.'], JSON_UNESCAPED_UNICODE);
    exit;
}
require_once __DIR__ . '/contact-service.php';
$settings = tax14_contact_settings();
$transport = static fn($url, $payload, $headers) => tax14_contact_http($url, $payload, $headers, $settings['brevo_ip_version']);
$result = tax14_handle_contact($data, $settings, $transport);
http_response_code($result['status']);
echo json_encode($result['body'], JSON_UNESCAPED_UNICODE);
