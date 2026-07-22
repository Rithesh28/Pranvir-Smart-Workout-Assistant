// Use IIFE to prevent global scope pollution
(function() {
    'use strict';
    
    // Enhanced slider functionality
    class SmartSlider {
        constructor(containerSelector) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return;
            
            this.track = this.container.querySelector('.slider-track');
            this.slides = this.container.querySelectorAll('.slide');
            this.prevBtn = this.container.querySelector('.prev-btn');
            this.nextBtn = this.container.querySelector('.next-btn');
            
            this.currentIndex = 0;
            this.isDragging = false;
            this.startPos = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.animationID = 0;
            this.autoSlideInterval = null;
            
            this.init();
        }

        init() {
            if (!this.track || !this.slides.length) return;

            this.setSlidePosition();
            this.addEventListeners();
            this.startAutoSlide();
        }

        setSlidePosition() {
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            this.slides.forEach((slide, index) => {
                slide.style.left = `${slideWidth * index}px`;
            });
        }

        addEventListeners() {
            // Mouse events
            this.track.addEventListener('mousedown', this.dragStart.bind(this));
            this.track.addEventListener('mousemove', this.drag.bind(this));
            this.track.addEventListener('mouseup', this.dragEnd.bind(this));
            this.track.addEventListener('mouseleave', this.dragEnd.bind(this));

            // Touch events
            this.track.addEventListener('touchstart', this.dragStart.bind(this));
            this.track.addEventListener('touchmove', this.drag.bind(this));
            this.track.addEventListener('touchend', this.dragEnd.bind(this));

            // Button events
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.move(-1));
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.move(1));
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.move(-1);
                if (e.key === 'ArrowRight') this.move(1);
            });

            // Window resize
            window.addEventListener('resize', this.setSlidePosition.bind(this));
        }

        dragStart(e) {
            if (e.type === 'touchstart') {
                this.startPos = e.touches[0].clientX;
            } else {
                this.startPos = e.clientX;
                e.preventDefault();
            }
            
            this.isDragging = true;
            this.animationID = requestAnimationFrame(this.animation.bind(this));
            this.track.classList.add('grabbing');
            
            // Pause auto slide during drag
            this.pauseAutoSlide();
        }

        drag(e) {
            if (!this.isDragging) return;
            
            let currentPosition;
            if (e.type === 'touchmove') {
                currentPosition = e.touches[0].clientX;
            } else {
                currentPosition = e.clientX;
            }
            
            const currentTranslate = this.prevTranslate + currentPosition - this.startPos;
            this.currentTranslate = Math.max(Math.min(currentTranslate, this.getMaxTranslate()), 0);
        }

        dragEnd() {
            this.isDragging = false;
            cancelAnimationFrame(this.animationID);
            this.track.classList.remove('grabbing');
            
            const movedBy = this.currentTranslate - this.prevTranslate;
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            
            if (Math.abs(movedBy) > slideWidth / 4) {
                this.move(movedBy > 0 ? -1 : 1);
            } else {
                this.setPositionByIndex();
            }
            
            // Resume auto slide
            this.startAutoSlide();
        }

        animation() {
            this.setSliderPosition();
            if (this.isDragging) {
                requestAnimationFrame(this.animation.bind(this));
            }
        }

        setSliderPosition() {
            this.track.style.transform = `translateX(${-this.currentTranslate}px)`;
        }

        getMaxTranslate() {
            return this.track.scrollWidth - this.track.clientWidth;
        }

        move(direction) {
            if (this.isDragging) return;
            
            this.currentIndex = Math.max(0, Math.min(this.currentIndex + direction, this.slides.length - 1));
            this.setPositionByIndex();
            this.updateActiveSlide();
            this.resetAutoSlide();
        }

        setPositionByIndex() {
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            this.currentTranslate = this.currentIndex * slideWidth;
            this.prevTranslate = this.currentTranslate;
            this.setSliderPosition();
        }

        updateActiveSlide() {
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentIndex);
            });
        }

        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                this.move(1);
            }, 5000);
        }

        pauseAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
            }
        }

        resetAutoSlide() {
            this.pauseAutoSlide();
            this.startAutoSlide();
        }

        goToSlide(index) {
            this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
            this.setPositionByIndex();
            this.updateActiveSlide();
            this.resetAutoSlide();
        }

        destroy() {
            this.pauseAutoSlide();
            // Remove event listeners
            if (this.prevBtn) this.prevBtn.removeEventListener('click');
            if (this.nextBtn) this.nextBtn.removeEventListener('click');
            document.removeEventListener('keydown');
        }
    }

    // Initialize sliders when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize main slider
        const mainSlider = new SmartSlider('.slider-container');
        
        // Add CSS for grabbing state
        if (!document.querySelector('#slider-styles')) {
            const style = document.createElement('style');
            style.id = 'slider-styles';
            style.textContent = `
                .slider-track.grabbing {
                    cursor: grabbing;
                    user-select: none;
                }
                
                .slider-track {
                    transition: transform 0.3s ease;
                }
                
                .slider-track.grabbing {
                    transition: none;
                }
                
                .slide {
                    transition: opacity 0.3s ease;
                }
                
                .slide:not(.active) {
                    opacity: 0.6;
                }
            `;
            document.head.appendChild(style);
        }
    });

    // Export for module use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SmartSlider;
    }
})();