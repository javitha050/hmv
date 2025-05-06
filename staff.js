/**
 * Staff Section JavaScript Functionality
 * 
 * This file handles all interactive functionality for the Staff Section including:
 * - 3D card hover effects
 * - Staff filtering by department/role
 * - Scroll-based animations
 * - Staff profile modal/lightbox
 * - Responsive adaptations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all staff section functionality
  initStaffSection();
});

/**
 * Initialize all staff section functionality
 */
function initStaffSection() {
  initStaffCards();
  initStaffFilters();
  animateStaffCardsOnScroll();
  initStaffLightbox();
  initStaffParallaxEffect();
}

/**
 * Initialize staff cards with enhanced hover effects
 */
function initStaffCards() {
  const staffCards = document.querySelectorAll('.staff-card');
  
  staffCards.forEach(card => {
    // Add 3D tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
      const cardRect = this.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      // Calculate rotation based on mouse position
      const rotateY = (mouseX / (cardRect.width / 2)) * 5; // Max 5 degrees
      const rotateX = -(mouseY / (cardRect.height / 2)) * 5; // Max 5 degrees
      
      // Apply the rotation transform
      const cardContent = this.querySelector('.glassmorphism');
      cardContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05) translateY(-5px)`;
      
      // Add highlight effect based on mouse position
      const glare = this.querySelector('.card-glare') || document.createElement('div');
      if (!this.querySelector('.card-glare')) {
        glare.classList.add('card-glare');
        glare.style.position = 'absolute';
        glare.style.top = '0';
        glare.style.left = '0';
        glare.style.right = '0';
        glare.style.bottom = '0';
        glare.style.borderRadius = 'inherit';
        glare.style.pointerEvents = 'none';
        glare.style.background = 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)';
        this.querySelector('.glassmorphism').appendChild(glare);
      }
      
      // Update glare position
      const mouseXPercent = (e.offsetX / cardRect.width) * 100;
      const mouseYPercent = (e.offsetY / cardRect.height) * 100;
      glare.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      glare.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    });
    
    // Reset card on mouse leave
    card.addEventListener('mouseleave', function() {
      const cardContent = this.querySelector('.glassmorphism');
      cardContent.style.transform = '';
      
      // Remove glare effect
      const glare = this.querySelector('.card-glare');
      if (glare) {
        glare.remove();
      }
    });
    
    // Add click event to open staff profile
    card.addEventListener('click', function() {
      const staffName = this.querySelector('h3').textContent;
      const staffRole = this.querySelector('.absolute.-bottom-4').textContent.trim();
      const staffImage = this.querySelector('img').src;
      const staffQualification = this.querySelector('p:nth-of-type(1)').textContent.trim();
      const staffDescription = this.querySelector('p:nth-of-type(2)').textContent.trim();
      
      openStaffLightbox(staffName, staffRole, staffImage, staffQualification, staffDescription);
    });
    
    // Add keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View profile of ${card.querySelector('h3').textContent}`);
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Add hover effects to social icons
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.classList.add('animate-pulse');
    });
    
    icon.addEventListener('mouseleave', function() {
      this.classList.remove('animate-pulse');
    });
    
    // Stop propagation to prevent card click when clicking social icons
    icon.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

/**
 * Initialize staff filtering functionality
 */
function initStaffFilters() {
  // Check if filter buttons exist
  const filterContainer = document.querySelector('.staff-filters');
  if (!filterContainer) {
    // Create filter buttons if they don't exist
    createStaffFilters();
  }
  
  // Add event listeners to filter buttons
  const filterButtons = document.querySelectorAll('.staff-filter-btn');
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
      const filterValue = this.getAttribute('data-role');
      
      // Filter staff cards
      filterStaffCards(filterValue);
      
      // Announce to screen readers
      announceFilterChange(filterValue);
    });
  });
}

/**
 * Create filter buttons for staff section if they don't exist
 */
