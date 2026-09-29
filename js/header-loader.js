/* OLD BIKE INDONESIA - Header & Footer Loader */

async function loadPartial(placeholderId, partialPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(partialPath);
        if (!response.ok) throw new Error(`${partialPath} not found`);
        const html = await response.text();
        placeholder.outerHTML = html;
    } catch (err) {
        console.warn(`Partial load failed (${partialPath}):`, err);
    }
}

async function loadHeader() {
    await loadPartial('header-placeholder', 'partials/header.html');
    initHeaderInteractions();
}

async function loadFooter() {
    await loadPartial('footer-placeholder', 'partials/footer.html');
}

function initHeaderInteractions() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        document.querySelectorAll('#mobile-menu a').forEach(function(item) {
            item.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Set active nav based on current page
    setActiveNav();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, targetId);
            }
        });
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
}

function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const pageName = currentPage.replace('.html', '');

    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    document.querySelectorAll('.nav-link-mobile').forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load header and footer on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadHeader();
        loadFooter();
    });
} else {
    loadHeader();
    loadFooter();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadHeader, loadFooter, initHeaderInteractions, setActiveNav };
}