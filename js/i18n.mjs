// Shared UI messages. API field values stay unchanged in both languages.
const messages = {
  "el": {
    "submit": "Στείλτε το αίτημα",
    "averageRate": "Μέσος συντελεστής {rate}%",
    "soleTraderVerdict": "Στα {profit} καθαρά κέρδη, η ατομική επιχείρηση μένει συνήθως φθηνότερη, με χαμηλή πρώτη κλίμακα και απλογραφικά βιβλία.",
    "equalVerdict": "Στα {profit} καθαρά κέρδη, ο κύριος φόρος είναι περίπου ίδιος. Αποφασίζουν το κόστος τήρησης και οι εισφορές.",
    "ikeVerdict": "Στα {profit} καθαρά κέρδη, η Ι.Κ.Ε. γλιτώνει περίπου {difference} τον χρόνο σε κύριο φόρο.",
    "profitError": "Γράψτε ποσό από 15.000 € έως 150.000 €, χωρίς δεκαδικά. Η σύγκριση δείχνει το τελευταίο σωστό ποσό.",
    "consentRequired": "Χρειάζεται η συγκατάθεσή σας για να σας καλέσουμε.",
    "serviceRequired": "Διαλέξτε την υπηρεσία που σας ενδιαφέρει.",
    "phoneRequired": "Γράψτε το τηλέφωνό σας, π.χ. 69XXXXXXXX.",
    "emailRequired": "Γράψτε το email σας.",
    "nameRequired": "Γράψτε το όνομά σας ή την επωνυμία.",
    "phoneCharacters": "Γράψτε μόνο ψηφία και, αν θέλετε, τον κωδικό χώρας.",
    "phoneLength": "Το τηλέφωνο θέλει 10 έως 15 ψηφία.",
    "emailInvalid": "Γράψτε ένα email με @, π.χ. onoma@gmail.com.",
    "oneError": "Διορθώστε 1 πεδίο:",
    "manyErrors": "Διορθώστε {count} πεδία:",
    "consent": "Συγκατάθεση",
    "captchaRequired": "Ολοκληρώστε τον έλεγχο ασφαλείας πριν στείλετε το αίτημα. Αν δεν φορτώνει, πατήστε «Νέος έλεγχος» ή καλέστε στο {phone}.",
    "sending": "Αποστολή…",
    "success": "Το αίτημά σας στάλθηκε. Ο Πέτρος θα επικοινωνήσει μαζί σας με τον τρόπο που επιλέξατε.",
    "deliveryError": "Δεν επιβεβαιώθηκε η αποστολή. Τα στοιχεία σας είναι ακόμη στη φόρμα. Δοκιμάστε ξανά σε λίγο ή καλέστε στο {phone}.",
    "captchaReset": "Ολοκληρώστε τον νέο έλεγχο ασφαλείας πριν από την αποστολή.",
    "captchaLoading": "Φόρτωση ελέγχου ασφαλείας…",
    "formUnavailable": "Η φόρμα δεν είναι διαθέσιμη αυτή τη στιγμή. Καλέστε μας στο 210 202 4225.",
    "captchaComplete": "Ο έλεγχος ασφαλείας ολοκληρώθηκε. Μπορείτε να στείλετε το αίτημα.",
    "captchaExpired": "Ο έλεγχος ασφαλείας έληξε. Πατήστε «Νέος έλεγχος».",
    "captchaUnavailable": "Ο έλεγχος ασφαλείας δεν είναι διαθέσιμος. Δοκιμάστε νέο έλεγχο ή καλέστε μας.",
    "captchaPrompt": "Ολοκληρώστε τον έλεγχο ασφαλείας πριν από την αποστολή.",
    "captchaFailed": "Δεν φορτώθηκε ο έλεγχος ασφαλείας. Δοκιμάστε ξανά ή καλέστε στο 210 202 4225."
  },
  "en": {
    "submit": "Send enquiry",
    "averageRate": "Average rate {rate}%",
    "soleTraderVerdict": "At {profit} net profit, a sole trader usually costs less, thanks to the lower first tax band and single-entry bookkeeping.",
    "equalVerdict": "At {profit} net profit, the main tax is about the same. Bookkeeping costs and social insurance contributions help determine the choice.",
    "ikeVerdict": "At {profit} net profit, an IKE saves about {difference} a year in main tax.",
    "profitError": "Enter a whole amount from €15,000 to €150,000. The comparison shows the last valid amount.",
    "consentRequired": "We need your consent to contact you.",
    "serviceRequired": "Choose the service you need.",
    "phoneRequired": "Enter your phone number, including the country code if outside Greece.",
    "emailRequired": "Enter your email address.",
    "nameRequired": "Enter your name or company name.",
    "phoneCharacters": "Use digits and, if needed, a country code.",
    "phoneLength": "Your phone number must contain 10 to 15 digits.",
    "emailInvalid": "Enter an email address with @, for example name@gmail.com.",
    "oneError": "Please correct 1 field:",
    "manyErrors": "Please correct {count} fields:",
    "consent": "Consent",
    "captchaRequired": "Complete the security check before sending your enquiry. If it does not load, select “New check” or call {phone}.",
    "sending": "Sending…",
    "success": "Your enquiry has been sent. Petros will contact you using your chosen method.",
    "deliveryError": "We could not confirm your enquiry was sent. Your details are still in the form. Try again shortly or call {phone}.",
    "captchaReset": "Complete the new security check before sending your enquiry.",
    "captchaLoading": "Loading security check…",
    "formUnavailable": "The form is currently unavailable. Call us on +30 210 202 4225.",
    "captchaComplete": "Security check complete. You can send your enquiry.",
    "captchaExpired": "The security check has expired. Select “New check”.",
    "captchaUnavailable": "The security check is unavailable. Try a new check or call us.",
    "captchaPrompt": "Complete the security check before sending your enquiry.",
    "captchaFailed": "The security check could not load. Try again or call +30 210 202 4225."
  }
};

