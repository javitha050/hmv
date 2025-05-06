/**
 * Contact Section JavaScript Functionality
 * 
 * This file handles all interactive functionality for the Contact Section including:
 * - Form validation and submission
 * - Floating label animations
 * - Google Maps integration
 * - Contact form feedback and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all contact section functionality
  initContactForm();
  initFloatingLabels();
  initGoogleMap();
  initContactAnimations();
});

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formInputs = contactForm.querySelectorAll('input, textarea');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  
  // Add validation styles to form inputs
  formInputs.forEach(input => {
    // Add validation event listeners
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      highlightInvalidField(input);
    });
    
    input.addEventListener('input', function() {
      validateField(input);
    });
    
    input.addEventListener('blur', function() {
      validateField(input);
    });
  });
  
  // Handle form submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields before submission
    let isValid = true;
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      // Show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
      submitButton.classList.add('opacity-75');
      
      // Simulate form submission (replace with actual AJAX submission)
      setTimeout(() => {
        showFormSuccess();
        
        // Reset form after success
        setTimeout(() => {
          contactForm.reset();
          formInputs.forEach(input => {
            input.classList.remove('has-value');
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) label.classList.remove('floating-label-active');
          });
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message';
          submitButton.classList.remove('opacity-75');
        }, 3000);
      }, 1500);
    }
  });
}

/**
 * Validate an individual form field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
  // Check validity based on HTML5 validation
  const isValid = field.checkValidity();
  
  if (!isValid) {
    highlightInvalidField(field);
    return false;
  } else {
    field.classList.remove('border-red-500', 'bg-red-50');
    field.classList.add('border-green-500/50');
    
    // Remove error message if it exists
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
    
    return true;
  }
}

/**
 * Highlight an invalid form field with error styling and message
 * @param {HTMLElement} field - The invalid input field
 */
function highlightInvalidField(field) {
  field.classList.add('border-red-500', 'bg-red-50/30');
  field.classList.remove('border-green-500/50');
  
  // Add error message if it doesn't exist
  let errorMsg = field.parentNode.querySelector('.error-message');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'error-message text-red-500 text-sm mt-1 ml-2 flex items-center';
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i> ${getErrorMessage(field)}`;
    field.parentNode.appendChild(errorMsg);
    
    // Animate error message entrance
    errorMsg.style.opacity = '0';
    errorMsg.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      errorMsg.style.transition = 'all 0.3s ease';
      errorMsg.style.opacity = '1';
      errorMsg.style.transform = 'translateY(0)';
    }, 10);
  }
}

/**
 * Get appropriate error message based on field type and validation state
 * @param {HTMLElement} field - The invalid input field
 * @returns {string} - The error message
 */
function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    return 'This field is required';
  } else if (field.validity.typeMismatch) {
    return field.type === 'email' ? 'Please enter a valid email address' : 'Please enter a valid value';
  } else if (field.validity.tooShort) {
    return `Please enter at least ${field.minLength} characters`;
  } else {
    return 'Please enter a valid value';
  }
}

/**
 * Show success message after form submission
 */
function showFormSuccess() {
  const contactForm = document.getElementById('contactForm');
  const formContent = contactForm.innerHTML;
  
  // Create success message
  const successMsg = document.createElement('div');
  successMsg.className = 'text-center py-8';
  successMsg.innerHTML = `
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
      <i class="fas fa-check text-2xl text-green-500"></i>
    </div>
    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Message Sent!</h3>
    <p class="text-gray-600 dark:text-gray-400">Thank you for contacting us. We'll get back to you shortly.</p>
  `;
  
  // Replace form with success message with animation
  contactForm.style.opacity = '0';
  contactForm.style.transform = 'translateY(20px)';
  contactForm.style.transition = 'all 0.5s ease';
  
  setTimeout(() => {
    contactForm.innerHTML = '';
    contactForm.appendChild(successMsg);
    contactForm.style.opacity = '1';
    contactForm.style.transform = 'translateY(0)';
  }, 500);
  
  // Restore form after delay (in a real app, you might not want to do this)
  setTimeout(() => {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      contactForm.innerHTML = formContent;
      contactForm.style.opacity = '1';
      contactForm.style.transform = 'translateY(0)';
      
      // Reinitialize floating labels for the new form elements
      initFloatingLabels();
    }, 500);
  }, 3000);
}

/**
 * Initialize floating label animations for form inputs
 */
function initFloatingLabels() {
  const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
  
  formInputs.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;
    
    // Check if input already has value (e.g., on page reload)
    if (input.value.trim() !== '') {
      input.classList.add('has-value');
      label.classList.add('floating-label-active');
    }
    
    // Handle input focus
    input.addEventListener('focus', () => {
      label.classList.add('floating-label-active');
    });
    
    // Handle input blur
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        label.classList.remove('floating-label-active');
        input.classList.remove('has-value');
      } else {
        input.classList.add('has-value');
      }
    });
  });
}

/**
 * Initialize Google Maps integration
 */
function initGoogleMap() {
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    // If not loaded, add a placeholder and message
    const mapContainer = document.getElementById('googleMap');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
          <i class="fas fa-map-marker-alt text-4xl text-primary mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">Google Maps will appear here when API key is configured.</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Please add your Google Maps API key to enable this feature.</p>
        </div>
      `;
    }
    return;
  }
  
  // If Google Maps API is loaded, initialize the map
  const mapOptions = {
    center: { lat: 6.8444, lng: 80.0155 }, // Homagama coordinates (approximate)
    zoom: 15,
    styles: [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 36
          },
          {
            "color": "#333333"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dedede"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f2f2f2"
          },
          {
            "lightness": 19
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e9e9e9"
          },
          {
            "lightness": 17
          }
        ]
      }
    ]
  };
  
  const map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  
  // Add marker for school location
  const marker = new google.maps.Marker({
    position: mapOptions.center,
    map: map,
    title: 'Homagama Maha Vidyalaya',
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#e74c3c',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    }
  });
  
  // Add info window
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px; font-weight: bold; color: #e74c3c;">Homagama Maha Vidyalaya</h3>
        <p style="margin: 0; font-size: 12px; color: #666;">Athurugiriya Road, Homagama<br>Colombo District, Sri Lanka</p>
      </div>
    `
  });
  
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
  
  // Open info window by default
  infoWindow.open(map, marker);
}

/**
 * Initialize scroll-based animations for contact section elements
 */
function initContactAnimations() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support Intersection Observer
    const animatedElements = document.querySelectorAll('#contact .glassmorphism, #contact .contact-info-item');
    animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }
  
  // Set up the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation classes when element is visible
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  // Observe contact form and info items with staggered delay
  const contactForm = document.querySelector('#contact .glassmorphism');
  if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(30px)';
    contactForm.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(contactForm);
  }
  
  // Observe contact info items with staggered delay
  const contactInfoItems = document.querySelectorAll('#contact .contact-info-item');
  contactInfoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1 + 0.2}s, transform 0.6s ease ${index * 0.1 + 0.2}s`;
    observer.observe(item);
  });
  
  // Add animation class for elements that become visible
  document.querySelectorAll('#contact .animate-in').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}