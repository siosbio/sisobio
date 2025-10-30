/* ==========================================
   Navigation (Mobile Menu)
   SISOBIO Corporate Website
   ========================================== */

/**
 * Navigation Manager
 */
class NavigationManager {
  constructor() {
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.mobileMenuLinks = this.mobileMenu ? this.mobileMenu.querySelectorAll('a') : [];
    this.isOpen = false;
    
    this.init();
  }
  
  /**
   * Initialize navigation system
   */
  init() {
    if (!this.mobileMenuToggle || !this.mobileMenu) {
      console.warn('Mobile menu elements not found');
      return;
    }
    
    // Setup toggle button
    this.setupToggleButton();
    
    // Setup menu link clicks
    this.setupMenuLinks();
    
    // Setup outside click
    this.setupOutsideClick();
    
    // Setup escape key
    this.setupEscapeKey();
    
    // Setup resize handler
    this.setupResizeHandler();
    
    console.log('Navigation initialized');
  }
  
  /**
   * Setup toggle button
   */
  setupToggleButton() {
    this.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });
  }
  
  /**
   * Toggle mobile menu open/close
   */
  toggleMenu() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }
  
  /**
   * Open mobile menu
   */
  openMenu() {
    this.isOpen = true;
    
    // Update aria attributes
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    if (this.mobileMenuLinks.length > 0) {
      setTimeout(() => {
        this.mobileMenuLinks[0].focus();
      }, 100);
    }
    
    console.log('Mobile menu opened');
  }
  
  /**
   * Close mobile menu
   */
  closeMenu() {
    this.isOpen = false;
    
    // Update aria attributes
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Mobile menu closed');
  }
  
  /**
   * Setup menu links (close menu on click)
   */
  setupMenuLinks() {
    this.mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu after clicking a link
        setTimeout(() => {
          this.closeMenu();
        }, 300);
      });
    });
  }
  
  /**
   * Setup outside click (close menu when clicking outside)
   */
  setupOutsideClick() {
    document.addEventListener('click', (e) => {
      if (!this.isOpen) return;
      
      // Check if click is outside menu and toggle button
      const isClickInsideMenu = this.mobileMenu.contains(e.target);
      const isClickOnToggle = this.mobileMenuToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        this.closeMenu();
      }
    });
  }
  
  /**
   * Setup escape key (close menu on ESC)
   */
  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
        this.mobileMenuToggle.focus();
      }
    });
  }
  
  /**
   * Setup resize handler (close menu on desktop resize)
   */
  setupResizeHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      
      resizeTimer = setTimeout(() => {
        // Close menu if window is resized to desktop width
        if (window.innerWidth >= 1024 && this.isOpen) {
          this.closeMenu();
        }
      }, 250);
    });
  }
  
  /**
   * Setup keyboard navigation within menu
   */
  setupKeyboardNavigation() {
    this.mobileMenu.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      const focusableElements = Array.from(this.mobileMenuLinks);
      const currentIndex = focusableElements.indexOf(document.activeElement);
      
      // Arrow Down: Next item
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      }
      
      // Arrow Up: Previous item
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex].focus();
      }
      
      // Home: First item
      if (e.key === 'Home') {
        e.preventDefault();
        focusableElements[0].focus();
      }
      
      // End: Last item
      if (e.key === 'End') {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    });
  }
  
  /**
   * Get menu state
   */
  isMenuOpen() {
    return this.isOpen;
  }
}


/**
 * Initialize Navigation Manager when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
});


/**
 * Prevent scrolling when mobile menu is open
 */
document.addEventListener('touchmove', (e) => {
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
    // Allow scrolling within menu
    if (mobileMenu.contains(e.target)) {
      return;
    }
    
    // Prevent body scroll
    e.preventDefault();
  }
}, { passive: false });


/**
 * Export for use in other modules (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}
