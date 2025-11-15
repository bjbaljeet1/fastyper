// Enhanced scroll animation for result container
const resultContainer = document.querySelector('.result-container');
const animatedElements = [
    '.result-statTop',
    '.result-stat',
    '.timing-stats',
    '.fastest-words',
    '.graph-container',
    '#topResultsContainer',
    '.result-actions'
].map(selector => Array.from(document.querySelectorAll(selector))).flat();

let lastScrollPosition = window.scrollY;
let animationFrameId = null;

function checkScroll() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        const currentScrollPosition = window.scrollY;
        const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
        lastScrollPosition = currentScrollPosition;

        if (resultContainer.classList.contains('show')) {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const isVisible = (elementTop <= window.innerHeight * 0.8) && (elementBottom >= 0);
                
                if (isVisible) {
                    // Only animate if scrolling up or if element wasn't previously visible
                    if (scrollDirection === 'up' || element.classList.contains('scroll-hidden')) {
                        element.classList.add('scroll-visible');
                        element.classList.remove('scroll-hidden');
                    }
                } else if (scrollDirection === 'down') {
                    element.classList.add('scroll-hidden');
                    element.classList.remove('scroll-visible');
                }
            });
        }
    });
}

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Adjust chart size if exists
        const chart = Chart.getChart("resultsChart");
        if (chart) {
            chart.resize();
        }
        
        // Re-check scroll positions
        checkScroll();
        
        // Adjust result container layout
        if (window.innerWidth < 1200) {
            document.querySelector('.result-container').style.flexDirection = 'column';
        } else {
            document.querySelector('.result-container').style.flexDirection = 'row';
        }
    }, 200);
});

// Initialize scroll animation
window.addEventListener('load', () => {
    animatedElements.forEach(element => {
        element.classList.add('scroll-hidden');
        // Add transition properties
        element.style.transition = 'all 0.5s ease-out';
    });
    // Trigger initial check
    setTimeout(checkScroll, 100);
});

// Clean up animation frame on unmount
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

// Set up scroll event listener
window.addEventListener('scroll', checkScroll);