export const siteLanguage = () => globalThis.document?.documentElement?.lang?.startsWith('en') ? 'en' : 'el';

export function createTranslator(language = 'el') {
  const dictionary = messages[language] || messages.el;
  return (key, values = {}) => {
    if (!(key in dictionary)) throw new Error(`Unknown translation: ${key}`);
    return dictionary[key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  };
}

export function formatEuro(amount, language = 'el') {
  const number = Math.round(amount).toLocaleString(language === 'en' ? 'en-GB' : 'el-GR');
  return language === 'en' ? `€${number}` : `${number} €`;
}

const serverMessages = new Map([
  ['Επιλέξτε επιχείρηση ή ιδιώτη.', 'Choose business or individual.'],
  ['Συμπληρώστε το όνομα ή την επωνυμία σας.', 'Enter your name or company name.'],
  ['Επιλέξτε την υπηρεσία που σας ενδιαφέρει.', 'Choose the service you need.'],
  ['Χρειάζεται η συγκατάθεσή σας για να επικοινωνήσουμε μαζί σας.', 'We need your consent to contact you.'],
  ['Συμπληρώστε τηλέφωνο με 10 έως 15 ψηφία.', 'Enter a phone number with 10 to 15 digits.'],
  ['Συμπληρώστε έγκυρη διεύθυνση email.', 'Enter a valid email address.'],
  ['Επιλέξτε αν θέλετε να επικοινωνήσουμε τηλεφωνικά ή με email.', 'Choose whether to be contacted by phone or email.'],
  ['Μειώστε το μέγεθος του κειμένου στη φόρμα.', 'Shorten the text in the form and try again.'],
  ['Ολοκληρώστε τον έλεγχο ασφαλείας και δοκιμάστε ξανά.', 'Complete the security check and try again.'],
  ['Ο έλεγχος ασφαλείας δεν είναι διαθέσιμος. Δοκιμάστε ξανά σε λίγο.', 'The security check is unavailable. Try again shortly.'],
  ['Ο έλεγχος ασφαλείας έληξε ή δεν ήταν έγκυρος. Επαναλάβετε τον έλεγχο.', 'The security check expired or was invalid. Complete a new check.'],
]);

export function localizeServerError(message, status, language = 'el') {
  if (language !== 'en') return typeof message === 'string' ? message : '';
  if (serverMessages.has(message)) return serverMessages.get(message);
  if (status === 429) return 'Too many enquiries in a short time. Try again in a few minutes or call +30 210 202 4225.';
  if (status === 413) return 'Your enquiry is too long. Shorten the text and try again.';
  if (status === 400) return 'Check your details and complete a new security check before trying again.';
  if (status === 503) return 'The form is currently unavailable. Try again shortly or call +30 210 202 4225.';
  return createTranslator('en')('deliveryError', { phone: '+30 210 202 4225' });
}
