function isMobileDevice() { 
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
 
let suppressMobileInputFocus = false;
 
function setupMobileInput() {
    if (!isMobileDevice()) return;
 
    const mobileInput = document.createElement("input");
    mobileInput.type = "text";
    mobileInput.id = "mobileTypingInput";
    mobileInput.style.position = "fixed";
    mobileInput.style.opacity = "0";
    mobileInput.style.top = "0";
    mobileInput.style.height = "1px";
    mobileInput.style.width = "1px";
    mobileInput.style.zIndex = "-1";
    mobileInput.autocapitalize = "off";
    mobileInput.autocomplete = "off";
    mobileInput.spellcheck = false;
    document.body.appendChild(mobileInput);
 
    // Refocus the input if it loses focus, unless suppressed.
    mobileInput.addEventListener("blur", () => {
        if (!suppressMobileInputFocus) {
            // Use a small timeout to prevent instant refocusing, which can cause issues.
            setTimeout(() => mobileInput.focus(), 100);
        }
    });
 
    // Handle all key presses via the `input` event
    mobileInput.addEventListener("input", function (e) {
        const typedChar = mobileInput.value.slice(-1);
 
        // This script is for the main typing test, which uses handleKeydown.
        // Check if the function exists before calling.
        if (typeof handleKeydown !== 'function') {
            console.error("handleKeydown function not found for mobile input.");
            return;
        }
 
        if (mobileInput.value.length < e.target.getAttribute('data-last-length') || typedChar === '') {
            // backspace
            const backspaceEvent = new KeyboardEvent("keydown", { key: "Backspace" });
            handleKeydown(backspaceEvent);
        } else {
            // normal key
            const event = new KeyboardEvent("keydown", { key: typedChar });
            handleKeydown(event);
            mobileInput.value = ""; 
        }
        
        e.target.setAttribute('data-last-length', mobileInput.value.length);
    });
 
    mobileInput.setAttribute('data-last-length', '0');
 
    // Prevent default backspace behavior which might navigate back
    mobileInput.addEventListener("keydown", function(e) {
        if (e.key === "Backspace") {
            e.preventDefault();
        }
    });
 
    // Touch to focus on the typing box
    const typingBox = document.getElementById('stringBox');
    if (typingBox) {
        let audioUnlocked = false;
        typingBox.addEventListener("touchstart", () => {
            if (!suppressMobileInputFocus) {
                mobileInput.focus();
 
                // Unlock audio on the first user touch
                if (!audioUnlocked && typeof correctSound !== 'undefined' && typeof incorrectSound !== 'undefined') {
                    correctSound.play().then(() => correctSound.pause()).catch(() => {});
                    incorrectSound.play().then(() => incorrectSound.pause()).catch(() => {});
                    audioUnlocked = true;
                }
            }
        }, { passive: true });
    }
}
 
// Function to prevent keyboard from showing when buttons are pressed
function preventKeyboardOnButtonPress() {
    if (!isMobileDevice()) return;
 
    const interactiveElements = document.querySelectorAll(
        'button, .nav-btn, .switch, input[type="radio"]'
    );
 
    const suppressFocus = () => {
        suppressMobileInputFocus = true;
    };
 
    const allowFocus = () => {
        // Use a timeout to allow the blur event to fire first
        setTimeout(() => {
            suppressMobileInputFocus = false;
        }, 200);
    };
 
    interactiveElements.forEach(el => {
        el.addEventListener('touchstart', suppressFocus, { passive: true });
        el.addEventListener('touchend', allowFocus, { passive: true });
    });
}
 
document.addEventListener('DOMContentLoaded', () => {
    setupMobileInput();
    preventKeyboardOnButtonPress();
 
    // Observe the body for added nodes (like the header) to attach listeners to new buttons
    const observer = new MutationObserver(() => {
        preventKeyboardOnButtonPress();
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
    // Special handling for the hamburger menu
    document.body.addEventListener('click', (e) => {
        const hamburger = e.target.closest('#hamburger');
        if (hamburger) {
            const navMenu = document.getElementById('navMenu');
            // If the menu is about to open, suppress focus.
            // If it's closing, allow focus again.
            suppressMobileInputFocus = !navMenu.classList.contains('show');
        }
    });
});
