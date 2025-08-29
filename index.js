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

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

// Work Slider Functionality
document.addEventListener('DOMContentLoaded', function () {
  const workSlider = {
    init() {
      this.track = document.querySelector('.work-slider__track');
      this.slides = document.querySelectorAll('.work-slider__slide');
      this.indicators = document.querySelectorAll('.work-slider__indicator');
      this.prevBtn = document.querySelector('.work-slider__btn--prev');
      this.nextBtn = document.querySelector('.work-slider__btn--next');

      // Check if elements exist
      if (!this.track || this.slides.length === 0) {
        console.error('Work slider elements not found');
        return;
      }

      this.currentIndex = 0;
      this.slideCount = this.slides.length;
      this.slidesPerView = this.calculateSlidesPerView();

      this.bindEvents();
      this.updateSlider();
      this.startAutoSlide();

      // Handle window resize
      window.addEventListener('resize', () => {
        this.slidesPerView = this.calculateSlidesPerView();
        this.updateSlider();
      });
    },

    calculateSlidesPerView() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    },

    bindEvents() {
      // Navigation buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
      }

      // Indicators
      if (this.indicators.length > 0) {
        this.indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => this.goToSlide(index));
        });
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      });

      // Touch swipe support
      this.addSwipeSupport();
    },

    addSwipeSupport() {
      let startX, movedX;
      const track = this.track;

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
            this.nextSlide();
          } else {
            this.prevSlide();
          }
          startX = null;
        }
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        if (!movedX && startX) {
          startX = null;
        }
      });
    },

    nextSlide() {
      if (this.currentIndex < this.slideCount - this.slidesPerView) {
        this.currentIndex++;
        this.updateSlider();
      } else if (this.currentIndex >= this.slideCount - this.slidesPerView) {
        // Loop back to the beginning
        this.currentIndex = 0;
        this.updateSlider();
      }
    },

    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateSlider();
      } else if (this.currentIndex === 0) {
        // Loop to the end
        this.currentIndex = this.slideCount - this.slidesPerView;
        this.updateSlider();
      }
    },

    goToSlide(index) {
      if (index >= 0 && index <= this.slideCount - this.slidesPerView) {
        this.currentIndex = index;
        this.updateSlider();
      }
    },

    updateSlider() {
      // Update track position
      const slideWidth = 100 / this.slidesPerView;
      this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}%)`;

      // Update active states
      this.slides.forEach((slide, index) => {
        slide.classList.remove('work-slider__slide--active', 'work-slider__slide--prev', 'work-slider__slide--next');

        if (index === this.currentIndex) {
          slide.classList.add('work-slider__slide--active');
        } else if (index === this.currentIndex - 1) {
          slide.classList.add('work-slider__slide--prev');
        } else if (index === this.currentIndex + 1) {
          slide.classList.add('work-slider__slide--next');
        }
      });

      // Update indicators
      if (this.indicators.length > 0) {
        this.indicators.forEach((indicator, index) => {
          if (index === this.currentIndex) {
            indicator.classList.add('work-slider__indicator--active');
          } else {
            indicator.classList.remove('work-slider__indicator--active');
          }
        });
      }

      // Update buttons state
      this.updateButtons();

      // Restart auto slide
      this.restartAutoSlide();
    },

    updateButtons() {
      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentIndex === 0;
      }

      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentIndex >= this.slideCount - this.slidesPerView;
      }
    },

    autoSlideInterval: null,

    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },

    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
    },

    restartAutoSlide() {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  };

  // Initialize the slider
  workSlider.init();

  // Pause auto-slide when user interacts with slider
  const sliderContainer = document.querySelector('.work-slider__container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => workSlider.stopAutoSlide());
    sliderContainer.addEventListener('mouseleave', () => workSlider.restartAutoSlide());

    // Also pause when focus is inside slider
    sliderContainer.addEventListener('focusin', () => workSlider.stopAutoSlide());
    sliderContainer.addEventListener('focusout', () => workSlider.restartAutoSlide());
  }

  // Initialize image modal after slider is set up
  initImageModal();
});

// Image Modal Functionality
function initImageModal() {
  const modal = document.querySelector('.image-modal');

  // Check if modal exists
  if (!modal) {
    console.error('Image modal not found');
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
    if (modalImg) modalImg.style.opacity = '0';

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
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
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

  // Debug info
  console.log(`Found ${images.length} project images`);
}