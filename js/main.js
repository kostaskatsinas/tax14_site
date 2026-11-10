/**
 * TAX14: the page's own behaviour. The nav, the phone sheet, the action bar, hovers and the dealt moment
 * come from assets/kit (system.js, motion.js, layout.js); this file runs the enquiry form and the
 * company-form tax calculator.
 */

import { sendContactEnquiry } from './contact-delivery.mjs?v=contact2';
import { createContactCaptcha } from './contact-captcha.mjs?v=contact2';

const PHONE_DISPLAY = '210 202 4225';
const SUBMIT_LABEL = 'Στείλτε το αίτημα';

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  setupCalculator();
  setupEnquiryForm();
});

/* ---------------------------------------------------------------------------
   Ατομική επιχείρηση vs Ι.Κ.Ε.: main tax only, indicative.
   --------------------------------------------------------------------------- */
function setupCalculator() {
  const slider = document.getElementById('profit-slider');
  const amount = document.getElementById('profit-amount');
  if (!slider || !amount) return;
  const inputError = document.getElementById('profit-input-error');
  const output = document.getElementById('profit-output');
  const taxAtomikiEl = document.getElementById('sim-tax-atomiki');
  const rateAtomikiEl = document.getElementById('sim-rate-atomiki');
  const taxIkeEl = document.getElementById('sim-tax-ike');
  const verdictEl = document.getElementById('simulator-verdict-text');
  const boxAtomiki = document.getElementById('sim-box-atomiki');
  const boxIke = document.getElementById('sim-box-ike');

  const formatEUR = (num) => `${Math.round(num).toLocaleString('el-GR')} €`;

  // Progressive scale for individual business income.
  const atomikiTax = (profit) => {
    const brackets = [
      { limit: 10000, rate: 0.09 },
      { limit: 10000, rate: 0.22 },
      { limit: 10000, rate: 0.28 },
      { limit: 10000, rate: 0.36 },
      { limit: Infinity, rate: 0.44 },
    ];
    let tax = 0;
    let remaining = profit;
    for (const bracket of brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, bracket.limit);
      tax += taxable * bracket.rate;
      remaining -= taxable;
    }
    return tax;
  };

  const update = (profit) => {
    const taxA = atomikiTax(profit);
    const taxI = profit * 0.22;
    const diff = taxA - taxI;
    output.textContent = formatEUR(profit);
    taxAtomikiEl.textContent = formatEUR(taxA);
    rateAtomikiEl.textContent = `Μέσος συντελεστής ${((taxA / profit) * 100).toFixed(1).replace('.', ',')}%`;
    taxIkeEl.textContent = formatEUR(taxI);
    const ikeAhead = diff > 1500;
    boxIke.classList.toggle('is-lower', ikeAhead);
    boxAtomiki.classList.toggle('is-lower', !ikeAhead);
    if (profit <= 25000) {
      verdictEl.textContent = `Στα ${formatEUR(profit)} καθαρά κέρδη, η ατομική επιχείρηση μένει συνήθως φθηνότερη, με χαμηλή πρώτη κλίμακα και απλογραφικά βιβλία.`;
    } else if (diff <= 0) {
      verdictEl.textContent = `Στα ${formatEUR(profit)} καθαρά κέρδη, ο κύριος φόρος είναι περίπου ίδιος. Αποφασίζουν το κόστος τήρησης και οι εισφορές.`;
    } else {
      verdictEl.textContent = `Στα ${formatEUR(profit)} καθαρά κέρδη, η Ι.Κ.Ε. γλιτώνει περίπου ${formatEUR(diff)} τον χρόνο σε κύριο φόρο.`;
    }
  };

  const clearError = () => {
    amount.removeAttribute('aria-invalid');
    inputError.hidden = true;
  };
  const validate = () => {
    if (amount.value !== '' && amount.validity.valid) return;
    amount.setAttribute('aria-invalid', 'true');
    inputError.textContent = 'Γράψτε ποσό από 15.000 € έως 150.000 €, χωρίς δεκαδικά. Η σύγκριση δείχνει το τελευταίο σωστό ποσό.';
    inputError.hidden = false;
  };

  slider.addEventListener('input', () => {
    amount.value = slider.value;
    clearError();
    update(Number(slider.value));
  });
  amount.addEventListener('input', () => {
    if (amount.value === '' || !amount.validity.valid) return;
    slider.value = amount.value;
    clearError();
    update(Number(amount.value));
  });
  amount.addEventListener('blur', validate);
  amount.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); validate(); }
  });
  update(Number(amount.value));
}

