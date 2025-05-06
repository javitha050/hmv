/**
 * News & Events Section Interactive Features
 * 
 * Features:
 * - Category Filtering: Filter news items by category (All, Events, Announcements, Achievements)
 * - Smooth Animations: Cards animate in/out when filtering between categories
 * - Scroll-Based Animations: News cards animate into view as the user scrolls down the page
 * - Lightbox Preview: Clicking on a card or its expand icon opens a lightbox with full image and details
 * - Accessibility Features: ARIA attributes and keyboard navigation support
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize news section functionality
    initNewsSection();
});

/**
 * Initialize all news section functionality
 */
function initNewsSection() {
    // Elements
    const filterButtons = document.querySelectorAll('.news-filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    // Track current filter
    let currentFilter = 'all';
    
    // Set initial state for news cards
    setInitialCardStates();
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Get filter value
            currentFilter = this.getAttribute('data-category');
            
            // Filter news cards
            filterNewsCards(currentFilter);
            
            // Announce to screen readers
            announceFilterChange(currentFilter);
        });
        
        // Keyboard support for filter buttons
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Initialize animations for cards in viewport
    animateNewsCardsOnScroll();
    
    // Add expand functionality to corner elements
    const expandIcons = document.querySelectorAll('.news-card .fa-expand');
    expandIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const newsCard = this.closest('.news-card');
            openNewsLightboxFromCard(newsCard);
        });
        
        // Keyboard support for expand icons
        icon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make expand icons focusable
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('role', 'button');
        icon.setAttribute('aria-label', 'Expand news item');
    });
    
    // Make news cards clickable
    newsCards.forEach(card => {
        card.addEventListener('click', function() {
            openNewsLightboxFromCard(this);
        });
        
        // Add keyboard support for cards
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openNewsLightboxFromCard(this);
            }
        });
    });
    
    // Add parallax effect to news section background
    initNewsParallaxEffect();
}

/**
 * Set initial states for news cards
 */
function setInitialCardStates() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        // Get category from badge
        const categoryBadge = card.querySelector('.absolute.top-4.left-4');
        if (categoryBadge) {
            const category = categoryBadge.textContent.trim().toLowerCase();
            card.setAttribute('data-category', category);
            
            // Add category to aria-label
            const currentLabel = card.getAttribute('aria-label') || '';
            card.setAttribute('aria-label', `${category} - ${currentLabel}`);
        }
    });
}

/**
 * Filter news cards based on category
 */
function filterNewsCards(filter) {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach((card, index) => {
        // Reset animations
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.setAttribute('aria-hidden', 'false');
                
                // Animate back in with delay based on index
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * index);
            } else {
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
            }
        }, 300);
    });
}

/**
 * Announce filter change to screen readers
 */
function announceFilterChange(filter) {
    // Create or get existing live region
    let liveRegion = document.getElementById('news-filter-announce');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'news-filter-announce';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
    }
    
    // Set the announcement text
    const filterText = filter === 'all' ? 'all news' : filter;
    liveRegion.textContent = `Filtered to show ${filterText}`;
    
    // Clear after announcement
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

/**
 * Animate news cards when they enter the viewport
 */
function animateNewsCardsOnScroll() {
    const newsCards = document.querySelectorAll('.news-card');
    
    // Set initial state
    newsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Animation on scroll
    function animateOnScroll() {
        newsCards.forEach(card => {
            if (isInViewport(card)) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Run once on load
    setTimeout(animateOnScroll, 300);
    
    // Add scroll event
    window.addEventListener('scroll', animateOnScroll);
}

/**
 * Open lightbox from a news card
 */
function openNewsLightboxFromCard(card) {
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p:nth-of-type(2)').textContent;
    const category = card.getAttribute('data-category') || '';
    
    openNewsLightbox(imgSrc, title, description, category);
}

/**
 * Create and open lightbox for news items
 */
function openNewsLightbox(imgSrc, title, description, category = '') {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 opacity-0 transition-opacity duration-300';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-labelledby', 'lightbox-title');
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden max-w-4xl w-full transform scale-95 transition-transform duration-300';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 text-white hover:bg-white/30 transition-all duration-300';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close');
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'w-full h-auto max-h-[70vh] object-contain';
    img.alt = title;
    
    // Add category badge if available
    let categoryEl = '';
    if (category) {
        const categoryClass = getCategoryColorClass(category);
        categoryEl = `
            <div class="inline-block px-3 py-1 ${categoryClass} text-white text-xs font-bold rounded-full mb-2">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
        `;
    }
    
    const contentInfo = document.createElement('div');
    contentInfo.className = 'p-6 text-white';
    contentInfo.innerHTML = `
        ${categoryEl}
        <h3 id="lightbox-title" class="text-2xl font-bold mb-2">${title}</h3>
        <p class="text-white/80">${description}</p>
    `;
    
    // Assemble lightbox
    lightboxContent.appendChild(closeBtn);
    lightboxContent.appendChild(img);
    lightboxContent.appendChild(contentInfo);
    lightbox.appendChild(lightboxContent);
    
    // Add to DOM
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
        lightboxContent.style.transform = 'scale(1)';
    }, 10);
    
    // Focus the close button for keyboard navigation
    setTimeout(() => {
        closeBtn.focus();
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', escHandler);
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        lightboxContent.style.transform = 'scale(95%)';
        
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    }
}

/**
 * Get color class based on category
 */
function getCategoryColorClass(category) {
    switch(category.toLowerCase()) {
        case 'event':
            return 'bg-primary/80';
        case 'announcement':
            return 'bg-accent/80';
        case 'achievement':
            return 'bg-secondary/80';
        default:
            return 'bg-primary/80';
    }
}

/**
 * Add parallax effect to news section background
 */
function initNewsParallaxEffect() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;
    
    const bgElements = newsSection.querySelectorAll('.absolute.top-0, .absolute.bottom-0, .particles .particle');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const sectionTop = newsSection.offsetTop;
        const sectionHeight = newsSection.offsetHeight;
        
        // Check if section is in view
        if (scrollPosition > sectionTop - window.innerHeight && 
            scrollPosition < sectionTop + sectionHeight) {
            
            const parallaxValue = (scrollPosition - sectionTop) * 0.2;
            
            bgElements.forEach((el, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                const intensity = 0.5 + (index % 3) * 0.2; // Vary the intensity
                el.style.transform = `translate3d(0, ${parallaxValue * direction * intensity}px, 0)`;
            });
        }
    });
}

// Initialize news features on page load
window.addEventListener('load', function() {
    initNewsSection();
});