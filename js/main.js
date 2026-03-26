/* =============================================
   ROYAL MASON MAC — Global JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Navbar ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger / Mobile Menu ── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Reveal (fade-up) ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.05}s`;
    observer.observe(el);
  });

  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1500;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }, 16);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── Contact Form Validation (contact.html) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const err = field.nextElementSibling;
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err && err.classList.contains('field-error')) err.classList.add('show');
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('error');
          if (err && err.classList.contains('field-error')) {
            err.textContent = 'Please enter a valid email address.';
            err.classList.add('show');
          }
          valid = false;
        } else {
          field.classList.remove('error');
          if (err && err.classList.contains('field-error')) err.classList.remove('show');
        }
      });

      if (!valid) return;

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('formSuccess');
      const errorMsg   = document.getElementById('formError');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(contactForm);
        const res  = await fetch(contactForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (res.ok) {
          successMsg && (successMsg.style.display = 'block');
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        errorMsg && (errorMsg.style.display = 'block');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });

    /* Real-time validation clear */
    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.classList.remove('error');
          const err = field.nextElementSibling;
          if (err && err.classList.contains('field-error')) err.classList.remove('show');
        }
      });
    });
  }

  /* ── Calendly Script Loader ── */
  if (document.getElementById('calendlyWidget')) {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
});
