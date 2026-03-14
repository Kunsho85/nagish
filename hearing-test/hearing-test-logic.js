// MAIN HEARING TEST FUNCTION
// Constants
const VOLUME_STEP = 0.0625;
const PLAYBACK_DURATION = 2000;

//Promeniti kad se digne na server sa url-om od servera
const SERVER_URL = 'https://ht.nagish.io';

// Audio context setup
//const audioContext = new(window.AudioContext || window.webkitAudioContext)();

// Audio players setup
const audioPlayers = Array.from({ length: 12 }, (_, i) => document.getElementById(
  `audioPlayer${i + 1}`));
const volumeRanges = [
  ...Array.from({ length: 6 }, (_, i) => document.getElementById(
    `volume${['250', '500', '1000', '2000', '4000', '8000'][i]}L`)),
  ...Array.from({ length: 6 }, (_, i) => document.getElementById(
    `volume${['250', '500', '1000', '2000', '4000', '8000'][i]}R`))
];
const volumeValues = Array.from({ length: 12 }, (_, i) => document.getElementById(
  `volumeValue${i + 1}`));

// SVG Drawing Functions
function drawSvgOnCanvas() {
  //console.log('DRAW SVG');
}

// Update SVG paths
function updatePaths() {
  //console.log('UPDATE PATH')
}

// Function to adjust volume and update slider visually
function adjustVolume(volumeElement, delta, e) {
  if (!volumeElement) return;

  const currentVolume = parseFloat(volumeElement.value);
  const newVolume = Math.min(Math.max(currentVolume + delta, 0), 1);
  volumeElement.value = newVolume.toFixed(2);

  // Update slider appearance
  volumeElement.style.setProperty('--value', `${newVolume * 100}%`);
  volumeElement.style.backgroundSize = `${newVolume * 100}% 100%`;

  return false;
}

// Function to play audio
function playAudio(audioPlayer, volume) {
  if (!audioPlayer) return;

  audioPlayer.volume = volume;
  //audioPlayer.muted = false;

  // audioContext.resume().then(() => {
  //   audioPlayer.play().catch((error) => {
  //     console.error('Error playing audio 11111:', error);
  //   });
  // });
  audioPlayer.play().catch((error) => {
    console.error('Error playing audio 11111:', error);
  });
}

// Setup volume controls
function setupVolumeControls() {
  const frequencies = ['250', '500', '1000', '2000', '4000', '8000'];
  const channels = ['L', 'R'];

  channels.forEach(channel => {
    frequencies.forEach(freq => {
      // Down button
      const downBtn = document.getElementById(`${channel}vol${freq}d`);
      if (downBtn) {
        ['click'].forEach(eventType => {

          downBtn.addEventListener(eventType, function (e) {
            e.preventDefault();
            e.stopPropagation();

            const volumeElement = document.getElementById(
              `volume${freq}${channel}`);
            adjustVolume(volumeElement, -VOLUME_STEP, e);

            const playerIndex = volumeRanges.findIndex(range => range.id ===
              volumeElement.id);
            if (playerIndex !== -1) {
              audioPlayers.forEach((player, i) => {
                player.muted = i !== playerIndex;
                player.pause();
                player.currentTime = 0;
              });
              playAudio(audioPlayers[playerIndex], volumeElement.value);

            }

            return false;

          }, true);
        });
      }

      // Up button
      const upBtn = document.getElementById(`${channel}vol${freq}u`);
      if (upBtn) {
        ['click'].forEach(eventType => {
          upBtn.addEventListener(eventType, function (e) {
            e.preventDefault();
            e.stopPropagation();

            const volumeElement = document.getElementById(
              `volume${freq}${channel}`);
            adjustVolume(volumeElement, VOLUME_STEP, e);

            const playerIndex = volumeRanges.findIndex(range => range.id ===
              volumeElement.id);
            if (playerIndex !== -1) {
              audioPlayers.forEach((player, i) => {
                player.muted = i !== playerIndex;
                player.pause();
                player.currentTime = 0;
              });
              playAudio(audioPlayers[playerIndex], volumeElement.value);
            }
            return false;
          }, true);
        });
      }
    });
  });
}

// Connect audio players
function connectAudioPlayers() {
  let debounceTimeout;

  audioPlayers.forEach((audioPlayer, index) => {
    if (!audioPlayer || !volumeRanges[index]) return;

    audioPlayer.volume = volumeRanges[index].value;

    volumeRanges[index].addEventListener('mousedown', function () {

      audioPlayers.forEach((player, i) => {
        player.muted = true;
        player.pause();
        player.currentTime = 0;
      });

    });

    volumeRanges[index].addEventListener('mouseup', function () {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const volume = this.value;
        audioPlayer.volume = volume;

        if (volumeValues[index]) {
          volumeValues[index].textContent = Math.round(volume * 100) + '%';
        }

        audioPlayers.forEach((player, i) => {
          if (i === index) {
            player.muted = false;
            if (volume > 0) {
              // audioContext.resume().then(() => {
              //   player.play();
              // });
              player.play();

            }
          }
        });
        playAudio(audioPlayers[index], volume);
      }, 100);

    });
  });
}

