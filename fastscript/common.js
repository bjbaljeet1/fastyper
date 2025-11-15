document.addEventListener("DOMContentLoaded", function() {
    // Single source of truth for navigation links
    const navLinksConfig = [
        { href: '/index.html', text: 'Home', inHeader: true, inFooter: true },
        { href: '/typing-practice.html', text: 'Practice', inHeader: true, inFooter: true },
        { href:'/tutorial.html', text: 'Tutorial', inHeader: true, inFooter: false },
        { href: '/how-to-use-fastyper.html', text: 'How to Use', inHeader: true, inFooter: true },
        { href: '/games.html', text: 'Games', inHeader: true, inFooter: false },
        { href: '/components/about.html', text: 'About', inHeader: false, inFooter: true },
        { href: '/components/privacy.html', text: 'Privacy', inHeader: false, inFooter: true },
        { href: '/contact.html', text: 'Contact', inHeader: false, inFooter: true }
    ];

    // Function to generate header navigation
    function generateHeaderNav(container) {
        const headerLinks = navLinksConfig.filter(link => link.inHeader);
        container.innerHTML = headerLinks.map(link => `<a href="${link.href}"><button class="nav-btn">${link.text}</button></a>`).join('');
    }

    // Function to set the active navigation link
    function setActiveNav() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            const button = link.querySelector('button');
            if (button) {
                button.classList.remove('active');
                if (currentPage === linkPage) {
                    button.classList.add('active');
                }
            }
        });
    }

    // Load Header
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector('header');
            if (headerElement) {
                headerElement.innerHTML = data;
                // Generate nav links dynamically
                const navMenu = document.getElementById("navMenu");
                if (navMenu) {
                    generateHeaderNav(navMenu);
                }
                // Add a noscript fallback for crawlers
                const noscriptFallback = `
                    <noscript>
                        <div class="nav-links" style="display:flex; gap: 10px;">
                            <a href="/index.html"><button class="nav-btn">Home</button></a>
                            <a href="/typing-practice.html"><button class="nav-btn">Practice</button></a>
                            <a href="/how-to-use-fastyper.html"><button class="nav-btn">How to Use</button></a>
                            <a href="/games.html"><button class="nav-btn">Games</button></a>
                            <a href="/components/about.html"><button class="nav-btn">About</button></a>
                        </div>
                    </noscript>`;
                headerElement.insertAdjacentHTML('beforeend', noscriptFallback);
                setActiveNav(); // Set active link after header is loaded
                initializeHamburger(); // Re-initialize hamburger after it's loaded
            }
        });

    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerElement = document.querySelector('.footer');
            if (footerElement) {
                footerElement.innerHTML = data;
                // Generate footer links dynamically
                const footerLinksContainer = document.querySelector('.footer-links');
                if (footerLinksContainer) {
                    const footerLinks = navLinksConfig.filter(link => link.inFooter);
                    footerLinksContainer.innerHTML = footerLinks.map(link => `<li><a href="${link.href}">${link.text}</a></li>`).join('');
                }
                // Set current year in footer after loading
                const footerYear = document.getElementById("footerYear");
                if (footerYear) {
                    footerYear.textContent = new Date().getFullYear();
                }
                initializeFooterAnimation(); // Animate footer on scroll
            }
        })
        .catch(error => console.error('Error loading footer:', error));

    // Hamburger toggle logic
    function initializeHamburger() {
        const hamburger = document.getElementById("hamburger");
        const navMenu = document.getElementById("navMenu");

        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                navMenu.classList.toggle("show");
                hamburger.classList.toggle("open");
            });
        }
    }

    // Cookie Consent Banner Logic
    function initializeCookieConsent() {
        const consentValue = localStorage.getItem('cookie_consent');
        if (consentValue === 'accepted') {
            return; // User has already accepted
        }

        // Create banner HTML
        const bannerHTML = `
            <div id="cookie-consent-banner">
                <p>We use cookies and similar technologies (like localStorage) to save your test history and progress. By continuing to use Fastyper, you agree to our use of this technology.</p>
                <button id="accept-cookies" class="nav-btn">Accept</button>
            </div>
        `;

        // Add banner to the body
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Add event listener
        const banner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('accept-cookies');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            banner.style.display = 'none';
            updateCookieDisplay(); // Update footer display
        });

        // Show the banner
        banner.style.display = 'flex';
    }

    // Function to display localStorage data in the footer
    function updateCookieDisplay() {
        const cookieDisplay = document.getElementById('cookie-display');
        if (!cookieDisplay) return;

        // Only show if consent is given
        if (localStorage.getItem('cookie_consent') !== 'accepted') {
            cookieDisplay.innerHTML = '<li>Accept cookies to see stored data.</li>';
            return;
        }

        let content = '';
        const topResults = localStorage.getItem('topResults');
        const fingerTrainProgress = localStorage.getItem('fingerTrainProgress');

        content += `<li><strong>Typing Test History:</strong> ${topResults ? 'Saved' : 'Not Saved'}</li>`;
        content += `<li><strong>Finger Train Progress:</strong> ${fingerTrainProgress ? 'Saved' : 'Not Saved'}</li>`;

        if (!topResults && !fingerTrainProgress) {
            content = '<li>No activity saved yet.</li>';
        }

        cookieDisplay.innerHTML = content;
    }

    initializeCookieConsent();

    // Animate footer on scroll
    function initializeFooterAnimation() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const animatedElements = [
            ...footer.querySelectorAll('.footer-column'),
            footer.querySelector('.footer-bottom')
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatedElements.forEach(el => {
                        if (el) el.classList.add('visible');
                    });
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the footer is visible

        observer.observe(footer);
    }
});