/* ---------------------------------------------------------------------------
   Enquiry form: business / individual switch, prefill from the service rows,
   validation, Turnstile and delivery through api/contact.php.
   --------------------------------------------------------------------------- */
function setupEnquiryForm() {
  const form = document.getElementById('lead-intake-form');
  if (!form) return;

  const switchB2B = document.getElementById('form-switch-b2b');
  const switchB2C = document.getElementById('form-switch-b2c');
  const groupB2B = document.getElementById('b2b-fields-group');
  const groupB2C = document.getElementById('b2c-fields-group');
  const segmentInput = document.getElementById('client_segment');
  const submitText = document.getElementById('form-submit-text');
  const submitBtn = document.getElementById('form-submit-btn');
  const feedback = document.getElementById('form-feedback');
  const errorSummary = document.getElementById('form-errors');
  const preferredMode = document.getElementById('preferred_mode');
  const b2bName = document.getElementById('b2b_company_name');
  const b2bService = document.getElementById('b2b_service_topic');
  const b2bLegal = document.getElementById('b2b_legal_form');
  const b2cName = document.getElementById('b2c_full_name');
  const b2cTopic = document.getElementById('b2c_topic');
  const segmentButtons = [switchB2B, switchB2C];

  const setSegment = (segment) => {
    const isB2B = segment === 'b2b';
    switchB2B.classList.toggle('active', isB2B);
    switchB2B.setAttribute('aria-checked', String(isB2B));
    switchB2C.classList.toggle('active', !isB2B);
    switchB2C.setAttribute('aria-checked', String(!isB2B));
    segmentButtons.forEach((button) => { button.tabIndex = button.getAttribute('aria-checked') === 'true' ? 0 : -1; });
    groupB2B.hidden = !isB2B;
    groupB2C.hidden = isB2B;
    segmentInput.value = isB2B ? 'Επιχείρηση (B2B)' : 'Ιδιώτης (B2C)';
    document.querySelectorAll('[data-optional-segment]').forEach((group) => {
      group.hidden = group.getAttribute('data-optional-segment') !== segment;
      group.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = group.hidden; });
    });
    // Hidden segment controls must not validate or enter the request payload.
    [groupB2B, groupB2C].forEach((group) => {
      group.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = group.hidden; });
    });
    b2bName.required = isB2B;
    b2bService.required = isB2B;
    b2cName.required = !isB2B;
    b2cTopic.required = !isB2B;
  };

  segmentButtons.forEach((button, index) => {
    button.addEventListener('click', () => setSegment(button.dataset.formSegment));
    button.addEventListener('keydown', (event) => {
      const next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      const target = segmentButtons[(index + next + segmentButtons.length) % segmentButtons.length];
      target.click();
      target.focus();
    });
  });

  // A service row (or any [data-prefill-segment] link) picks the segment and the service in the form.
  const selectValue = (select, value) => {
    if (!select || !value) return;
    [...select.options].forEach((option) => { option.selected = option.value === value; });
  };
  document.querySelectorAll('[data-prefill-segment]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const segment = trigger.dataset.prefillSegment || 'b2b';
      setSegment(segment);
      clearValidation();
      if (segment === 'b2b') {
        selectValue(b2bService, trigger.dataset.prefillService);
        if (trigger.dataset.prefillLegal) {
          document.getElementById('optional-details').open = true;
          selectValue(b2bLegal, trigger.dataset.prefillLegal);
        }
      } else {
        selectValue(b2cTopic, trigger.dataset.prefillService);
      }
      // Let the link scroll first, then put the cursor in the name field.
      setTimeout(() => (segment === 'b2b' ? b2bName : b2cName).focus({ preventScroll: true }), 0);
    });
  });

  const syncContactMethod = () => {
    const emailSelected = preferredMode.value === 'Απάντηση μέσω Email';
    ['phone', 'email'].forEach((channel) => {
      const active = (channel === 'email') === emailSelected;
      document.getElementById(`${channel}-contact-group`).hidden = !active;
      const field = document.getElementById(`contact_${channel}`);
      field.disabled = !active;
      field.required = active;
    });
  };

  const captcha = createContactCaptcha({
    container: document.getElementById('contact-captcha'),
    status: document.getElementById('captcha-status'),
    retryButton: document.getElementById('captcha-retry'),
  });
  captcha.start();

  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')]
    .filter((field) => field.id !== 'website_url');

  const validationMessage = (field) => {
    if (field.disabled) return '';
    if (!field.required && !field.value.trim()) return '';
    if (field.type === 'checkbox' && !field.checked) return 'Χρειάζεται η συγκατάθεσή σας για να σας καλέσουμε.';
    if (field.required && !field.value.trim()) {
      if (field.tagName === 'SELECT') return 'Διαλέξτε την υπηρεσία που σας ενδιαφέρει.';
      if (field.id === 'contact_phone') return 'Γράψτε το τηλέφωνό σας, π.χ. 69XXXXXXXX.';
      if (field.id === 'contact_email') return 'Γράψτε το email σας.';
      return 'Γράψτε το όνομά σας ή την επωνυμία.';
    }
    if (field.id === 'contact_phone' && !/^\+?[\d\s().-]+$/.test(field.value.trim())) return 'Γράψτε μόνο ψηφία και, αν θέλετε, τον κωδικό χώρας.';
    if (field.id === 'contact_phone' && (field.value.replace(/\D/g, '').length < 10 || field.value.replace(/\D/g, '').length > 15)) return 'Το τηλέφωνο θέλει 10 έως 15 ψηφία.';
    if (field.type === 'email' && field.validity.typeMismatch) return 'Γράψτε ένα email με @, π.χ. onoma@gmail.com.';
    return '';
  };

  const clearFieldError = (field) => {
    document.getElementById(`${field.id}-error`)?.remove();
    field.removeAttribute('aria-invalid');
    const describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== `${field.id}-error`);
    if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
    else field.removeAttribute('aria-describedby');
  };

  function clearValidation() {
    fields.forEach(clearFieldError);
    errorSummary.hidden = true;
    feedback.hidden = true;
  }

  const showFeedback = (type, message) => {
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.focus();
  };

  preferredMode.addEventListener('change', () => { syncContactMethod(); clearValidation(); });
  segmentButtons.forEach((button) => button.addEventListener('click', clearValidation));
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid') && !validationMessage(field)) {
        clearFieldError(field);
        errorSummary.querySelector(`a[href="#${field.id}"]`)?.closest('li').remove();
        if (!errorSummary.querySelector('li')) errorSummary.hidden = true;
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitBtn.disabled || document.getElementById('website_url')?.value.trim()) return;
    clearValidation();
    const invalid = fields.map((field) => ({ field, message: validationMessage(field) })).filter((item) => item.message);
    if (invalid.length) {
      const heading = document.createElement('strong');
      heading.textContent = invalid.length === 1 ? 'Διορθώστε 1 πεδίο:' : `Διορθώστε ${invalid.length} πεδία:`;
      const list = document.createElement('ul');
      errorSummary.replaceChildren(heading, list);
      invalid.forEach(({ field, message }) => {
        const error = document.createElement('p');
        error.id = `${field.id}-error`;
        error.className = 'field__error';
        error.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
        (field.closest('.form-group') || field.closest('.form-row') || field.parentElement).append(error);
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${field.id}`;
        link.textContent = field.id === 'gdpr_consent' ? 'Συγκατάθεση' : (field.labels?.[0]?.textContent.trim() || message);
        link.addEventListener('click', (e) => { e.preventDefault(); field.focus(); });
        item.append(link);
        list.append(item);
      });
      errorSummary.hidden = false;
      errorSummary.focus();
      return;
    }
    if (!captcha.getToken()) {
      showFeedback('error', `Ολοκληρώστε τον έλεγχο ασφαλείας πριν στείλετε το αίτημα. Αν δεν φορτώνει, πατήστε «Νέος έλεγχος» ή καλέστε στο ${PHONE_DISPLAY}.`);
      document.getElementById('captcha-group').focus();
      return;
    }
    const payload = { ...Object.fromEntries(new FormData(form).entries()), captcha_token: captcha.getToken() };
    submitBtn.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitText.textContent = 'Αποστολή…';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      await sendContactEnquiry(payload, { sourceUrl: window.location.href, signal: controller.signal });
      showFeedback('success', 'Το αίτημά σας στάλθηκε. Ο Πέτρος θα επικοινωνήσει μαζί σας με τον τρόπο που επιλέξατε.');
    } catch (error) {
      console.warn('TAX14 email request failed:', error.name, error.message);
      showFeedback('error', error.userMessage || `Δεν επιβεβαιώθηκε η αποστολή. Τα στοιχεία σας είναι ακόμη στη φόρμα. Δοκιμάστε ξανά σε λίγο ή καλέστε στο ${PHONE_DISPLAY}.`);
    } finally {
      window.clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      submitBtn.disabled = false;
      submitText.textContent = SUBMIT_LABEL;
      captcha.reset();
    }
  });

  setSegment('b2b');
  syncContactMethod();
}