let hearingTestResult = null;

// Results calculation
document.getElementById('showValues')?.addEventListener('click', function () {
  // Get pre-test question values
  const getQuestionValue = (name) => {
    const element = document.querySelector(`input[name="${name}"]:checked`);
    return element ? element.value : 'Not answered';
  };

  const preTestResults = {
    struggleToHear: getQuestionValue('struggle-to-hear'),
    missHearing: getQuestionValue('miss-hearing'),
    transcriptBenefit: getQuestionValue('transcript-benefit'),
    hardToFollow: getQuestionValue('hard-to-follow')
  };

  // Get user info
  const name = document.getElementById('name')?.value || 'Not provided';
  const email = document.getElementById('email')?.value || 'Not provided';

  const getValues = channel => ['250', '500', '1000', '2000', '4000', '8000']
    .map(freq => document.getElementById(`volume${freq}${channel}`).value);

  const valuesL = getValues('L');
  const valuesR = getValues('R');

  const calculateAverage = values => {
    const numericValues = values.map(v => Number(v) || 0);
    return numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;
  };

  const averageL = calculateAverage(valuesL);
  const averageR = calculateAverage(valuesR);
  const averageLx = (averageL * 100).toFixed(2);
  const averageRx = (averageR * 100).toFixed(2);
  const AVRlr = ((Number(averageLx) + Number(averageRx)) / 2).toFixed(0);

  // Create detailed results object
  const detailedResults = {
    userInfo: {
      name,
      email
    },
    preTest: preTestResults,
    leftEar: {
      values: valuesL.map((v, i) => ({
        frequency: ['250', '500', '1000', '2000', '4000', '8000'][i],
        value: (v * 100).toFixed(2)
      })),
      average: averageLx
    },
    rightEar: {
      values: valuesR.map((v, i) => ({
        frequency: ['250', '500', '1000', '2000', '4000', '8000'][i],
        value: (v * 100).toFixed(2)
      })),
      average: averageRx
    },
    totalAverage: AVRlr
  };

  hearingTestResult = detailedResults;

  // Display detailed results in output element
  const outputElement = document.getElementById('output');
  if (outputElement) {
    outputElement.innerHTML = `
      <div class="results-container">
        <h3>Detailed Hearing Test Results</h3>
        
        <div class="user-info">
          <h4>User Information</h4>
          <p>Name: ${detailedResults.userInfo.name}</p>
          <p>Email: ${detailedResults.userInfo.email}</p>
        </div>

        <div class="pre-test-results">
          <h4>Pre-Test Questionnaire</h4>
          <p>Struggle to hear: ${detailedResults.preTest.struggleToHear}</p>
          <p>Miss hearing: ${detailedResults.preTest.missHearing}</p>
          <p>Transcript benefit: ${detailedResults.preTest.transcriptBenefit}</p>
          <p>Hard to follow: ${detailedResults.preTest.hardToFollow}</p>
        </div>

        <div class="ear-results">
          <div class="left-ear">
            <h4>Left Ear</h4>
            ${detailedResults.leftEar.values.map(v => 
              `<p>${v.frequency}Hz: ${v.value}%</p>`
            ).join('')}
            <p><strong>Average: ${detailedResults.leftEar.average}%</strong></p>
          </div>
          <div class="right-ear">
            <h4>Right Ear</h4>
            ${detailedResults.rightEar.values.map(v => 
              `<p>${v.frequency}Hz: ${v.value}%</p>`
            ).join('')}
            <p><strong>Average: ${detailedResults.rightEar.average}%</strong></p>
          </div>
        </div>
        <div class="total-average">
          <h4>Total Average: ${detailedResults.totalAverage}%</h4>
        </div>
      </div>
    `;
  }

  // Determine group and update existing elements
  let group = 1;
  if (AVRlr > 15 && AVRlr <= 34) group = 2;
  else if (AVRlr > 34 && AVRlr <= 49) group = 3;
  else if (AVRlr > 49) group = 4;

  const results = {
    1: {
      title: 'No Hearing Loss',
      copy: '15 dB hearing loss or less. You likely hear quiet sounds well and may experience no trouble hearing in noisy environments.'
    },
    2: {
      title: 'Mild Hearing Loss',
      copy: 'You may have difficulty hearing soft sounds or speech in noisy environments, but everyday conversations remain clear in quiet settings.'
    },
    3: {
      title: 'Moderate Loss',
      copy: 'Speech may be unclear, especially in background noise. Higher-pitched sounds are harder to detect without hearing aids.'
    },
    4: {
      title: 'Severe to Profound Hearing Loss',
      copy: 'You can only hear loud sounds. Speech is difficult to understand even in quiet settings without amplification.'
    }
  };

  const titleElement = document.querySelector('[db-result-title]');
  const copyElement = document.querySelector('[db-result-copy]');

  if (titleElement && copyElement && results[group]) {
    titleElement.textContent = results[group].title;
    copyElement.textContent = results[group].copy;
  }

  hearingTestResult = {
    ...hearingTestResult,
    questionsResult: {
      title: results[group].title,
      copy: results[group].copy
    }
  }
});

