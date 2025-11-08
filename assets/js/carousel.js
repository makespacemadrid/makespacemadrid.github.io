// Makespace Madrid Website JavaScript
// Simple and hackable JavaScript for interactive features

// Carousel functionality - very hackable!
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
        motionMedia: window.matchMedia('(prefers-reduced-motion: reduce)')
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

    function getSlideWidth() {
        const referenceSlide = track.querySelector('.carousel-image');
        if (referenceSlide) {
            return referenceSlide.getBoundingClientRect().width;
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
            track.classList.add('no-transition');
        } else {
            track.classList.remove('no-transition');
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
    };

    track.addEventListener('transitionend', (event) => {
        if (event.target !== track || event.propertyName !== 'transform') {
            return;
        }

        const slides = getSlides();

        if (state.currentIndex === slides.length - 1) {
            state.currentIndex = 1;
            setTransform(false);
        } else if (state.currentIndex === 0) {
            state.currentIndex = slides.length - 2;
            setTransform(false);
        }

        scheduleNext();
    });

    track.addEventListener('mouseenter', pauseAutoplay);
    track.addEventListener('mouseleave', resumeAutoplay);
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