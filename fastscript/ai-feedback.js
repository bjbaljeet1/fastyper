document.addEventListener('DOMContentLoaded', () => {
    const aiFeedbackText = document.getElementById('aiFeedbackText');

    if (!aiFeedbackText) {
        console.error("AI Feedback element not found.");
        return;
    }

    // This object will be populated by other scripts (e.g., script.js)
    window.typingAnalysis = {
        wpm: 0,
        accuracy: 100,
        mistakes: 0,
        totalChars: 0,
        keyPressTimestamps: [],
        lastMistakeTime: 0,
        isTestActive: false,
        mistakeMap: {}, // Tracks mistakes per character
    };

    let lastFeedbackTime = 0;
    const feedbackCooldown = 5000; // 5 seconds

    function getAIAdvice() {
        const { wpm, accuracy, mistakes, totalChars, keyPressTimestamps, lastMistakeTime, isTestActive } = window.typingAnalysis;

        if (!isTestActive || totalChars < 10) {
            return "Start typing to get live feedback...";
        }

        const currentTime = Date.now();
        if (currentTime - lastFeedbackTime < feedbackCooldown) {
            return aiFeedbackText.textContent; // Return current feedback if on cooldown
        }

        // 1. Analyze specific key mistakes (high priority)
        if (mistakes > 3) { // Only check if there are a few mistakes
            const { mistakeMap } = window.typingAnalysis;
            let maxMistakes = 0;
            let problemKey = '';

            for (const key in mistakeMap) {
                if (mistakeMap[key] > maxMistakes) {
                    maxMistakes = mistakeMap[key];
                    problemKey = key;
                }
            }

            // If one key is responsible for a significant portion of mistakes (e.g., > 30%)
            // and has been missed more than twice.
            if (problemKey && maxMistakes > 2 && maxMistakes > mistakes * 0.3) {
                lastFeedbackTime = currentTime;
                return `You seem to be struggling with the '${problemKey.toUpperCase()}' key. Focus on its placement.`;
            }
        }

        // Analyze recent mistakes
        if (mistakes > 0 && (currentTime - lastMistakeTime < 3000)) {
            lastFeedbackTime = currentTime;
            if (accuracy < 90) {
                return "High error rate detected. Slow down and focus on accuracy.";
            }
            return "Oops, a mistake! Take a breath and refocus on the next word.";
        }

        // Analyze rhythm
        if (keyPressTimestamps.length > 10) {
            const intervals = [];
            for (let i = 1; i < keyPressTimestamps.length; i++) {
                intervals.push(keyPressTimestamps[i] - keyPressTimestamps[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const stdDev = Math.sqrt(intervals.map(x => Math.pow(x - avgInterval, 2)).reduce((a, b) => a + b) / intervals.length);

            if (stdDev > avgInterval * 0.75) { // High deviation means inconsistent rhythm
                lastFeedbackTime = currentTime;
                return "Your typing rhythm is a bit inconsistent. Try to maintain a steady pace.";
            }
        }

        // Analyze speed vs. accuracy
        if (wpm > 50 && accuracy < 95) {
            lastFeedbackTime = currentTime;
            return "Great speed, but accuracy is slipping. Prioritize precision over pace.";
        }

        if (wpm < 30 && totalChars > 20) {
            lastFeedbackTime = currentTime;
            return "Focus on striking keys with confidence. Speed will build with practice.";
        }

        // General encouragement
        if (wpm > 70 && accuracy > 97) {
            lastFeedbackTime = currentTime;
            return "Excellent! You're typing with both speed and precision. Keep it up!";
        }

        return "Keep a steady rhythm. You're doing great!";
    }

    function updateAIFeedback() {
        const advice = getAIAdvice();
        if (aiFeedbackText.textContent !== advice) {
            aiFeedbackText.textContent = advice;
        }
    }

    // This function should be called from your main script whenever stats are updated
    function triggerAIUpdate() {
        if (window.typingAnalysis.isTestActive) {
            updateAIFeedback();
        }
    }

    // Expose the trigger function globally so other scripts can call it
    window.triggerAIUpdate = triggerAIUpdate;

    // Reset feedback when the test ends or restarts
    document.addEventListener('testFinished', () => {
        window.typingAnalysis.isTestActive = false;
        window.typingAnalysis.mistakeMap = {}; // Reset mistake map
        aiFeedbackText.textContent = "Test finished! See your full results below.";
    });
});