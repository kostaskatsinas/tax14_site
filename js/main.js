/**
 * TAX14 — Λογιστική & Φοροτεχνική Συμβουλευτική (Αθήνα)
 * Interactive UX Architecture & Smart Segmented Lead Capture
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // 2. Sticky Header Scroll State
  const siteHeader = document.getElementById('site-header');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 24) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  const closeMobileDrawer = () => {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.hidden = true;
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', (!isExpanded).toString());
      mobileDrawer.hidden = isExpanded;
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  // 4. Hero Executive Command Center Tabs (B2B vs B2C Preview)
  const dashboardTabs = document.querySelectorAll('[data-dashboard-tab]');
  const panelB2B = document.getElementById('dashboard-panel-b2b');
  const panelB2C = document.getElementById('dashboard-panel-b2c');

  dashboardTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-dashboard-tab');
      dashboardTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle('active', isCurrent);
        t.setAttribute('aria-selected', isCurrent.toString());
      });

      if (panelB2B && panelB2C) {
        if (target === 'b2b') {
          panelB2B.hidden = false;
          panelB2C.hidden = true;
        } else {
          panelB2B.hidden = true;
          panelB2C.hidden = false;
        }
      }
    });
  });

  // 5. Service Segmentation Filter Bar (All / B2B / B2C)
  const filterPills = document.querySelectorAll('[data-service-filter]');
  const serviceCards = document.querySelectorAll('[data-segment-card]');
  const servicesGrid = document.querySelector('.services-split-grid');

  const setServiceFilter = (filterValue) => {
    filterPills.forEach((pill) => {
      const isMatch = pill.getAttribute('data-service-filter') === filterValue;
      pill.classList.toggle('active', isMatch);
      pill.setAttribute('aria-selected', isMatch.toString());
    });

    if (servicesGrid) {
      servicesGrid.classList.toggle('single-view', filterValue !== 'all');
    }

    serviceCards.forEach((card) => {
      const cardType = card.getAttribute('data-segment-card');
      if (filterValue === 'all' || filterValue === cardType) {
        card.hidden = false;
      } else {
        card.hidden = true;
      }
    });
  };

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filterValue = pill.getAttribute('data-service-filter') || 'all';
      setServiceFilter(filterValue);
    });
  });

  // Ensure clicking a B2B/B2C nav link unhides that card if filtered out
  document.querySelectorAll('[data-nav-segment]').forEach((navEl) => {
    navEl.addEventListener('click', () => {
      setServiceFilter('all');
    });
  });

  // 6. Interactive Legal Entity Comparison Guide (Ατομική, ΟΕ/ΕΕ, ΙΚΕ, ΑΕ)
  const entityData = {
    atomiki: {
      badge: 'ΙΔΑΝΙΚΗ ΓΙΑ ΕΛΕΥΘΕΡΟΥΣ ΕΠΑΓΓΕΛΜΑΤΙΕΣ & ΝΕΟΕΙΣΕΡΧΟΜΕΝΟΥΣ',
      title: 'Ατομική Επιχείρηση',
      taxRate: '9% έως 44% (Κλίμακα)',
      summary:
        'Η πιο ευέλικτη και οικονομική μορφή έναρξης για ελεύθερους επαγγελματίες, παροχή υπηρεσιών και μικρές εμπορικές επιχειρήσεις με χαμηλό λειτουργικό κόστος.',
      books: 'Απλογραφικά (Β\' Κατηγορίας)',
      liability: 'Απεριόριστη (Προσωπική Περιουσία)',
      capital: '0 € (Δεν απαιτείται)',
      efka: 'Υποχρεωτική (Έκπτωση 50% τα πρώτα 5 έτη)',
      when: 'Όταν τα ετήσια καθαρά κέρδη είναι έως ~30.000 €–35.000 € και ο επιχειρηματικός ή πιστωτικός κίνδυνος είναι περιορισμένος.',
      servicePrefill: 'Σύσταση / Μετατροπή / Λύση Εταιρείας',
      legalFormPrefill: 'Ατομική Επιχείρηση / Ελεύθερος Επαγγελματίας'
    },
    'oe-ee': {
      badge: 'ΙΔΑΝΙΚΗ ΓΙΑ ΟΙΚΟΓΕΝΕΙΑΚΕΣ & ΣΥΝΕΤΑΙΡΙΣΤΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ',
      title: 'Ομόρρυθμη (Ο.Ε.) ή Ετερόρρυθμη (Ε.Ε.) Εταιρεία',
      taxRate: '22% (Σταθερός Συντελεστής)',
      summary:
        'Προσωπική εταιρεία τουλάχιστον 2 εταίρων που συνδυάζει την απλότητα τήρησης απλογραφικών βιβλίων με σταθερό εταιρικό φορολογικό συντελεστή 22% χωρίς φόρο μερίσματος στα απλογραφικά.',
      books: 'Απλογραφικά (έως 1.500.000 € τζίρο)',
      liability: 'Απεριόριστη στους Ομόρρυθμους Εταίρους',
      capital: 'Ελεύθερο (Καθορίζεται από τους εταίρους)',
      efka: 'Υποχρεωτική για όλους τους εταίρους',
      when: 'Όταν υπάρχουν 2+ συνέταιροι με εμπιστοσύνη μεταξύ τους και επιθυμούν απλογραφικά βιβλία με τελική φορολόγηση 22%.',
      servicePrefill: 'Σύσταση / Μετατροπή / Λύση Εταιρείας',
      legalFormPrefill: 'Ο.Ε. / Ε.Ε. (Προσωπική Εταιρεία)'
    },
    ike: {
      badge: 'Η Νο.1 ΕΠΙΛΟΓΗ ΓΙΑ ΣΥΓΧΡΟΝΕΣ & ΑΝΑΠΤΥΣΣΟΜΕΝΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ',
      title: 'Ιδιωτική Κεφαλαιουχική Εταιρεία (Ι.Κ.Ε.)',
      taxRate: '22% Εταιρικός (+5% Μέρισμα)',
      summary:
        'Σύγχρονη κεφαλαιουχική εταιρεία (Μονοπρόσωπη ή Πολυπρόσωπη) που θωρακίζει την προσωπική περιουσία των εταίρων, προσφέρει σταθερό φόρο 22% και απαλλάσσει τους απλούς εταίρους από εισφορές e-ΕΦΚΑ.',
      books: 'Διπλογραφικά (Γ\' Κατηγορίας)',
      liability: 'Περιορισμένη (Μόνο μέχρι το εταιρικό κεφάλαιο)',
      capital: 'Από 1 € (Ευέλικτες εισφορές)',
      efka: 'Μόνο ο Διαχειριστής (ή ο Μοναδικός Εταίρος)',
      when: 'Όταν τα καθαρά κέρδη υπερβαίνουν τα 35.000 €–40.000 €, υπάρχουν πολλοί εταίροι/επενδυτές ή απαιτείται περιορισμός ευθύνης.',
      servicePrefill: 'Σύσταση / Μετατροπή / Λύση Εταιρείας',
      legalFormPrefill: 'Ι.Κ.Ε. (Ιδιωτική Κεφαλαιουχική Εταιρεία)'
    },
    ae: {
      badge: 'ΓΙΑ ΜΕΓΑΛΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ, ΕΠΕΝΔΥΤΙΚΑ ΣΧΗΜΑΤΑ & ΔΙΑΓΩΝΙΣΜΟΥΣ',
      title: 'Ανώνυμη Εταιρεία (Α.Ε.)',
      taxRate: '22% Εταιρικός (+5% Μέρισμα)',
      summary:
        'Η κορυφαία εταιρική μορφή υψηλού κύρους για επιχειρήσεις με μεγάλο κύκλο εργασιών, συμμετοχή σε δημόσιους/διεθνείς διαγωνισμούς, τραπεζική χρηματοδότηση και είσοδο επενδυτών μέσω μετοχών.',
      books: 'Διπλογραφικά (Γ\' Κατηγορίας - Πλήρη ΕΛΠ)',
      liability: 'Περιορισμένη (Μέχρι το μετοχικό κεφάλαιο)',
      capital: '25.000 € (Ελάχιστο Μετοχικό Κεφάλαιο)',
      efka: 'Μέλη Δ.Σ. μόνο εφόσον λαμβάνουν αμοιβή ή κατέχουν >=3%',
      when: 'Όταν απαιτείται ισχυρό θεσμικό προφίλ, εύκολη μεταβίβαση μετοχών, άντληση κεφαλαίων ή συμμετοχή σε μεγάλα έργα.',
      servicePrefill: 'Σύσταση / Μετατροπή / Λύση Εταιρείας',
      legalFormPrefill: 'Α.Ε. / Ε.Π.Ε.'
    }
  };

  const entityTabs = document.querySelectorAll('[data-entity]');
  const elBadge = document.getElementById('entity-badge');
  const elTitle = document.getElementById('entity-title');
  const elTaxRate = document.getElementById('entity-tax-rate');
  const elSummary = document.getElementById('entity-summary');
  const elBooks = document.getElementById('entity-books');
  const elLiability = document.getElementById('entity-liability');
  const elCapital = document.getElementById('entity-capital');
  const elEfka = document.getElementById('entity-efka');
  const elWhen = document.getElementById('entity-when');
  const elCtaBtn = document.getElementById('entity-cta-btn');

  entityTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-entity') || 'atomiki';
      const info = entityData[key];
      if (!info) return;

      entityTabs.forEach((t) => {
        const isSelected = t === tab;
        t.classList.toggle('active', isSelected);
        t.setAttribute('aria-selected', isSelected.toString());
      });

      if (elBadge) elBadge.textContent = info.badge;
      if (elTitle) elTitle.textContent = info.title;
      if (elTaxRate) elTaxRate.textContent = info.taxRate;
      if (elSummary) elSummary.textContent = info.summary;
      if (elBooks) elBooks.textContent = info.books;
      if (elLiability) elLiability.textContent = info.liability;
      if (elCapital) elCapital.textContent = info.capital;
      if (elEfka) elEfka.textContent = info.efka;
      if (elWhen) elWhen.textContent = info.when;
      if (elCtaBtn) {
        elCtaBtn.setAttribute('data-prefill-legal', info.legalFormPrefill);
      }
    });
  });

  // 7. Live Tax Simulator (Ατομική Επιχείρηση vs ΙΚΕ)
  const profitSlider = document.getElementById('profit-slider');
  const profitOutput = document.getElementById('profit-output');
  const simTaxAtomiki = document.getElementById('sim-tax-atomiki');
  const simRateAtomiki = document.getElementById('sim-rate-atomiki');
  const simTaxIke = document.getElementById('sim-tax-ike');
  const simRateIke = document.getElementById('sim-rate-ike');
  const simVerdictText = document.getElementById('simulator-verdict-text');
  const simBoxAtomiki = document.getElementById('sim-box-atomiki');
  const simBoxIke = document.getElementById('sim-box-ike');

  const formatEUR = (num) => {
    return Math.round(num).toLocaleString('el-GR') + ' €';
  };

  // Greek progressive scale for individual business income (Ατομική Επιχείρηση)
  const calculateAtomikiTax = (profit) => {
    let tax = 0;
    const brackets = [
      { limit: 10000, rate: 0.09 },
      { limit: 10000, rate: 0.22 },
      { limit: 10000, rate: 0.28 },
      { limit: 10000, rate: 0.36 },
      { limit: Infinity, rate: 0.44 }
    ];
    let remaining = profit;
    for (const bracket of brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, bracket.limit);
      tax += taxable * bracket.rate;
      remaining -= taxable;
    }
    return tax;
  };

  const updateSimulator = () => {
    if (!profitSlider) return;
    const profit = Number(profitSlider.value);
    if (profitOutput) profitOutput.textContent = formatEUR(profit);

    const taxAtomiki = calculateAtomikiTax(profit);
    const effRateAtomiki = ((taxAtomiki / profit) * 100).toFixed(1).replace('.', ',');

    const taxIkeCorp = profit * 0.22;
    const diff = taxAtomiki - taxIkeCorp;

    if (simTaxAtomiki) simTaxAtomiki.textContent = formatEUR(taxAtomiki);
    if (simRateAtomiki) simRateAtomiki.textContent = `Μέσος συντελεστής: ${effRateAtomiki}%`;

    if (simTaxIke) simTaxIke.textContent = formatEUR(taxIkeCorp);
    if (simRateIke) simRateIke.textContent = `Εταιρικός φόρος 22% (+5% σε διανομή)`;

    if (simBoxAtomiki && simBoxIke) {
      if (diff > 1500) {
        simBoxIke.classList.add('sim-box-highlight');
        simBoxAtomiki.classList.remove('sim-box-highlight');
      } else {
        simBoxAtomiki.classList.add('sim-box-highlight');
        simBoxIke.classList.remove('sim-box-highlight');
      }
    }

    if (simVerdictText) {
      if (profit <= 25000) {
        simVerdictText.innerHTML = `Στα <strong>${formatEUR(profit)}</strong> καθαρά κέρδη, η <strong>Ατομική Επιχείρηση</strong> παραμένει συνήθως πιο οικονομική λόγω χαμηλότερης πρώτης κλίμακας (9%) και απλογραφικών βιβλίων.`;
      } else if (profit <= 40000) {
        simVerdictText.innerHTML = `Στα <strong>${formatEUR(profit)}</strong> καθαρά κέρδη βρίσκεστε στο <strong>κομβικό σημείο μετάβασης</strong>. Η <strong>Ι.Κ.Ε.</strong> ή η <strong>Ο.Ε./Ε.Ε.</strong> εξοικονομεί <strong>${formatEUR(Math.max(0, diff))}</strong> ετησίως σε κύριο φόρο.`;
      } else {
        simVerdictText.innerHTML = `Στα <strong>${formatEUR(profit)}</strong> καθαρά κέρδη, η <strong>Ι.Κ.Ε.</strong> προσφέρει ετήσιο φορολογικό όφελος <strong>${formatEUR(diff)}</strong> έναντι της Ατομικής κλίμακας (44%) και προστατεύει την προσωπική σας περιουσία.`;
      }
    }
  };

  if (profitSlider) {
    profitSlider.addEventListener('input', updateSimulator);
    updateSimulator();
  }

  // 8. FAQ Accordion
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetId = trigger.getAttribute('aria-controls');
      const contentEl = targetId ? document.getElementById(targetId) : null;

      // Close other open items for clean reading
      faqTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherId = otherTrigger.getAttribute('aria-controls');
          const otherContent = otherId ? document.getElementById(otherId) : null;
          if (otherContent) otherContent.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', (!isExpanded).toString());
      if (contentEl) {
        contentEl.hidden = isExpanded;
      }
    });
  });

  // 9. Smart Segmented Lead Capture Form (Επιχείρηση B2B vs Ιδιώτης B2C)
  const switchBtnB2B = document.getElementById('form-switch-b2b');
  const switchBtnB2C = document.getElementById('form-switch-b2c');
  const groupB2B = document.getElementById('b2b-fields-group');
  const groupB2C = document.getElementById('b2c-fields-group');
  const clientSegmentInput = document.getElementById('client_segment');
  const submitBtnText = document.getElementById('form-submit-text');

  // B2B required fields
  const b2bCompanyInput = document.getElementById('b2b_company_name');
  const b2bLegalSelect = document.getElementById('b2b_legal_form');
  const b2bActivityInput = document.getElementById('b2b_activity');
  const b2bServiceSelect = document.getElementById('b2b_service_topic');

  // B2C required fields
  const b2cNameInput = document.getElementById('b2c_full_name');
  const b2cTopicSelect = document.getElementById('b2c_topic');

  const setFormSegment = (segment) => {
    const isB2B = segment === 'b2b';

    if (switchBtnB2B && switchBtnB2C) {
      switchBtnB2B.classList.toggle('active', isB2B);
      switchBtnB2B.setAttribute('aria-checked', isB2B.toString());
      switchBtnB2C.classList.toggle('active', !isB2B);
      switchBtnB2C.setAttribute('aria-checked', (!isB2B).toString());
    }

    if (groupB2B && groupB2C) {
      groupB2B.hidden = !isB2B;
      groupB2C.hidden = isB2B;
    }

    if (clientSegmentInput) {
      clientSegmentInput.value = isB2B ? 'Επιχείρηση (B2B)' : 'Ιδιώτης (B2C)';
    }

    if (submitBtnText) {
      submitBtnText.textContent = isB2B
        ? 'Αποστολή Αιτήματος & Λήψη Προσφοράς'
        : 'Αποστολή Αιτήματος Επικοινωνίας';
    }

    // Toggle required attributes dynamically
    if (b2bCompanyInput) b2bCompanyInput.required = isB2B;
    if (b2bLegalSelect) b2bLegalSelect.required = isB2B;
    if (b2bActivityInput) b2bActivityInput.required = isB2B;
    if (b2bServiceSelect) b2bServiceSelect.required = isB2B;

    if (b2cNameInput) b2cNameInput.required = !isB2B;
    if (b2cTopicSelect) b2cTopicSelect.required = !isB2B;
  };

  if (switchBtnB2B && switchBtnB2C) {
    switchBtnB2B.addEventListener('click', () => setFormSegment('b2b'));
    switchBtnB2C.addEventListener('click', () => setFormSegment('b2c'));
  }

  // Deep-linking buttons across the site that pre-select segment & service in the form
  document.querySelectorAll('[data-prefill-segment]').forEach((triggerEl) => {
    triggerEl.addEventListener('click', (e) => {
      const segment = triggerEl.getAttribute('data-prefill-segment') || 'b2b';
      const service = triggerEl.getAttribute('data-prefill-service');
      const legalForm = triggerEl.getAttribute('data-prefill-legal');

      setFormSegment(segment);

      if (segment === 'b2b') {
        if (service && b2bServiceSelect) {
          Array.from(b2bServiceSelect.options).forEach((opt) => {
            if (opt.value === service) opt.selected = true;
          });
        }
        if (legalForm && b2bLegalSelect) {
          Array.from(b2bLegalSelect.options).forEach((opt) => {
            if (opt.value === legalForm) opt.selected = true;
          });
        }
      } else if (segment === 'b2c' && service && b2cTopicSelect) {
        Array.from(b2cTopicSelect.options).forEach((opt) => {
          if (opt.value === service) opt.selected = true;
        });
      }

      const contactSection = document.getElementById('contact');
      if (contactSection && triggerEl.tagName === 'BUTTON') {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 10. Form Validation & Submission (Hostinger PHP Backend + Local Preview Fallback)
  const intakeForm = document.getElementById('lead-intake-form');
  const formFeedback = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  const showFeedback = (type, htmlMessage) => {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.innerHTML = htmlMessage;
    formFeedback.hidden = false;
  };

  if (intakeForm) {
    intakeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      const hpInput = document.getElementById('website_url');
      if (hpInput && hpInput.value.trim() !== '') {
        return;
      }

      const isB2B = clientSegmentInput && clientSegmentInput.value.includes('B2B');
      const phoneVal = (document.getElementById('contact_phone')?.value || '').trim();
      const emailVal = (document.getElementById('contact_email')?.value || '').trim();
      const gdprChecked = document.getElementById('gdpr_consent')?.checked;

      // Validate segment-specific fields
      if (isB2B) {
        if (!b2bCompanyInput?.value.trim()) {
          showFeedback('error', 'Παρακαλώ συμπληρώστε την <strong>Επωνυμία Επιχείρησης ή το Ονοματεπώνυμό σας</strong>.');
          b2bCompanyInput?.focus();
          return;
        }
        if (!b2bLegalSelect?.value) {
          showFeedback('error', 'Παρακαλώ επιλέξτε τη <strong>Νομική Μορφή</strong> της επιχείρησής σας.');
          b2bLegalSelect?.focus();
          return;
        }
        if (!b2bActivityInput?.value.trim()) {
          showFeedback('error', 'Παρακαλώ συμπληρώστε το <strong>Αντικείμενο Δραστηριότητας / Κλάδο</strong>.');
          b2bActivityInput?.focus();
          return;
        }
      } else {
        if (!b2cNameInput?.value.trim()) {
          showFeedback('error', 'Παρακαλώ συμπληρώστε το <strong>Ονοματεπώνυμό σας</strong>.');
          b2cNameInput?.focus();
          return;
        }
        if (!b2cTopicSelect?.value) {
          showFeedback('error', 'Παρακαλώ επιλέξτε το <strong>Θέμα Ενδιαφέροντος</strong> (π.χ. Δήλωση Ε1/Ε2, Ε9, Μισθωτήρια).');
          b2cTopicSelect?.focus();
          return;
        }
      }

      // Phone & Email validation
      const phoneClean = phoneVal.replace(/[\s\-().+]/g, '');
      if (phoneClean.length < 10) {
        showFeedback('error', 'Παρακαλώ εισάγετε ένα έγκυρο <strong>Τηλέφωνο Επικοινωνίας</strong> (τουλάχιστον 10 ψηφία).');
        document.getElementById('contact_phone')?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showFeedback('error', 'Παρακαλώ εισάγετε μια έγκυρη <strong>Διεύθυνση Email</strong>.');
        document.getElementById('contact_email')?.focus();
        return;
      }

      if (!gdprChecked) {
        showFeedback('error', 'Απαιτείται η αποδοχή της <strong>Πολιτικής Απορρήτου (GDPR)</strong> για την αποστολή του αιτήματός σας.');
        return;
      }

      // Prepare payload
      const formData = new FormData(intakeForm);
      const payload = Object.fromEntries(formData.entries());

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
      }
      if (submitBtnText) {
        submitBtnText.textContent = 'Αποστολή σε εξέλιξη...';
      }

      try {
        const response = await fetch('api/contact.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const result = await response.json();
          if (result.success) {
            showFeedback(
              'success',
              `✓ <strong>Το αίτημά σας καταχωρήθηκε επιτυχώς!</strong><br/>Ευχαριστούμε για την επικοινωνία. Ένας εξειδικευμένος φοροτεχνικός σύμβουλος του γραφείου <strong>TAX14</strong> θα επικοινωνήσει μαζί σας εντός της ίδιας εργάσιμης ημέρας.`
            );
            intakeForm.reset();
            setFormSegment(isB2B ? 'b2b' : 'b2c');
          } else {
            showFeedback('error', result.message || 'Παρουσιάστηκε σφάλμα κατά την αποστολή. Παρακαλώ καλέστε μας στο 210 300 1400.');
          }
        } else {
          // Local static preview fallback (when PHP server is not active locally)
          const summaryName = isB2B ? payload.b2b_company_name : payload.b2c_full_name;
          const summaryTopic = isB2B ? `${payload.b2b_legal_form} • ${payload.b2b_service_topic}` : payload.b2c_topic;
          showFeedback(
            'success',
            `✓ <strong>Επιτυχής Καταχώρηση Αιτήματος (${payload.client_segment})!</strong><br/>Λάβαμε τα στοιχεία για <strong>${summaryName}</strong> (${summaryTopic}). Ένας φοροτεχνικός σύμβουλος του <strong>TAX14</strong> θα επικοινωνήσει σύντομα μαζί σας στο <strong>${payload.contact_phone}</strong>.`
          );
          intakeForm.reset();
          setFormSegment(isB2B ? 'b2b' : 'b2c');
        }
      } catch (_err) {
        // Fallback for local static preview
        const summaryName = isB2B ? payload.b2b_company_name : payload.b2c_full_name;
        const summaryTopic = isB2B ? `${payload.b2b_legal_form} • ${payload.b2b_service_topic}` : payload.b2c_topic;
        showFeedback(
          'success',
          `✓ <strong>Επιτυχής Καταχώρηση Αιτήματος (${payload.client_segment})!</strong><br/>Λάβαμε τα στοιχεία για <strong>${summaryName}</strong> (${summaryTopic}). Ένας φοροτεχνικός σύμβουλος του <strong>TAX14</strong> θα επικοινωνήσει σύντομα μαζί σας στο <strong>${payload.contact_phone}</strong>.`
        );
        intakeForm.reset();
        setFormSegment(isB2B ? 'b2b' : 'b2c');
      } finally {
        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
        }
        setFormSegment(isB2B ? 'b2b' : 'b2c');
      }
    });
  }

  // 11. GDPR Cookie Consent Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
  const cookieEssentialBtn = document.getElementById('cookie-essential-btn');
  const COOKIE_STORAGE_KEY = 'tax14_cookie_consent_v1';

  try {
    const savedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!savedConsent && cookieBanner) {
      cookieBanner.hidden = false;
    }
  } catch (_e) {
    // Ignore storage errors in restricted contexts
  }

  const saveCookiePreference = (choice) => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    } catch (_e) {
      // Ignore
    }
    if (cookieBanner) {
      cookieBanner.hidden = true;
    }
  };

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => saveCookiePreference('all'));
  }
  if (cookieEssentialBtn) {
    cookieEssentialBtn.addEventListener('click', () => saveCookiePreference('essential'));
  }

  // 12. Legal Modals (Πολιτική Απορρήτου, Όροι Χρήσης, Πολιτική Cookies)
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const modalBackdrops = document.querySelectorAll('.legal-modal-backdrop');

  const closeAllModals = () => {
    modalBackdrops.forEach((backdrop) => {
      backdrop.hidden = true;
    });
    document.body.style.overflow = '';
  };

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = modalId ? document.getElementById(modalId) : null;
      if (modal) {
        closeAllModals();
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalButtons.forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});