document.getElementById('submit-ht').addEventListener('click', () => {
  const name = document.getElementById('name')?.value || 'Not provided';
  const email = document.getElementById('email')?.value || 'Not provided';
  const canvas = document.getElementById('myCanvas');
  const imageData = canvas.toDataURL('image/png');

  hearingTestResult = { ...hearingTestResult, name, email }

  if (name && name !== 'Not provided' && email && email !== 'Not provided') {
    sendResult(hearingTestResult);
  }

})

function sendResult(result) {
  const submitButton = document.querySelector('.submit-button_ht');
  const url = `${SERVER_URL}/webhook`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  };

  submitButton.classList.add('hide');

  fetch(url, options)
    .then(response => response.json())
    .then(async (response) => {
      // const imageUrl = response.data.file;
      // const imageUrlSplit = imageUrl.split('/');
      // const fileName = imageUrlSplit[imageUrlSplit.length - 1];

      // await downloadGraph(imageUrl, fileName);

      if (typeof window.cardManager.showCard === 'function') {
        window.cardManager.showCard(9);
      }

    })
    .catch(error => {
      console.error('Error:', error);
      submitButton.classList.remove('hide');
    });
}

// async function downloadGraph(imageUrl, fileName) {
//   try {
//     const link = document.createElement('a');

//     link.href = await toDataURL(imageUrl);
//     link.download = fileName;
//     link.classList.add('hide');
//     document.body.appendChild(link);

//     link.click();
//     document.body.removeChild(link);
//   } catch (error) {
//     console.error(error);
//   }
// }

async function toDataURL(url) {
  const blob = await fetch(url).then(res => res.blob());
  return URL.createObjectURL(blob);
}

// Add slider styling
const sliderStyle = document.createElement('style');
sliderStyle.textContent = `
input[type="range"] {
    --value: 0%;
    background: linear-gradient(90deg, 
        var(--slider-color, #646cff) var(--value), 
        var(--slider-bg, #ddd) var(--value)
    );
}

input[type="range"]::-webkit-slider-thumb {
    position: relative;
    z-index: 2;
}
`;
document.head.appendChild(sliderStyle);

// Enable PNG download
// document.getElementById('downloadBtn')?.addEventListener('click', function () {
//   const canvas = document.getElementById('myCanvas');
//   const link = document.createElement('a');
//   link.download = 'hearing-test-results.png';
//   link.href = canvas.toDataURL('image/png');
//   link.click();
// });

setupVolumeControls();
connectAudioPlayers();
//drawSvgOnCanvas(); // Initial SVG drawing

// Export functions for global access
window.drawSvgOnCanvas = drawSvgOnCanvas;
window.updatePaths = updatePaths;

//SCRIPTA ZA PUSTANJE ZVUKA ZABA!!!!

const playPauseButton = document.getElementById('playPauseButton');
const playIcon = playPauseButton.querySelector('.play_icon');
const pauseIcon = playPauseButton.querySelector('.pause_icon');
const audioPlayer = document.getElementById('audioPlayer');

// Ensure the audio is paused initially
audioPlayer.pause();

playPauseButton.addEventListener('click', function () {
  // Toggle the is-active class on play and pause icons
  playIcon.classList.toggle('is-active');
  pauseIcon.classList.toggle('is-active');

  // Play or pause the audio based on the active icon
  if (pauseIcon.classList.contains('is-active')) {
    audioPlayer.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  } else {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
});

// Optional: Add event listeners to sync button state with audio state
// audioPlayer.addEventListener('play', function () {
//   playIcon.classList.remove('is-active');
//   pauseIcon.classList.add('is-active');
// });

// audioPlayer.addEventListener('pause', function () {
//   playIcon.classList.add('is-active');
//   pauseIcon.classList.remove('is-active');
// });

// Optional: Handle audio ending
// audioPlayer.addEventListener('ended', function () {
//   playIcon.classList.add('is-active');
//   pauseIcon.classList.remove('is-active');
// });