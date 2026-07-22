// Use IIFE to prevent global scope pollution
(function() {
    'use strict';
    
    // Global variables - check if they already exist
    if (typeof window.currentSlide === 'undefined') {
        window.currentSlide = 0;
    }
    
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        if (slides.length > 0) {
            initializeSlides();
            initializeAnimations();
            initializePerformanceOptimizations();
        }
    });

    // Slide initialization
    function initializeSlides() {
        showSlide(window.currentSlide);
        startAutoSlide();
    }

    // Show specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    // Move to next/previous slide
    function moveSlide(direction) {
        window.currentSlide += direction;
        
        if (window.currentSlide >= totalSlides) {
            window.currentSlide = 0;
        } else if (window.currentSlide < 0) {
            window.currentSlide = totalSlides - 1;
        }
        
        showSlide(window.currentSlide);
        resetAutoSlide();
    }

    // Auto slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveSlide(1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Make moveSlide available globally for onclick handlers
    window.moveSlide = moveSlide;

    // Animations
    function initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.stat-item, .slide, .exercise-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Performance optimizations
    function initializePerformanceOptimizations() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleResize();
            }, 250);
        });
    }

    // Handle window resize
    function handleResize() {
        // Adjust slider for mobile
        if (window.innerWidth < 768) {
            document.querySelector('.slider-track').scrollLeft = window.currentSlide * 320;
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Loading states
    function setLoadingState(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    // Error handling
    function showError(message, element = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        if (element) {
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
            setTimeout(() => errorDiv.remove(), 5000);
        } else {
            // Show global error
            document.body.insertBefore(errorDiv, document.body.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    // Success messages
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        document.body.insertBefore(successDiv, document.body.firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            moveSlide,
            showError,
            showSuccess,
            setLoadingState,
            debounce,
            throttle
        };
    }
})();