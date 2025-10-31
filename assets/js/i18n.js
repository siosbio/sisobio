/* ==========================================
   i18n (Internationalization)
   SISOBIO Corporate Website
   Korean/English Language Switching
   ========================================== */

/**
 * i18n Manager
 */
class I18nManager {
  constructor() {
    this.STORAGE_KEY = 'sisobio-language';
    this.currentLanguage = this.getInitialLanguage();
    this.translations = {};
    
    this.init();
  }
  
  /**
   * Initialize i18n system
   */
  async init() {
    try {
      // Load translations
      await this.loadTranslations(this.currentLanguage);
      
      // Apply translations
      this.applyTranslations();
      
      // Render dynamic content (timeline, contact, footer)
      this.renderDynamicContent();
      
      // Setup language toggle
      this.setupLanguageToggle();
      
      // Update document lang attribute
      document.documentElement.setAttribute('lang', this.currentLanguage === 'ko' ? 'ko' : 'en');
      
      console.log(`i18n initialized: ${this.currentLanguage}`);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
    }
  }
  
  /**
   * Get initial language (priority: localStorage → browser → default)
   */
  getInitialLanguage() {
    // Check localStorage first
    const storedLanguage = localStorage.getItem(this.STORAGE_KEY);
    if (storedLanguage === 'ko' || storedLanguage === 'en') {
      return storedLanguage;
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ko')) {
      return 'ko';
    }
    
    // Default to Korean
    return 'ko';
  }
  
  /**
   * Load translations from JSON file
   */
  async loadTranslations(language) {
    try {
      // Add cache busting timestamp to prevent browser caching
      const timestamp = new Date().getTime();
      const response = await fetch(`assets/locales/${language}.json?v=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${language}.json: ${response.status}`);
      }
      
      this.translations = await response.json();
      console.log(`Loaded translations for: ${language} (cache-busted: v${timestamp})`);
      
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);
      