function createStaffFilters() {
  const staffSection = document.getElementById('staff');
  const sectionTitle = staffSection.querySelector('.relative.mb-20');
  
  // Create filter container
  const filterContainer = document.createElement('div');
  filterContainer.className = 'staff-filters flex flex-wrap justify-center gap-3 mb-10';
  filterContainer.setAttribute('role', 'group');
  filterContainer.setAttribute('aria-label', 'Filter staff by role');
  
  // Define filter categories
  const filters = [
    { role: 'all', label: 'All Staff', icon: 'fas fa-users' },
    { role: 'leadership', label: 'Leadership', icon: 'fas fa-crown' },
    { role: 'academic', label: 'Academic', icon: 'fas fa-graduation-cap' },
    { role: 'administrative', label: 'Administrative', icon: 'fas fa-briefcase' }
  ];
  
  // Create filter buttons
  filters.forEach((filter, index) => {
    const button = document.createElement('button');
    button.className = `staff-filter-btn px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${index === 0 ? 'active bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`;
    button.setAttribute('data-role', filter.role);
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    
    button.innerHTML = `
      <i class="${filter.icon}"></i>
      <span>${filter.label}</span>
    `;
    
    filterContainer.appendChild(button);
  });
  
  // Insert filter container after section title
  sectionTitle.parentNode.insertBefore(filterContainer, sectionTitle.nextSibling);
  
  // Add data-role attributes to existing staff cards
  const staffCards = document.querySelectorAll('.staff-card');
  staffCards.forEach(card => {
    const roleElement = card.querySelector('.absolute.-bottom-4');
    if (roleElement) {
      const roleText = roleElement.textContent.trim().toLowerCase();
      
      // Assign appropriate role category
      if (roleText.includes('principal')) {
        card.setAttribute('data-role', 'leadership');
      } else if (roleText.includes('head')) {
        card.setAttribute('data-role', 'academic');
      } else {
        card.setAttribute('data-role', 'administrative');
      }
    }
  });
}

/**
 * Filter staff cards based on selected role
 * @param {string} role - The role to filter by
 */
