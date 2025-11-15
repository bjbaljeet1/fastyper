function isMobileDevice() { 
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
 
let suppressMobileInputFocus = false;
 
function setupFingerTrainMobileInput() {
    if (!isMobileDevice()) return;
 
    const mobileInput = document.createElement("input");
    mobileInput.type = "text";
    mobileInput.id = "mobileTypingInput";
    mobileInput.style.position = "fixed";
    mobileInput.style.opacity = "0";
    mobileInput.style.top = "650px"; // Position off-screen consistently
    mobileInput.style.height = "1px";
    mobileInput.style.width = "1px";
    mobileInput.style.zIndex = "-1";
    mobileInput.autocapitalize = "off";
    mobileInput.autocomplete = "off";
    mobileInput.spellcheck = false;
 
    document.body.appendChild(mobileInput);
 
    setTimeout(() => mobileInput.focus(), 300);
 
    mobileInput.addEventListener("blur", () => {
        if (!suppressMobileInputFocus) {
            setTimeout(() => mobileInput.focus(), 100);
        }
    });
 
    mobileInput.addEventListener("input", function (e) {
        const typedChar = mobileInput.value.slice(-1);
 
        // This script is only for FingerTrain, which uses handleKey
        if (typeof handleKey !== 'function') return;
 
        if (mobileInput.value.length < e.target.getAttribute('data-last-length') || typedChar === '') {
            // Backspace
            const backspaceEvent = new KeyboardEvent("keydown", { key: "Backspace" });
            handleKey(backspaceEvent);
        } else {
            // Normal key
            const event = new KeyboardEvent("keydown", { key: typedChar });
            handleKey(event);
            mobileInput.value = ""; 
        }
 
        e.target.setAttribute('data-last-length', mobileInput.value.length);
    });
 
    mobileInput.setAttribute('data-last-length', '0');
 
    mobileInput.addEventListener("keydown", function(e) {
        if (e.key === "Backspace") {
            e.preventDefault();
        }
    });
 
    // Touch to focus on the typing box
    const typingBox = document.querySelector('.bjBox');
    if (typingBox) {
        typingBox.addEventListener("touchstart", () => {
            if (!suppressMobileInputFocus) mobileInput.focus();
        }, { passive: true });
    }
}
 
// Function to prevent keyboard from showing when buttons are pressed
function preventKeyboardOnButtonPress() {
    if (!isMobileDevice()) return;
 
    const interactiveElements = document.querySelectorAll(
        'button, .nav-btn, .switch, #legendHeader'
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
    setupFingerTrainMobileInput();
    preventKeyboardOnButtonPress(); // Initial run
 
    // Observe the body for added nodes (like the header)
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Re-run the function to attach listeners to new buttons
                preventKeyboardOnButtonPress();
            }
        }
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
    // Use 'mousedown' which fires before 'blur' on the input.
    // This ensures we can suppress the refocus logic in time.
    document.body.addEventListener('mousedown', (e) => {
        const hamburger = e.target.closest('#hamburger');
        if (hamburger) {
            suppressMobileInputFocus = true;
        }
    });

    // When the click is complete, check the menu state.
    document.body.addEventListener('mouseup', (e) => {
        const hamburger = e.target.closest('#hamburger');
        if (hamburger) {
            // Use a timeout to allow the menu's 'show' class to be toggled by common.js
            setTimeout(() => {
                const navMenu = document.getElementById('navMenu');
                suppressMobileInputFocus = navMenu.classList.contains('show');
            }, 50);
        }
    });
});