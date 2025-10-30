/* ==========================================
   Main JavaScript
   SISOBIO Corporate Website
   ========================================== */

/**
 * DOM Content Loaded Event
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('SISOBIO Website Loaded');
  
  // Initialize all modules
  initSmoothScroll();
  initScrollToTop();
  initHeaderScroll();
  initTabSwitching();
  
  // Log success
  console.log('All modules initialized');
});


/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  // Select all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Ignore links that just have "#" or are empty
      if (!href || href === '#') return;
      
      // Get target element
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Smooth scroll to target
        const headerOffset = 80; // Height of sticky header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without triggering scroll
        history.pushState(null, null, href);
      }
    });
  });
}


/**
 * Floating Scroll to Top Button
 */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (!scrollToTopBtn) return;
  
  // Show/hide button based on scroll position
  const toggleButtonVisibility = throttle(() => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show button after scrolling down 400px
    if (scrollPosition > 400) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, 100);
  
  // Listen to scroll events
  window.addEventListener('scroll', toggleButtonVisibility);
  
  // Click event to scroll to top
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Optional: Focus on first element for accessibility
    const firstFocusable = document.querySelector('a, button, input, select, textarea');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  });
  
  // Keyboard accessibility: Enter or Space key
  scrollToTopBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTopBtn.click();
    }
  });
  
  console.log('Floating scroll to top button initialized');
}


/**
 * Header Shadow on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow when scrolled down
      if (currentScroll > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
}


/**
 * Tab Switching (Certifications Section)
 */
function initTabSwitching() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Get target tab content
      const targetId = tab.getAttribute('data-tab');
      
      if (!targetId) return;
      
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('tab--active'));
      
      // Add active class to clicked tab
      tab.classList.add('tab--active');
      
      // Hide all tab contents
      const allTabContents = document.querySelectorAll('.tab-content');
      allTabContents.forEach(content => {
        content.classList.remove('tab-content--active');
      });
      
      // Show target tab content
      const targetContent = document.getElementById(`tab-${targetId}`);
      if (targetContent) {
        targetContent.classList.add('tab-content--active');
      }
    });
  });
}


/**
 * Intersection Observer for Scroll Animations (Optional)
 * Uncomment if you want to add scroll animations
 */
/*
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  const animatedElements = document.querySelectorAll('.business-card, .product-card, .cert-card');
  animatedElements.forEach(el => observer.observe(el));
}
*/


/**
 * Utility: Debounce Function
 */
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  
  return function executedFunction() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}


/**
 * Utility: Throttle Function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  
  return function() {
    const args = arguments;
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


/**
 * Export functions for use in other modules (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle
  };
}
