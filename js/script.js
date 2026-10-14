/**
 * ==========================================================================
 * Shahd Walid - Personal Developer Portfolio Script
 * Vanilla JavaScript (ES6+) Implementation
 * 
 * Features:
 * 1. Dark/Light Theme Switcher with localStorage persistence
 * 2. Accessible Mobile Navigation Menu
 * 3. Scroll-triggered Animations via Intersection Observer
 * 4. Active Navigation State Highlighting
 * 5. Smooth Anchor Scrolling & Keyboard Navigation
 * 6. Interactive Project Placeholder Notice Modal
 * 7. Accessible Contact Form Client-side Validation & Feedback
 * 8. Back-to-Top Button with Visibility Threshold
 * 9. Dynamic Footer Copyright Year
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME SWITCHING (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const THEME_STORAGE_KEY = 'sw_portfolio_theme';

  /**
   * Applies the requested theme to document and updates accessible attributes.
   * @param {string} theme - 'dark' or 'light'
   */
  const setTheme = (theme) => {
    const activeTheme = theme === 'light' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', activeTheme);
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme);

    if (themeToggleBtn) {
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} mode`);
    }
  };

  // Initialize theme: Check localStorage first, default to dark
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Default theme requested: Dark mode
    setTheme('dark');
  }

  // Toggle button event listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(targetTheme);
    });
  }


  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    if (!navToggleBtn || !navMenu) return;
    navToggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    if (!navToggleBtn || !navMenu) return;
    navToggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        closeMobileMenu();
        navToggleBtn.focus();
      }
    });

    // Close menu if resized above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('is-active')) {
        closeMobileMenu();
      }
    });
  }


  /* --------------------------------------------------------------------------
     3. SCROLL-TRIGGERED ANIMATIONS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const animatableElements = document.querySelectorAll('.animate-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If reduced motion is preferred or observer unsupported, show elements immediately
    animatableElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const scrollObserverOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, scrollObserverOptions);

    animatableElements.forEach((el) => scrollObserver.observe(el));
  }


  /* --------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120; // Offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
  highlightActiveNavLink(); // Initial check on load


  /* --------------------------------------------------------------------------
     5. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');

  const toggleBackToTopButton = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  if (backToTopBtn) {
    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }


  /* --------------------------------------------------------------------------
     6. PROJECT PLACEHOLDER INTERACTION MODAL
     -------------------------------------------------------------------------- */
  const projectActionButtons = document.querySelectorAll('.project-action-btn[data-action]');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  const openProjectModal = (type, projectTitle) => {
    if (!projectModal) return;

    if (type === 'placeholder-demo') {
      modalTitle.textContent = `${projectTitle} — Live Demo Notice`;
      modalMessage.textContent = `The live deployment for "${projectTitle}" is currently undergoing final staging and will be published once hosting configuration is complete.`;
    } else {
      modalTitle.textContent = `${projectTitle} — Repository Notice`;
      modalMessage.textContent = `The source repository for "${projectTitle}" is currently organized in a private workspace and will be linked publicly upon release. Please refer to the feature specifications listed on this page.`;
    }

    projectModal.removeAttribute('hidden');
    modalActionBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  projectActionButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const actionType = btn.getAttribute('data-action');
      const card = btn.closest('.project-card');
      const titleElem = card ? card.querySelector('.project-title') : null;
      const title = titleElem ? titleElem.textContent.trim() : 'Project';
      openProjectModal(actionType, title);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeProjectModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !projectModal.hasAttribute('hidden')) {
        closeProjectModal();
      }
    });
  }


  /* --------------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & SIMULATED FEEDBACK
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  // Regex pattern for standard RFC email validation
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  /**
   * Sets or clears validation error message on a form field
   */
  const setFieldError = (input, errorElementId, errorMessage) => {
    const errorElement = document.getElementById(errorElementId);
    if (!input || !errorElement) return;

    if (errorMessage) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      errorElement.textContent = errorMessage;
    } else {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      errorElement.textContent = '';
    }
  };

  /**
   * Validates individual form fields
   */
  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      setFieldError(nameInput, 'name-error', 'Please enter your name.');
      return false;
    }
    if (val.length < 2) {
      setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
      return false;
    }
    setFieldError(nameInput, 'name-error', '');
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, 'email-error', 'Please enter your email address.');
      return false;
    }
    if (!emailPattern.test(val)) {
      setFieldError(emailInput, 'email-error', 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    setFieldError(emailInput, 'email-error', '');
    return true;
  };

  const validateSubject = () => {
    const val = subjectInput.value.trim();
    if (!val) {
      setFieldError(subjectInput, 'subject-error', 'Please provide a subject.');
      return false;
    }
    if (val.length < 3) {
      setFieldError(subjectInput, 'subject-error', 'Subject must be at least 3 characters.');
      return false;
    }
    setFieldError(subjectInput, 'subject-error', '');
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (!val) {
      setFieldError(messageInput, 'message-error', 'Please enter your message.');
      return false;
    }
    if (val.length < 10) {
      setFieldError(messageInput, 'message-error', 'Message must be at least 10 characters.');
      return false;
    }
    setFieldError(messageInput, 'message-error', '');
    return true;
  };

  // Real-time validation listeners on blur and input
  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => { if (nameInput.classList.contains('invalid')) validateName(); });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => { if (emailInput.classList.contains('invalid')) validateEmail(); });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', validateSubject);
    subjectInput.addEventListener('input', () => { if (subjectInput.classList.contains('invalid')) validateSubject(); });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', () => { if (messageInput.classList.contains('invalid')) validateMessage(); });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        // Focus the first invalid field
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulation of submission process
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Validating...';
      }

      setTimeout(() => {
        // Display clear feedback specifying this is a frontend demonstration
        if (formFeedback) {
          formFeedback.removeAttribute('hidden');
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Form validated successfully!</strong><br>
            <em>Frontend Demonstration Notice:</em> No email backend is attached, so this message was not transmitted to a server. To connect directly with Shahd Walid, please reach out via <a href="https://www.linkedin.com/in/shahd-walid1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: bold; color: inherit;">LinkedIn</a>.
          `;
        }

        // Reset form inputs
        contactForm.reset();

        // Restore submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Send Message';
        }
      }, 700);
    });
  }


  /* --------------------------------------------------------------------------
     8. DYNAMIC COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
