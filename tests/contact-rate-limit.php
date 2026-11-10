<?php
declare(strict_types=1);

require_once __DIR__ . '/../api/contact-rate-limit.php';

// Run with: php tests/contact-rate-limit.php. Uses a temporary folder, sends nothing.
$dir = sys_get_temp_dir() . '/tax14-rate-test-' . bin2hex(random_bytes(4));
$failures = 0;
$total = 0;
$check = static function (string $name, bool $ok) use (&$failures, &$total): void {
    $total++;
    if (!$ok) { $failures++; fwrite(STDERR, "FAIL: $name\n"); }
};

$t = 1_700_000_000;
for ($i = 0; $i < 5; $i++) {
    $check("attempt " . ($i + 1) . " within the limit is allowed", tax14_rate_limit_hit('203.0.113.7', $dir, $t + $i) === 0);
}
$wait = tax14_rate_limit_hit('203.0.113.7', $dir, $t + 10);
$check('sixth attempt inside 10 minutes is blocked', $wait > 0);
$check('retry time points to when the oldest attempt expires', $wait === 590);
$check('another client is not affected', tax14_rate_limit_hit('198.51.100.4', $dir, $t + 10) === 0);
$check('attempts are allowed again after the window', tax14_rate_limit_hit('203.0.113.7', $dir, $t + 601) === 0);

$files = glob($dir . '/*.json') ?: [];
$raw = implode('', array_map('file_get_contents', $files));
$check('stored files never contain the raw IP', !str_contains($raw, '203.0.113.7') && !str_contains(implode('', $files), '203.0.113.7'));

$check('fails open when storage cannot be created', tax14_rate_limit_hit('203.0.113.7', '/proc/tax14-no-such-dir', $t) === 0);

foreach ($files as $file) touch($file, $t - 1000);
tax14_rate_limit_cleanup($dir, $t);
$check('cleanup removes expired files', (glob($dir . '/*.json') ?: []) === []);
@rmdir($dir);

if ($failures > 0) { fwrite(STDERR, "$failures rate limit checks failed.\n"); exit(1); }
echo "$total rate limit checks passed. No emails sent.\n";
