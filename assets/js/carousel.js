function initCarouselMarquee() {
    const track = document.querySelector('.carousel-track');
    if (!track || track.dataset.sliderInitialized === 'true') {
        return;
    }

    const originalSlides = Array.from(track.querySelectorAll('.carousel-image'));
    if (originalSlides.length <= 1) {
        return;
    }

    const state = {
        currentIndex: 1,
        displayDuration: 4000,
        autoplayTimeoutId: null,
        isPaused: false,
        motionMedia: window.matchMedia('(prefers-reduced-motion: reduce)'),
        transitionFallbackId: null,
        pendingTransition: false,
        transitionDuration: 800
    };

    const firstClone = originalSlides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    firstClone.classList.add('carousel-image-clone');

    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    lastClone.setAttribute('aria-hidden', 'true');
    lastClone.classList.add('carousel-image-clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    function getSlides() {
        return Array.from(track.children);
    }

    function parseDurationValue(rawValue) {
        if (!rawValue) {
            return Number.NaN;
        }

        const parts = rawValue
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean);

        for (const part of parts) {
            if (part.endsWith('ms')) {
                const numeric = parseFloat(part);
                if (!Number.isNaN(numeric)) {
                    return numeric;
                }
            } else if (part.endsWith('s')) {
                const numeric = parseFloat(part);
                if (!Number.isNaN(numeric)) {
                    return numeric * 1000;
                }
            } else {
                const numeric = parseFloat(part);
                if (!Number.isNaN(numeric)) {
                    return numeric * 1000;
                }
            }
        }

        return Number.NaN;
    }

    function getTransitionDurationMs(element) {
        try {
            const computedStyle = window.getComputedStyle(element);
            const cssDuration = parseDurationValue(computedStyle.transitionDuration);
            if (!Number.isNaN(cssDuration)) {
                return cssDuration;
            }

            const variableDuration = parseDurationValue(
                computedStyle.getPropertyValue('--carousel-transition-duration')
            );
            if (!Number.isNaN(variableDuration)) {
                return variableDuration;
            }
        } catch (error) {
            // If getComputedStyle fails we silently fall back to default duration.
        }

        return 800;
    }

    function getSlideWidth() {
        const referenceSlide = track.querySelector('.carousel-image');
        if (referenceSlide) {
            const width = referenceSlide.getBoundingClientRect().width;
            if (width > 0) {
                return width;
            }
        }

        const parent = track.parentElement;
        return parent ? parent.getBoundingClientRect().width : window.innerWidth;
    }

    function clearAutoplay() {
        if (state.autoplayTimeoutId) {
            window.clearTimeout(state.autoplayTimeoutId);
            state.autoplayTimeoutId = null;
        }
    }

    function clearTransitionFallback() {
        if (state.transitionFallbackId) {
            window.clearTimeout(state.transitionFallbackId);
            state.transitionFallbackId = null;
        }
    }

    function scheduleTransitionFallback() {
        clearTransitionFallback();

        state.transitionDuration = getTransitionDurationMs(track);

        const fallbackDelay = Math.max(state.transitionDuration, 50) + 50;
        state.transitionFallbackId = window.setTimeout(() => {
            state.transitionFallbackId = null;
            finalizeTransition();
        }, fallbackDelay);
    }

    function scheduleNext() {
        clearAutoplay();
        if (state.isPaused || state.motionMedia.matches) {
            return;
        }

        state.autoplayTimeoutId = window.setTimeout(() => {
            moveToNext();
        }, state.displayDuration);
    }

    function setTransform(useTransition) {
        const slideWidth = getSlideWidth();
        const offset = -state.currentIndex * slideWidth;

        if (!useTransition) {
            state.pendingTransition = false;
            clearTransitionFallback();
            track.classList.add('no-transition');
        } else {
            track.classList.remove('no-transition');
            state.pendingTransition = true;
            scheduleTransitionFallback();
        }

        track.style.transform = `translateX(${offset}px)`;

        if (!useTransition) {
            void track.offsetHeight;
            track.classList.remove('no-transition');
        }
    }

    function moveToNext() {
        state.currentIndex += 1;
        setTransform(true);
    }

    function moveToPrev() {
        state.currentIndex -= 1;
        setTransform(true);
    }

    function pauseAutoplay() {
        state.isPaused = true;
        clearAutoplay();
    }

    function resumeAutoplay() {
        state.isPaused = false;
        scheduleNext();
    }

    const handleResize = () => {
        setTransform(false);
        state.transitionDuration = getTransitionDurationMs(track);
    };

    function finalizeTransition(event) {
        if (event) {
            if (event.target !== track) {
                return;
            }

            if (event.propertyName && !event.propertyName.toLowerCase().includes('transform')) {
                return;
            }
        }

        if (!state.pendingTransition) {
            return;
        }

        state.pendingTransition = false;
        clearTransitionFallback();

        const slides = getSlides();

        if (state.currentIndex >= slides.length - 1) {
            state.currentIndex = 1;
            setTransform(false);
        } else if (state.currentIndex <= 0) {
            state.currentIndex = slides.length - 2;
            setTransform(false);
        }

        scheduleNext();
    }

    state.transitionDuration = getTransitionDurationMs(track);

    ['transitionend', 'webkitTransitionEnd'].forEach((eventName) => {
        track.addEventListener(eventName, finalizeTransition);
    });

    track.addEventListener('mouseenter', pauseAutoplay);
    track.addEventListener('mouseleave', resumeAutoplay);
    track.addEventListener('touchstart', pauseAutoplay, false);
    track.addEventListener('touchend', resumeAutoplay);
    track.addEventListener('touchcancel', resumeAutoplay);
    window.addEventListener('resize', handleResize);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            pauseAutoplay();
        } else {
            resumeAutoplay();
        }
    });

    const handleMotionPreferenceChange = (event) => {
        if (event.matches) {
            pauseAutoplay();
        } else {
            resumeAutoplay();
        }
    };

    if (typeof state.motionMedia.addEventListener === 'function') {
        state.motionMedia.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof state.motionMedia.addListener === 'function') {
        state.motionMedia.addListener(handleMotionPreferenceChange);
    }

    track.carouselController = {
        next: moveToNext,
        prev: moveToPrev,
        pause: pauseAutoplay,
        resume: resumeAutoplay,
        setDisplayDuration(milliseconds) {
            if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
                console.warn('Carousel speed must be a positive number of milliseconds.');
                return;
            }

            state.displayDuration = milliseconds;
            scheduleNext();
            console.log(`Carousel display duration set to ${milliseconds}ms`);
        },
        recalc: () => setTransform(false)
    };

    state.isPaused = state.motionMedia.matches;
    state.currentIndex = 1;
    setTransform(false);
    scheduleNext();

    track.dataset.sliderInitialized = 'true';
}

// Initialize all interactive features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarouselMarquee();
});