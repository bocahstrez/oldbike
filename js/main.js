/* OLD BIKE INDONESIA - Shared JavaScript */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('#mobile-menu a').forEach(function(item) {
            item.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // Details/summary animation enhancement
    document.querySelectorAll('details').forEach(function(detail) {
        const summary = detail.querySelector('summary');
        const content = detail.querySelector('.p-6') || detail.querySelector('[class*="border-t"]');
        
        if (summary && content) {
            summary.addEventListener('click', function(e) {
                // Let the native behavior handle open/close
                // Just add a small delay for visual effect
                setTimeout(function() {
                    if (detail.open) {
                        content.style.animation = 'fadeIn 0.3s ease-out';
                    }
                }, 10);
            });
        }
    });

    // Keyboard navigation for details
    document.querySelectorAll('details summary').forEach(function(summary) {
        summary.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add active class to current page nav link
    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        document.querySelectorAll('nav a').forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
        
        // Also for mobile menu
        document.querySelectorAll('#mobile-menu a').forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNav();

    // Handle logo fallback
    document.querySelectorAll('img[onerror]').forEach(function(img) {
        img.addEventListener('error', function() {
            if (this.src !== this.dataset.fallback) {
                this.src = this.dataset.fallback || 'https://placehold.co/48x48/1A1A1A/F8F4F0?text=OBI';
            }
        }, { once: true });
    });
});

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, throttle };
}