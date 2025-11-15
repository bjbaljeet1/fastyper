 document.addEventListener('DOMContentLoaded', function() {
            const keys = document.querySelectorAll('.key');
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let isShiftPressed = false;
            let isCapsLockOn = false;
            
            const activeKeys = new Set();
            const keyElements = {};

            keys.forEach(key => {
                const keyValue = key.getAttribute('data-key');
                const side = key.getAttribute('data-side') || 'none';
                keyElements[`${keyValue}-${side}`] = key;
            });


            function pressKey(keyElement) {
                if (!keyElement) return;

                // Get the current accent color from body's computed style
    const accentColor = getComputedStyle(document.querySelector('.button')).borderColor;
    
    keyElement.style.backgroundColor = accentColor;
    keyElement.style.color = '#ffffff';
    keyElement.style.boxShadow = `0 0 15px ${accentColor}`;
    
    setTimeout(() => {
        keyElement.style.backgroundColor = '';
        keyElement.style.color = '';
        keyElement.style.boxShadow = '';
    }, 100);




                
                keyElement.classList.add('active');
               // playClickSound();
                
                setTimeout(() => {
                    keyElement.classList.remove('active');
                }, 100);
            }

            document.addEventListener('keydown', function(e) {
                e.preventDefault();
                const keyValue = e.key.toLowerCase();
                const code = e.code.toLowerCase();
                
                if (activeKeys.has(code)) return;
                activeKeys.add(code);

                let keyToPress = null;
                
                if (code.includes('shift')) {
                    isShiftPressed = true;
                    if (code.includes('left')) {
                        keyToPress = keyElements['shift-left'];
                    } else {
                        keyToPress = keyElements['shift-right'];
                    }
                }
                else if (code.includes('control')) {
                    if (code.includes('left')) {
                        keyToPress = keyElements['ctrl-left'];
                    } else {
                        keyToPress = keyElements['ctrl-right'];
                    }
                }
                else if (code.includes('alt')) {
                    if (e.key === 'AltGraph' || code === 'altright' || e.location === 2) {
                        keyToPress = keyElements['alt-right'];
                    } 
                    else if (code.includes('left') || e.location === 1) {
                        keyToPress = keyElements['alt-left'];
                    }
                    else if (!keyToPress) {
                        keyToPress = code.includes('right') ? keyElements['alt-right'] : keyElements['alt-left'];
                    }
                }
                else if (code === 'space') {
                    keyToPress = keyElements['space-none'];
                }
                else if (keyValue === 'capslock') {
                    isCapsLockOn = !isCapsLockOn;
                    keyToPress = keyElements['capslock-none'];
                    if (keyToPress) {
                        keyToPress.classList.toggle('active', isCapsLockOn);
                    }
                }
                else {
                    keyToPress = document.querySelector(`.key[data-key="${escapeKey(keyValue)}"]`);
                    
                    if (!keyToPress && e.key.length === 1) {
                        const keysWithShift = document.querySelectorAll('.key[data-shift]');
                        keysWithShift.forEach(key => {
                            if (key.getAttribute('data-shift') === e.key) {
                                keyToPress = key;
                            }
                        });
                    }
                }
                
                if (keyToPress) {
                    pressKey(keyToPress);
                }
            });

            document.addEventListener('keyup', function(e) {
                const keyValue = e.key.toLowerCase();
                const code = e.code.toLowerCase();
                
                activeKeys.delete(code);

                let keyToRelease = null;
                
                if (code.includes('shift')) {
                    isShiftPressed = false;
                    if (code.includes('left')) {
                        keyToRelease = keyElements['shift-left'];
                    } else {
                        keyToRelease = keyElements['shift-right'];
                    }
                }
                else if (code.includes('control')) {
                    if (code.includes('left')) {
                        keyToRelease = keyElements['ctrl-left'];
                    } else {
                        keyToRelease = keyElements['ctrl-right'];
                    }
                }
                else if (code === 'space') {
                    keyToRelease = keyElements['space-none'];
                }
                else if (code.includes('alt')) {
                    if (e.key === 'AltGraph' || code === 'altright' || e.location === 2) {
                        keyToRelease = keyElements['alt-right'];
                    }
                    else if (code.includes('left') || e.location === 1) {
                        keyToRelease = keyElements['alt-left'];
                    }
                    else if (!keyToRelease) {
                        keyToRelease = code.includes('right') ? keyElements['alt-right'] : keyElements['alt-left'];
                    }
                }
                
                if (keyToRelease) {
                    keyToRelease.classList.remove('active');
                }
            });

            function escapeKey(key) {
                if (key === '\\') return '\\\\';
                return key;
            }

            keys.forEach(key => {
                key.addEventListener('mousedown', function() {
                    const keyValue = this.getAttribute('data-key');
                    const side = this.getAttribute('data-side') || 'none';
                    
                    if (keyValue === 'capslock') {
                        isCapsLockOn = !isCapsLockOn;
                        this.classList.toggle('active', isCapsLockOn);
                    }
                    
                    pressKey(this);
                });
            });
        });

        // Update your keyboard.js with something like this
document.addEventListener('DOMContentLoaded', function() {
    const stringBox = document.getElementById('stringBox');
    
    // Handle both virtual and physical keyboard input
    stringBox.addEventListener('input', function(e) {
        // Your existing character handling logic here
        handleCharacterInput(e.data || String.fromCharCode(e.keyCode));
    });
    
    // For contenteditable div version
    stringBox.addEventListener('keydown', function(e) {
        // Prevent Enter key from creating new lines
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
    
    // For textarea version
    stringBox.addEventListener('keydown', function(e) {
        // Your existing key handling logic
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const stringBox = document.getElementById('stringBox');
    if (stringBox && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(() => {
            stringBox.focus();
        }, 300);
    }
});
