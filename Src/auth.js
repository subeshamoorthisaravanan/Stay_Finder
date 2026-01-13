// loader.js - Loader functionality for Stay Finder

class LoaderManager {
    constructor() {
        this.loader = document.getElementById('mainLoader');
        this.minLoaderTime = 1000; // Minimum loader display time (1 second)
        this.maxLoaderTime = 3000; // Maximum loader display time (3 seconds)
        this.startTime = Date.now();
        this.isContentLoaded = false;
        this.loaderTimeout = null;
        this.init();
    }

    init() {
        // Start loading timer
        this.startLoadingTimer();
        
        // Listen for page load event
        window.addEventListener('load', () => {
            this.contentLoaded();
        });
        
        // Listen for DOM content loaded event (faster)
        document.addEventListener('DOMContentLoaded', () => {
            // We don't hide yet, wait for images and other resources
            this.domContentLoaded();
        });
        
        // Fallback: hide loader after max time
        this.loaderTimeout = setTimeout(() => {
            this.hideLoader();
        }, this.maxLoaderTime);
    }

    startLoadingTimer() {
        this.startTime = Date.now();
        console.log('Loader started at:', new Date().toLocaleTimeString());
    }

    domContentLoaded() {
        console.log('DOM content loaded');
        // DOM is ready, but we still wait for minimum time
    }

    contentLoaded() {
        this.isContentLoaded = true;
        console.log('Page fully loaded');
        
        // Calculate elapsed time
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoaderTime - elapsedTime);
        
        // Wait for minimum loader time if needed
        if (remainingTime > 0) {
            console.log(`Waiting ${remainingTime}ms to meet minimum loader time`);
            setTimeout(() => {
                this.hideLoader();
            }, remainingTime);
        } else {
            this.hideLoader();
        }
    }

    hideLoader() {
        // Clear the fallback timeout
        if (this.loaderTimeout) {
            clearTimeout(this.loaderTimeout);
        }
        
        if (!this.loader) {
            console.warn('Loader element not found');
            return;
        }
        
        // Add fade-out animation class
        this.loader.classList.add('fade-out');
        
        // Update loading text to completed
        const loadingText = this.loader.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = 'Ready!';
            loadingText.style.color = '#4CAF50';
        }
        
        // Stop dot animation
        const dots = this.loader.querySelector('.dots');
        if (dots) {
            dots.style.opacity = '0';
        }
        
        console.log('Hiding loader...');
        
        // Remove loader from DOM after animation
        setTimeout(() => {
            this.loader.style.display = 'none';
            
            // Trigger custom event for other scripts
            window.dispatchEvent(new CustomEvent('loaderHidden'));
            
            // Add class to body to indicate loader is hidden
            document.body.classList.add('loader-hidden');
            
            console.log('Loader hidden at:', new Date().toLocaleTimeString());
            
            // Optional: send analytics event
            this.sendLoaderAnalytics();
        }, 500); // Match this with CSS animation duration
    }

    sendLoaderAnalytics() {
        // In a real app, you would send this to your analytics service
        const loadTime = Date.now() - this.startTime;
        console.log(`Total load time: ${loadTime}ms`);
        
        // Example: Send to Google Analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                'load_time': loadTime,
                'page_path': window.location.pathname
            });
        }
    }

    showLoader() {
        // Reset and show loader (for AJAX navigation, etc.)
        if (this.loader) {
            this.loader.classList.remove('fade-out');
            this.loader.style.display = 'flex';
            
            // Reset loading text
            const loadingText = this.loader.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Loading...';
                loadingText.style.color = '';
            }
            
            // Show dots again
            const dots = this.loader.querySelector('.dots');
            if (dots) {
                dots.style.opacity = '1';
            }
            
            this.startTime = Date.now();
        }
    }

    // Static method for quick initialization
    static initialize() {
        if (!LoaderManager.instance) {
            LoaderManager.instance = new LoaderManager();
        }
        return LoaderManager.instance;
    }
}

// Create loader manager instance
document.addEventListener('DOMContentLoaded', () => {
    const loaderManager = LoaderManager.initialize();
    
    // Make loader manager available globally for other scripts
    window.LoaderManager = loaderManager;
    
    // Optional: Add loader to AJAX requests
    if (typeof window.jQuery !== 'undefined') {
        // jQuery AJAX loader integration
        $(document).ajaxStart(function() {
            loaderManager.showLoader();
        });
        
        $(document).ajaxStop(function() {
            // Quick show/hide for AJAX requests
            setTimeout(() => {
                loaderManager.hideLoader();
            }, 500);
        });
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Page was loaded from cache, hide loader immediately
            loaderManager.hideLoader();
        }
    });
    
    // Handle page unload (when navigating away)
    window.addEventListener('beforeunload', () => {
        // Show loader immediately when leaving page
        loaderManager.showLoader();
    });
});

// Additional loader utility functions
const LoaderUtils = {
    // Show a mini loader for specific elements
    showMiniLoader: function(element, text = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'mini-loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span>${text}</span>
        `;
        
        element.style.position = 'relative';
        element.appendChild(loader);
        
        return loader;
    },
    
    // Hide mini loader
    hideMiniLoader: function(element) {
        const loader = element.querySelector('.mini-loader');
        if (loader) {
            loader.remove();
        }
    },
    
    // Show full-page overlay loader for specific actions
    showOverlayLoader: function(text = 'Processing...') {
        const overlay = document.createElement('div');
        overlay.className = 'overlay-loader';
        overlay.id = 'overlayLoader';
        overlay.innerHTML = `
            <div class="overlay-content">
                <div class="spinner-large"></div>
                <div class="overlay-text">${text}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        return overlay;
    },
    
    // Hide overlay loader
    hideOverlayLoader: function() {
        const overlay = document.getElementById('overlayLoader');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }
};

// Make utility functions available globally
window.LoaderUtils = LoaderUtils;