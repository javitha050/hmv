/**
 * About Section Interactive Features
 * 
 * Features:
 * - Scroll animations for cards and history section
 * - Advanced 3D hover effects with depth perception
 * - Counter animations for statistics with easing
 * - Parallax background effects with mouse movement
 * - Timeline animation for history section
 * - Image zoom and overlay effects
 * - Interactive button animations
 * - Accessibility enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize about section functionality
    initAboutSection();
});

/**
 * Initialize all about section functionality
 */
function initAboutSection() {
    // Animate elements when they enter viewport
    animateOnScroll();
    
    // Initialize statistics counters
    initCounters();
    
    // Add parallax effect to background elements
    initParallaxEffect();
    
    // Enhance card hover effects with 3D
    enhanceCardInteractions();
    
    // Add timeline animation to history section
    initHistoryTimeline();
    
    // Add image zoom and overlay effects
    enhanceImageInteractions();
    
    // Add interactive button animations
    enhanceButtonAnimations();
    
    // Add accessibility enhancements
    improveAccessibility();
    
    // Add mouse-based parallax effect
    initMouseParallax();
}

/**
 * Animate elements when they enter the viewport
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.group, .mt-24, .relative.mb-20');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Set initial state - hidden
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Function to animate elements in viewport
    function checkAndAnimate() {
        animatedElements.forEach((element, index) => {
            if (isInViewport(element)) {
                // Add staggered delay based on index
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }
    
    // Run on load and scroll
    checkAndAnimate();
    window.addEventListener('scroll', checkAndAnimate);
}

/**
 * Initialize and animate statistics counters with easing effects
 */
function initCounters() {
    const counters = document.querySelectorAll('#about .text-2xl, #about .text-3xl');
    
    counters.forEach(counter => {
        // Get target number from the text content
        const targetText = counter.textContent;
        const targetNumber = parseInt(targetText);
        
        // Skip if not a number or doesn't end with + sign
        if (isNaN(targetNumber) || !targetText.includes('+')) {
            return;
        }
        
        // Create wrapper for animation effects
        const parent = counter.parentNode;
        const wrapper = document.createElement('div');
        wrapper.className = 'counter-wrapper relative';
        parent.replaceChild(wrapper, counter);
        wrapper.appendChild(counter);
        
        // Add highlight effect element
        const highlight = document.createElement('div');
        highlight.className = 'absolute inset-0 bg-primary/10 rounded-lg scale-110 opacity-0';
        highlight.style.transition = 'opacity 0.5s ease';
        wrapper.insertBefore(highlight, counter);
        
        // Set initial value
        counter.textContent = '0';
        
        // Easing function for smooth animation
        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        
        // Function to animate counter with easing
        function animateCounter() {
            if (!isInViewport(counter)) return;
            
            // Show highlight effect
            highlight.style.opacity = '1';
            setTimeout(() => {
                highlight.style.opacity = '0';
            }, 1000);
            
            let startTime = null;
            const duration = 2500; // 2.5 seconds
            
            function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply easing function for smooth animation
                const easedProgress = easeOutExpo(progress);
                const currentNumber = Math.floor(easedProgress * targetNumber);
                
                // Update counter text
                counter.textContent = currentNumber + '+';
                
                // Add visual feedback during counting
                const scale = 1 + (1 - Math.abs(progress - 0.5) * 2) * 0.1;
                counter.style.transform = `scale(${scale})`;
                
                // Continue animation if not complete
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Animation complete
                    counter.textContent = targetText; // Restore original text with + sign
                    counter.style.transform = '';
                    
                    // Add completion effect
                    counter.style.textShadow = '0 0 10px rgba(231, 76, 60, 0.5)';
                    setTimeout(() => {
                        counter.style.textShadow = '';
                    }, 500);
                }
            }
            
            // Start animation with requestAnimationFrame for smoother performance
            requestAnimationFrame(updateCounter);
            
            // Remove scroll listener once animation starts
            window.removeEventListener('scroll', animateCounter);
        }
        
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Start animation when counter comes into view
        if (isInViewport(counter)) {
            // Slight delay for better visual effect when page loads
            setTimeout(animateCounter, 300);
        } else {
            window.addEventListener('scroll', animateCounter);
        }
    });
}

/**
 * Add parallax effect to background elements
 */
function initParallaxEffect() {
    const particles = document.querySelectorAll('#about .particle');
    const aboutSection = document.getElementById('about');
    
    if (!aboutSection || particles.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const sectionTop = aboutSection.offsetTop;
        const scrollRelative = scrollPosition - sectionTop;
        
        particles.forEach((particle, index) => {
            // Different speeds and directions for each particle
            const speed = 0.05 + (index * 0.02);
            const direction = index % 2 === 0 ? 1 : -1;
            
            if (scrollRelative > -500 && scrollRelative < 1000) {
                particle.style.transform = `translate(${direction * scrollRelative * speed}px, ${scrollRelative * speed * 0.5}px)`;
            }
        });
    });
}

