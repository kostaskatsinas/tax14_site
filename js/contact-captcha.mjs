import { createTranslator } from './i18n.mjs?v=1';

export function createContactCaptcha({ container, status, retryButton, language = 'el' }) {
  const t = createTranslator(language);
  let token = '';
  let widget = null;
  let starting = false;
  const notify = message => { status.textContent = message; };
  const reset = () => {
    token = '';
    notify(t('captchaReset'));
    if (widget !== null && window.turnstile) window.turnstile.reset(widget);
  };
  const start = async () => {
    if (starting) return;
    starting = true;
    retryButton.hidden = true;
    notify(t('captchaLoading'));
    try {
      const response = await fetch('/api/contact-config.php', { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Configuration unavailable');
      const config = await response.json();
      if (config.ready !== true || typeof config.captchaSiteKey !== 'string' || !config.captchaSiteKey) {
        notify(t('formUnavailable'));
        retryButton.hidden = false;
        return;
      }
      if (!window.turnstile) await new Promise((resolve, reject) => {
        document.getElementById('tax14-turnstile-script')?.remove();
        const script = document.createElement('script');
        script.id = 'tax14-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        const timeout = window.setTimeout(() => reject(new Error('CAPTCHA timed out')), 15000);
        script.onload = () => { window.clearTimeout(timeout); resolve(); };
        script.onerror = () => { window.clearTimeout(timeout); reject(new Error('CAPTCHA unavailable')); };
        document.head.append(script);
      });
      // The script load event above guarantees the explicit render API is ready.
      widget = window.turnstile.render(container, {
        sitekey: config.captchaSiteKey, action: 'tax14_contact', theme: 'light', size: 'compact', language,
        'response-field': false,
        callback: value => { token = value; notify(t('captchaComplete')); retryButton.hidden = true; },
        'expired-callback': () => { token = ''; notify(t('captchaExpired')); retryButton.hidden = false; },
        'error-callback': () => { token = ''; notify(t('captchaUnavailable')); retryButton.hidden = false; },
      });
      notify(t('captchaPrompt'));
    } catch (_error) {
      token = '';
      notify(t('captchaFailed'));
      retryButton.hidden = false;
    } finally {
      starting = false;
    }
  };
  retryButton.addEventListener('click', () => widget === null ? start() : reset());
  return { start, reset, getToken: () => token };
}
