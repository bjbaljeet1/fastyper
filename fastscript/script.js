 //total words, correct words--
        let paragraphs = [];
        let wordsPerParagraph = 30;
        let paragraphCount = 1;
        let timer = 30;
        let totalTypedChars = 0;
        let correctChars = 0;
        let interval;
        let elapsedSeconds = 0;
        let timerStarted = false;
        let mistakes = 0;
        let ghostMode = false;
        let blinkSpeed = 1.0;
        let soundEnabled = true;
        let totalTypedWords = 0;
        let lastCharWasSpace = false;
        let correctWords = 0;
        let currentWordMistakes = 0;
        //-------------corrected words---------------//
        let correctedMistakes = 0;
        let wordsWithCorrectedMistakes = 0;
        let currentWordHasCorrectedMistakes = false;
        let mistakeTracking = initMistakeTracking();
        //-------------------------------------------//

        // Audio elements
        const correctSound = new Audio('media/key-press-263640.mp3');
        const incorrectSound = new Audio('media/wrong-47985.mp3');

        // Keystroke timing variables
        let keyTimestamps = [];
        let keyIntervals = [];
        let fastestKeyPress = Infinity;
        let slowestKeyPress = 0;

        // Word timing variables
        let wordStartTime = null;
        let currentTypedWord = "";
        let typedWordTimings = [];
        let currentWordCorrect = true;

        // Results storage
        let topResults = JSON.parse(localStorage.getItem('topResults')) || [];

        let easyWords = [ "apple", "beach", "chair", "dance", "eagle", "fairy", "giant", "happy", "igloo", "joker",
            "knife", "lemon", "mango", "night", "ocean", "piano", "queen", "river", "sweet", "tiger",
            "uncle", "visit", "water", "xylol", "yacht", "zebra", "about", "brave", "cloud", "dream",
            "early", "faint", "grass", "house", "index", "joint", "kitty", "light", "mouse", "north",
            "orbit", "paint", "quiet", "round", "story", "truck", "under", "voice", "whale", "young",
            "zoned", "angle", "bacon", "camel", "delay", "equal", "frost", "glove", "honey", "input",
            "jelly", "kneel", "laugh", "metal", "never", "olive", "party", "reply", "smoke", "touch",
            "unity", "valid", "wheat", "yield", "zippy", "ahead", "blunt", "craft", "ditch", "event",
            "flame", "ghost", "honor", "image", "jolly", "knead", "later", "model", "noble", "ounce",
            "prime", "quest", "ready", "scope", "thing", "upper", "voter", "widen", "yells", "zones",
            "actor", "blink", "creek", "diver", "enjoy", "fresh", "grape", "humor", "imply", "juice",
            "knock", "lucky", "magic", "novel", "offer", "place", "quirk", "ratio", "share", "value",
            "world", "xenon", "yeast", "zooms", "alert", "board", "crush", "donut", "enter", "field",
            "green", "haste", "ideal", "kayak", "large", "meter", "nerdy", "opal", "peach", "reset",
            // 500 more easy and unique words
            "acorn", "badge", "cabin", "daisy", "eager", "fable", "gamer", "habit", "icily", "jolly",
            "koala", "lemon", "mirth", "nifty", "oasis", "panda", "quack", "rider", "salad", "table",
            "urban", "vivid", "wrist", "xerox", "yodel", "zesty", "angel", "baker", "candy", "diner",
            "ember", "fancy", "globe", "hiker", "inbox", "jewel", "kneel", "latch", "mover", "nurse",
            "ocean", "pouch", "quiet", "raven", "sandy", "tulip", "usher", "vapor", "waltz", "xenon",
            "youth", "zebra", "adore", "blaze", "chess", "dodge", "elbow", "frost", "grill", "honey",
            "inlet", "jolly", "kiosk", "liver", "motel", "noble", "orbit", "piano", "quilt", "ranch",
            "sheep", "toast", "unity", "vowel", "wedge", "xylem", "yacht", "zonal", "amber", "bison",
            "cider", "drift", "eagle", "flock", "gloom", "hatch", "inbox", "jolly", "knead", "lunar",
            "mirth", "niche", "olive", "pouch", "quack", "rider", "sable", "tiger", "udder", "vivid",
            "wrist", "xerox", "yodel", "zesty", "apron", "blush", "couch", "daisy", "easel", "fable",
            "gazer", "hiker", "icily", "jewel", "kebab", "latch", "mover", "nurse", "oasis", "panda",
            "quilt", "raven", "salad", "table", "urban", "vapor", "waltz", "xenon", "youth", "zebra",
            "actor", "baker", "candy", "diner", "ember", "fancy", "globe", "hiker", "inlet", "jewel",
            "kneel", "liver", "motel", "noble", "orbit", "piano", "quilt", "ranch", "sheep", "toast",
            "unity", "vowel", "wedge", "xylem", "yacht", "zonal", "amber", "bison", "cider", "drift",
            "eagle", "flock", "gloom", "hatch", "inbox", "jolly", "knead", "lunar", "mirth", "niche",
            "olive", "pouch", "quack", "rider", "sable", "tiger", "udder", "vivid", "wrist", "xerox",
            "yodel", "zesty", "apron", "blush", "couch", "daisy", "easel", "fable", "gazer", "hiker",
            "icily", "jewel", "kebab", "latch", "mover", "nurse", "oasis", "panda", "quilt", "raven",
            "salad", "table", "urban", "vapor", "waltz", "xenon", "youth", "zebra", "actor", "baker",
            "candy", "diner", "ember", "fancy", "globe", "hiker", "inlet", "jewel", "kneel", "liver",
            "motel", "noble", "orbit", "piano", "quilt", "ranch", "sheep", "toast", "unity", "vowel",
            "wedge", "xylem", "yacht", "zonal", "amber", "bison", "cider", "drift", "eagle", "flock",
            "gloom", "hatch", "inbox", "jolly", "knead", "lunar", "mirth", "niche", "olive", "pouch",
            "quack", "rider", "sable", "tiger", "udder", "vivid", "wrist", "xerox", "yodel", "zesty",
            "apron", "blush", "couch", "daisy", "easel", "fable", "gazer", "hiker", "icily", "jewel",
            "kebab", "latch", "mover", "nurse", "oasis", "panda", "quilt", "raven", "salad", "table",
            "urban", "vapor", "waltz", "xenon", "youth", "zebra", "actor", "baker", "candy", "diner",
            "ember", "fancy", "globe", "hiker", "inlet", "jewel", "kneel", "liver", "motel", "noble",
            "orbit", "piano", "quilt", "ranch", "sheep", "toast", "unity", "vowel", "wedge", "xylem",
            "yacht", "zonal", "amber", "bison", "cider", "drift", "eagle", "flock", "gloom", "hatch",
            "inbox", "jolly", "knead", "lunar", "mirth", "niche", "olive", "pouch", "quack", "rider",
            "sable", "tiger", "udder", "vivid", "wrist", "xerox", "yodel", "zesty", "apron", "blush",
            "couch", "daisy", "easel", "fable", "gazer", "hiker", "icily", "jewel", "kebab", "latch",
            "mover", "nurse", "oasis", "panda", "quilt", "raven", "salad", "table", "urban", "vapor",
            "waltz", "xenon", "youth", "zebra", "actor", "baker", "candy", "diner", "ember", "fancy",
            "globe", "hiker", "inlet", "jewel", "kneel", "liver", "motel", "noble", "orbit", "piano",
            "quilt", "ranch", "sheep", "toast", "unity", "vowel", "wedge", "xylem", "yacht", "zonal",
            "amber", "bison", "cider", "drift", "eagle", "flock", "gloom", "hatch", "inbox", "jolly",
            "knead", "lunar", "mirth", "niche", "olive", "pouch", "quack", "rider", "sable", "tiger",
            "udder", "vivid", "wrist", "xerox", "yodel", "zesty", "apron", "blush", "couch", "daisy",
            "easel", "fable", "gazer", "hiker", "icily", "jewel", "kebab", "latch", "mover", "nurse",
            "oasis", "panda", "quilt", "raven", "salad", "table", "urban", "vapor", "waltz", "xenon",
            "youth", "zebra", "actor", "baker", "candy", "diner", "ember", "fancy", "globe", "hiker",
            "inlet", "jewel", "kneel", "liver", "motel", "noble", "orbit", "piano", "quilt", "ranch",
            "sheep", "toast", "unity", "vowel", "wedge", "xylem", "yacht", "zonal"];

        let mediumWords = [ "Abandon", "Baffled", "Cautious", "Dashing", "Eagerly", "Fearing", "Glimmer", "Hopping",
                "Insight", "Jovial", "Kicking", "Lending", "Mistery", "Nurture", "Opulent", "Pristine", "Quoting", "Radiate", 
                "Sailing", "Tremble", "Urging", "Vibrate", "Whisper", "Xenon", "Yonder", "Zealous", "Affluent", "Briskly", "Cavity",
                "Dazzle", "Enthral", "Fascinate", "Glisten", "Hurdles", "Important", "Junction", "Keenest", "Luminous", "Mystery", 
                "Nuclear", "Obvious", "Planted", "Quitting", "Resist", "Stellar", "Tolerate", "Unique", "Vortex", "Wonderful", "Xenophobia", 
                "Youthful", "Zigzag", "Admired", "Ballots", "Courage", "Delight", "Empower", "Friction", "Garnish", "Heavenly", "Iconic",
                "Juggling", "Kingdom", "Ladder", "Marvel", "Naked", "Overcome", "Plumber", "Queue", "Rustic", "Solace", "Tempered", "Unify", 
                "Vibrant", "Wander", "Extraordinary", "Vocalist", "Intact", "Flexible", "Horizon", "Gritty", "Lavish", "Outlast", "Pledge",
                "Reactor", "Stoked", "Thrive", "Uptake", "Vulture", "X-rays", "Yarn", "Zipper", "Anticipate", "Bravely", "Critique", "Desire",
                "Excited", "Forward", "Gale", "Heedful", "Impulse", "Jovial", "Karma", "Loyalty", "Mature", "Noble", "Ogle", "Patriot", "Richer",
                "Sustain", "Turtle", "Under", "Vestige", "Wholesome", "Xylophone", "Yellowish", "Zoned", "Adore", "Beaming", "Chill", "Dwelling",
                "Eager", "Fresh", "Grace", "Hardy", "Intrepid", "Jumpy", "Keen", "Lithe", "Mellow", "Noble", "Optic", "Perfect", "Quiet", "Rational",
                "Secure", "Thrust", "Uptake", "Vigorous", "Wholesome", "Xerox", "Yard", "Zappier", "Active", "Brisk", "Courage", "Doodle", "Elevate",
                "Flawless", "Glisten", "Heedful", "Inclusive", "Joking", "Kindness", "Laughter", "Master", "Nightfall", "Objective", "Pray", "Quickly",
                "Resist", "Selfish", "Tragic", "Usable", "Velvet", "Whiz", "Yucky", "Zoned", "Anchor", "Baking", "Cultivate", "Discreet", "Edge", 
                "Flexibility", "Growth", "Harmony", "Improve", "Jury", "Kind", "Luxuriant", "Mirthful", "Nudge", "Ongoing", "Pithy", "Quest", "Remedy",
                "Stable", "Tackle", "Urgent", "Vibrancy", "Willing", "X-factor", "Yield", "Zippy", "Alleviate", "Blessed", "Crafty", "Doubt", "Enigma", 
                "Fighting", "Gentle", "Hardy", "Inspire", "Jumpstart", "Kettle", "Legend", "Mood", "Nudge", "Outlook", "Piquant", "Rough", "Survival", "Tough",
                "Vexed", "Worthy", "Excited", "Yonder", "Zippered", "Align", "Boldness", "Clever", "Drive", "Escaped", "Final", "Grit", "Hugging", "Impress",
                "Jest", "Keenly", "Languish", "Mastery", "Nerve", "Open", "Presto", "Quickness", "Rustic", "Strength", "Taste", "Ulcer", "Vortex", "Wild", 
                "Xander", "Yellow", "Zestful", "Arrow", "Blossom", "Calm", "Dove", "Epitome", "Fondness", "Glance", "Heavy", "Infuse", "Juggle", "Knee", "Longing",
                "Mellow", "Notice", "Option", "Prize", "Quaint", "Restore", "Slick", "Tender", "Undeniable", "Vibration", "Whip", "Yonder", "Zigzagging",
                // --- Additional unique words below ---
                "Serenity", "Momentum", "Cascade", "Obsidian", "Paradox", "Reverie", "Twilight", "Nebula", "Fragment", "Harbinger",
                "Solstice", "Mirage", "Vantage", "Epoch", "Fathom", "Glyph", "Horizon", "Juncture", "Kismet", "Labyrinth",
                "Mosaic", "Nostalgia", "Oracle", "Pinnacle", "Quasar", "Resonance", "Sanctuary", "Talisman", "Umbra", "Vigil",
                "Wistful", "Zephyr", "Axiom", "Burgeon", "Cynosure", "Diligent", "Eclipse", "Fervor", "Gossamer", "Halcyon",
                "Incisor", "Jubilee", "Kinship", "Luminous", "Mirth", "Nimble", "Oblique", "Pensive", "Quotient", "Rapture",
                "Sable", "Tranquil", "Unison", "Verdant", "Wanderlust", "Xenial", "Yielding", "Zenith",
                // --- 200 more unique words ---
                "Adept", "Benevolent", "Cordial", "Diligence", "Eloquent", "Finesse", "Gallant", "Hallowed", "Impetus", "Jocular",
                "Keenest", "Lattice", "Meander", "Nimbleness", "Obliging", "Pensive", "Quaintness", "Resilient", "Sublime", "Tenacity",
                "Ubiquitous", "Vivid", "Wistfulness", "Xylophonist", "Yielded", "Zealot", "Aspire", "Bravado", "Camaraderie", "Dexterity",
                "Empathy", "Fervent", "Gracious", "Harmonious", "Ingenuity", "Jubilant", "Kindred", "Lucid", "Meticulous", "Nurturing",
                "Optimism", "Perceptive", "Quiescent", "Radiant", "Sagacious", "Tranquility", "Unwavering", "Virtuous", "Whimsical", "Xenophile",
                "Yearning", "Zest", "Ambition", "Bountiful", "Cognizant", "Discern", "Ebullient", "Felicity", "Genuine", "Hearten",
                "Illustrious", "Judicious", "Keenly", "Laudable", "Magnanimous", "Nobleman", "Obstinate", "Persevere", "Quotable", "Reverent",
                "Sanguine", "Tactful", "Unfaltering", "Valiant", "Winsome", "Xenodochial", "Yield", "Zephyr", "Altruism", "Burgeon",
                "Convivial", "Dazzling", "Eminent", "Flourish", "Gumption", "Humble", "Intrepid", "Joviality", "Kindliness", "Luminousness",
                "Majestic", "Nimbleness", "Opportune", "Placid", "Quixotic", "Resolute", "Serendipity", "Thrive", "Uplift", "Veneration",
                "Wanderer", "Xenogenesis", "Yonder", "Zany", "Acumen", "Benevolence", "Celerity", "Devotion", "Elation", "Fortitude",
                "Gratitude", "Hopeful", "Inquisitive", "Jocund", "Keen", "Levity", "Merit", "Noblewoman", "Oblige", "Prudence",
                "Quench", "Rejoice", "Sincerity", "Transcend", "Unison", "Vigorous", "Worthy", "Xyloid", "Yielding", "Zealousness",
                "Affirm", "Blissful", "Composed", "Daring", "Eager", "Fidelity", "Generous", "Hilarity", "Inventive", "Jubilance",
                "Keenest", "Lively", "Mirthful", "Noble", "Optimist", "Prowess", "Quotidian", "Repose", "Sage", "Thriving",
                "Urbane", "Valorous", "Witty", "Xenolith", "Yearn", "Zeal", "Ascend", "Brisk", "Courageous", "Dutiful",
                "Effusive", "Foresight", "Gallantry", "Heedful", "Imaginative", "Jocose", "Kindred", "Lustrous", "Munificent", "Nimble",
                "Obliged", "Perceptive", "Quixotry", "Resolute", "Sublime", "Tenacious", "Upbeat", "Vividness", "Wistful", "Xenophile",
                "Yield", "Zestful"];
        let hardWords = [];

  // Generate 500 more unique hard words
        (function() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            const wordSet = new Set(hardWords);

            function randomWord() {
                // Random length between 6 and 10
                const len = Math.floor(Math.random() * 5) + 6;
                let w = "";
                for (let i = 0; i < len; i++) {
                    w += chars[Math.floor(Math.random() * chars.length)];
                }
                return w;
            }

            while (wordSet.size < 510) {
                wordSet.add(randomWord());
            }

           hardWords = Array.from(wordSet);
        })();

        let currentWordBank = easyWords;
        const box = document.getElementById("stringBox");
        const timerElement = document.getElementById("timer");
        const wpmElement = document.getElementById("wpm");
        let currentParagraphIndex = 0;
        let targetString = "";
        let currentIndex = 0;
        let cursor;

        // Initialize audio
        function initAudio() {
            try {
                correctSound.volume = 0.9;
                incorrectSound.volume = 0.3;
            } catch (e) {
                console.log("Audio initialization error:", e);
            }
        }

        // Function to store top results
        function storeTopResults(newResult) {
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            topResults = JSON.parse(localStorage.getItem('topResults')) || [];
            topResults.push(newResult);
            topResults.sort((a, b) => b.wpm - a.wpm);
            topResults = topResults.slice(0, 10);
            localStorage.setItem('topResults', JSON.stringify(topResults));
            if (typeof updateCookieDisplay === 'function') {
                updateCookieDisplay();
            }
        }

        function generateParagraphs() {
            paragraphs = [];
            for (let i = 0; i < paragraphCount; i++) {
                let paragraph = [];
                for (let j = 0; j < wordsPerParagraph; j++) {
                    paragraph.push(currentWordBank[Math.floor(Math.random() * currentWordBank.length)]);
                }
                paragraphs.push(paragraph.join(" "));
            }
        }

        function initializeStringBox() {
            box.innerHTML = "";
            const words = targetString.split(" ");

            words.forEach((word, index) => {
                const wordSpan = document.createElement("span");
                wordSpan.className = "word";
                if (ghostMode) {
                    wordSpan.classList.add("ghost-word");
                    wordSpan.style.animationDuration = `${1/blinkSpeed}s`;
                }

                for (let char of word) {
                    const span = document.createElement("span");
                    span.textContent = char;
                    span.className = "char default";
                    wordSpan.appendChild(span);
                }

                box.appendChild(wordSpan);

                if (index < words.length - 1) {
                    const spaceSpan = document.createElement("span");
                    spaceSpan.textContent = "\u00A0";
                    spaceSpan.className = "char default";
                    box.appendChild(spaceSpan);
                }
            });

            addCursor();
        }

        function addCursor() {
            const spans = document.querySelectorAll(".char");
            if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);

            cursor = document.createElement("span");
            cursor.className = "cursor";

            if (currentIndex >= spans.length) {
                spans[spans.length - 1]?.after(cursor);
            } else {
                spans[currentIndex]?.before(cursor);
            }
        }

        function loadNextParagraph() {
            if (currentParagraphIndex < paragraphs.length - 1) {
                currentParagraphIndex++;
                targetString = paragraphs[currentParagraphIndex];
                currentIndex = 0;
                initializeStringBox();
            } else {
                generateParagraphs();
                currentParagraphIndex = 0;
                targetString = paragraphs[currentParagraphIndex];
                currentIndex = 0;
                initializeStringBox();
            }
        }

        function calculateAverageInterval() {
            if (keyIntervals.length === 0) return 0;
            const total = keyIntervals.reduce((sum, val) => sum + val, 0);
            return total / keyIntervals.length;
        }

        //-----------------corrected words function-----------------//
        // Initialize mistake tracking object
        function initMistakeTracking() {
            return {
                correctedMistakes: 0,
                wordsWithCorrectedMistakes: 0,
                currentWordHasCorrectedMistakes: false
            };
        }

        // Handle backspace on incorrect characters
        function handleBackspaceOnMistake(span, tracking) {
            if (span.classList.contains("incorrect")) {
                tracking.correctedMistakes++;
                tracking.currentWordHasCorrectedMistakes = true;
            }
        }

        // Update stats when word is completed
        function updateWordStatsOnCompletion(tracking) {
            if (tracking.currentWordHasCorrectedMistakes) {
                tracking.wordsWithCorrectedMistakes++;
            }
            tracking.currentWordHasCorrectedMistakes = false;
        }

        function renderPerformanceChart() {
            const ctx = document.getElementById('resultsChart').getContext('2d');
            topResults = JSON.parse(localStorage.getItem('topResults')) || [];
            
            // Destroy existing chart if it exists
            if (ctx.chart) {
                ctx.chart.destroy();
            }
            
            // If no results, show empty chart
            if (topResults.length === 0) {
                ctx.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: 'WPM',
                                data: [],
                                borderColor: '#00ccff',
                                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                                tension: 0.3,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Accuracy',
                                data: [],
                                borderColor: '#4cff4c',
                                backgroundColor: 'rgba(76, 255, 76, 0.1)',
                                tension: 0.3,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: { display: true, text: 'WPM' }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: { display: true, text: 'Accuracy (%)' },
                                min: 0,
                                max: 100,
                                grid: { drawOnChartArea: false }
                            }
                        }
                    }
                });
                return;
            }
            
            // Limit to last 10 results for better visibility
            const recentResults = topResults.slice(0, 10).reverse();
            
            ctx.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: recentResults.map((_, i) => `Test ${i + 1}`),
                    datasets: [
                        {
                            label: 'WPM',
                            data: recentResults.map(r => r.wpm),
                            borderColor: '#00ccff',
                            backgroundColor: 'rgba(0, 204, 255, 0.1)',
                            tension: 0.3,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Accuracy',
                            data: recentResults.map(r => parseFloat(r.accuracy)),
                            borderColor: '#4cff4c',
                            backgroundColor: 'rgba(76, 255, 76, 0.1)',
                            tension: 0.3,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'WPM'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Accuracy (%)'
                            },
                            min: 0,
                            max: 100,
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        }

        function populateTopResultsTable() {
            topResults = JSON.parse(localStorage.getItem('topResults')) || [];
            const tableBody = document.querySelector('#topResultsTable tbody');
            tableBody.innerHTML = '';
            
            // Sort by WPM descending and take top 5
            const sortedResults = [...topResults].sort((a, b) => b.wpm - a.wpm).slice(0, 5);
            
            sortedResults.forEach((result, index) => {
                const row = document.createElement('tr');
                
                const rankCell = document.createElement('td');
                rankCell.textContent = index + 1;
                
                const wpmCell = document.createElement('td');
                wpmCell.textContent = result.wpm;
                
                const accuracyCell = document.createElement('td');
                accuracyCell.textContent = `${result.accuracy}%`;
                
                const modeCell = document.createElement('td');
                modeCell.textContent = result.mode || 'Easy';
                
                const dateCell = document.createElement('td');
                const date = new Date(result.timestamp || Date.now());
                dateCell.textContent = date.toLocaleString();
                
                row.appendChild(rankCell);
                row.appendChild(wpmCell);
                row.appendChild(accuracyCell);
                row.appendChild(modeCell);
                row.appendChild(dateCell);
                
                tableBody.appendChild(row);
            });
        }

        function clearHistory() {
            if (localStorage.getItem('cookie_consent') !== 'accepted') return;

            if (confirm('Are you sure you want to delete all your typing test history? This cannot be undone.')) {
                // Clear all stored data
                localStorage.removeItem('topResults');
                localStorage.removeItem('typingTestResults');
                localStorage.removeItem('typingTimingStats');
                localStorage.removeItem('fastestWords');
                
                // Reset the topResults array
                topResults = [];
                
                // Clear the current display
                const fastestWordsContainer = document.getElementById("fastestWordsContainer");
                fastestWordsContainer.innerHTML = "";
                
                const tableBody = document.querySelector('#topResultsTable tbody');
                tableBody.innerHTML = '';

                // Reset the results display
                document.getElementById('result-wpm').textContent = '0';
                document.getElementById('result-accuracy').textContent = '0%';
                document.getElementById('result-correct').textContent = '0';
                document.getElementById('result-mistakes').textContent = '0';
                document.getElementById('result-CorrectCharacter').textContent = '0';
                document.getElementById('result-TotalWords').textContent = '0';
                document.getElementById('result-WrongWords').textContent = '0';
                document.getElementById('averageInterval').textContent = '0ms';
                document.getElementById('fastestKeyPress').textContent = '0ms';
                document.getElementById('slowestKeyPress').textContent = '0ms';

                
                // Clear the chart if it exists
                const chartCanvas = document.getElementById('resultsChart');
                if (chartCanvas && chartCanvas.chart) {
                    chartCanvas.chart.destroy();
                }
                
                // Create a new empty chart
                renderPerformanceChart();

                if (typeof updateCookieDisplay === 'function') {
                    updateCookieDisplay();
                }
                
                showToast("All history has been cleared!");
            }
        }
        function handleResultKeys(event) {
            // Ctrl + R to restart
            if (event.ctrlKey && event.key.toLowerCase() === 'r') {
                event.preventDefault();
                restartTest();
            }
        
            // Ctrl + C to delete history
            if (event.ctrlKey && event.key.toLowerCase() === 'c') {
                event.preventDefault();
                clearHistory();
            }
        }

        
        function endTest() {
            clearInterval(interval);
            document.removeEventListener("keydown", handleKeydown);

            const totalWords = Math.floor(totalTypedChars / 5);
            const wpm = Math.floor((totalWords * 60) / elapsedSeconds);
            const totalAttempts = correctChars + mistakes;
            const accuracy = totalAttempts > 0 ? ((correctChars / totalAttempts) * 100).toFixed(2) : 0;

            const results = {
                wpm: wpm,
                accuracy: accuracy,
                correctChars: correctChars,
                totalTypedChars: totalTypedChars,
                mistakes: mistakes,
                timeSpent: elapsedSeconds,
                timestamp: new Date().toISOString(),
                mode: currentWordBank === easyWords ? "Easy" : 
                      currentWordBank === mediumWords ? "Medium" : "Hard",
                duration: elapsedSeconds,
                totalTypedWords: totalTypedWords,
                correctWords: correctWords,
                wrongWords: totalTypedWords - correctWords,
                correctedMistakes: mistakeTracking.correctedMistakes,
                wordsWithCorrectedMistakes: mistakeTracking.wordsWithCorrectedMistakes
            };

            if (localStorage.getItem('cookie_consent') === 'accepted') {
                localStorage.setItem("typingTestResults", JSON.stringify(results));
            }

            storeTopResults(results);

            function formatTime(ms) {
                if (ms > 1000) {
                    return (ms / 1000).toFixed(2) + "s";
                } else {
                    return ms.toFixed(2) + "ms";
                }
            }

            const averageKeyInterval = calculateAverageInterval();
            const timingStats = {
                averageKeyInterval: formatTime(averageKeyInterval),
                fastestKeyPress: formatTime(fastestKeyPress),
                slowestKeyPress: formatTime(slowestKeyPress)
            };

            if (localStorage.getItem('cookie_consent') === 'accepted') {
                localStorage.setItem("typingTimingStats", JSON.stringify(timingStats));
            }

            const topFastestWords = [...typedWordTimings]
                .filter(w => w.word.length > 2)
                .sort((a, b) => a.time - b.time)
                .slice(0, 3)
                .map(item => ({
                    word: item.word,
                    time: item.time > 1000
                        ? (item.time / 1000).toFixed(2) + "s"
                        : item.time.toFixed(0) + "ms"
                }));

            if (localStorage.getItem('cookie_consent') === 'accepted') {
                localStorage.setItem("fastestWords", JSON.stringify(topFastestWords));
            }

            // Hide the typing test container
            document.querySelector('.container').classList.add('hide');
        
            // Update result display
            document.getElementById('result-wpm').textContent = wpm;
            document.getElementById('result-accuracy').textContent = `${accuracy}%`;
            document.getElementById('result-correct').textContent = correctWords;
            document.getElementById('result-mistakes').textContent = mistakes;
            document.getElementById('result-CorrectCharacter').textContent = correctChars;
            document.getElementById('result-TotalWords').textContent = totalTypedWords;
            document.getElementById('result-WrongWords').textContent = totalTypedWords - correctWords;
            document.getElementById('averageInterval').textContent = calculateAverageInterval().toFixed(2) + "ms";
            document.getElementById('fastestKeyPress').textContent = fastestKeyPress > 1000
                ? (fastestKeyPress / 1000).toFixed(2) + "s"
                : fastestKeyPress.toFixed(0) + "ms";
            document.getElementById('slowestKeyPress').textContent = slowestKeyPress > 1000
                ? (slowestKeyPress / 1000).toFixed(2) + "s"
                : slowestKeyPress.toFixed(0) + "ms";

            // Display the top 3 fastest words
            const fastestWordsContainer = document.getElementById("fastestWordsContainer");
            fastestWordsContainer.innerHTML = "";
            topFastestWords.forEach(item => {
                const wordElement = document.createElement("div");
                wordElement.className = "word-item";
                wordElement.innerHTML = `${item.word} <small>${item.time}</small>`;
                fastestWordsContainer.appendChild(wordElement);
            });

            // Show the result container
            
            document.querySelector('.result-container').classList.add('show');
            
            // Render the chart and top results table
            renderPerformanceChart();
            populateTopResultsTable();
            document.addEventListener('keydown', handleResultKeys);
        }

        function startTimer() {
            if (timerStarted) return;
            timerStarted = true;

            document.getElementById("increaseTimer").disabled = true;
            // AI Feedback Integration: Set test as active
            if (window.typingAnalysis) {
                window.typingAnalysis.isTestActive = true;
            }

            document.getElementById("decreaseTimer").disabled = true;
            document.getElementById("easyMode").disabled = true;
            document.getElementById("mediumMode").disabled = true;
            document.getElementById("hardMode").disabled = true;
            document.getElementById("ghostMode").disabled = true;
            document.getElementById("soundToggle").disabled = true;

            const timeOptions = document.getElementsByName("timeOption");

            timeOptions.forEach(option => {
                option.disabled = true;
                option.style.cursor = "not-allowed";
                option.style.pointerEvents = "none";
                option.style.opacity = 0.5;
            });
            

            interval = setInterval(() => {
                timer--;
                elapsedSeconds++;
                timerElement.textContent = `${timer}`;
                updateWPM();
                if (timer <= 0) {
                    endTest();
                }
            }, 1000);
        }

        function updateWPM() {
            if (elapsedSeconds > 0) {
                const wordsTyped = totalTypedChars / 5;
                const currentWPM = Math.floor((wordsTyped * 60) / elapsedSeconds);
                const accuracyElement = document.getElementById('accuracy');

                if (wpmElement.textContent !== `${currentWPM}`) {
                    wpmElement.textContent = `${currentWPM}`;
                    wpmElement.classList.add('updated');
                    setTimeout(() => wpmElement.classList.remove('updated'), 500);
                }
                
                const totalAttempts = correctChars + mistakes;
                const accuracy = totalAttempts > 0 ? (correctChars / totalAttempts) * 100 : 0;
                const newAccuracyText = `${accuracy.toFixed(2)}%`;
                if (accuracyElement.textContent !== newAccuracyText) {
                    const animationClass = accuracy < 90 ? 'updated-low' : 'updated';
                    accuracyElement.textContent = newAccuracyText;
                    accuracyElement.classList.add(animationClass);
                    setTimeout(() => accuracyElement.classList.remove(animationClass), 500);
                }

                // AI Feedback Integration: Update and trigger AI
                if (window.typingAnalysis) {
                    window.typingAnalysis.wpm = currentWPM;
                    window.typingAnalysis.accuracy = accuracy;
                    window.typingAnalysis.mistakes = mistakes;
                    window.typingAnalysis.totalChars = totalTypedChars;
                    // keyPressTimestamps are pushed in handleKeydown

                    if (window.triggerAIUpdate) {
                        window.triggerAIUpdate();
                    }
                }

            }
        }

        function shakeWord(index) {
            const words = document.querySelectorAll(".word");
            if (index >= 0 && index < words.length) {
                const word = words[index];
                word.classList.add("shake");
                
                setTimeout(() => {
                    word.classList.remove("shake");
                }, 500);
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const soundIcon = document.querySelector("#soundToggle i");
            if (soundEnabled) {
                soundIcon.classList.remove("fa-volume-mute");
                soundIcon.classList.add("fa-volume-up");
                showToast("Sound enabled");
            } else {
                soundIcon.classList.remove("fa-volume-up");
                soundIcon.classList.add("fa-volume-mute");
                showToast("Sound disabled");
            }
        }

        function handleKeydown(event) {
            // Prevent default actions for certain key combinations
            if (event.altKey && (event.key.toLowerCase() === 'r' || event.key.toLowerCase() === 's')) {
                event.preventDefault();
                return; // Exit the function without processing these key combinations
            }


            const increaseBtn = document.getElementById("increaseTimer");
            const decreaseBtn = document.getElementById("decreaseTimer");
            const easyBtn = document.getElementById("easyMode");
            const mediumBtn = document.getElementById("mediumMode");
            const hardBtn = document.getElementById("hardMode");
            const ghostBtn = document.getElementById("ghostMode");
            const soundBtn = document.getElementById("soundToggle");
            const restartBtn = document.getElementById("restartTest");

            if (event.ctrlKey && event.key === "r" || event.key == "R") {
                event.preventDefault();
                restartTest();
                animateButton(restartBtn);
                showToast("Test restarted!");
                return;
            }
            
            if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!timerStarted) {
                    timer += 10;
                    timerElement.textContent = `${timer}`;
                    animateButton(increaseBtn);
                    showToast("+10 seconds added!");
                    updateTimeOptionSelection();
                }
                return;
            }
            
            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!timerStarted && timer > 10) {
                    timer -= 10;
                    timerElement.textContent = `${timer}`;
                    animateButton(decreaseBtn);
                    showToast("-10 seconds removed!");
                    updateTimeOptionSelection();
                }
                return;
            }
            
            if (event.ctrlKey && event.key.toLowerCase() === "e") {
                event.preventDefault();
                if (!timerStarted) {
                    wordsPerParagraph = 30; // Easy mode default
                    currentWordBank = easyWords;
                    ghostMode = false;
                    document.getElementById("ghostControls").style.display = "none";
                    restartTest();
                    animateButton(easyBtn);
                    showToast("Easy mode activated!");
                }
                return;
            }
            
            if (event.ctrlKey && event.key.toLowerCase() === "m") {
                event.preventDefault();
                if (!timerStarted) {
                    wordsPerParagraph = 20; // Medium mode: 20 words
                    currentWordBank = mediumWords;
                    ghostMode = false;
                    document.getElementById("ghostControls").style.display = "none";
                    restartTest();
                    animateButton(mediumBtn);
                    showToast("Medium mode activated!");
                }
                return;
            }
            
            if (event.ctrlKey && event.key.toLowerCase() === "h") {
                event.preventDefault();
                if (!timerStarted) {
                    wordsPerParagraph = 20; // Hard mode: 20 words
                    currentWordBank = hardWords;
                    ghostMode = false;
                    document.getElementById("ghostControls").style.display = "none";
                    restartTest();
                    animateButton(hardBtn);
                    showToast("Hard mode activated!");
                }
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "g") {
                event.preventDefault();
                if (!timerStarted) {
                    ghostMode = !ghostMode;
                    document.getElementById("ghostControls").style.display = ghostMode ? "block" : "none";
                    animateButton(ghostBtn);
                    showToast(ghostMode ? "Ghost mode activated!" : "Ghost mode deactivated!");
                    restartTest();
                }
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "t") {
                event.preventDefault();
                if (!timerStarted) {
                    toggleSound();
                    animateButton(soundBtn);
                }
                return;
            }
            
            if (event.ctrlKey && event.key.toLowerCase() === "q") {
                event.preventDefault();
                if (!timerStarted) {
                    timer = 30;
                    document.getElementById("quickOption").checked = true;
                    timerElement.textContent = `${timer}`;
                    showToast("Quick mode (30s) selected!");
                }
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "s") {
                event.preventDefault();
                if (!timerStarted) {
                    timer = 60;
                    document.getElementById("standardOption").checked = true;
                    timerElement.textContent = `${timer}`;
                    showToast("Standard mode (60s) selected!");
                }
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "c") {
                event.preventDefault();
                clearHistory();
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "o") {
                event.preventDefault();
                if (!timerStarted) {
                    timer = 120;
                    document.getElementById("marathonOption").checked = true;
                    timerElement.textContent = `${timer}`;
                    showToast("Marathon mode (120s) selected!");
                }
                return;
            }
                    if (event.ctrlKey) {
            return;
        }

        if (!timerStarted && event.key.length === 1) {
            startTimer();
        }

        const now = Date.now();
        if (keyTimestamps.length > 0) {
            const interval = now - keyTimestamps[keyTimestamps.length - 1];
            keyIntervals.push(interval);

            if (interval < fastestKeyPress) fastestKeyPress = interval;
            if (interval > slowestKeyPress) slowestKeyPress = interval;
        }
        keyTimestamps.push(now);
        
        // AI Feedback Integration: Push timestamp
        if (window.typingAnalysis) {
            window.typingAnalysis.keyPressTimestamps.push(now);
        }


        const spans = document.querySelectorAll(".char");

        if (event.key === "Backspace") {
            if (currentIndex > 0) {
                currentIndex--;
                const span = spans[currentIndex];
                //---------------------------------
                handleBackspaceOnMistake(span, mistakeTracking); 
                //---------------------------------
                if (span.classList.contains("correct")) {
                    correctChars--;
                }
                span.className = "char default";
                totalTypedChars--;
                addCursor();
            }
        } else if (currentIndex < targetString.length) {
            if (event.key.length === 1) {
                const targetChar = targetString[currentIndex];
                let inputChar = event.key;

                if (!wordStartTime) {
                    wordStartTime = Date.now();
                }
                currentTypedWord += inputChar;

                let wordIndex = 0;
                let charCount = 0;
                const words = targetString.split(" ");
                for (let i = 0; i < words.length; i++) {
                    if (currentIndex >= charCount && currentIndex < charCount + words[i].length) {
                        wordIndex = i;
                        break;
                    }
                    charCount += words[i].length + 1;
                }

                if (inputChar === targetChar) {
                    spans[currentIndex].className = "char correct";
                    correctChars++;
                    
                    if (soundEnabled) {
                        try {
                            correctSound.currentTime = 0;
                            correctSound.play().catch(e => console.log("Audio play error:", e));
                        } catch (e) {
                            console.log("Audio error:", e);
                        }
                    }
                } else {
                    spans[currentIndex].className = "char incorrect";
                    mistakes++;
                    currentWordMistakes++; // Increment mistake counter for current word
                    currentWordCorrect = false;
                    // AI Feedback Integration: Note mistake time
                    if (window.typingAnalysis) {
                        // Track which key was missed
                        const key = targetChar.toLowerCase();
                        if (window.typingAnalysis.mistakeMap) {
                            window.typingAnalysis.mistakeMap[key] = (window.typingAnalysis.mistakeMap[key] || 0) + 1;
                        }
                        window.typingAnalysis.lastMistakeTime = Date.now();
                    }

                if (soundEnabled) {
                        try {
                            incorrectSound.currentTime = 0;
                            incorrectSound.play().catch(e => console.log("Audio play error:", e));
                        } catch (e) {
                            console.log("Audio error:", e);
                        }
                    }
                     
                    shakeWord(wordIndex);
                }
                
                totalTypedChars++;
                currentIndex++;
                addCursor();

                // Check if we've completed a word (space or end of word)
                if (inputChar === " " || currentIndex === targetString.length) {
                    totalTypedWords++;
                    
                    // Track word timing
                    if (wordStartTime) {
                        const wordEndTime = Date.now();
                        const wordTime = wordEndTime - wordStartTime;
                        
                        // Get the current word being typed
                        const words = targetString.split(" ");
                        let wordIndex = 0;
                        let charCount = 0;
                        for (let i = 0; i < words.length; i++) {
                            if (currentIndex >= charCount && currentIndex < charCount + words[i].length) {
                                wordIndex = i;
                                break;
                            }
                            charCount += words[i].length + 1;
                        }
                        
                        const currentWord = words[wordIndex];
                        
                        typedWordTimings.push({
                            word: currentWord,
                            time: wordTime,
                            correct: currentWordCorrect
                        });
                        
                        wordStartTime = null;
                        currentTypedWord = "";
                        currentWordCorrect = true;
                    }
                    
                    // If no mistakes were made in this word, increment correctWords
                    if (currentWordMistakes === 0) {
                        correctWords++;
                    }
                    
                    updateWordStatsOnCompletion(mistakeTracking);
                    
                    // Reset word mistake counter
                    currentWordMistakes = 0;
                    
                    if (currentIndex === targetString.length) {
                        loadNextParagraph();
                    }
                }
            }
        }
    }

    function animateButton(button) {
        button.classList.add("pressed");
        setTimeout(() => {
            button.classList.remove("pressed");
        }, 200);
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.style.display = "block";
        toast.style.opacity = 1;

        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                toast.style.display = "none";
            }, 300);
        }, 1500);
    }

    function updateTimeOptionSelection() {
        const quick = document.getElementById("quickOption");
        const standard = document.getElementById("standardOption");
        const marathon = document.getElementById("marathonOption");

        if (timer === 30) {
            quick.checked = true;
        } else if (timer === 60) {
            standard.checked = true;
        } else if (timer === 120) {
            marathon.checked = true;
        } else {
            quick.checked = false;
            standard.checked = false;
            marathon.checked = false;
        }
    }

    function restartTest() {
        // Scroll to the top of the page smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        clearInterval(interval);

        totalTypedChars = 0;
        correctChars = 0;
        elapsedSeconds = 0;
        currentIndex = 0;
        // Preserve the last used timer duration instead of resetting to 30
        const lastSelectedTime = document.querySelector('input[name="timeOption"]:checked')?.value || 30;
        timer = parseInt(lastSelectedTime, 10);
        timerStarted = false;
        currentParagraphIndex = 0;
        mistakes = 0;
        totalTypedWords = 0;
        correctWords = 0; // Reset correct word counter
        currentWordMistakes = 0; // Reset current word mistake counter
        lastCharWasSpace = false;
        //---------------------------
        mistakeTracking = initMistakeTracking();
        //---------------------------
        // AI Feedback Integration: Reset AI state on restart
        if (window.typingAnalysis) {
            window.typingAnalysis.isTestActive = false;
            window.typingAnalysis.keyPressTimestamps = [];
            window.typingAnalysis.mistakeMap = {};
            document.dispatchEvent(new CustomEvent('testFinished'));
        }


        keyTimestamps = [];
        keyIntervals = [];
        fastestKeyPress = Infinity;
        slowestKeyPress = 0;
        typedWordTimings = [];
        wordStartTime = null;
        currentTypedWord = "";
        currentWordCorrect = true;
        updateTimeOptionSelection(); // Set the correct radio button based on the timer value

        generateParagraphs();
        targetString = paragraphs[currentParagraphIndex];

        timerElement.textContent = `${timer}`;
        wpmElement.textContent = "0";
        document.getElementById("accuracy").textContent = "0%";

        // Hide results and show typing test
        document.querySelector('.result-container').classList.remove('show');
        document.querySelector('.container').classList.remove('hide');

        initializeStringBox();
        updateActiveModeButton();

        document.getElementById("increaseTimer").disabled = false;
        document.getElementById("decreaseTimer").disabled = false;
        document.getElementById("easyMode").disabled = false;
        document.getElementById("mediumMode").disabled = false;
        document.getElementById("hardMode").disabled = false;
        document.getElementById("ghostMode").disabled = false;
        document.getElementById("soundToggle").disabled = false;

        const timeOptions = document.getElementsByName("timeOption");
        timeOptions.forEach(option => {
            option.disabled = false;
            option.style.cursor = "pointer";
            option.style.pointerEvents = "auto";
            option.style.opacity = 1;
        });

        document.removeEventListener('keydown', handleResultKeys);
        document.addEventListener("keydown", handleKeydown);
    }

    function toggleGhostMode() {
        ghostMode = !ghostMode;
        document.getElementById("ghostControls").style.display = ghostMode ? "block" : "none";
        restartTest();
    }

    function updateBlinkSpeed() {
        blinkSpeed = parseFloat(document.getElementById("blinkSpeed").value);
        document.getElementById("blinkSpeedValue").textContent = `${blinkSpeed.toFixed(1)}x`;
        
        const ghostWords = document.querySelectorAll(".ghost-word");
        ghostWords.forEach(word => {
            word.style.animationDuration = `${10/blinkSpeed}s`;
        });
    }

    // function to manage button states
    function updateActiveModeButton() {
        const easyBtn = document.getElementById("easyMode");
        const mediumBtn = document.getElementById("mediumMode");
        const hardBtn = document.getElementById("hardMode");

        // Remove active class from all buttons first
        easyBtn.classList.remove("active");
        mediumBtn.classList.remove("active");
        hardBtn.classList.remove("active");

        // Add active class to the current mode
        if (currentWordBank === easyWords) {
            easyBtn.classList.add("active");
        } else if (currentWordBank === mediumWords) {
            mediumBtn.classList.add("active");
        } else if (currentWordBank === hardWords) {
            hardBtn.classList.add("active");
        }
    }
    //---------------end of function------------------//

    // Button event listeners
    document.getElementById("increaseTimer").addEventListener("click", () => {
        if (!timerStarted) {
            timer += 10;
            timerElement.textContent = `${timer}`;
            animateButton(document.getElementById("increaseTimer"));
            showToast("+10 seconds added!");
            updateTimeOptionSelection();
        }
    });

    document.getElementById("decreaseTimer").addEventListener("click", () => {
        if (!timerStarted && timer > 10) {
            timer -= 10;
            timerElement.textContent = `${timer}`;
            animateButton(document.getElementById("decreaseTimer"));
            showToast("-10 seconds removed!");
            updateTimeOptionSelection();
        }
    });

    document.getElementById("easyMode").addEventListener("click", () => {
        if (!timerStarted) {
            wordsPerParagraph = 30; // Easy mode default
            currentWordBank = easyWords;
            ghostMode = false;
            document.getElementById("ghostControls").style.display = "none";
            restartTest();
            updateActiveModeButton(); // Add this line
            animateButton(document.getElementById("easyMode"));
            showToast("Easy mode activated!");
        }
    });

    document.getElementById("mediumMode").addEventListener("click", () => {
        if (!timerStarted) {
            wordsPerParagraph = 20; // Medium mode: 20 words
            currentWordBank = mediumWords;
            ghostMode = false;
            document.getElementById("ghostControls").style.display = "none";
            restartTest();
            updateActiveModeButton(); // Add this line
            animateButton(document.getElementById("mediumMode"));
            showToast("Medium mode activated!");
        }
    });

    document.getElementById("hardMode").addEventListener("click", () => {
        if (!timerStarted) {
            wordsPerParagraph = 20; // Hard mode: 20 words
            currentWordBank = hardWords;
            ghostMode = false;
            document.getElementById("ghostControls").style.display = "none";
            restartTest();
            updateActiveModeButton(); // Add this line
            animateButton(document.getElementById("hardMode"));
            showToast("Hard mode activated!");
        }
    });

    document.getElementById("ghostMode").addEventListener("click", () => {
        if (!timerStarted) {
            toggleGhostMode();
            animateButton(document.getElementById("ghostMode"));
            showToast(ghostMode ? "Ghost mode activated!" : "Ghost mode deactivated!");
        }
    });

    document.getElementById("soundToggle").addEventListener("click", () => {
        if (!timerStarted) {
            toggleSound();
            animateButton(document.getElementById("soundToggle"));
        }
    });

    document.getElementById("restartTest").addEventListener("click", () => {
        restartTest();
        animateButton(document.getElementById("restartTest"));
        showToast("Test restarted!");
    });

    document.getElementById("restartFromResults").addEventListener("click", () => {
     restartTest();
    });

    document.getElementById("deleteHistory").addEventListener("click", () => {
        clearHistory();
       // animateButton(document.getElementById("deleteHistory"));
       // showToast("History cleared!");
    });

    let shortcutTimeout; // To hold the timeout ID

    function showShortcuts() {
        const popup = document.getElementById("shortcut-popup");
        if (popup) {
            popup.classList.add("show");

            // Clear any existing timer
            if (shortcutTimeout) {
                clearTimeout(shortcutTimeout);
            }

            // Hide after 10 seconds
            shortcutTimeout = setTimeout(() => {
                hideShortcuts();
            }, 10000);
        }
    }

    function hideShortcuts() {
        const popup = document.getElementById("shortcut-popup");
        if (popup) popup.classList.remove("show");
    }

    document.getElementById("showShortcutsBtn").addEventListener("click", () => {
        showShortcuts();
    });

    document.getElementById("closeShortcutsBtn").addEventListener("click", () => {
        hideShortcuts();
        if (shortcutTimeout) {
            clearTimeout(shortcutTimeout); // Stop it from trying to hide again
        }
    });

    const timeOptions = document.getElementsByName("timeOption");
    timeOptions.forEach(option => {
        option.addEventListener("change", () => {
            if (!timerStarted) {
                timer = parseInt(option.value);
                timerElement.textContent = `${timer}`;

                if (timer === 30) {
                    showToast("Quick Mode: 30 seconds selected!");
                } else if (timer === 60) {
                    showToast("Standard Mode: 60 seconds selected!");
                } else if (timer === 120) {
                    showToast("Marathon Mode: 120 seconds selected!");
                }
            }
        });
    });

    document.getElementById("blinkSpeed").addEventListener("input", updateBlinkSpeed);

    // Initial load
    initAudio();
    generateParagraphs();
    updateActiveModeButton();
    targetString = paragraphs[currentParagraphIndex];
    initializeStringBox();
    document.addEventListener("keydown", handleKeydown);
    


    