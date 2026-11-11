import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactCaptcha } from '../js/contact-captcha.mjs';

for (const language of ['el', 'en']) test(`CAPTCHA loads, expires and resets in ${language}`, async () => {
  const original = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch };
  let callbacks;
  let scriptLoads = 0;
  let resets = 0;
  let retry;
  const status = { textContent: '' };
  const retryButton = { hidden: false, addEventListener: (_, handler) => { retry = handler; } };
  globalThis.window = { setTimeout, clearTimeout };
  globalThis.fetch = async (url) => { assert.equal(url, '/api/contact-config.php'); return ({ ok: true, headers: new Headers({ 'content-type': 'application/json' }), json: async () => ({ ready: true, captchaSiteKey: 'public-widget-key' }) }); };
  globalThis.document = {
    getElementById: () => null,
    createElement: () => ({}),
    head: { append(script) {
      scriptLoads++;
      assert.match(script.src, /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit$/);
      window.turnstile = {
        ready() { throw new Error('Not needed after script.onload'); },
        render(_, options) { callbacks = options; return 'widget-id'; },
        reset(id) { assert.equal(id, 'widget-id'); resets++; },
      };
      queueMicrotask(() => script.onload());
    } },
  };
  try {
    const captcha = createContactCaptcha({ container: {}, status, retryButton, language });
    await captcha.start();
    assert.equal(scriptLoads, 1);
    assert.equal(callbacks.action, 'tax14_contact');
    assert.equal(callbacks.language, language);
    assert.match(status.textContent, language === 'en' ? /Complete the security check/ : /Ολοκληρώστε/);
    assert.equal(captcha.getToken(), '');
    callbacks.callback('single-use-token');
    assert.equal(captcha.getToken(), 'single-use-token');
    assert.match(status.textContent, language === 'en' ? /Security check complete/ : /ολοκληρώθηκε/);
    callbacks['expired-callback']();
    assert.equal(captcha.getToken(), '');
    assert.equal(retryButton.hidden, false);
    retry();
    assert.equal(resets, 1);
    callbacks.callback('replacement-token');
    captcha.reset();
    assert.equal(captcha.getToken(), '');
    assert.equal(resets, 2);
    callbacks['error-callback']();
    assert.equal(captcha.getToken(), '');
    assert.equal(retryButton.hidden, false);
  } finally {
    Object.assign(globalThis, original);
  }
});