      // Fallback to Korean if English fails
      if (language === 'en') {
        console.log('Falling back to Korean');
        this.currentLanguage = 'ko';
        await this.loadTranslations('ko');
      }
    }
  }
  
  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Check if element is an input with placeholder
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.setAttribute('placeholder', translation);
        }
        // Check if element has aria-label
        else if (element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', translation);
        }
        // Default: set text content
        else {
          element.textContent = translation;
        }
      } else {
        console.warn(`Translation not found for key: ${key}`);
      }
    });
    
    // Apply language-specific images
    this.applyLanguageImages();
  }
  
  /**
   * Apply language-specific images (e.g., map images)
   */
  applyLanguageImages() {
    const lang = this.currentLanguage;
    
    // Update images with data-i18n-src-* attributes
    const images = document.querySelectorAll('img[data-i18n-src-kr][data-i18n-src-en]');
    images.forEach(img => {
      const srcKr = img.getAttribute('data-i18n-src-kr');
      const srcEn = img.getAttribute('data-i18n-src-en');
      
      const newSrc = (lang === 'ko' && srcKr) ? srcKr : (lang === 'en' && srcEn) ? srcEn : null;
      
      if (newSrc && img.src !== newSrc) {
        // Add cache-busting parameter to force reload
        const cacheBuster = `?lang=${lang}&t=${Date.now()}`;
        img.src = newSrc + cacheBuster;
      }
      
      // Update alt text if data-i18n-alt attribute exists
      const altKey = img.getAttribute('data-i18n-alt');
      if (altKey) {
        const altText = this.getTranslation(altKey);
        if (altText) {
          img.alt = altText;
        }
      }
    });
    
    // Update source elements with data-i18n-srcset-* attributes
    const sources = document.querySelectorAll('source[data-i18n-srcset-kr][data-i18n-srcset-en]');
    sources.forEach(source => {
      const srcsetKr = source.getAttribute('data-i18n-srcset-kr');
      const srcsetEn = source.getAttribute('data-i18n-srcset-en');
      
      const newSrcset = (lang === 'ko' && srcsetKr) ? srcsetKr : (lang === 'en' && srcsetEn) ? srcsetEn : null;
      
      if (newSrcset && source.srcset !== newSrcset) {
        // Add cache-busting parameter to force reload
        const cacheBuster = `?lang=${lang}&t=${Date.now()}`;
        source.srcset = newSrcset + cacheBuster;
        
        // Force browser to re-evaluate picture element
        const picture = source.closest('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            // Trigger reload by temporarily removing and re-adding src
            const currentSrc = img.src;
            img.src = '';
            setTimeout(() => {
              img.src = currentSrc;
            }, 0);
          }
        }
      }
    });
    
    console.log(`Language-specific images applied for: ${lang}`);
  }
  
  /**
   * Render dynamic content (Timeline, Contact info, Footer)
   */
  renderDynamicContent() {
    this.renderTimeline();
    this.renderContactInfo();    
  }
  
  /**
   * Render Timeline items dynamically from JSON with multi-line events
   */
  renderTimeline() {
    const timelineContainer = document.querySelector('.timeline');
    
    if (!timelineContainer) {
      console.warn('Timeline container not found');
      return;
    }
    
    const timelineItems = this.getTranslation('about.timeline.items');
    
    if (!Array.isArray(timelineItems) || timelineItems.length === 0) {
      console.warn('Timeline items not found or empty');
      return;
    }
    
    // Clear existing items
    timelineContainer.innerHTML = '';
    
    // Render new items
    timelineItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'timeline__item';
      
      // Create year element
      const yearDiv = document.createElement('div');
      yearDiv.className = 'timeline__year';
      yearDiv.textContent = item.year;
      
      // Create content element with multiple events
      const contentDiv = document.createElement('div');
      contentDiv.className = 'timeline__content';
      
      // If events is an array, create multiple paragraphs
      if (Array.isArray(item.events)) {
        item.events.forEach((event, index) => {
          const p = document.createElement('p');
          p.textContent = event;
          // Add margin between paragraphs except for the last one
          if (index < item.events.length - 1) {
            p.style.marginBottom = '0.5rem';
          }
          contentDiv.appendChild(p);
        });
      } else {
        // Fallback to single description if events array doesn't exist
        contentDiv.textContent = item.description || '';
      }
      
      li.appendChild(yearDiv);
      li.appendChild(contentDiv);
      timelineContainer.appendChild(li);
    });
    
    console.log(`Rendered ${timelineItems.length} timeline items`);
  }
  
  /**
   * Render Contact information dynamically
   */
  renderContactInfo() {
    const phoneValue = this.getTranslation('contact.info.phoneValue');
    const addressValue = this.getTranslation('contact.info.addressValue');
    
    // Update phone numbers in contact section (only update href, text is handled by data-i18n)
    const contactPhoneLinks = document.querySelectorAll('.contact-item a[href^="tel:"]');
    contactPhoneLinks.forEach(link => {
      if (phoneValue) {
        // Clean phone number for href (remove hyphens)
        const cleanPhone = phoneValue.replace(/-/g, '');        

        // Apply different tel: format based on language
        if (this.currentLanguage === 'ko') {
          // Korean: tel:07080189079 (domestic format)
          link.href = `tel:${cleanPhone}`;
        } else {
          // English: tel:+8207080189079 (international format)
          link.href = `tel:+82${cleanPhone}`;
        }
        // Do NOT set textContent here - it's already handled by data-i18n="contact.info.phoneValue"
      }
    });
    
    // Update contact address - force update even if data-i18n attribute exists
    const contactAddressDd = document.querySelector('.contact-item dd[data-i18n="contact.info.addressValue"]');
    if (contactAddressDd && addressValue) {
      contactAddressDd.textContent = addressValue;
      console.log(`Contact address updated to: ${addressValue}`);
    }
    
    console.log('Contact info updated');
  }
  
  /**
   * Get translation by key (supports nested keys like "nav.about")
   */
  getTranslation(key) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  }
  
  /**
   * Switch language
   */
  async switchLanguage(language) {
    if (language !== 'ko' && language !== 'en') {
      console.error(`Invalid language: ${language}`);
      return;
    }
    
    try {
      // Load new translations
      await this.loadTranslations(language);
      
      // Apply translations
      this.applyTranslations();
      
      // Re-render dynamic content
      this.renderDynamicContent();
      
      // Update current language
      this.currentLanguage = language;
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, language);
      
      // Update document lang attribute
      document.documentElement.setAttribute('lang', language === 'ko' ? 'ko' : 'en');
      
      // Update toggle button text
      this.updateToggleButtonText();
      
      // Update font family
      this.updateFontFamily(language);
      
      // Log for debugging
      console.log(`Language switched to: ${language}`);
      
      // Dispatch custom event
      const event = new CustomEvent('languagechange', {
        detail: { language: language }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error(`Failed to switch language to ${language}:`, error);
    }
  }
  
  /**
   * Setup language toggle button
   */
  setupLanguageToggle() {
    const toggleButton = document.getElementById('languageToggle');
    
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        const newLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
        this.switchLanguage(newLanguage);
      });
      
      // Initialize button text
      this.updateToggleButtonText();
    }
  }
  
  /**
   * Update toggle button text
   */
  updateToggleButtonText() {
    const toggleButton = document.getElementById('languageToggle');
    
    if (toggleButton) {
      const span = toggleButton.querySelector('span[data-i18n="nav.language"]');
      if (span) {
        // Show the opposite language (current: KO → show: EN)
        span.textContent = this.currentLanguage === 'ko' ? 'EN' : 'KO';
      }
      
      // Update aria-label
      toggleButton.setAttribute('aria-label', 
        this.currentLanguage === 'ko' ? 'Switch to English' : '한국어로 전환'
      );
    }
  }
  
  /**
   * Update font family based on language
   */
  updateFontFamily(language) {
    const body = document.body;
    
    if (language === 'ko') {
      body.style.fontFamily = "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif";
    } else {
      body.style.fontFamily = "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif";
    }
  }
  
  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  /**
   * Translate a specific key programmatically
   */
  translate(key) {
    return this.getTranslation(key);
  }
}


/**
 * Initialize i18n Manager when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  window.i18nManager = new I18nManager();
});


/**
 * Keyboard Shortcut: Ctrl/Cmd + Shift + L to toggle language
 */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
    e.preventDefault();
    if (window.i18nManager) {
      const newLanguage = window.i18nManager.getCurrentLanguage() === 'ko' ? 'en' : 'ko';
      window.i18nManager.switchLanguage(newLanguage);
    }
  }
});


/**
 * Export for use in other modules (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
}
