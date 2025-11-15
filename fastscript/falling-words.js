document.addEventListener('DOMContentLoaded', () => {
    const wordBox = document.getElementById('word-box');
    const gameInput = document.getElementById('game-input');
    const livesContainer = document.getElementById('lives-container');
    const wpmDisplay = document.getElementById('wpm-display');
    const accuracyDisplay = document.getElementById('accuracy-display-val');
    const scoreDisplay = document.getElementById('score-display');
    const timeDisplay = document.getElementById('time-display');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayText = document.getElementById('overlay-text');
    const startGameBtnMain = document.getElementById('start-game-btn-main');
    const startGameBtnDesktop = document.getElementById('start-game-btn-desktop');
    const totalWordsDisplay = document.getElementById('total-words-display');
    const wpmChartCanvas = document.getElementById('wpm-chart');
    const explosionSound = new Audio('/media/finish.mp3'); // Sound for correct word
    const clearHighScoresBtn = document.getElementById('clearHighScoresBtn');
    const highScoresTableBody = document.querySelector('#highScoresTable tbody');
    const correctSound = new Audio('/media/key-press-263640.mp3');
    const incorrectSound = new Audio('/media/wrong-47985.mp3');
    const mobileRestartBtn = document.getElementById('mobile-restart-btn');
    const mobilePauseBtn = document.getElementById('mobile-pause-btn');

    const easyWords = [ "apple", "beach", "chair", "dance", "eagle", "fairy", "giant", "happy", "igloo", "joker",
    "knife", "lemon", "mango", "night", "ocean", "piano", "queen", "river", "sweet", "tiger",
    "uncle", "visit", "water", "xylol", "yacht", "zebra", "about", "brave", "cloud", "dream",
    "early", "faint", "grass", "house", "index", "joint", "kitty", "light", "mouse", "north",
    "orbit", "paint", "quiet", "round", "story", "truck", "under", "voice", "whale", "young",
    "zoned", "angle", "bacon", "camel", "delay", "equal", "frost", "glove", "honey", "input",
    "jelly", "kneel", "laugh", "metal", "never", "olive", "party", "reply", "smoke", "touch",
    "unity", "valid", "wheat", "yield", "zippy", "ahead", "blunt", "craft", "ditch", "event",
    "flame", "ghost", "honor", "image", "jolly", "knead", "later", "model", "noble", "ounce",
    "prime", "quest", "ready", "scope", "thing", "upper", "voter", "widen", "yells", "zones"];

    let lives;
    const gameOverQuotes = [
        "Even legends have to rest. Try again!",
        "The keyboard is mightier than the sword. Sharpen your skills.",
        "You fought well. The words live to fall another day.",
        "Defeat is not the end, but a chance to begin again, more wisely.",
        "Your fingers have been bested... for now.",
        "GAME OVER. Insert coin (or press 'Play Again').",
        "The wordpocalypse was too much. Will you rise from the ashes?"
    ];

    let score;
    let wordInterval;
    let gameLoopInterval;
    let fallingWords = [];
    let activeWord = null;
    let gameActive = false;
    let isPaused = false;
    let wordFallSpeed;
    let wordSpawnRate;
    let speedBoostsApplied;

    // Stats
    let totalTypedEntries;
    let correctTypedEntries;
    let gameStartTime;
    let totalWordsTyped;
    let correctWordsTyped;
    let currentWordHasMistake;
    let statUpdateInterval;

    let wpmChart;
    let wpmHistory = [];

    function initializeGame() {
        lives = 5;
        score = 0;
        totalTypedEntries = 0;
        correctTypedEntries = 0;
        totalWordsTyped = 0;
        correctWordsTyped = 0;
        currentWordHasMistake = false;
        gameStartTime = null;
        wordFallSpeed = 1;
        wordSpawnRate = 2000;
        speedBoostsApplied = [];
        fallingWords = [];
        wpmHistory = [];

        // Clear only the falling word elements, leaving the overlay intact
        const wordsToRemove = wordBox.querySelectorAll('.falling-word');
        wordsToRemove.forEach(wordEl => wordEl.remove());
        fallingWords = []; // Ensure the array is also cleared

        gameInput.value = '';
        isPaused = false;
        activeWord = null;
        
        if (wordInterval) clearInterval(wordInterval);
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        if (statUpdateInterval) clearInterval(statUpdateInterval);

        updateDisplays();
        initializeChart();
        displayHighScores();
        overlayTitle.classList.remove('game-over-animated'); // Reset animation class
        
        mobilePauseBtn.disabled = true;
        mobilePauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause'; // Reset button text
        // Ensure the overlay is visible and shows the initial message
        gameOverlay.classList.remove('hidden');
        overlayTitle.textContent = 'Falling Words';
        overlayText.innerHTML = 'Type the words before they hit the bottom.<br>Press SPACE to start!'; 
        startGameBtnDesktop.textContent = 'Start Game'; // Reset main button text

        // Mobile button visibility
        startGameBtnMain.style.display = 'inline-block';
        mobileRestartBtn.style.display = 'none';
        mobilePauseBtn.style.display = 'none';
    }

    function updateDisplays() {
        livesContainer.innerHTML = '';
        for (let i = 0; i < Math.max(0, lives); i++) {
            const lifeIcon = document.createElement('img');
            lifeIcon.src = '/media/fastyper-coin.png';
            lifeIcon.className = 'life-coin';
            livesContainer.appendChild(lifeIcon);
        }
        scoreDisplay.textContent = score;
        totalWordsDisplay.textContent = totalWordsTyped;
        
        const accuracy = totalTypedEntries > 0 ? ((correctTypedEntries / totalTypedEntries) * 100).toFixed(0) : 100; // Character-based accuracy
        accuracyDisplay.textContent = `${accuracy}%`;

        if (gameActive && gameStartTime) {
            // Update timer display
            const timeElapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
            const minutes = Math.floor(timeElapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (timeElapsedSeconds % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${minutes}:${seconds}`;
            const timeElapsedMinutes = (Date.now() - gameStartTime) / 60000;
            if (timeElapsedMinutes > 0) {
                const wpm = Math.floor((correctTypedEntries / 5) / timeElapsedMinutes);
                wpmHistory.push(wpm);
                if (wpmHistory.length > 30) { // Keep the last 30 seconds of data
                    wpmHistory.shift();
                }
                wpmDisplay.textContent = wpm;
                updateChart();
            }
        } else {
            wpmDisplay.textContent = "0";
            timeDisplay.textContent = "00:00";
        }
    }

    function initializeChart() {
        if (wpmChart) {
            wpmChart.destroy();
        }
        const ctx = wpmChartCanvas.getContext('2d');

        // Create a gradient for the fill
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(0, 204, 255, 0.4)'); // Brighter at the top
        gradient.addColorStop(1, 'rgba(0, 204, 255, 0)');   // Fades to transparent

        wpmChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'WPM',
                    data: [],
                    borderColor: '#00d9ff', // A brighter, more electric cyan
                    backgroundColor: gradient, // Use the gradient here
                    fill: true, // Make sure the area under the line is filled
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    x: { ticks: { display: false }, grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
        updateChart();
    }

    function createWord() {
        if (fallingWords.length >= 5) return; // Limit concurrent words

        const availableWords = easyWords.filter(w => !fallingWords.some(fw => fw.text === w));
        if (availableWords.length === 0) return;

        const text = availableWords[Math.floor(Math.random() * availableWords.length)];
        const wordElement = document.createElement('div');
        wordElement.className = 'falling-word';
        wordElement.classList.add('word-spawn'); // Add spawn animation class
        wordElement.textContent = text;
        wordElement.style.top = '0px';

        wordBox.appendChild(wordElement);

        // Clean up animation class after it finishes
        setTimeout(() => wordElement.classList.remove('word-spawn'), 500);

        // Now that the element is in the DOM, we can get its actual width
        const wordWidth = wordElement.offsetWidth;
        const maxLeft = wordBox.clientWidth - wordWidth;
        wordElement.style.left = `${Math.random() * Math.max(0, maxLeft)}px`;

        fallingWords.push({
            text: text,
            element: wordElement,
            y: 0
        });
    }

    function loseLife() {
        lives--;

        // Add screen shake effect
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 300);

        if (lives <= 0) {
            endGame();
        }
        updateDisplays();
    }

    function gameLoop() {
        if (!gameActive) return;

        fallingWords.forEach((word, index) => {
            word.y += wordFallSpeed;
            word.element.style.top = `${word.y}px`;

            if (word.y > wordBox.clientHeight) {
                word.element.remove();
                fallingWords.splice(index, 1);
                
                // If the missed word was the one being typed, it counts as a wrong word.
                if (activeWord && activeWord.text === word.text) {
                    totalWordsTyped++; // It was attempted
                    activeWord = null;
                    gameInput.value = '';
                    currentWordHasMistake = false;
                }
                loseLife();
            }
        });

        // Check if the active word should start burning
        if (activeWord && activeWord.startTime) {
            const timeSinceActive = Date.now() - activeWord.startTime;
            // If user takes more than 4 seconds on a word, it catches fire.
            if (timeSinceActive > 4000) {
                activeWord.element.classList.add('burning');
            }
        }
    }

    function highlightWord() {
        if (!activeWord) return;

        const typed = gameInput.value;
        let newHTML = '';
        let correct = true;

        for (let i = 0; i < activeWord.text.length; i++) {
            if (i < typed.length) {
                if (typed[i] === activeWord.text[i]) {
                    newHTML += `<span class="correct">${activeWord.text[i]}</span>`;
                } else {
                    newHTML += `<span class="incorrect">${activeWord.text[i]}</span>`;
                    correct = false;
                }
            } else {
                newHTML += `<span>${activeWord.text[i]}</span>`;
            }
        }
        activeWord.element.innerHTML = newHTML;
        return correct;
    }
    
    /**
     * Checks the current score and applies a one-time speed boost if a threshold is met.
     * This makes the game progressively harder.
     */
    function checkScoreForSpeedBoost() {
        const scoreThresholds = [50, 150, 300, 500]; // Score milestones for speed boosts

        scoreThresholds.forEach(threshold => {
            if (score >= threshold && !speedBoostsApplied.includes(threshold)) {
                wordFallSpeed += 0.4; // Increase falling speed
                speedBoostsApplied.push(threshold); // Mark this boost as applied
            }
        });
    }

    function createBlastEffect(wordObject) {
        const rect = wordObject.element.getBoundingClientRect();
        const containerRect = wordBox.getBoundingClientRect();

        const blast = document.createElement('div');
        blast.className = 'blast-wave';
        blast.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        blast.style.top = `${rect.top - containerRect.top + rect.height / 2}px`;
        blast.style.width = `${rect.width * 2.5}px`;
        blast.style.height = `${rect.width * 2.5}px`;
        wordBox.appendChild(blast);
        setTimeout(() => blast.remove(), 800); // Clean up after animation
    }
    function explodeWord(wordObject, isCorrect) {
        const wordEl = wordObject.element;
        const wordText = wordObject.text;
        const rect = wordEl.getBoundingClientRect();
        const containerRect = wordBox.getBoundingClientRect();

        // Hide the original word element
        wordEl.style.opacity = '0';

        for (let i = 0; i < wordText.length; i++) {
            const char = wordText[i];
            const particle = document.createElement('span');
            particle.textContent = char;
            particle.className = 'explosion-particle';
            
            // Position particle at the original character's location within the game box
            particle.style.left = `${rect.left - containerRect.left + (i * (rect.width / wordText.length))}px`;
            particle.style.top = `${rect.top - containerRect.top}px`;
            
            // Calculate a random outward direction
            const angle = Math.random() * 2 * Math.PI;
            const radius = 100 + Math.random() * 80; // Scatter distance
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const rot = (Math.random() - 0.5) * 720; // Random rotation
            
            // Set CSS variables for the animation
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            particle.style.setProperty('--rot', `${rot}deg`);

            wordBox.appendChild(particle);
            // Clean up the particle after animation
            setTimeout(() => particle.remove(), 1000);
        }
    }

    function handleInput() {
        if (!gameActive) return;

        const typedValue = gameInput.value;

        if (!activeWord) {
            if (typedValue.length > 0) {
                activeWord = fallingWords.find(word => word.text.startsWith(typedValue));
                if (activeWord) {
                    activeWord.element.classList.add('active');
                    activeWord.startTime = Date.now(); // Start the "burn" timer
                    currentWordHasMistake = false; // Reset mistake tracking for the new word
                } else {
                    // No word starts with the typed letter. This is a mistake.
                    // To provide feedback, we'll temporarily set the first available word as active.
                    // This allows highlightWord() to show the error, and lets the user backspace.
                    activeWord = fallingWords[0] || null;
                    if (!activeWord) return; // No words on screen, do nothing.
                }
            }
        } else if (typedValue.length === 0) {
            // User backspaced completely, de-activate the word.
            activeWord.element.classList.remove('active', 'burning');
            activeWord.element.innerHTML = activeWord.text; // Reset content
            activeWord = null;
            return; // Exit since there's no active word to process
        }

        // Only increment total typed entries if a character was added, not removed.
        if (typedValue.length > (activeWord?.element.querySelectorAll('.correct, .incorrect').length || 0)) {
            totalTypedEntries++;
        }

        const isCorrectSoFar = highlightWord();

        // Play sound based on the last typed character
        if (typedValue.length > (lastInputValue || '').length) { // Character was added
            if (isCorrectSoFar) {
                correctSound.currentTime = 0;
                correctSound.play().catch(e => console.error("Audio play failed:", e));
            } else {
                incorrectSound.currentTime = 0;
                incorrectSound.play().catch(e => console.error("Audio play failed:", e));
                score = Math.max(0, score - 2); // Decrease score by 2 for a wrong key, not going below 0
                
                // Add shake effect to score display
                scoreDisplay.classList.add('score-shake');
                setTimeout(() => {
                    scoreDisplay.classList.remove('score-shake');
                }, 300); // Match animation duration
                updateDisplays(); // Update score display immediately
            }
        }

        if (!isCorrectSoFar) {
            currentWordHasMistake = true;
            // A mistake was made. The highlightWord() function has already marked it visually.
            // We will allow the user to use backspace to correct it without an immediate penalty.
        }
 
        if (typedValue === activeWord.text) {
            score += activeWord.text.length;
            totalWordsTyped++;

            // A word is only correct if it's typed fully without any mistakes along the way.
            if (!currentWordHasMistake) {
                correctWordsTyped++;
                // Check for speed boost only on correctly typed words
                checkScoreForSpeedBoost();
            }

            // Add all characters of the correctly typed word to the stats
            correctTypedEntries += activeWord.text.length;
            
            // Play explosion sound
            if (explosionSound) {
                explosionSound.currentTime = 0;
                explosionSound.play().catch(e => console.error("Audio play failed:", e));
            }

            explodeWord(activeWord, true); // Create the explosion effect
            // The word element is hidden by explodeWord and removed with the particles
            fallingWords = fallingWords.filter(word => word.text !== activeWord.text);
            activeWord = null;
            gameInput.value = '';
            
            wordFallSpeed += 0.05;
            if(wordSpawnRate > 500) {
                wordSpawnRate -= 50;
                clearInterval(wordInterval);
                wordInterval = setInterval(createWord, wordSpawnRate);
            }
        }
    }

    function startGame() {
        if (gameActive) return;

        initializeGame();
        gameActive = true;
        gameOverlay.classList.add('hidden');
        // Use a small timeout to ensure the keyboard opens reliably on mobile after the overlay is hidden.
        setTimeout(() => {
            gameInput.focus();
        }, 100);
        gameStartTime = Date.now();
        gameInput.disabled = false;

        // Mobile button visibility
        startGameBtnMain.style.display = 'none';
        mobileRestartBtn.style.display = 'inline-block';
        mobilePauseBtn.style.display = 'inline-block';

        mobilePauseBtn.disabled = false;

        wordInterval = setInterval(createWord, wordSpawnRate);
        gameLoopInterval = setInterval(gameLoop, 20);
        statUpdateInterval = setInterval(updateDisplays, 1000);

    }

    function pauseGame() {
        if (!gameActive || isPaused) return;

        isPaused = true;
        // We keep gameActive true logically, but stop the intervals
        clearInterval(wordInterval);
        clearInterval(gameLoopInterval);
        clearInterval(statUpdateInterval);

        overlayTitle.textContent = 'Paused';
        overlayText.innerHTML = 'Press SPACE to resume.';
        gameOverlay.classList.remove('hidden');
        mobilePauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        gameInput.disabled = true;
    }

    function resumeGame() {
        if (!isPaused) return;

        isPaused = false;
        gameOverlay.classList.add('hidden');
        gameInput.disabled = false;
        gameInput.focus();
        mobilePauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

        wordInterval = setInterval(createWord, wordSpawnRate);
        gameLoopInterval = setInterval(gameLoop, 20);
        statUpdateInterval = setInterval(updateDisplays, 1000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(wordInterval);
        clearInterval(gameLoopInterval);
        clearInterval(statUpdateInterval);

        // Clear only the falling word elements, leaving the overlay intact
        const wordsToRemove = wordBox.querySelectorAll('.falling-word');
        wordsToRemove.forEach(wordEl => wordEl.remove());

        // Reset the array of falling words
        fallingWords = [];

        overlayTitle.textContent = 'Game Over';
        overlayTitle.classList.add('game-over-animated'); // Add class for animation

        const finalAccuracy = totalTypedEntries > 0 ? ((correctTypedEntries / totalTypedEntries) * 100).toFixed(0) : 100;
        const wrongWordsTyped = totalWordsTyped - correctWordsTyped;
        const timeElapsedMinutes = (Date.now() - gameStartTime) / 60000;
        const finalWPM = timeElapsedMinutes > 0 ? Math.floor((correctTypedEntries / 5) / timeElapsedMinutes) : 0;
        const randomQuote = gameOverQuotes[Math.floor(Math.random() * gameOverQuotes.length)];
        overlayText.innerHTML = `
            <div class="final-stats">Score: ${score} | WPM: ${finalWPM} | Accuracy: ${finalAccuracy}%</div>
            <div class="final-stats">Correct Words: ${correctWordsTyped} | Wrong Words: ${wrongWordsTyped}</div>
            <div class="game-over-quote">"${randomQuote}"</div>
        `;

        startGameBtnDesktop.textContent = 'Play Again';
        gameOverlay.classList.remove('hidden');
        gameInput.disabled = true; // Disable input to prevent accidental restart
        mobilePauseBtn.disabled = true;
        saveAndDisplayScores(score, finalWPM, finalAccuracy);
    }

    function handleStart() {
        if (gameActive) {
            initializeGame();
            gameActive = false;
            isPaused = false;
        } else {
            startGame();
        }
    }

    /**
     * Saves a new score to local storage if it's a high score and updates the display.
     * @param {number} newScore The final score.
     * @param {number} newWpm The final WPM.
     * @param {number} newAccuracy The final accuracy.
     */
    function saveAndDisplayScores(newScore, newWpm, newAccuracy) {
        const highScores = JSON.parse(localStorage.getItem('fallingWordsHighScores')) || [];
        
        const scoreEntry = {
            score: newScore,
            wpm: newWpm,
            accuracy: newAccuracy
        };

        highScores.push(scoreEntry);
        highScores.sort((a, b) => b.score - a.score); // Sort by score descending
        const topScores = highScores.slice(0, 5); // Keep only top 5

        localStorage.setItem('fallingWordsHighScores', JSON.stringify(topScores));
        displayHighScores();
    }

    /**
     * Loads high scores from local storage and displays them in the table.
     */
    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem('fallingWordsHighScores')) || [];
        highScoresTableBody.innerHTML = ''; // Clear existing table

        if (highScores.length === 0) {
            highScoresTableBody.innerHTML = `<tr><td colspan="4">No high scores yet. Play a game to set one!</td></tr>`;
            return;
        }

        highScores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.score}</td>
                <td>${score.wpm}</td>
                <td>${score.accuracy}%</td>
            `;
            highScoresTableBody.appendChild(row);
        });
    }

    /**
     * Clears the high scores from local storage after user confirmation.
     */
    function clearHighScores() {
        if (confirm("Are you sure you want to clear all high scores? This action cannot be undone.")) {
            localStorage.removeItem('fallingWordsHighScores');
            displayHighScores(); // Refresh the table to show it's empty
        }
    }

    // Event Listeners
    startGameBtnMain.addEventListener('click', startGame);
    startGameBtnDesktop.addEventListener('click', startGame);
    clearHighScoresBtn.addEventListener('click', clearHighScores);
    mobileRestartBtn.addEventListener('click', () => {
        // The restart button should always bring the game to a fresh state and then start it.
        gameActive = false; // Allow startGame to run
        startGame();
    });
    mobilePauseBtn.addEventListener('click', () => {
        if (!gameActive) return;

        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    });

    document.addEventListener('keydown', (e) => {
        // Handle Ctrl + R for restart
        if (e.ctrlKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            handleStart();
            return; // Prevent other keydown logic from running
        }
        // Handle Space key for start, pause, and resume
        if (e.code === 'Space') {
            e.preventDefault();
            if (!gameActive && !isPaused && !gameOverlay.classList.contains('hidden')) {
                startGame(); // Initial start
            } else if (gameActive && !isPaused) {
                pauseGame(); // Pause the running game
            } else if (gameActive && isPaused) {
                resumeGame(); // Resume the paused game
            }
        } else if (gameActive && !isPaused) {
            gameInput.focus(); // Focus input on other key presses during active gameplay
        }
    });

    // We need to know the input's value *before* the input event fires to detect backspace properly.
    let lastInputValue = '';
    gameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key.length > 1) {
            // When backspace is pressed, we don't count it as a typed entry for accuracy.
            // We let the 'input' event handle the visual update.
        }
        lastInputValue = gameInput.value;
    });

    gameInput.addEventListener('input', (e) => {
        // We pass the event to handleInput to get more context if needed later.
        handleInput(e);
    });

    function updateChart() {
        if (!wpmChart) return;
        wpmChart.data.labels = wpmHistory.map((_, i) => i);
        wpmChart.data.datasets[0].data = wpmHistory;
        wpmChart.update('none'); // 'none' for no animation
    }

    // Initial setup
    initializeGame();
});