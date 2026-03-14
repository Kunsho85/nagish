# Nagish Hearing Test — Technical Documentation

This document provides a comprehensive overview of the custom JavaScript implementation for the Nagish Hearing Test (`nagish.com/hearing-test`). The system is built using a modular approach, combining UI management, audio processing, and data submission.

## 1. Architecture Overview

The hearing test is composed of several key modules:
- **Card Manager**: Handles the multi-step UI transitions using GSAP.
- **Audio Engine**: Manages frequency-specific audio playback and volume calibration.
- **Result Processor**: Calculates hearing loss levels and generates visual reports.
- **Data Integration**: Connects the frontend to the backend via webhooks.

---

## 2. Core Modules

### 2.1 Card Manager (`CardManager` Class)
The UI is structured as a series of "cards" (Steps 0-9). The `CardManager` handles:
- **Transitions**: Uses GSAP to animate cards in and out with a sliding effect.
- **Validation**: Checks if questions are answered or checkboxes are ticked before enabling the "Next" button.
- **State Management**: Tracks the current step and manages the visibility of elements.

**Key Attributes:**
- `sk-target="card-X"`: Identifies a specific step card.
- `sk-action="next:click"`: Triggers the transition to the next card.
- `.is-gsap`: Elements within a card that animate during transitions.

### 2.2 Audio Engine
The test uses 12 audio players (6 frequencies for each ear: 250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz).

- **Volume Control**: Users adjust volume in steps of `0.0625` (6.25%).
- **Calibration**: A dedicated "Frog Sound" test ensures the user's volume is set correctly before starting.
- **Playback Logic**: Only one frequency plays at a time. When a volume slider is adjusted, the corresponding frequency plays automatically.

### 2.3 Result Calculation
Results are calculated based on the average volume threshold across all frequencies.
- **Groups**:
    - **Group 1 (<= 15dB loss)**: No Hearing Loss.
    - **Group 2 (16-34dB loss)**: Mild Hearing Loss.
    - **Group 3 (35-49dB loss)**: Moderate Loss.
    - **Group 4 (> 49dB loss)**: Severe to Profound Loss.

---

## 3. Integration Details

### 3.1 Webflow Custom Attributes
The script relies on specific attributes set within the Webflow Designer:
- `[sk-target="card-X"]`: Card containers.
- `[sk-action="next:click"]`: Next buttons.
- `[db-result-title]`: Target for the result heading.
- `[db-result-copy]`: Target for the result description.
- `[load]`: Triggers the small loader animation on form submission.

### 3.2 External Dependencies
- **GSAP (3.12.2)**: Core animation engine.
- **ScrollToPlugin**: Used for smooth scrolling interactions.

### 3.3 Backend Communication
- **Endpoint**: `https://ht.nagish.io/webhook`
- **Payload**: Includes user name, email, pre-test answers, frequency results, and a Base64 PNG of the audiogram canvas.

---

## 4. Maintenance Notes

### Switching to GitHub Hosting
The core logic is currently embedded inline in Webflow. If you wish to move it to an external file:
1. Copy the script content to `hearing-test/hearing-test.js` in this repository.
2. Replace the inline script in Webflow with:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/Kunsho85/nagish/hearing-test/hearing-test.js"></script>
   ```

### Updating Frequencies or Sounds
To change the audio files, update the `ID`s of the HTML5 Audio elements in Webflow to match `audioPlayer1` through `audioPlayer12`.


## 5. Audio Files

The `hearing-test/sounds/` directory contains all the audio tones used in the test. These files are currently loaded from the Webflow Assets panel for performance optimization, but they are included in this repository for completeness and future use.

| Filename       | Description                               |
|----------------|-------------------------------------------|
| `250Hz L.mp3`  | 250 Hz tone for the left ear              |
| `250Hz R.mp3`  | 250 Hz tone for the right ear             |
| `500Hz L.mp3`  | 500 Hz tone for the left ear              |
| `500Hz R.mp3`  | 500 Hz tone for the right ear             |
| `1000Hz L.mp3` | 1000 Hz tone for the left ear             |
| `1000Hz R.mp3` | 1000 Hz tone for the right ear            |
| `2000Hz L.mp3` | 2000 Hz tone for the left ear             |
| `2000Hz R.mp3` | 2000 Hz tone for the right ear            |
| `4000Hz L.mp3` | 4000 Hz tone for the left ear             |
| `4000Hz R.mp3` | 4000 Hz tone for the right ear            |
| `8000Hz L.mp3` | 8000 Hz tone for the left ear             |
| `8000Hz R.mp3` | 8000 Hz tone for the right ear            |