/**
 * Enhance card hover interactions with advanced 3D effects
 */
function enhanceCardInteractions() {
    const cards = document.querySelectorAll('#about .group');
    
    cards.forEach(card => {
        // Get card elements
        const icon = card.querySelector('.text-5xl');
        const title = card.querySelector('h3');
        const arrow = card.querySelector('.fas.fa-arrow-right');
        const cornerElement = card.querySelector('.absolute.-top-2.-left-2');
        const statCounter = card.querySelector('.mt-6.flex');
        
        // Add light reflection effect
        const lightReflection = document.createElement('div');
        lightReflection.className = 'absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 pointer-events-none';
        card.querySelector('.glassmorphism')?.appendChild(lightReflection);
        
        // Add tilt effect on mouse move with enhanced 3D depth
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            // Calculate mouse position relative to card center
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation (max 8 degrees)
            const rotateX = mouseY / (cardRect.height / 2) * -8;
            const rotateY = mouseX / (cardRect.width / 2) * 8;
            
            // Calculate distance from center for light effect
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const maxDistance = Math.sqrt(Math.pow(cardRect.width / 2, 2) + Math.pow(cardRect.height / 2, 2));
            const intensity = 1 - (distance / maxDistance);
            
            // Apply transform with enhanced perspective
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.boxShadow = `
                0 ${15 + Math.abs(rotateY)}px ${25 + Math.abs(rotateX) * 2}px rgba(0, 0, 0, 0.1),
                ${rotateY * 0.5}px ${rotateX * -0.5}px ${10 + Math.abs(rotateY)}px rgba(0, 0, 0, 0.05)
            `;
            
            // Update light reflection based on mouse position
            if (lightReflection) {
                lightReflection.style.opacity = `${0.5 + intensity * 0.5}`;
                lightReflection.style.background = `
                    radial-gradient(
                        circle at ${(mouseX / cardRect.width + 0.5) * 100}% ${(mouseY / cardRect.height + 0.5) * 100}%, 
                        rgba(255, 255, 255, 0.2) 0%, 
                        rgba(255, 255, 255, 0) 60%
                    )
                `;
            }
            
            // Move elements for enhanced depth effect
            if (icon) {
                icon.style.transform = `translate(${mouseX * 0.08}px, ${mouseY * 0.08}px) scale(1.1)`;
                icon.style.textShadow = `${rotateY * 0.05}px ${rotateX * -0.05}px 5px rgba(0, 0, 0, 0.15)`;
            }
            
            if (title) {
                title.style.transform = `translate(${mouseX * 0.04}px, ${mouseY * 0.04}px)`;
            }
            
            if (cornerElement) {
                cornerElement.style.transform = `translate(${mouseX * -0.03}px, ${mouseY * -0.03}px)`;
            }
            
            if (statCounter) {
                statCounter.style.transform = `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)`;
            }
            
            if (arrow) {
                arrow.style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
            }
        });
        
        // Reset transform on mouse leave with smooth transition
        card.addEventListener('mouseleave', function() {
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            card.style.transform = '';
            card.style.boxShadow = '';
            
            if (lightReflection) lightReflection.style.opacity = '0';
            
            // Reset all elements with transition
            [icon, title, cornerElement, statCounter, arrow].forEach(el => {
                if (el) {
                    el.style.transition = 'transform 0.5s ease, text-shadow 0.5s ease';
                    el.style.transform = '';
                    if (el === icon) el.style.textShadow = '';
                    
                    // Remove transition after animation completes
                    setTimeout(() => {
                        if (el) el.style.transition = '';
                    }, 500);
                }
            });
            
            // Remove transition property after animation completes
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        // Add pulse effect to arrow on hover
        if (arrow) {
            card.addEventListener('mouseenter', function() {
                arrow.classList.add('animate-pulse');
            });
            
            card.addEventListener('mouseleave', function() {
                arrow.classList.remove('animate-pulse');
            });
        }
    });
}

/**
 * Initialize timeline animation for history section
 */
function initHistoryTimeline() {
    const historySection = document.querySelector('#about .mt-24');
    const timelineIndicator = document.querySelector('#about .h-0\\.5');
    
    if (!historySection || !timelineIndicator) return;
    
    // Set initial state
    timelineIndicator.style.width = '0';
    timelineIndicator.style.transition = 'width 1.5s ease-in-out';
    
    function animateTimeline() {
        if (isInViewport(historySection)) {
            timelineIndicator.style.width = '100%';
            // Remove event listener once animation is triggered
            window.removeEventListener('scroll', animateTimeline);
        }
    }
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Run on load and scroll
    animateTimeline();
    window.addEventListener('scroll', animateTimeline);
}

/**
 * Add image zoom and overlay effects to history section image
 */
