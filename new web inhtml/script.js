/**
 * Gallery Section Interactive Features
 * - Category filtering
 * - Lightbox functionality
 * - Animation enhancements
 * - Lazy loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery functionality when DOM is fully loaded
    initGallery();
    // Initialize news section functionality
    initNewsSection();
});

function initGallery() {
    // Elements
    const galleryGrid = document.querySelector('#gallery .grid');
    const filterButtons = document.querySelectorAll('#gallery .flex.justify-center button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const expandIcons = document.querySelectorAll('.gallery-item .fa-expand');
    
    // Track current filter
    let currentFilter = 'All';
    
    // Add data attributes to gallery items based on their categories
    galleryItems.forEach(item => {
        const categoryEl = item.querySelector('span.inline-block');
        if (categoryEl) {
            const category = categoryEl.textContent.trim();
            item.setAttribute('data-category', category);
        }
    });
    
    // Filter button functionality
    filterButtons.forEach(button => {
        // Set initial active state
        if (button.textContent.trim() === 'All') {
            button.classList.add('active');
        }
        
        // Add click event
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary/80');
                btn.classList.add('bg-white/10');
            });
            
            this.classList.remove('bg-white/10');
            this.classList.add('active', 'bg-primary/80');
            
            // Get filter value
            currentFilter = this.textContent.trim();
            
            // Filter items
            filterGalleryItems(currentFilter);
        });
    });
    
    // Lightbox functionality
    expandIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const galleryItem = this.closest('.gallery-item');
            const imgSrc = galleryItem.querySelector('img').src;
            const title = galleryItem.querySelector('h3').textContent;
            const description = galleryItem.querySelector('p').textContent;
            
            openLightbox(imgSrc, title, description);
        });
    });
    
    // Make gallery items clickable
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            openLightbox(imgSrc, title, description);
        });
    });
    
    // Initialize AOS-like scroll animations
    initScrollAnimations();
}

/**
 * Filter gallery items based on category
 */
function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Reset animations
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (filter === 'All' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                // Animate back in with delay based on index
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 * Array.from(galleryItems).indexOf(item));
            } else {
                item.style.display = 'none';
            }
        }, 300);
    });
}

/**
 * Create and open lightbox with image and details
 */
function openLightbox(imgSrc, title, description) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 opacity-0 transition-opacity duration-300';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden max-w-4xl w-full transform scale-95 transition-transform duration-300';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 text-white hover:bg-white/30 transition-all duration-300';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'w-full h-auto max-h-[70vh] object-contain';
    
    const contentInfo = document.createElement('div');
    contentInfo.className = 'p-6 text-white';
    contentInfo.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">${title}</h3>
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

// Dark Mode Toggle
function initDarkModeToggle() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");
  const mobileDarkModeToggle = document.getElementById("mobileDarkModeToggle");
  const mobileDarkModeIcon = document.getElementById("mobileDarkModeIcon");

  function setDarkMode(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    updateDarkModeButton(darkModeIcon, isDark);
    updateMobileDarkModeButton(mobileDarkModeIcon, isDark);
    localStorage.setItem("darkMode", isDark);
  }

  function updateDarkModeButton(iconEl, isDark) {
    iconEl.className = isDark ? "fas fa-sun text-lg" : "fas fa-moon text-lg";
  }

  function updateMobileDarkModeButton(iconEl, isDark) {
    iconEl.className = isDark ? "fas fa-sun text-lg" : "fas fa-moon text-lg";
  }

  // Initial state
  const savedTheme = localStorage.getItem("darkMode") === "true";
  if (savedTheme) {
    document.documentElement.classList.add("dark");
    updateDarkModeButton(darkModeIcon, savedTheme);
    updateMobileDarkModeButton(mobileDarkModeIcon, savedTheme);
  }

  // Desktop Dark Mode Toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = !document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    });
  }

  // Mobile Dark Mode Toggle
  if (mobileDarkModeToggle) {
    mobileDarkModeToggle.addEventListener("click", () => {
      const isDark = !document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    });
  }
}

// Add parallax effect to gallery background
function initParallaxEffect() {
    const gallerySection = document.getElementById('gallery');
    const bgElements = gallerySection.querySelectorAll('.absolute.top-0, .absolute.bottom-0');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const sectionTop = gallerySection.offsetTop;
        const sectionHeight = gallerySection.offsetHeight;
        
        // Check if section is in view
        if (scrollPosition > sectionTop - window.innerHeight && 
            scrollPosition < sectionTop + sectionHeight) {
            
            const parallaxValue = (scrollPosition - sectionTop) * 0.2;
            
            bgElements.forEach((el, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                el.style.transform = `translate3d(0, ${parallaxValue * direction}px, 0)`;
            });
        }
    });
}

// Initialize all gallery features
window.addEventListener('load', function() {
    initGallery();
    lazyLoadGalleryImages();
    initParallaxEffect();
});

/**
 * News & Events Section Interactive Features
 * - Category filtering
 * - Card animations
 * - Hover effects
 */
function initNewsSection() {
    // Elements
    const filterButtons = document.querySelectorAll('.news-filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    // Track current filter
    let currentFilter = 'all';
    
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
            const imgSrc = newsCard.querySelector('img').src;
            const title = newsCard.querySelector('h3').textContent;
            const description = newsCard.querySelector('p:nth-of-type(2)').textContent;
            
            openNewsLightbox(imgSrc, title, description);
        });
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
                // Animate back in with delay based on index
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * index);
            } else {
                card.style.display = 'none';
            }
        }, 300);
    });
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
 * Create and open lightbox for news items
 */
function openNewsLightbox(imgSrc, title, description) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 opacity-0 transition-opacity duration-300';
    
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
    
    const contentInfo = document.createElement('div');
    contentInfo.className = 'p-6 text-white';
    contentInfo.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">${title}</h3>
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