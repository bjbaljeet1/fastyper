// Screen recording functionality
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let captureStream;
let audioStream;
const recordButton = document.getElementById('recordButton');
const toast = document.getElementById('toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        // Clear previous chunks
        recordedChunks = [];
        
        // Get selected quality
        const qualitySelector = document.getElementById('recordingQuality');
        const quality = qualitySelector.value;

        const qualitySettings = {
            'hd': { width: 1280, height: 720, bitrate: 5000000 },
            'fhd': { width: 1920, height: 1080, bitrate: 8000000 },
            '4k': { width: 3840, height: 2160, bitrate: 20000000 }
        };

        const settings = qualitySettings[quality] || qualitySettings['fhd'];

        // Disable quality selector during recording
        qualitySelector.disabled = true;

        // Request screen capture
        const videoStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: 'browser',
                width: { ideal: settings.width },
                height: { ideal: settings.height },
                frameRate: { ideal: 60 }
            },
            audio: true,
            selfBrowserSurface: 'include'
        });

        const videoTrack = videoStream.getVideoTracks()[0];
        if (videoTrack.getSettings().displaySurface !== 'browser') {
            showToast('Please select the current tab for recording');
            videoStream.getTracks().forEach(track => track.stop());
            return;
        }

        // Handle audio
        if (videoStream.getAudioTracks().length === 0) {
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });
                audioStream.getAudioTracks().forEach(track => videoStream.addTrack(track));
            } catch (audioError) {
                console.warn('Audio capture failed:', audioError);
                showToast('Recording without microphone');
            }
        }

        // Use a more compatible mimeType
        const options = { 
            mimeType: 'video/webm;codecs=vp9,opus',
            videoBitsPerSecond: settings.bitrate
        };

        // Check if the mimeType is supported
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn(`${options.mimeType} is not supported`);
            options.mimeType = 'video/webm'; // Fallback to default
        }

        mediaRecorder = new MediaRecorder(videoStream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = videoURL;
            a.download = `fastyper-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.mp4`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(videoURL);
            }, 100);
            
            showToast('Recording saved');
        };

        mediaRecorder.start(); // Let the browser handle chunking for better performance
        isRecording = true;
        recordButton.classList.add('recording');
        recordButton.innerHTML = '<i class="fas fa-stop"></i>';
        showToast('Recording started - Press Alt+S to stop');

        // Handle track ending
        videoTrack.onended = () => {
            if (isRecording) {
                stopRecording();
            }
        };

        captureStream = videoStream;

    } catch (err) {
        console.error('Error starting recording:', err);
        showToast('Recording failed to start');
        resetRecordingState();
    }
}

function stopRecording() {
    if (!isRecording) return;
    
    try {
        mediaRecorder.stop();
        isRecording = false;
        
        // Stop all tracks
        if (captureStream) {
            captureStream.getTracks().forEach(track => track.stop());
        }
        
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
        }
        
        resetRecordingState();
    } catch (e) {
        console.error('Error stopping recording:', e);
        showToast('Error stopping recording');
        resetRecordingState();
    }
}

function resetRecordingState() {
    recordButton.classList.remove('recording');
    recordButton.innerHTML = '<i class="fas fa-video"></i>';
    
    // Re-enable quality selector
    const qualitySelector = document.getElementById('recordingQuality');
    if (qualitySelector) qualitySelector.disabled = false;
}

// Event listener for the record button
recordButton.addEventListener('click', toggleRecording);

// Keyboard shortcut (Alt+R to start, Alt+S to stop)
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'r' && !isRecording) {
        e.preventDefault();
        startRecording();
    } else if (e.altKey && e.key.toLowerCase() === 's' && isRecording) {
        e.preventDefault();
        stopRecording();
    }
});