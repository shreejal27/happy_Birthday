let microphoneStream; // Variable to store the microphone stream
function initMicrophone() {
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
                  console.log('User is blowing into the microphone!');
                  document.getElementById('text').innerHTML = "Blowing";
                  // Call the flameToggle function or place your logic here
                  flameToggle();
              }
          }); // Adjust the interval as needed
      })
      .catch((error) => {
          console.error('Error accessing microphone:', error);
      });
}

function flameToggle() {
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
  } else {
      console.error('Flame element not found');
  }
}

// flame.addEventListener('click', flameToggle);