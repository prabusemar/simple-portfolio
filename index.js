/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

// Back to top button functionality
const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  if (backToTopButton) {
    backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
    backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
    backToTopButton.style.transform = isBackToTopRendered
      ? "scale(1)"
      : "scale(0)";
  }
};

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 700) {
      isBackToTopRendered = true;
      alterStyles(isBackToTopRendered);
    } else {
      isBackToTopRendered = false;
      alterStyles(isBackToTopRendered);
    }
  });

  // Click handler for back to top button
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initWorkSlider();
  initImageModal();
  animateSkills();
  initSmoothScrolling();
  initScrollIndicator();
});

// Navbar functionality
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!hamburger || !navMenu) return;
  
  // Toggle mobile menu
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

// Work Slider Functionality
function initWorkSlider() {
  const track = document.querySelector('.work-slider__track');
  const slides = document.querySelectorAll('.work-slider__slide');
  const indicators = document.querySelectorAll('.work-slider__indicator');
  const prevBtn = document.querySelector('.work-slider__btn--prev');
  const nextBtn = document.querySelector('.work-slider__btn--next');

  // Check if slider elements exist
  if (!track || slides.length === 0) {
    console.log('Work slider not found, skipping initialization');
    return;
  }

  let currentIndex = 0;
  const slideCount = slides.length;
  let slidesPerView = calculateSlidesPerView();
  let autoSlideInterval = null;

  // Calculate slides per view based on screen width
  function calculateSlidesPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  // Update slider position and states
  function updateSlider() {
    const slideWidth = 100 / slidesPerView;
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

    // Update active states for slides
    slides.forEach((slide, index) => {
      slide.classList.remove('work-slider__slide--active', 'work-slider__slide--prev', 'work-slider__slide--next');

      if (index === currentIndex) {
        slide.classList.add('work-slider__slide--active');
      } else if (index === currentIndex - 1) {
        slide.classList.add('work-slider__slide--prev');
      } else if (index === currentIndex + 1) {
        slide.classList.add('work-slider__slide--next');
      }
    });

    // Update indicators
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('work-slider__indicator--active');
        } else {
          indicator.classList.remove('work-slider__indicator--active');
        }
      });
    }

    // Update buttons state
    updateButtons();

    // Restart auto slide
    restartAutoSlide();
  }

  // Update navigation buttons state
  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= slideCount - slidesPerView;
    }
  }

  // Go to next slide
  function nextSlide() {
    if (currentIndex < slideCount - slidesPerView) {
      currentIndex++;
    } else {
      // Loop back to the beginning
      currentIndex = 0;
    }
    updateSlider();
  }

  // Go to previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      // Loop to the end
      currentIndex = Math.max(0, slideCount - slidesPerView);
    }
    updateSlider();
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index >= 0 && index <= slideCount - slidesPerView) {
      currentIndex = index;
      updateSlider();
    }
  }

  // Start auto slide
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // Stop auto slide
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Restart auto slide
  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Add swipe support for touch devices
  function addSwipeSupport() {
    let startX = null;
    let movedX = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      movedX = false;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!startX) return;
      const x = e.touches[0].clientX;
      const diff = startX - x;

      if (Math.abs(diff) > 50) {
        movedX = true;
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startX = null;
      }
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!movedX && startX) {
        startX = null;
      }
    });
  }

  // Add event listeners
  function bindEvents() {
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    // Indicators
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch swipe support
    addSwipeSupport();
  }

  // Handle window resize
  function handleResize() {
    const newSlidesPerView = calculateSlidesPerView();

    if (newSlidesPerView !== slidesPerView) {
      slidesPerView = newSlidesPerView;

      // Ensure currentIndex is valid for the new view
      if (currentIndex > slideCount - slidesPerView) {
        currentIndex = Math.max(0, slideCount - slidesPerView);
      }

      updateSlider();
    }
  }

  // Initialize the slider
  bindEvents();
  updateSlider();
  startAutoSlide();

  // Pause auto-slide when user interacts with slider
  const sliderContainer = document.querySelector('.work-slider__container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    sliderContainer.addEventListener('focusin', stopAutoSlide);
    sliderContainer.addEventListener('focusout', startAutoSlide);
  }

  // Handle window resize
  window.addEventListener('resize', handleResize);
}

