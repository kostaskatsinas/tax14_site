<?php
/**
 * The PHP mail() route is retired; the form now uses FormSubmit.
 * Cached clients must not send requests to the old customer recipient.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
http_response_code(410);
echo json_encode([
    'success' => false,
    'message' => 'Η φόρμα έχει ενημερωθεί. Ανανεώστε τη σελίδα και δοκιμάστε ξανά.'
], JSON_UNESCAPED_UNICODE);
