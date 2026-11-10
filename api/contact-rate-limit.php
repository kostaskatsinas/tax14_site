<?php
declare(strict_types=1);

/**
 * Small file-based rate limit for the contact endpoint, a second layer behind Turnstile.
 * Only a SHA-256 hash of the client IP is stored, never the IP itself, and entries
 * expire after the window. The folder sits outside public_html, next to the private config.
 */
const TAX14_RATE_LIMIT_MAX = 5;
const TAX14_RATE_LIMIT_WINDOW = 600; // seconds

function tax14_rate_limit_dir(): string {
    $configured = getenv('TAX14_RATE_LIMIT_DIR');
    if (is_string($configured) && $configured !== '') return $configured;
    $private = dirname(__DIR__, 2) . '/tax14-contact-rate';
    if (is_dir($private) || @mkdir($private, 0700, true)) return $private;
    return sys_get_temp_dir() . '/tax14-contact-rate';
}

/**
 * Records one attempt and returns how many seconds the client must wait,
 * or 0 when the attempt is allowed. Fails open if storage is unavailable,
 * so a hosting hiccup never blocks real enquiries.
 */
function tax14_rate_limit_hit(string $clientKey, string $dir, ?int $now = null,
                              int $max = TAX14_RATE_LIMIT_MAX, int $window = TAX14_RATE_LIMIT_WINDOW): int {
    $now ??= time();
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return 0;
    $file = $dir . '/' . hash('sha256', 'tax14-contact|' . $clientKey) . '.json';
    $handle = @fopen($file, 'c+');
    if ($handle === false) return 0;
    try {
        if (!flock($handle, LOCK_EX)) return 0;
        $stored = json_decode((string) stream_get_contents($handle), true);
        $attempts = array_values(array_filter(
            is_array($stored) ? $stored : [],
            static fn($time): bool => is_int($time) && $time > $now - $window
        ));
        if (count($attempts) >= $max) {
            return max(1, min($attempts) + $window - $now);
        }
        $attempts[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($attempts));
        fflush($handle);
        return 0;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** Occasionally removes files whose newest attempt is older than the window. */
function tax14_rate_limit_cleanup(string $dir, ?int $now = null, int $window = TAX14_RATE_LIMIT_WINDOW): void {
    $now ??= time();
    foreach (glob($dir . '/*.json') ?: [] as $file) {
        $modified = @filemtime($file);
        if ($modified !== false && $modified < $now - $window) @unlink($file);
    }
}
