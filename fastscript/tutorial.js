document.addEventListener('DOMContentLoaded', () => {
    // This will hold a reference to the currently active instance's handleKey function.
    let activeKeyHandler = null;

    // Global keydown listener that delegates to the active handler.
    document.addEventListener('keydown', (e) => {
        if (activeKeyHandler) {
            activeKeyHandler(e);
        }
    });

    /**
     * Initializes an interactive tutorial practice section.
     * @param {string} containerSelector - The CSS selector for the container of the practice section.
     * @param {string} targetString - The string of characters to practice.
     * @param {string} popupMessage - The HTML string for the congratulatory message.
     */
    function initializeTutorialPractice(containerSelector, targetString, popupMessage) {
        const tutorialContainer = document.querySelector(containerSelector);
        if (!tutorialContainer) return;

        const bjBox = tutorialContainer.querySelector('.bjBox');
        const keyboardKeys = tutorialContainer.querySelectorAll('.tutorial-keyboard .key');
        const popup = document.getElementById('tutorial-popup');
        const popupTextElement = popup ? document.getElementById('tutorial-popup-message') : null;

        // Define key rows for the final exercise
        const keyRows = {
            top: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            home: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
            bottom: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
        };
        let currentIndex = 0;
        let typedChars = [];
        let practiceCompleted = false; // Prevents popup from re-triggering

        const setActive = () => {
            document.querySelectorAll('.tutorial-keyboard-container').forEach(c => c.classList.remove('active-focus'));
            tutorialContainer.classList.add('active-focus');
            activeKeyHandler = handleKey; // Set this instance's handler as the active one
        };

        // Set this instance as active when the user clicks inside it
        tutorialContainer.addEventListener('click', setActive);

        function renderString() {
            if (!bjBox) return;

            let html = '';
            targetString.split('').forEach((char, idx) => {
                if (idx < currentIndex) {
                    if (typedChars[idx] && typedChars[idx].correct) {
                        html += `<span class="correct">${char}</span>`;
                    } else {
                        html += `<span class="incorrect">${typedChars[idx] ? typedChars[idx].char : char}</span>`;
                    }
                } else if (idx === currentIndex) {
                    html += `<span class="blinking-cursor">|</span><span>${char}</span>`;
                } else {
                    html += `<span>${char}</span>`;
                }
            });

            if (currentIndex === targetString.length) {
                html += `<span class="blinking-cursor">|</span>`;
            }

            bjBox.innerHTML = html;
        }

        function highlightKey(key) {
            const keyElement = tutorialContainer.querySelector(`.key[data-key="${key}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
                setTimeout(() => {
                    keyElement.classList.remove('active');
                }, 150);
            }
        }

        function highlightRow(key) {
            let rowToHighlight = null;
            if (keyRows.top.includes(key)) rowToHighlight = 'top';
            else if (keyRows.home.includes(key)) rowToHighlight = 'home';
            else if (keyRows.bottom.includes(key)) rowToHighlight = 'bottom';

            // Use the more robust class-based selector
            const rowSelector = `.keyboard-row-${rowToHighlight}`;
            const rowElement = tutorialContainer.querySelector(rowSelector);
            if (rowElement) {
                rowElement.classList.add('highlight-row');
                setTimeout(() => {
                    rowElement.classList.remove('highlight-row');
                }, 200); // Highlight duration
            }
        }

        function handleKey(e) {
            if (practiceCompleted) return;

            if (e.key === ' ') e.preventDefault();
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

            // Use special row highlighting for the final section
            if (containerSelector === '.tutorial-all-rows') {
                highlightRow(e.key.toLowerCase());
            } else {
                highlightKey(e.key);
            }

            if (e.key === 'Backspace') {
                if (currentIndex > 0) {
                    currentIndex--;
                    typedChars.pop();
                }
            } else if (e.key.length === 1 && currentIndex < targetString.length) {
                const isCorrect = e.key === targetString[currentIndex];
                typedChars[currentIndex] = { char: e.key, correct: isCorrect };
                currentIndex++;
            }

            renderString();

            if (currentIndex === targetString.length) {
                const allCorrect = typedChars.every(c => c.correct);
                if (allCorrect) {
                    practiceCompleted = true;
                    if (popup && popupTextElement) {
                        popupTextElement.innerHTML = popupMessage; // Set the custom message
                        popup.classList.add('show');
                    }

                    setTimeout(() => {
                        if (popup) popup.classList.remove('show');
                        currentIndex = 0;
                        typedChars = [];
                        practiceCompleted = false;
                        renderString();
                    }, 5000);
                }
            }
        }

        // Add click listeners for virtual keyboard
        keyboardKeys.forEach(key => {
            key.addEventListener('click', () => {
                // When a virtual key is clicked, activate this container
                setActive();

                const keyValue = key.dataset.key;
                if (keyValue) {
                    const event = new KeyboardEvent('keydown', { key: keyValue });
                    handleKey(event); // Directly call handler for immediate feedback
                }
            });
        });

        renderString(); // Initial render
    }

    // Initialize all practice sections
    initializeTutorialPractice(
        '.tutorial-home-row', 
        'asdf jkl;', 
        'Home row complete! Practice <strong>Level 1 & 2</strong> on the <a href="typing-practice.html">Practice</a> page.'
    );
    initializeTutorialPractice(
        '.tutorial-top-row', 
        'qwer uiop', 
        'Top row conquered! Head to the <a href="typing-practice.html">Practice</a> page to master <strong>Level 3 & 4</strong>.'
    );
    initializeTutorialPractice(
        '.tutorial-bottom-row', 
        'zxcv m,./', 
        'Excellent! The bottom row is yours. Solidify your skills on <strong>Level 5 & 6</strong> of the <a href="typing-practice.html">Practice</a> page.'
    );
    initializeTutorialPractice(
        '.practice', 
       '<a href="typing-practice.html</a> page.'
    );
    initializeTutorialPractice(
        '.tutorial-all-rows',
        'quick fox jumps; lazy dog.',
        'Tutorial complete! You have the skills. Now build your speed on the <a href="index.html">main typing test</a>!'
    );

    // Deactivate all instances if user clicks outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tutorial-keyboard-container')) {
            document.querySelectorAll('.tutorial-keyboard-container').forEach(c => c.classList.remove('active-focus'));
            activeKeyHandler = null; // Deactivate keyboard input
        }
    });
});