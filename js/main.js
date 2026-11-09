/**
 * TAX14 — Λογιστική & Φοροτεχνική Συμβουλευτική (Αθήνα)
 * Interactive UX Architecture & Smart Segmented Lead Capture
 */

import { sendContactEnquiry } from './contact-delivery.mjs?v=email2';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const navigationLinks = [...document.querySelectorAll('.main-nav a, .mobile-drawer a[href^="#"], .header-actions a[href="#contact"]')];
  const pageSections = [...document.querySelectorAll('main > section[id]')];
  let navigationFrame = null;
  const updateActiveNavigation = () => {
    navigationFrame = null;
    const marker = (document.getElementById('site-header')?.getBoundingClientRect().bottom || 78) + 48;
    let current = '';
    pageSections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    });
    if (current === 'services') {
      const filter = document.querySelector('[data-service-filter].active')?.getAttribute('data-service-filter');
      current = filter === 'b2c' || (filter === 'all' && location.hash === '#services-b2c') ? 'services-b2c' : 'services-b2b';
    }
    navigationLinks.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleNavigationUpdate = () => {
    if (navigationFrame === null) navigationFrame = requestAnimationFrame(updateActiveNavigation);
  };
  window.addEventListener('resize', scheduleNavigationUpdate);
  window.addEventListener('load', scheduleNavigationUpdate);
  window.addEventListener('hashchange', scheduleNavigationUpdate);

  // 2. Sticky Header Scroll State
  const siteHeader = document.getElementById('site-header');
  const handleScroll = () => {
    scheduleNavigationUpdate();
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
    mobileToggle.setAttribute('aria-label', 'Άνοιγμα μενού πλοήγησης');
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', (!isExpanded).toString());
      mobileDrawer.hidden = isExpanded;
      mobileToggle.setAttribute('aria-label', isExpanded ? 'Άνοιγμα μενού πλοήγησης' : 'Κλείσιμο μενού πλοήγησης');
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileDrawer && !mobileDrawer.hidden) {
      closeMobileDrawer();
      mobileToggle.focus();
    }
  });
  window.matchMedia('(min-width: 1121px)').addEventListener('change', closeMobileDrawer);

  // Keep the full selector available on desktop and reveal it on demand on mobile.
  const folderToggle = document.getElementById('folder-toggle');
  const folderContent = document.getElementById('folder-content');
  const folderDesktopTitle = document.getElementById('folder-desktop-title');
  const compactHero = window.matchMedia('(max-width: 760px)');
  let mobileFolderExpanded = false;
  const updateFolderDisclosure = () => {
    if (!folderToggle || !folderContent || !folderDesktopTitle) return;
    const expanded = !compactHero.matches || mobileFolderExpanded;
    const toggleHadFocus = document.activeElement === folderToggle;
    folderToggle.hidden = !compactHero.matches;
    folderDesktopTitle.hidden = compactHero.matches;
    // Move focus before hiding content when crossing a responsive breakpoint.
    if (!expanded && folderContent.contains(document.activeElement)) folderToggle.focus();
    folderContent.hidden = !expanded;
    if (!compactHero.matches && toggleHadFocus) {
      document.querySelector('[data-dashboard-tab][aria-selected="true"]')?.focus();
    }
    folderToggle.setAttribute('aria-expanded', String(expanded));
  };
  folderToggle?.addEventListener('click', () => {
    mobileFolderExpanded = !mobileFolderExpanded;
    updateFolderDisclosure();
  });
  compactHero.addEventListener('change', updateFolderDisclosure);
  updateFolderDisclosure();

  // 4. Service selector tabs (businesses and individuals)
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
    scheduleNavigationUpdate();
    filterPills.forEach((pill) => {
      const isMatch = pill.getAttribute('data-service-filter') === filterValue;
      pill.classList.toggle('active', isMatch);
      pill.setAttribute('aria-pressed', isMatch.toString());
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

  // Resolve direct links and browser history even when a service is filtered out.
  const revealLinkedService = () => {
    const segment = location.hash === '#services-b2b' ? 'b2b'
      : location.hash === '#services-b2c' ? 'b2c' : null;
    if (segment) {
      setServiceFilter(segment);
      document.getElementById(`services-${segment}`)?.scrollIntoView({ behavior: 'instant' });
    }
  };
  document.querySelectorAll('a[href="#services-b2b"], a[href="#services-b2c"]').forEach((link) => {
    link.addEventListener('click', () => setServiceFilter(link.hash.endsWith('b2b') ? 'b2b' : 'b2c'));
  });
  window.addEventListener('hashchange', revealLinkedService);
  revealLinkedService();

  // 6. Interactive Legal Entity Comparison Guide (Ατομική, ΟΕ/ΕΕ, ΙΚΕ, ΑΕ)
  const entityData = {
    atomiki: {
      badge: 'Για ελεύθερους επαγγελματίες και νέες επιχειρήσεις',
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
      badge: 'Για οικογενειακές και συνεταιριστικές επιχειρήσεις',
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
      badge: 'Για αναπτυσσόμενες επιχειρήσεις',
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
      badge: 'Για μεγάλες επιχειρήσεις και επενδυτικά σχήματα',
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
      document.getElementById('entity-detail-card')?.setAttribute('aria-labelledby', tab.id);

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
  const profitAmount = document.getElementById('profit-amount');
  const profitInputError = document.getElementById('profit-input-error');
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

  if (profitSlider && profitAmount) {
    const clearProfitError = () => {
      profitAmount.removeAttribute('aria-invalid');
      profitInputError.hidden = true;
    };
    profitSlider.addEventListener('input', () => {
      profitAmount.value = profitSlider.value;
      clearProfitError();
      updateSimulator();
    });
    profitAmount.addEventListener('input', () => {
      if (profitAmount.value === '' || !profitAmount.validity.valid) return;
      profitSlider.value = profitAmount.value;
      clearProfitError();
      updateSimulator();
    });
    const validateProfitAmount = () => {
      if (profitAmount.value !== '' && profitAmount.validity.valid) return;
      profitAmount.setAttribute('aria-invalid', 'true');
      profitInputError.textContent = 'Συμπληρώστε ακέραιο ποσό από 15.000 € έως 150.000 €. Η σύγκριση δείχνει το τελευταίο έγκυρο ποσό.';
      profitInputError.hidden = false;
    };
    profitAmount.addEventListener('blur', validateProfitAmount);
    profitAmount.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); validateProfitAmount(); }
    });
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
      submitBtnText.textContent = 'Στείλτε αίτημα επικοινωνίας';
    }

    document.querySelectorAll('[data-optional-segment]').forEach(group => {
      group.hidden = group.getAttribute('data-optional-segment') !== segment;
      group.querySelectorAll('input, select, textarea').forEach(field => { field.disabled = group.hidden; });
    });

    // Hidden segment controls must not validate or enter the request payload.
    [groupB2B, groupB2C].forEach((group) => {
      group?.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = group.hidden; });
    });

    // Toggle required attributes dynamically
    if (b2bCompanyInput) b2bCompanyInput.required = isB2B;
    if (b2bLegalSelect) b2bLegalSelect.required = false;
    if (b2bActivityInput) b2bActivityInput.required = false;
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
          document.getElementById('optional-details').open = true;
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
        contactSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        (segment === 'b2b' ? b2bCompanyInput : b2cNameInput)?.focus({ preventScroll: true });
      }
    });
  });

  const setupChoiceKeyboard = (selector, selectedAttribute) => {
    const buttons = [...document.querySelectorAll(selector)];
    const sync = () => buttons.forEach((button) => {
      button.tabIndex = button.getAttribute(selectedAttribute) === 'true' ? 0 : -1;
    });
    buttons.forEach((button, index) => {
      button.addEventListener('click', sync);
      button.addEventListener('keydown', (event) => {
        const nextIndex = { ArrowRight: (index + 1) % buttons.length,
          ArrowLeft: (index - 1 + buttons.length) % buttons.length,
          Home: 0, End: buttons.length - 1 }[event.key];
        if (nextIndex === undefined) return;
        event.preventDefault();
        buttons[nextIndex].click();
        buttons[nextIndex].focus();
      });
    });
    sync();
  };
  setupChoiceKeyboard('[data-dashboard-tab]', 'aria-selected');
  setupChoiceKeyboard('[data-entity]', 'aria-selected');
  setupChoiceKeyboard('[data-form-segment]', 'aria-checked');
  setFormSegment('b2b');

  // 10. Form validation and delivery feedback
  const intakeForm = document.getElementById('lead-intake-form');
  const formFeedback = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  const errorSummary = document.getElementById('form-errors');
  const showFeedback = (type, message) => {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.textContent = message;
    formFeedback.hidden = false;
    formFeedback.focus();
  };
  const preferredMode = document.getElementById('preferred_mode');
  const syncContactMethod = () => {
    const emailSelected = preferredMode.value === 'Απάντηση μέσω Email';
    ['phone', 'email'].forEach(channel => {
      const active = (channel === 'email') === emailSelected;
      const group = document.getElementById(`${channel}-contact-group`);
      const field = document.getElementById(`contact_${channel}`);
      group.hidden = !active;
      field.disabled = !active;
      field.required = active;
    });
  };
  syncContactMethod();

  const validationMessage = (field) => {
    if (field.disabled) return '';
    if (!field.required && !field.value.trim()) return '';
    if (field.type === 'checkbox' && !field.checked) return 'Χρειάζεται η συγκατάθεσή σας για να επικοινωνήσουμε μαζί σας.';
    if (field.required && !field.value.trim()) return 'Συμπληρώστε αυτό το πεδίο.';
    if (field.id === 'contact_phone' && !/^\+?[\d\s().-]+$/.test(field.value.trim())) return 'Χρησιμοποιήστε μόνο ψηφία και προαιρετικά τον κωδικό χώρας.';
    if (field.id === 'contact_phone' && (field.value.replace(/\D/g, '').length < 10 || field.value.replace(/\D/g, '').length > 15)) return 'Συμπληρώστε τηλέφωνο με 10 έως 15 ψηφία.';
    if (field.type === 'email' && field.validity.typeMismatch) return 'Συμπληρώστε έγκυρο email, π.χ. name@example.gr.';
    return '';
  };
  const clearFieldError = (field) => {
    document.getElementById(`${field.id}-error`)?.remove();
    field.removeAttribute('aria-invalid');
    const describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== `${field.id}-error`);
    if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
    else field.removeAttribute('aria-describedby');
  };
  if (intakeForm) {
    const fields = [...intakeForm.querySelectorAll('input:not([type="hidden"]), select, textarea')]
      .filter(field => field.id !== 'website_url');
    const clearValidation = () => {
      fields.forEach(clearFieldError);
      errorSummary.hidden = true;
      formFeedback.hidden = true;
    };
    preferredMode.addEventListener('change', () => { syncContactMethod(); clearValidation(); });
    document.querySelectorAll('[data-form-segment], [data-prefill-segment]').forEach(button => {
      button.addEventListener('click', () => {
        clearValidation();
        document.querySelectorAll('[data-form-segment]').forEach(button => {
          button.tabIndex = button.getAttribute('aria-checked') === 'true' ? 0 : -1;
        });
      });
    });
    fields.forEach(field => {
      field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid') && !validationMessage(field)) {
          clearFieldError(field);
          errorSummary.querySelector(`a[href="#${field.id}"]`)?.closest('li').remove();
          if (!errorSummary.querySelector('li')) errorSummary.hidden = true;
        }
      });
    });
    intakeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (formSubmitBtn.disabled || document.getElementById('website_url')?.value.trim()) return;
      clearValidation();
      const invalidFields = fields.map(field => ({ field, message: validationMessage(field) })).filter(item => item.message);
      if (invalidFields.length) {
        const heading = document.createElement('strong');
        heading.textContent = 'Ελέγξτε τα παρακάτω πεδία:';
        const list = document.createElement('ul');
        errorSummary.replaceChildren(heading, list);
        invalidFields.forEach(({ field, message }) => {
          const error = document.createElement('p');
          error.id = `${field.id}-error`;
          error.className = 'field-error';
          error.textContent = message;
          field.setAttribute('aria-invalid', 'true');
          field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
          (field.closest('.form-group') || field.closest('.form-row') || field.parentElement).append(error);
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${field.id}`;
          link.textContent = field.id === 'gdpr_consent' ? 'Συγκατάθεση επικοινωνίας' : (field.labels?.[0]?.textContent.replace('*', '').trim() || message);
          link.addEventListener('click', (event) => { event.preventDefault(); field.focus(); });
          item.append(link);
          list.append(item);
        });
        errorSummary.hidden = false;
        errorSummary.focus();
        return;
      }
      const payload = Object.fromEntries(new FormData(intakeForm).entries());
      formSubmitBtn.disabled = true;
      intakeForm.setAttribute('aria-busy', 'true');
      submitBtnText.textContent = 'Αποστολή σε εξέλιξη…';
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        await sendContactEnquiry(payload, { sourceUrl: window.location.href, signal: controller.signal });
        showFeedback('success', 'Το δοκιμαστικό αίτημα έγινε δεκτό για αποστολή. Ελέγξτε το δοκιμαστικό email για την παραλαβή του. Στην πρώτη δοκιμή χρειάζεται ενεργοποίηση από το μήνυμα του FormSubmit.');
      } catch (error) {
        console.warn('TAX14 email request failed:', error.name, error.message);
        showFeedback('error', 'Δεν επιβεβαιώθηκε η αποστολή του δοκιμαστικού αιτήματος. Τα στοιχεία παραμένουν στη φόρμα. Ελέγξτε πρώτα το δοκιμαστικό email και τα ανεπιθύμητα πριν δοκιμάσετε ξανά.');
      } finally {
        window.clearTimeout(timeout);
        intakeForm.removeAttribute('aria-busy');
        formSubmitBtn.disabled = false;
        submitBtnText.textContent = 'Στείλτε αίτημα επικοινωνίας';
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

  let modalTrigger = null;
  let activeModal = null;
  let inertSiblings = [];
  const closeAllModals = () => {
    modalBackdrops.forEach((backdrop) => {
      backdrop.hidden = true;
    });
    document.body.style.overflow = '';
    inertSiblings.forEach(element => { element.inert = false; });
    inertSiblings = [];
    activeModal = null;
    modalTrigger?.focus();
    modalTrigger = null;
  };

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = modalId ? document.getElementById(modalId) : null;
      if (modal) {
        closeAllModals();
        modalTrigger = btn;
        activeModal = modal;
        modal.hidden = false;
        inertSiblings = [...document.body.children].filter(element => element !== modal && !element.inert && element.tagName !== 'SCRIPT');
        inertSiblings.forEach(element => { element.inert = true; });
        modal.querySelector('[data-close-modal]')?.focus();
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
    if (e.key === 'Tab' && activeModal) {
      const focusable = [...activeModal.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].filter(element => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});
