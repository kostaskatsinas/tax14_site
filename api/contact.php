<?php
/**
 * TAX14 — Λογιστική & Φοροτεχνική Συμβουλευτική (Αθήνα)
 * Hostinger Web Hosting Unlimited - Lead Capture Form Handler (PHP 8.x)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Μη επιτρεπτή μέθοδος αιτήματος.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Parse JSON or standard POST payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '', true);
if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot anti-spam check
if (!empty($data['website_url'])) {
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper function for clean sanitization
function clean_field(mixed $value): string {
    if (!is_string($value)) {
        return '';
    }
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

require_once __DIR__ . '/contact-validation.php';
$validationError = validate_contact_request($data);
if ($validationError !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $validationError], JSON_UNESCAPED_UNICODE);
    exit;
}

$segment        = clean_field($data['client_segment']);
$preferredMode  = clean_field($data['preferred_mode']);
$emailMode      = $preferredMode === 'Απάντηση μέσω Email';
$phone          = $emailMode ? '' : clean_field($data['contact_phone'] ?? '');
$email          = $emailMode ? trim($data['contact_email']) : '';
$message        = clean_field($data['contact_message'] ?? '');
$phoneDisplay   = $phone !== '' ? "<a href='tel:{$phone}'>{$phone}</a>" : '—';
$emailDisplay   = $email !== '' ? clean_field($email) : '—';
$isB2B          = $segment === 'Επιχείρηση (B2B)';

if ($isB2B) {
    $clientName  = clean_field($data['b2b_company_name'] ?? '');
    $legalForm   = clean_field($data['b2b_legal_form'] ?? '');
    $staffCount  = clean_field($data['b2b_staff_count'] ?? '');
    $activity    = clean_field($data['b2b_activity'] ?? '');
    $topic       = clean_field($data['b2b_service_topic'] ?? '');
    $detailsHtml = "
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Επωνυμία / Όνομα:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$clientName}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Νομική Μορφή:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$legalForm}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Αντικείμενο / Κλάδος:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$activity}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Προσωπικό (ΕΡΓΑΝΗ ΙΙ):</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$staffCount}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Υπηρεσία Ενδιαφέροντος:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$topic}</td></tr>
    ";
} else {
    $clientName  = clean_field($data['b2c_full_name'] ?? '');
    $topic       = clean_field($data['b2c_topic'] ?? '');
    $profile     = clean_field($data['b2c_profile'] ?? '');
    $detailsHtml = "
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Ονοματεπώνυμο:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$clientName}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Θέμα Ενδιαφέροντος:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$topic}</td></tr>
      <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Προφίλ Φορολογούμενου:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$profile}</td></tr>
    ";
}

// =========================================================================
// ΡΥΘΜΙΣΗ EMAIL ΓΡΑΦΕΙΟΥ ΣΤΟ HOSTINGER
// Παραλήπτης των αιτημάτων επικοινωνίας του γραφείου.
// =========================================================================
$recipientEmail = 'petros.thanasos@gmail.com';
$subject = "=?UTF-8?B?" . base64_encode("Νέο Αίτημα [{$segment}]: {$clientName} - TAX14") . "?=";

$emailBody = "
<!DOCTYPE html>
<html lang='el'>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;'>
  <div style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;'>
    <div style='background:#0A1628;color:#ffffff;padding:20px 24px;'>
      <h2 style='margin:0;font-size:18px;'>TAX14 — Νέο Αίτημα Επικοινωνίας / Προσφοράς</h2>
      <p style='margin:4px 0 0;font-size:13px;color:#cbd5e1;'>Κατηγορία: {$segment}</p>
    </div>
    <div style='padding:24px;'>
      <table style='width:100%;border-collapse:collapse;font-size:14px;'>
        {$detailsHtml}
        <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Τηλέφωνο:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$phoneDisplay}</td></tr>
        <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Email:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$emailDisplay}</td></tr>
        <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Τρόπος Επικοινωνίας:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>{$preferredMode}</td></tr>
        <tr><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:bold;'>Μήνυμα:</td><td style='padding:8px 12px;border-bottom:1px solid #e2e8f0;'>" . ($message ?: '—') . "</td></tr>
      </table>
    </div>
  </div>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: TAX14 Website <no-reply@tax14.gr>',
    'X-Mailer: PHP/' . phpversion()
];

if ($emailMode) {
    $headers[] = "Reply-To: {$email}";
}

$sent = @mail($recipientEmail, $subject, $emailBody, implode("\r\n", $headers));

http_response_code($sent ? 200 : 502);
echo json_encode([
    'success' => $sent,
    'message' => $sent ? 'Το αίτημά σας στάλθηκε.' : 'Το αίτημα δεν στάλθηκε. Δοκιμάστε ξανά ή καλέστε μας στο 210 202 4225.'
], JSON_UNESCAPED_UNICODE);
