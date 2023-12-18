let microphoneStream; // Variable to store the microphone stream
function initMicrophone() {

    turnOnFlame();
    // Check for Web Audio API support
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
        alert('Web Audio API is not supported in this browser');
        return;
    }

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Access the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            // Store the microphone stream in the variable
            microphoneStream = stream;

            // Create an audio source node
            const source = audioContext.createMediaStreamSource(stream);

            // Create an analyser node
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Adjust the FFT size as needed

            // Connect the source to the analyser
            source.connect(analyser);

            // Connect the analyser to the audio context's destination (speakers)
            analyser.connect(audioContext.destination);

            // Set up an array to store frequency data
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            // Check for blowing into the microphone periodically
            setInterval(() => {
                analyser.getByteFrequencyData(dataArray);

                // Analyze the frequency data (you may need to customize this part)
                const maxFrequency = Math.max(...dataArray);
                if (maxFrequency > 254) {
                    //   console.log('User is blowing into the microphone!');
                    document.getElementById('text').innerHTML = "!! Happy Birthday !!";
                    // Call the flameToggle function or place your logic here
                    turnOffFlame();
                }
            }); // Adjust the interval as needed
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
        });
}

function turnOffFlame() {
    var flame = document.getElementById('flame');
    if (flame) {
        flame.classList.remove('lit');
        flame.classList.add('out');

        // Stop the microphone input by stopping the audio track
        if (microphoneStream) {
            const audioTracks = microphoneStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].stop();
            }
        }
        addSmoke();
    } else {
        console.error('Flame element not found');
    }
}

function turnOnFlame() {
    var flame = document.getElementById('flame');
    if (flame) {
        flame.classList.remove('out');
        flame.classList.add('lit');
        document.getElementById('text').innerHTML = "";
        removeSmoke();
    } else {
        console.error('Flame element not found');
    }
}

// Function to add smoke divs
function addSmoke() {
    for (let i = 0; i < 3; i++) {
        const smokeDiv = document.createElement("div");
        smokeDiv.className = "smoke";
        document.querySelector(".candle").appendChild(smokeDiv);
    }
}

// Function to remove smoke divs
function removeSmoke() {
    const smokeDivs = document.querySelectorAll(".smoke");
    smokeDivs.forEach(smokeDiv => smokeDiv.remove());
}