// Image Modal Functionality
function initImageModal() {
  const modal = document.querySelector('.image-modal');

  // Check if modal exists
  if (!modal) {
    console.log('Image modal not found, skipping initialization');
    return;
  }

  const modalImg = modal.querySelector('.image-modal__img');
  const modalCaption = modal.querySelector('.image-modal__caption');
  const closeBtn = modal.querySelector('.image-modal__close');
  const prevBtn = modal.querySelector('.image-modal__prev');
  const nextBtn = modal.querySelector('.image-modal__next');
  const loading = modal.querySelector('.image-modal__loading');

  let currentImageIndex = 0;
  let images = [];

  // Gather all project images
  function gatherImages() {
    const imageBoxes = document.querySelectorAll('.work-slider__image-box');
    images = Array.from(imageBoxes).map((box, index) => {
      const img = box.querySelector('img');
      return {
        src: img.src,
        alt: img.alt || `Project image ${index + 1}`,
        element: box
      };
    });
  }

  // Open modal with specific image
  function openModal(index) {
    if (images.length === 0) return;

    currentImageIndex = index;
    const image = images[index];

    // Show loading
    if (loading) loading.style.display = 'block';
    if (modalImg) {
      modalImg.style.opacity = '0';
      modalImg.src = '';
    }

    // Preload image
    const img = new Image();
    img.onload = () => {
      if (modalImg) {
        modalImg.src = image.src;
        modalImg.alt = image.alt;
      }
      if (modalCaption) modalCaption.textContent = image.alt;
      if (loading) loading.style.display = 'none';
      if (modalImg) modalImg.style.opacity = '1';

      modal.classList.add('image-modal--active');
      document.body.style.overflow = 'hidden';
    };

    img.onerror = () => {
      if (loading) loading.style.display = 'none';
      if (modalCaption) modalCaption.textContent = 'Failed to load image';
    };

    img.src = image.src;
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('image-modal--active');
    document.body.style.overflow = 'auto';

    // Reset modal content after transition
    setTimeout(() => {
      if (modalImg) {
        modalImg.src = '';
        modalImg.alt = '';
      }
      if (modalCaption) modalCaption.textContent = '';
    }, 300);
  }

  // Show previous image
  function prevImage() {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openModal(currentImageIndex);
  }

  // Show next image
  function nextImage() {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openModal(currentImageIndex);
  }

  // Add event listeners
  function bindEvents() {
    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', prevImage);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextImage);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (modal.classList.contains('image-modal--active')) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    });

    // Add click events to all project images
    images.forEach((image, index) => {
      image.element.addEventListener('click', () => {
        openModal(index);
      });
    });
  }

  // Initialize the modal
  gatherImages();
  bindEvents();
}

// Animate Skills Progress Bars
function animateSkills() {
  const progressBars = document.querySelectorAll('.progress-bar');

  if (progressBars.length === 0) {
    console.log('No progress bars found, skipping animation');
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const level = progressBar.getAttribute('data-level') || '80';

        // Animate the progress bar
        progressBar.style.width = level + '%';

        // Stop observing after animation
        observer.unobserve(progressBar);
      }
    });
  }, observerOptions);

  // Observe each progress bar
  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navbar = document.querySelector('.navbar');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Skip if it's an external link or mailto link
      if (this.getAttribute('href').startsWith('http') || this.getAttribute('href').startsWith('mailto')) {
        return;
      }
      
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('.nav-menu');
      if (hamburger && navMenu && hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }

      // Update URL hash without scrolling
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    });
  });
}

// Handle window resize for responsive adjustments
function handleWindowResize() {
  // Reinitialize work slider on resize
  const track = document.querySelector('.work-slider__track');
  if (track) {
    initWorkSlider();
  }
  
  // Close mobile menu when switching to desktop view
  if (window.innerWidth > 768) {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }
}

// Add window resize listener
window.addEventListener('resize', handleWindowResize);

// Initialize everything when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // All initialization functions are already called via DOMContentLoaded
  });
}