/* ==========================================
   Theme Toggle (Dark/Light Mode)
   Siso Bio Corporate Website
   ========================================== */

/**
 * Theme Manager
 */
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'sisobio-theme';
    this.THEME_ATTR = 'data-theme';
    this.currentTheme = this.getInitialTheme();
    
    this.init();
  }
  
  /**
   * Initialize theme system
   */
  init() {
    // Set initial theme
    this.applyTheme(this.currentTheme);
    
    // Setup toggle button
    this.setupToggleButton();
    
    // Listen for system theme changes
    this.listenForSystemThemeChanges();
    
    console.log(`Theme initialized: ${this.currentTheme}`);
  }
  
  /**
   * Get initial theme (priority: localStorage → system → default)
   */
  getInitialTheme() {
    // Check localStorage first
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  }
  
  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute(this.THEME_ATTR, theme);
    this.currentTheme = theme;
    
    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // Update logo based on theme
    this.updateLogo(theme);
    
    // Update button aria-label
    this.updateButtonLabel(theme);
  }
  
  /**
   * Update logo based on theme
   */
  updateLogo(theme) {
    const logoImg = document.querySelector('.nav__logo img');
    
    if (logoImg) {
      if (theme === 'dark') {
        // Dark mode: use white logo (logo.svg)
        logoImg.src = '/assets/images/icons/logo.svg';
      } else {
        // Light mode: use black logo (logo_black.svg)
        logoImg.src = '/assets/images/icons/logo_black.svg';
      }
    }
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Log for debugging
    console.log(`Theme toggled to: ${newTheme}`);
    
    // Dispatch custom event
    const event = new CustomEvent('themechange', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Setup toggle button
   */
  setupToggleButton() {
    const toggleButton = document.getElementById('themeToggle');
    
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Initialize button label
      this.updateButtonLabel(this.currentTheme);
    }
  }
  
  /**
   * Update button aria-label
   */
  updateButtonLabel(theme) {
    const toggleButton = document.getElementById('themeToggle');
    
    if (toggleButton) {
      if (theme === 'light') {
        toggleButton.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        toggleButton.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }
  }
  
  /**
   * Listen for system theme changes
   */
  listenForSystemThemeChanges() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
          // Only apply system theme if user hasn't manually set a preference
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
      // Legacy browsers
      else if (darkModeQuery.addListener) {
        darkModeQuery.addListener((e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  }
  
  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Set theme programmatically
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    }
  }
  
  /**
   * Reset theme to system default
   */
  resetTheme() {
    localStorage.removeItem(this.STORAGE_KEY);
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    this.applyTheme(systemTheme);
  }
}


/**
 * Initialize Theme Manager when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});


/**
 * Keyboard Shortcut: Ctrl/Cmd + Shift + T to toggle theme
 */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
    e.preventDefault();
    if (window.themeManager) {
      window.themeManager.toggleTheme();
    }
  }
});


/**
 * Export for use in other modules (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
