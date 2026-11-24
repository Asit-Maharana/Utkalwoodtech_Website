/**
 * UTKAL WOOD TECH - Haute Luxury Interactive Engine & Scroller Animations
 * Directors: Amit Moharana, Ajit Kumar Maharana, Asit Maharana
 * Mobile / WhatsApp: +91 7789959910
 * Location: Villideuli, PO-Villigram, PS-Nimapada, Puri 752106, Odisha
 * Domain: utkalwoodtech.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initPagePreloader();
  initScrollAnimations();
  initMobileMenu();
  initLuxuryEstimator();
  initPortfolioFilter();
  initCareerModal();
  initContactForm();
});

// Fast, Silky-Smooth Page Reveal
function initPagePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Instant smooth fade
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 80);
  }
  // Reveal all hero elements immediately
  document.querySelectorAll('.hero-lux .reveal-on-scroll').forEach(el => {
    el.classList.add('is-visible');
  });
}

// Scroller Progress & Scroll-Driven Reveal Animations
function initScrollAnimations() {
  const scrollBar = document.getElementById('scrollProgress');

  // Top Scroll Progress Tracking
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollBar) {
      scrollBar.style.width = scrolled + '%';
    }
  }, { passive: true });

  // IntersectionObserver for Smooth Reveal-on-Scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Active Navigation Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || ((current === 'quote' || current === 'calculator') && (href === '#quote' || href === '#calculator'))) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// Fully Responsive Mobile Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('hamburgerToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

      // Prevent background body scroll when drawer is open on mobile
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        toggleBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }
}

// Woodwork & Luxury Interior Cost Estimator
function initLuxuryEstimator() {
  const form = document.getElementById('luxEstimatorForm');
  if (!form) return;

  const propRadios = form.querySelectorAll('input[name="propType"]');
  const itemChecks = form.querySelectorAll('input[name="woodworkItems"]');
  const gradeSelect = document.getElementById('materialGradeSelect');

  const priceOutput = document.getElementById('calculatedPrice');
  const summaryProp = document.getElementById('summaryProp');
  const summaryCount = document.getElementById('summaryItemCount');
  const summaryGrade = document.getElementById('summaryMaterial');
  const waBtn = document.getElementById('whatsappEstimateBtn');

  const basePrices = {
    wardrobe: 42000,
    kitchen: 68000,
    tvunit: 25000,
    ceiling: 28000,
    pooja: 20000,
    doors: 26000,
    sunmica: 32000
  };

  const propMultipliers = {
    '1bhk': 1.0,
    '2bhk': 1.45,
    '3bhk': 1.95,
    'villa': 2.7,
    'commercial': 1.85
  };

  const gradeMultipliers = {
    'marine710': 1.35,
    'standard': 1.0,
    'luxury': 1.75
  };

  function recalculate() {
    let propVal = '2bhk';
    let propText = '2 BHK Apartment';
    propRadios.forEach(r => {
      if (r.checked) {
        propVal = r.value;
        propText = r.dataset.label || 'Apartment';
      }
    });

    let selectedNames = [];
    let sum = 0;
    let checkedCount = 0;

    itemChecks.forEach(ch => {
      if (ch.checked) {
        checkedCount++;
        sum += (basePrices[ch.value] || 25000);
        selectedNames.push(ch.dataset.name || ch.value);
      }
    });

    if (checkedCount === 0) {
      sum = 50000;
    }

    const gradeVal = gradeSelect.value;
    const gradeText = gradeSelect.options[gradeSelect.selectedIndex].text;
    const gradeMult = gradeMultipliers[gradeVal] || 1.35;
    const propMult = propMultipliers[propVal] || 1.0;

    const totalEstimate = sum * propMult * gradeMult;
    const minEst = Math.round((totalEstimate * 0.9) / 1000) * 1000;
    const maxEst = Math.round((totalEstimate * 1.15) / 1000) * 1000;

    const formattedRange = `₹${minEst.toLocaleString('en-IN')} - ₹${maxEst.toLocaleString('en-IN')}`;

    if (priceOutput) priceOutput.textContent = formattedRange;
    if (summaryProp) summaryProp.textContent = propText;
    if (summaryCount) summaryCount.textContent = `${checkedCount} Items Selected`;
    if (summaryGrade) summaryGrade.textContent = gradeText.split('(')[0].trim();

    if (waBtn) {
      const msg = encodeURIComponent(
        `*Namaskar Amit Moharana (Managing Director, Utkal Wood Tech)*,\n\n` +
        `I would like to discuss an interior woodwork quotation:\n` +
        `• *Property Layout:* ${propText}\n` +
        `• *Items:* ${selectedNames.join(', ') || 'Custom Woodwork'}\n` +
        `• *Material Grade:* ${gradeText}\n` +
        `• *Estimated Budget:* ${formattedRange}\n\n` +
        `*Headquarters:* Villideuli, Nimapada, Puri (PIN 752106)\n` +
        `Please schedule a free site consultation.`
      );
      waBtn.href = `https://wa.me/917789959910?text=${msg}`;
    }
  }

  propRadios.forEach(r => r.addEventListener('change', recalculate));
  itemChecks.forEach(ch => ch.addEventListener('change', recalculate));
  gradeSelect.addEventListener('change', recalculate);

  recalculate();
}

// Portfolio Filter
function initPortfolioFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const items = document.querySelectorAll('.gallery-lux-item');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Career Application Modal
function initCareerModal() {
  const modal = document.getElementById('careerModalLux');
  const closeBtn = document.getElementById('closeModalLux');
  const applyBtns = document.querySelectorAll('.btn-apply-lux');
  const roleField = document.getElementById('appliedRoleField');
  const careerForm = document.getElementById('careerFormLux');

  if (!modal) return;

  applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.dataset.role;
      const salary = btn.dataset.salary;
      if (roleField) {
        roleField.value = `${role} (Salary: ₹${salary}/month)`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('candName').value;
      const phone = document.getElementById('candPhone').value;
      const role = document.getElementById('appliedRoleField').value;
      const exp = document.getElementById('candExp').value;
      const location = document.getElementById('candLocation').value;

      const waText = encodeURIComponent(
        `*Job Application - Utkal Wood Tech*\n` +
        `*Managing Director:* Amit Moharana\n` +
        `*Headquarters:* Villideuli, Nimapada, Puri 752106\n\n` +
        `• *Position:* ${role}\n` +
        `• *Candidate Name:* ${name}\n` +
        `• *Phone Number:* ${phone}\n` +
        `• *Experience:* ${exp}\n` +
        `• *Current Address/District:* ${location}\n\n` +
        `I am ready to join your woodwork team immediately.`
      );

      window.open(`https://wa.me/917789959910?text=${waText}`, '_blank');
      closeModal();
      careerForm.reset();
    });
  }
}

// Contact Form Handler
function initContactForm() {
  const contactForm = document.getElementById('luxContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cxName').value;
    const phone = document.getElementById('cxPhone').value;
    const service = document.getElementById('cxService').value;
    const notes = document.getElementById('cxNotes').value;

    const waMsg = encodeURIComponent(
      `*New Bespoke Woodwork Enquiry - Utkal Wood Tech*\n` +
      `*To Directors:* Amit Moharana, Ajit Kumar Maharana, Asit Maharana\n\n` +
      `• *Client Name:* ${name}\n` +
      `• *Contact Number:* ${phone}\n` +
      `• *Requested Craft:* ${service}\n` +
      `• *Project Scope / Site Location:* ${notes || 'Site visit request'}\n\n` +
      `Please contact me for site measurement & 3D consultation.`
    );

    window.open(`https://wa.me/917789959910?text=${waMsg}`, '_blank');
    contactForm.reset();
  });
}