function filterStaffCards(role) {
  const staffCards = document.querySelectorAll('.staff-card');
  
  staffCards.forEach(card => {
    const cardRole = card.getAttribute('data-role');
    
    if (role === 'all' || cardRole === role) {
      // Show card with animation
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      // Hide card with animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

/**
 * Announce filter change to screen readers
 * @param {string} role - The selected role filter
 */
function announceFilterChange(role) {
  // Create or get existing live region
  let liveRegion = document.getElementById('staff-filter-announcement');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'staff-filter-announcement';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.appendChild(liveRegion);
  }
  
  // Set announcement text
  const roleText = role === 'all' ? 'all staff' : `${role} staff`;
  liveRegion.textContent = `Showing ${roleText}`;
}

/**
 * Initialize scroll-based animations for staff cards
 */
function animateStaffCardsOnScroll() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support Intersection Observer
    const staffCards = document.querySelectorAll('.staff-card');
    staffCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }
  
  // Set up the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered animation delay based on card index
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100); // 100ms stagger between cards
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  // Observe staff cards with initial hidden state
  const staffCards = document.querySelectorAll('.staff-card');
  staffCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

/**
 * Initialize staff lightbox/modal functionality
 */
function initStaffLightbox() {
  // Create lightbox container if it doesn't exist
  if (!document.getElementById('staff-lightbox')) {
    const lightbox = document.createElement('div');
    lightbox.id = 'staff-lightbox';
    lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    
    lightbox.innerHTML = `
      <div class="lightbox-content bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-2xl w-full mx-4 shadow-2xl transform scale-95 transition-transform duration-300">
        <div class="relative">
          <div class="absolute top-4 right-4 z-10">
            <button id="close-lightbox" class="bg-white/20 backdrop-blur-md text-gray-800 dark:text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="lightbox-header relative h-48 bg-gradient-to-r from-primary to-secondary overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div class="lightbox-profile flex flex-col items-center -mt-16 px-6 pb-6">
            <div class="profile-image-container relative mb-4">
              <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <img id="lightbox-image" src="" alt="Staff Member" class="w-full h-full object-cover">
              </div>
              <div id="lightbox-role" class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"></div>
            </div>
            
            <h3 id="lightbox-name" class="text-2xl font-bold mb-1 text-gray-800 dark:text-white"></h3>
            <p id="lightbox-qualification" class="text-gray-500 dark:text-gray-400 mb-4 italic"></p>
            
            <div class="w-16 h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full mb-4"></div>
            
            <p id="lightbox-description" class="text-gray-700 dark:text-gray-300 text-center mb-6"></p>
            
            <div class="flex space-x-4">
              <a href="#" class="social-icon-container">
                <div class="social-icon bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-primary/80 hover:to-secondary/80 text-gray-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <i class="fas fa-envelope"></i>
                </div>
              </a>
              <a href="#" class="social-icon-container">
                <div class="social-icon bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-primary/80 hover:to-secondary/80 text-gray-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <i class="fab fa-linkedin"></i>
                </div>
              </a>
              <a href="#" class="social-icon-container">
                <div class="social-icon bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-primary/80 hover:to-secondary/80 text-gray-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <i class="fas fa-phone"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Add event listeners for lightbox
    const closeLightbox = document.getElementById('close-lightbox');
    closeLightbox.addEventListener('click', closeStaffLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) {
        closeStaffLightbox();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !lightbox.classList.contains('pointer-events-none')) {
        closeStaffLightbox();
      }
    });
  }
}

/**
 * Open staff lightbox with staff details
 * @param {string} name - Staff member name
 * @param {string} role - Staff role/position
 * @param {string} image - Staff image URL
 * @param {string} qualification - Staff qualifications
 * @param {string} description - Staff description
 */
function openStaffLightbox(name, role, image, qualification, description) {
  const lightbox = document.getElementById('staff-lightbox');
  
  // Set lightbox content
  document.getElementById('lightbox-name').textContent = name;
  document.getElementById('lightbox-role').textContent = role;
  document.getElementById('lightbox-image').src = image;
  document.getElementById('lightbox-qualification').textContent = qualification;
  document.getElementById('lightbox-description').textContent = description;
  
  // Show lightbox with animation
  lightbox.classList.remove('pointer-events-none');
  lightbox.setAttribute('aria-hidden', 'false');
  
  setTimeout(() => {
    lightbox.classList.remove('opacity-0');
    lightbox.querySelector('.lightbox-content').classList.remove('scale-95');
    lightbox.querySelector('.lightbox-content').classList.add('scale-100');
    
    // Set focus to close button for accessibility
    document.getElementById('close-lightbox').focus();
  }, 10);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close staff lightbox
 */
function closeStaffLightbox() {
  const lightbox = document.getElementById('staff-lightbox');
  
  // Hide lightbox with animation
  lightbox.classList.add('opacity-0');
  lightbox.querySelector('.lightbox-content').classList.remove('scale-100');
  lightbox.querySelector('.lightbox-content').classList.add('scale-95');
  
  setTimeout(() => {
    lightbox.classList.add('pointer-events-none');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Initialize parallax effect for staff section background
 */
function initStaffParallaxEffect() {
  const staffSection = document.getElementById('staff');
  const particles = staffSection.querySelectorAll('.particle');
  
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const sectionTop = staffSection.offsetTop;
    const sectionHeight = staffSection.offsetHeight;
    
    // Check if section is in viewport
    if (scrollPosition > sectionTop - window.innerHeight && 
        scrollPosition < sectionTop + sectionHeight) {
      
      // Calculate parallax offset
      const offset = (scrollPosition - (sectionTop - window.innerHeight)) * 0.1;
      
      // Apply parallax effect to particles
      particles.forEach((particle, index) => {
        const speed = 0.05 + (index * 0.02); // Different speed for each particle
        const yOffset = offset * speed;
        
        particle.style.transform = `translateY(${yOffset}px)`;
      });
    }
  });
}