function enhanceImageInteractions() {
    const historyImage = document.querySelector('#about .md\\:w-1\\/2.relative.group.overflow-hidden img');
    const imageOverlay = document.querySelector('#about .absolute.inset-0.bg-gradient-to-r');
    
    if (!historyImage || !imageOverlay) return;
    
    // Add magnifying glass icon on hover
    const magnifyIcon = document.createElement('div');
    magnifyIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
    magnifyIcon.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl opacity-0 transition-opacity duration-300 z-20';
    historyImage.parentNode.appendChild(magnifyIcon);
    
    // Add click event for fullscreen preview
    historyImage.parentNode.addEventListener('click', function() {
        createImageModal(historyImage.src);
    });
    
    // Add hover effects
    historyImage.parentNode.addEventListener('mouseenter', function() {
        magnifyIcon.style.opacity = '1';
    });
    
    historyImage.parentNode.addEventListener('mouseleave', function() {
        magnifyIcon.style.opacity = '0';
    });
}

/**
 * Create fullscreen image modal
 */
function createImageModal(imageSrc) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'max-w-full max-h-[90vh] object-contain';
    img.style.transform = 'scale(0.95)';
    img.style.transition = 'transform 0.3s ease';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.className = 'absolute top-4 right-4 text-white text-2xl bg-primary/80 w-10 h-10 rounded-full flex items-center justify-center';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    
    // Add elements to modal
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal function
    const closeModal = () => {
        modal.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    };
    
    // Add event listeners
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', escHandler);
            closeModal();
        }
    });
}

/**
 * Add interactive button animations
 */
function enhanceButtonAnimations() {
    const learnMoreBtn = document.querySelector('#about .group.relative.overflow-hidden.mt-4');
    
    if (!learnMoreBtn) return;
    
    // Add ripple effect on click
    learnMoreBtn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = learnMoreBtn.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        
        learnMoreBtn.appendChild(ripple);
        
        setTimeout(() => {
            learnMoreBtn.removeChild(ripple);
        }, 600);
    });
    
    // Add custom styles for ripple animation if not already in stylesheet
    if (!document.querySelector('#rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
            @keyframes ripple {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Add mouse-based parallax effect to background elements
 */
function initMouseParallax() {
    const aboutSection = document.getElementById('about');
    const particles = document.querySelectorAll('#about .particle');
    
    if (!aboutSection || particles.length === 0) return;
    
    aboutSection.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = aboutSection.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        // Calculate mouse position as percentage of section dimensions
        const xPercent = x / width - 0.5; // -0.5 to 0.5
        const yPercent = y / height - 0.5; // -0.5 to 0.5
        
        particles.forEach((particle, index) => {
            // Different intensities for each particle
            const intensity = 15 + (index * 5);
            const speedFactor = 1 + (index * 0.2);
            
            // Apply transform based on mouse position
            particle.style.transform = `translate(${xPercent * intensity * speedFactor}px, ${yPercent * intensity * speedFactor}px)`;
        });
    });
    
    // Reset particles position when mouse leaves section
    aboutSection.addEventListener('mouseleave', function() {
        particles.forEach(particle => {
            particle.style.transform = '';
        });
    });
}

/**
 * Improve accessibility for the about section
 */
function improveAccessibility() {
    // Add appropriate ARIA attributes to interactive elements
    const cards = document.querySelectorAll('#about .group');
    const historyImage = document.querySelector('#about .md\\:w-1\\/2.relative.group.overflow-hidden');
    const learnMoreBtn = document.querySelector('#about .group.relative.overflow-hidden.mt-4');
    
    // Make cards keyboard focusable and add ARIA roles
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Feature card ${index + 1}`);
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Trigger hover effect
                this.classList.add('keyboard-focus');
            }
        });
        
        card.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // Make image interactive for keyboard users
    if (historyImage) {
        historyImage.setAttribute('tabindex', '0');
        historyImage.setAttribute('role', 'button');
        historyImage.setAttribute('aria-label', 'View school history image');
        
        historyImage.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = this.querySelector('img');
                if (img) createImageModal(img.src);
            }
        });
    }
    
    // Ensure button has proper attributes
    if (learnMoreBtn) {
        if (!learnMoreBtn.getAttribute('aria-label')) {
            learnMoreBtn.setAttribute('aria-label', 'Learn more about our history');
        }
    }
    
    // Add skip link for keyboard navigation if not already present
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 z-50 rounded';
        skipLink.href = '#about';
        skipLink.textContent = 'Skip to About section';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// Initialize about section features on page load
window.addEventListener('load', function() {
    initAboutSection();
});

// Add custom styles for keyboard focus if not already in stylesheet
if (!document.querySelector('#keyboardFocusStyle')) {
    const style = document.createElement('style');
    style.id = 'keyboardFocusStyle';
    style.textContent = `
        .keyboard-focus {
            outline: 3px solid #e74c3c !important;
            outline-offset: 3px;
        }
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);
}