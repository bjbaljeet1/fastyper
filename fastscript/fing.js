  // Lesson data structure with 10 lessons and 21 patterns each
        const lessons = [
            {
                name: "Level 1: Home Row Basic",
                description: "Practice the home row keys",
                keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
                patterns: generatePatterns(['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], 21)
            },
            {
                name: "Level 1.1: Extended Home Row",
                description: "Practice extended home row keys",
                keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
                patterns: generatePatterns(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"], 21)
            },
            {
                name: "Level 2: Top Row Basic",
                description: "Practice the top row keys",
                keys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
                patterns: generatePatterns(['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'], 21)
            },
            {
                name: "Level 2.1: Extended Top Row",
                description: "Practice extended top row keys",
                keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
                patterns: generatePatterns(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], 21)
            },
            {
                name: "Level 3: Bottom Row Basic",
                description: "Practice the bottom row keys",
                keys: ['z', 'x', 'c', 'v', 'm', ',', '.', '/'],
                patterns: generatePatterns(['z', 'x', 'c', 'v', 'm', ',', '.', '/'], 21)
            },
            {
                name: "Level 3.1: Extended Bottom Row",
                description: "Practice extended bottom row keys",
                keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
                patterns: generatePatterns(['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'], 21)
            },
            {
                name: "Level 4: Home + Top Rows",
                description: "Practice home and top row keys",
                keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
                patterns: generatePatterns(['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'], 21)
            },
            {
                name: "Level 5: Home + Bottom Rows",
                description: "Practice home and bottom row keys",
                keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'z', 'x', 'c', 'v', 'm', ',', '.', '/'],
                patterns: generatePatterns(['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'z', 'x', 'c', 'v', 'm', ',', '.', '/'], 21)
            },
            {
                name: "Level 6: Top + Bottom Rows",
                description: "Practice top and bottom row keys",
                keys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p', 'z', 'x', 'c', 'v', 'm', ',', '.', '/'],
                patterns: generatePatterns(['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p', 'z', 'x', 'c', 'v', 'm', ',', '.', '/'], 21)
            },
            {
                name: "Level 7: All Rows Combined",
                description: "Practice all keyboard rows",
                keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 
                       'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
                       'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
                patterns: generatePatterns(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 
                       'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
                       'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'], 21)
            }
        ];

      function groupWithSpaces(chars) {
    let grouped = [];
    for (let i = 0; i < chars.length; i++) {
        grouped.push(chars[i]);
        // Insert space after every 4 chars, except at the very end
        if ((i + 1) % 4 === 0 && i !== chars.length - 1) {
            grouped.push(" ");
        }
    }
    return grouped;
}


        // Function to generate patterns for a set of keys
        function generatePatterns(keys, count) {
            const patterns = [];
            
            for (let i = 0; i < count; i++) {
                // Create different pattern types
                if (i % 7 === 0) {
                    // Sequential pattern
                    // patterns.push([...keys]);
                    patterns.push(groupWithSpaces([...keys]));

                } else if (i % 7 === 1) {
                    // Reverse pattern
                    patterns.push(groupWithSpaces([...keys].reverse()));
                } else if (i % 7 === 2) {
                    // Alternating pattern
                    const pattern = [];
                    for (let j = 0; j < keys.length; j++) {
                        if (j % 2 === 0 && j + 1 < keys.length) {
                            pattern.push(keys[j+1], keys[j]);
                        }
                    }
                    patterns.push(groupWithSpaces(pattern.length > 0 ? pattern : [...keys]));
                } else if (i % 7 === 3) {
                    // Random pattern with all keys
                    patterns.push(groupWithSpaces([...keys].sort(() => Math.random() - 0.5)));
                } else if (i % 7 === 4) {
                    // Pattern focusing on left hand
                    const leftKeys = keys.filter(k => 
                        ['a', 's', 'd', 'f', 'g', 'q', 'w', 'e', 'r', 't', 
                         'z', 'x', 'c', 'v', 'b'].includes(k));
                    patterns.push(groupWithSpaces([...leftKeys].sort(() => Math.random() - 0.5)));
                } else if (i % 7 === 5) {
                    // Pattern focusing on right hand
                    const rightKeys = keys.filter(k => 
                        ['h', 'j', 'k', 'l', ';', "'", 'y', 'u', 'i', 'o', 'p', 
                         '[', ']', '\\', 'n', 'm', ',', '.', '/'].includes(k));
                   patterns.push(groupWithSpaces([...rightKeys].sort(() => Math.random() - 0.5)));
                } else {
                    // Mixed pattern with repeated elements for practice
                    const pattern = [];
                    for (let j = 0; j < keys.length * 1.5; j++) {
                        pattern.push(keys[Math.floor(Math.random() * keys.length)]);
                    }
                    patterns.push(groupWithSpaces(pattern));
                }
            }
            
            return patterns;
        }

        // App state
        let currentLesson = 0;
        let currentPattern = 0;
        let currentIndex = 0;
        let startTime = null;
        let errors = 0;
        let totalKeystrokes = 0;
        let correctKeystrokes = 0;
        let typedChars = [];
        let wpm = 0;
        let wpmInterval = null;
        let countdownInterval = null;
        let maxUnlockedLesson = 0; // Keep this to calculate total progress accurately
        
        // DOM elements
        const bjBox = document.querySelector('.bjBox');
        const lessonNumber = document.getElementById('lessonNumber');
        const patternNumber = document.getElementById('patternNumber');
        const accuracyElement = document.getElementById('accuracy');
        const progressElement = document.getElementById('progress');
        const wpmElement = document.getElementById('wpm');
        const errorsElement = document.getElementById('errors');
        const overallProgressBar = document.getElementById('overallProgressBar');
        const overallProgressText = document.getElementById('overallProgressText');
        const lessonFocus = document.getElementById('lessonFocus');
        const patternInfo = document.getElementById('patternInfo');
        const prevLessonBtn = document.getElementById('prevLesson');
        const resetLessonBtn = document.getElementById('resetLesson');
        const nextLessonBtn = document.getElementById('nextLesson');
        const completionMessage = document.getElementById('completionMessage');
        const resetAllProgressBtn = document.getElementById('resetAllProgressBtn');
        const countdownElement = document.getElementById('countdown');
        const errorNotification = document.getElementById('errorNotification');
        const levelUnlockedModal = document.getElementById('levelUnlockedModal');
        const levelUnlockSound = document.getElementById('levelUnlockSound');
        const skipLevelUnlockBtn = document.getElementById('skipLevelUnlockBtn');
        const lessonSelector = document.getElementById('lessonSelector');
        const toggleFingerColors = document.getElementById('toggleFingerColors');
        const keyboardKeys = document.querySelectorAll('.key');
        const legendHeader = document.getElementById('legendHeader');
        const fingerLegend = document.getElementById('fingerLegend');
        const tipOfTheDayContent = document.getElementById('tipOfTheDayContent');
        
        // Initialize
        loadProgress();
        initializeLessonSelector();
        setupVirtualKeyboard();
        displayTipOfTheDay();
        resetLesson();
        
        // Event listeners
        document.addEventListener('keydown', handleKey);
        prevLessonBtn.addEventListener('click', () => changeLesson(-1));
        nextLessonBtn.addEventListener('click', () => changeLesson(1));
        resetLessonBtn.addEventListener('click', resetLesson);
        resetAllProgressBtn.addEventListener('click', resetAllProgress);
        toggleFingerColors.addEventListener('change', handleColorToggle);
        skipLevelUnlockBtn.addEventListener('click', skipLevelUnlock);
        legendHeader.addEventListener('click', toggleLegend);
        
        // Functions
        function displayTipOfTheDay() {
            const allTips = [
                "<strong>Master Touch Typing:</strong> Keep your eyes on the screen, not your fingers. This is the golden rule.",
                "<strong>Maintain Good Posture:</strong> Sit up straight with your feet flat on the floor. It reduces fatigue and improves focus.",
                "<strong>Use All Your Fingers:</strong> Learn the correct finger placement for each key. Our finger legend helps!",
                "<strong>Practice Consistently:</strong> Just 15-30 minutes of focused practice daily yields significant results.",
                "<strong>Focus on Accuracy First:</strong> Speed will naturally follow accuracy. Don't rush and build bad habits.",
                "<strong>Increased Productivity:</strong> Spend less time typing and more time thinking and creating.",
                "<strong>Better Job Prospects:</strong> Many modern jobs value or require efficient typing skills.",
                "<strong>Improved Focus:</strong> When you can type without thinking, your mind is free to concentrate on your ideas.",
                "<strong>Reduced Strain:</strong> Proper technique reduces the risk of Repetitive Strain Injury (RSI).",
                "<strong>Enhanced Communication:</strong> Respond faster in chats, emails, and online collaborations."
            ];

            if (tipOfTheDayContent) {
                const randomIndex = Math.floor(Math.random() * allTips.length);
                tipOfTheDayContent.innerHTML = allTips[randomIndex];
            }
        }
        function saveProgress() {
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            const progress = {
                currentLesson: currentLesson,
                currentPattern: currentPattern,
                maxUnlockedLesson: maxUnlockedLesson || 0
            };
            localStorage.setItem('fingerTrainProgress', JSON.stringify(progress));

            if (typeof updateCookieDisplay === 'function') {
                updateCookieDisplay();
            }
        }

        function loadProgress() {
            const savedProgress = JSON.parse(localStorage.getItem('fingerTrainProgress'));
            if (savedProgress) {
                currentLesson = savedProgress.currentLesson || 0;
                currentPattern = savedProgress.currentPattern || 0;
                maxUnlockedLesson = savedProgress.maxUnlockedLesson || 0;
            }

            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            const colorsEnabled = localStorage.getItem('fingerColorsEnabled') !== 'false';
            if (toggleFingerColors) {
                toggleFingerColors.checked = colorsEnabled;
            }

            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            const legendCollapsed = localStorage.getItem('fingerLegendCollapsed') === 'true';
            if (legendCollapsed) {
                fingerLegend.classList.add('collapsed');
            }
        }

        function initializeLessonSelector() {
            lessonSelector.innerHTML = '';
            
            lessons.forEach((lesson, index) => {
                const button = document.createElement('button');
                button.className = 'lesson-btn';
                button.textContent = `L${index + 1}`;
                if (index > maxUnlockedLesson) {
                    button.disabled = true;
                    button.title = "Complete previous levels to unlock";
                }
                if (index === currentLesson) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    currentLesson = index;
                    currentPattern = 0;
                    saveProgress();
                    resetLesson();
                });
                lessonSelector.appendChild(button);
            });
        }
        
        function updateLessonButtons() {
            document.querySelectorAll('.lesson-btn').forEach((btn, index) => {
                btn.disabled = index > maxUnlockedLesson;
                if (index === currentLesson) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Disable/Enable next/prev buttons
            if (maxUnlockedLesson === 0) {
                prevLessonBtn.disabled = true;
                nextLessonBtn.disabled = true;
                nextLessonBtn.title = "Complete the current level to unlock";
            } else {
                prevLessonBtn.disabled = currentLesson === 0;
                const isNextDisabled = currentLesson >= maxUnlockedLesson || currentLesson === lessons.length - 1;
                nextLessonBtn.disabled = isNextDisabled;

                if (isNextDisabled) {
                    nextLessonBtn.title = (currentLesson === lessons.length - 1) ? "You've completed all levels!" : "Complete the current level to unlock";
                } else {
                    nextLessonBtn.title = ""; // Clear tooltip when enabled
                }
            }
        }

        function resetAllProgress() {
            const confirmed = confirm("Are you sure you want to reset all your progress? This action cannot be undone.");
            if (confirmed) {
                if (localStorage.getItem('cookie_consent') !== 'accepted') return;
                localStorage.removeItem('fingerTrainProgress');
                currentLesson = 0;
                currentPattern = 0;
                maxUnlockedLesson = 0;
                
                // Re-initialize the UI
                initializeLessonSelector();
                resetLesson();
                if (typeof updateCookieDisplay === 'function') {
                    updateCookieDisplay();
                }
                alert("All progress has been reset.");
            }
        }
        
        function setupVirtualKeyboard() {
            keyboardKeys.forEach(key => {
                key.addEventListener('click', () => {
                    const keyValue = key.getAttribute('data-key');
                    if (keyValue) {
                        // Create a keyboard event
                        const event = new KeyboardEvent('keydown', {
                            key: keyValue === ' ' ? ' ' : keyValue,
                            keyCode: keyValue === ' ' ? 32 : keyValue.charCodeAt(0),
                            which: keyValue === ' ' ? 32 : keyValue.charCodeAt(0)
                        });
                        
                        // Dispatch the event
                        document.dispatchEvent(event);
                    }
                });
            });
        }
        
        function updateKeyboard() {
            // Reset all keys
            keyboardKeys.forEach(key => {
                key.classList.remove('active');
            });
            
            // Highlight current key
            const currentChars = lessons[currentLesson].patterns[currentPattern];
            if (currentIndex < currentChars.length) {
                const currentKey = currentChars[currentIndex];
                const keyElement = document.querySelector(`.key[data-key="${currentKey}"]`);
                if (keyElement) {
                    keyElement.classList.add('active');
                }
            }
        }
        
        function handleKey(e) {
            if (e.key === 'Escape') {
                resetLesson();
                return;
            }
            // Prevent page scrolling when pressing space
    if (e.key === ' ') {
        e.preventDefault();
    }

            
            // Ignore modifier keys
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
                return;
            }
            
            // Start timer on first key press
            if (startTime === null && e.key.length === 1) {
                startTime = new Date();
                wpmInterval = setInterval(calculateWPM, 2000); // Calculate WPM every 2 seconds
            }
            
            const currentChars = lessons[currentLesson].patterns[currentPattern];
            
            if (e.key === 'Backspace') {
                // Allow backspace to correct errors
                if (currentIndex > 0) {
                    // If we're going back from an error, remove the error record
                    if (typedChars[currentIndex - 1] && !typedChars[currentIndex - 1].correct) {
                        errors--;
                    }
                    // If we're going back from a correct character, decrement correctKeystrokes
                    if (typedChars[currentIndex - 1] && typedChars[currentIndex - 1].correct) {
                        // Only decrement if it's not a space, as spaces don't count towards WPM chars
                        if (typedChars[currentIndex - 1].char !== ' ') correctKeystrokes--;
                    }
                    currentIndex--;
                    typedChars.pop();
                    hideError();
                }
            } else if (e.key === 'ArrowRight') {
                // Skip forward
                if (currentIndex < currentChars.length) currentIndex++;
                hideError();
            } else if (e.key === 'ArrowLeft') {
                // Skip backward
                if (currentIndex > 0) currentIndex--;
                hideError();
            } else if (e.key === 'Enter') {
                // Next pattern
                changePattern(1);
                hideError();
            } else if (e.key.length === 1 || e.key === ' ') {
                // Count all keystrokes for accuracy calculation
                totalKeystrokes++;
                
                const isCorrect = e.key === currentChars[currentIndex];
                typedChars[currentIndex] = {char: e.key, correct: isCorrect};

                if (isCorrect) {
                    correctKeystrokes++;
                    hideError();
                } else {
                    errors++;
                    showError(`ERROR! EXPECTED "${currentChars[currentIndex]}" BUT GOT "${e.key}"`);
                }

                // Always advance the cursor
                currentIndex++;

                // Check if pattern is completed
                if (currentIndex >= currentChars.length) {
                    showCompletionMessage();
                    checkLevelCompletion();
                }
            }
            
            updateStats();
            renderString();
            updateKeyboard();
        }
        
        function handleColorToggle() {
            const isEnabled = toggleFingerColors.checked;
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;
            localStorage.setItem('fingerColorsEnabled', isEnabled);
            applyColorPreference();
        }

        function toggleLegend() {
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            const isCollapsed = fingerLegend.classList.toggle('collapsed');
            localStorage.setItem('fingerLegendCollapsed', isCollapsed);
        }


        function applyColorPreference() {
            const isEnabled = localStorage.getItem('fingerColorsEnabled') !== 'false';
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;
            document.querySelector('.virtual_keyboard').classList.toggle('colors-hidden', !isEnabled);
        }

        function showError(message) {
            errorNotification.textContent = message;
            errorNotification.style.opacity = '1';
        }
        
        function hideError() {
            errorNotification.style.opacity = '0';
        }
        
        function skipLevelUnlock() {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            levelUnlockedModal.classList.remove('show');
            // Wait for animation to finish before changing level
            setTimeout(() => changeLesson(1), 500);
        }

        function showLevelUnlockedMessage() {
            levelUnlockedModal.style.display = 'flex';
            if (levelUnlockSound) {
                levelUnlockSound.currentTime = 0;
                levelUnlockSound.play().catch(e => console.error("Audio play failed:", e));
            }

            let countdown = 5;
            const countdownEl = document.getElementById('levelUnlockedCountdown');
            countdownEl.textContent = countdown;

            if (countdownInterval) {
                clearInterval(countdownInterval);
            }

            countdownInterval = setInterval(() => {
                countdown--;
                countdownEl.textContent = countdown;

                if (countdown <= 0) {
                    // Use the skip function to handle the transition
                    if (levelUnlockedModal.style.display === 'flex') skipLevelUnlock();
                }
            }, 1000);
        }

        function showCompletionMessage() {
            // Show completion message
            completionMessage.style.display = 'block';
            
            // Start countdown
            let countdown = 3;
            countdownElement.textContent = countdown;
            
            // Clear any existing interval
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            
            // Start countdown
            countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    const isLastPattern = currentPattern === lessons[currentLesson].patterns.length - 1;
                    const isLevelUnlocked = isLastPattern && currentLesson === maxUnlockedLesson -1;

                    // Check if it's the last pattern of the current level
                    if (isLevelUnlocked) {
                        showLevelUnlockedMessage();
                    } else if (isLastPattern) {
                        changeLesson(1);
                    } else {
                        changePattern(1);
                    }
                }
            }, 1000);
        }
        
        function updateStats() {
            const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
            const currentChars = lessons[currentLesson].patterns[currentPattern];
            const progress = currentChars.length > 0 ? Math.round((currentIndex / currentChars.length) * 100) : 0;
            
            lessonNumber.textContent = `${currentLesson + 1}/${lessons.length}`;
            patternNumber.textContent = `${currentPattern + 1}/${lessons[currentLesson].patterns.length}`;
            accuracyElement.textContent = `${accuracy}%`;
            progressElement.textContent = `${progress}%`;
            wpmElement.textContent = wpm;
            errorsElement.textContent = errors;
            lessonFocus.textContent = lessons[currentLesson].name;
            patternInfo.textContent = `Pattern ${currentPattern + 1}`;
            updateOverallProgress();
        }

        function updateOverallProgress() {
            const totalLessons = lessons.length;
            // Calculate completed lessons based on the max unlocked level
            const completedLessons = maxUnlockedLesson > currentLesson ? maxUnlockedLesson : currentLesson;
            const progressInCurrentLesson = (currentPattern / lessons[currentLesson].patterns.length);
            
            const overallProgress = ((completedLessons + progressInCurrentLesson) / totalLessons) * 100;
            
            overallProgressBar.style.width = `${Math.min(100, overallProgress)}%`;
            overallProgressText.textContent = `${Math.floor(Math.min(100, overallProgress))}%`;
        }

        function checkLevelCompletion() {
            // If the user completes the last pattern of their highest unlocked lesson, unlock the next one.
            if (currentPattern === lessons[currentLesson].patterns.length - 1 && currentLesson === maxUnlockedLesson && maxUnlockedLesson < lessons.length - 1) {
                maxUnlockedLesson++;
                saveProgress(); // Save progress immediately after unlocking
            }
        }
        
      function renderString() {
    const currentChars = lessons[currentLesson].patterns[currentPattern];
    let html = '';
    
    currentChars.forEach((ch, idx) => {
        if (idx < currentIndex) {
            // Character has been typed
            if (typedChars[idx] && typedChars[idx].correct) {
                html += `<span class="correct">${ch}</span>`;
            } else {
                html += `<span class="incorrect">${typedChars[idx] ? typedChars[idx].char : ch}</span>`;
            }
        } else if (idx === currentIndex) {
            // Current character with cursor
            html += `<span class="blinking-cursor">|</span><span>${ch}</span>`;
        } else {
            // Future characters
            html += `<span>${ch}</span>`;
        }
    });


    // If cursor is at end, show blinking cursor after last char
    if (currentIndex === currentChars.length) {
        html += `<span class="blinking-cursor">|</span>`;
    }

    bjBox.innerHTML = html;
}

        function calculateWPM() {
            if (!startTime) return;
            const now = new Date();
            const timeElapsed = (now - startTime) / 1000 / 60; // in minutes
            if (timeElapsed > 0) {
                // Standard WPM is (all typed characters / 5) / time in minutes
                const grossWPM = (currentIndex / 5) / timeElapsed;
                wpm = Math.round(grossWPM);
            }
        }

        


        function resetLesson() {
            // Hide completion message if visible
            completionMessage.style.display = 'none';
            
            // Clear countdown if in progress
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            // Hide error message
            hideError();
            
            // Reset lesson state
            currentIndex = 0;
            errors = 0;
            totalKeystrokes = 0;
            correctKeystrokes = 0;
            startTime = null;
            typedChars = [];
            wpm = 0;
            if (wpmInterval) {
                clearInterval(wpmInterval);
                wpmInterval = null;
            }
            
            updateStats();
            renderString();
            updateLessonButtons();
            updateKeyboard();
            applyColorPreference();
        }
        
        function changePattern(direction) {
            // Hide completion message if visible
            completionMessage.style.display = 'none';
            
            // Clear countdown if in progress
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            // Hide error message
            hideError();
            
            // Change pattern
            currentPattern = (currentPattern + direction + lessons[currentLesson].patterns.length) % lessons[currentLesson].patterns.length;
            saveProgress();
            resetLesson();
        }
        
        function changeLesson(direction) {
            // Hide completion message if visible
            completionMessage.style.display = 'none';
            
            // Clear countdown if in progress
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            // Hide error message
            hideError();
            
            // Change lesson, but respect unlocked levels
            const newLesson = currentLesson + direction;
            if (newLesson >= 0 && newLesson <= maxUnlockedLesson && newLesson < lessons.length) {
                currentLesson = newLesson;
                currentPattern = 0;
                saveProgress();
                resetLesson();
            }
        }