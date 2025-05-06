/**
 * Enhanced Header and Hero Section Functionality
 * This script adds interactive features to the header and hero section
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded - initializing header functionality');
  
  // Initialize header functionality
  initHeader();
  
  // Initialize mobile menu animations
  initMobileMenu();
  
  // Initialize hero section parallax effects
  initHeroParallax();
  
  // Force check dark mode on page load
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
  if (isDarkModeEnabled) {
    document.documentElement.classList.add('dark');
    updateDarkModeIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateDarkModeIcons(false);
  }
  
  // Log initialization status
  console.log('Header initialization complete');
  console.log('Dark mode status:', isDarkModeEnabled ? 'enabled' : 'disabled');
});

/**
 * Initialize header functionality
 */
function initHeader() {
  console.log('Initializing header');
  
  // Add scroll event listener for header transformation
  const header = document.querySelector('header');
  const mainContent = document.getElementById('mainContent');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!header) {
    console.error('Header element not found');
    return;
  }
  
  if (!mainContent) {
    console.error('Main content element not found');
    return;
  }
  
  console.log('Header and main content elements found');
  
  // Header scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('py-2');
      header.classList.add('shadow-xl');
      header.classList.remove('py-4');
    } else {
      header.classList.remove('py-2');
      header.classList.remove('shadow-xl');
      header.classList.add('py-4');
    }
  });
  
  // Initialize dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const mobileDarkModeIcon = document.getElementById('mobileDarkModeIcon');
  
  console.log('Dark mode toggle elements:', {
    darkModeToggle: !!darkModeToggle,
    mobileDarkModeToggle: !!mobileDarkModeToggle,
    darkModeIcon: !!darkModeIcon,
    mobileDarkModeIcon: !!mobileDarkModeIcon
  });
  
  // Directly attach event listeners to elements
  if (darkModeToggle) {
    darkModeToggle.onclick = function(e) {
      e.preventDefault();
      toggleDarkMode();
    };
  }
  
  if (mobileDarkModeToggle) {
    mobileDarkModeToggle.onclick = function(e) {
      e.preventDefault();
      toggleDarkMode();
    };
  }
  
  // Check for saved dark mode preference and initialize accordingly
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
  console.log('Dark mode enabled from localStorage:', isDarkModeEnabled);
  
  if (isDarkModeEnabled) {
    document.documentElement.classList.add('dark');
    
    // Apply dark mode styles to header and mobile menu
    if (header) {
      header.classList.add('from-gray-800/95', 'to-gray-900/95');
      header.classList.remove('from-primary/90', 'to-red-600/90');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.add('from-gray-800/95', 'to-gray-900/95');
      mobileMenu.classList.remove('from-primary/90', 'to-red-700/90');
    }
    
    // Update icons and visual elements
    updateDarkModeIcons(true);
  } else {
    // Ensure light mode styles are applied
    if (header) {
      header.classList.add('from-primary/90', 'to-red-600/90');
      header.classList.remove('from-gray-800/95', 'to-gray-900/95');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.add('from-primary/90', 'to-red-700/90');
      mobileMenu.classList.remove('from-gray-800/95', 'to-gray-900/95');
    }
  }
  
  // Add hover effect to nav items
  const navItems = document.querySelectorAll('nav a');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('span.text-xs')?.classList.add('opacity-100');
    });
    
    item.addEventListener('mouseleave', function() {
      this.querySelector('span.text-xs')?.classList.remove('opacity-100');
    });
  });
  
  // Add aria-labels for accessibility
  if (darkModeToggle) {
    darkModeToggle.setAttribute('aria-label', isDarkModeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
  
  if (mobileDarkModeToggle) {
    mobileDarkModeToggle.setAttribute('aria-label', isDarkModeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
  
  console.log('Header initialization complete');
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  console.log('Toggle dark mode called');
  
  // Get all elements that need special handling during mode switch
  const header = document.querySelector('header');
  const mobileMenu = document.getElementById('mobileMenu');
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  console.log('Current dark mode state:', isDarkMode);
  console.log('Header element found:', !!header);
  console.log('Mobile menu element found:', !!mobileMenu);
  
  // Add transition class for smooth color changes
  document.body.classList.add('transition-colors', 'duration-500');
  
  if (isDarkMode) {
    // Switch to light mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
    updateDarkModeIcons(false);
    console.log('Switching to light mode');
    
    // Apply specific light mode styles if needed
    if (header) {
      header.classList.add('from-primary/90', 'to-red-600/90');
      header.classList.remove('from-gray-800/95', 'to-gray-900/95');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.add('from-primary/90', 'to-red-700/90');
      mobileMenu.classList.remove('from-gray-800/95', 'to-gray-900/95');
    }
  } else {
    // Switch to dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
    updateDarkModeIcons(true);
    console.log('Switching to dark mode');
    
    // Apply specific dark mode styles if needed
    if (header) {
      header.classList.add('from-gray-800/95', 'to-gray-900/95');
      header.classList.remove('from-primary/90', 'to-red-600/90');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.add('from-gray-800/95', 'to-gray-900/95');
      mobileMenu.classList.remove('from-primary/90', 'to-red-700/90');
    }
  }
  
  // Force update of mobile menu background
  if (mobileMenu) {
    // First remove all potential background classes
    mobileMenu.classList.remove(
      'from-primary/90', 'to-red-700/90',
      'from-gray-800/95', 'to-gray-900/95'
    );
    
    // Then add the correct ones based on current mode
    if (document.documentElement.classList.contains('dark')) {
      mobileMenu.classList.add('from-gray-800/95', 'to-gray-900/95');
    } else {
      mobileMenu.classList.add('from-primary/90', 'to-red-700/90');
    }
  }
  
  // Remove transition class after animation completes
  setTimeout(() => {
    document.body.classList.remove('transition-colors', 'duration-500');
  }, 500);
  
  // Dispatch custom event for other components to react to mode change
  document.dispatchEvent(new CustomEvent('darkModeToggled', { 
    detail: { isDarkMode: !isDarkMode } 
  }));
  
  console.log('Dark mode toggle complete');
}

/**
 * Update dark mode icons and related UI elements
 */
function updateDarkModeIcons(isDarkMode) {
  const darkModeIcon = document.getElementById('darkModeIcon');
  const mobileDarkModeIcon = document.getElementById('mobileDarkModeIcon');
  const darkModeToggles = document.querySelectorAll('#darkModeToggle, #mobileDarkModeToggle');
  
  // Update main icon
  if (darkModeIcon) {
    if (isDarkMode) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
      darkModeIcon.setAttribute('title', 'Switch to Light Mode');
    } else {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
      darkModeIcon.setAttribute('title', 'Switch to Dark Mode');
    }
  }
  
  // Update mobile icon
  if (mobileDarkModeIcon) {
    if (isDarkMode) {
      mobileDarkModeIcon.classList.remove('fa-moon');
      mobileDarkModeIcon.classList.add('fa-sun');
      mobileDarkModeIcon.setAttribute('title', 'Switch to Light Mode');
    } else {
      mobileDarkModeIcon.classList.remove('fa-sun');
      mobileDarkModeIcon.classList.add('fa-moon');
      mobileDarkModeIcon.setAttribute('title', 'Switch to Dark Mode');
    }
  }
  
  // Add visual feedback to toggle buttons
  darkModeToggles.forEach(toggle => {
    if (isDarkMode) {
      toggle.classList.add('bg-yellow-400/20');
      toggle.classList.remove('bg-indigo-600/20');
    } else {
      toggle.classList.add('bg-indigo-600/20');
      toggle.classList.remove('bg-yellow-400/20');
    }
  });
}

/**
 * Initialize mobile menu with simplified functionality
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!mobileMenuButton || !mobileMenu) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  // Force initial state - simple hidden state without animations
  mobileMenu.classList.add('hidden');
  
  // Simple toggle for mobile menu
  mobileMenuButton.onclick = function(event) {
    event.stopPropagation(); // Prevent document click from immediately closing the menu
    
    if (mobileMenu.classList.contains('hidden')) {
      // Show menu without animation
      mobileMenu.classList.remove('hidden');
    } else {
      // Hide menu without animation
      mobileMenu.classList.add('hidden');
    }
  };
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!mobileMenu.classList.contains('hidden') && 
        !mobileMenu.contains(event.target) && 
        !mobileMenuButton.contains(event.target)) {
      // Hide menu without animation
      mobileMenu.classList.add('hidden');
    }
  });
  
  // Add click event to mobile menu items
  const mobileMenuItems = mobileMenu.querySelectorAll('a');
  mobileMenuItems.forEach(item => {
    item.onclick = function() {
      // Hide menu without animation
      mobileMenu.classList.add('hidden');
    };
  });
  
  // Ensure mobile dark mode toggle works
  const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
  if (mobileDarkModeToggle) {
    mobileDarkModeToggle.onclick = function(event) {
      event.stopPropagation(); // Prevent document click from closing the menu
      toggleDarkMode();
    };
  }
}

/**
 * Initialize hero section parallax effects
 */
function initHeroParallax() {
  const heroSection = document.getElementById('home');
  const decorativeElements = heroSection?.querySelectorAll('.absolute');
  
  if (!heroSection || !decorativeElements) return;
  
  // Add parallax effect on mouse move
  heroSection.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    decorativeElements.forEach((element, index) => {
      // Skip elements that shouldn't move
      if (element.classList.contains('inset-0')) return;
      
      // Create different movement factors for each element
      const factorX = (index % 3 + 1) * 15;
      const factorY = (index % 2 + 1) * 15;
      
      // Apply transform based on mouse position
      element.style.transform = `translate(${(x - 0.5) * factorX}px, ${(y - 0.5) * factorY}px)`;
    });
  });
  
  // Reset positions when mouse leaves
  heroSection.addEventListener('mouseleave', function() {
    decorativeElements.forEach(element => {
      // Skip elements that shouldn't move
      if (element.classList.contains('inset-0')) return;
      
      // Reset transform with transition
      element.style.transition = 'transform 0.5s ease-out';
      element.style.transform = 'translate(0, 0)';
      
      // Remove transition after animation completes
      setTimeout(() => {
        element.style.transition = '';
      }, 500);
    });
  });
}