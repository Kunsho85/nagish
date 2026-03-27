# Nagish Hearing Test — Technical Documentation

This document provides a comprehensive overview of the custom JavaScript implementation for the Nagish Hearing Test (`nagish.com/hearing-test`). The system is built using a modular approach, combining UI management, audio processing, and data submission.

## 1. Architecture Overview

The hearing test is composed of several key modules:
- **Card Manager**: Handles the multi-step UI transitions using GSAP.
- **Audio Engine**: Manages frequency-specific audio playback and volume calibration.
- **Result Processor**: Calculates hearing loss levels and generates visual reports.
- **Data Integration**: Connects the frontend to the backend via webhooks.

---

## 2. HTML Structure & JS Targets Mapping

This section details the exact HTML classes, IDs, and custom attributes that the JavaScript logic relies on. When rebuilding the layout, these targets **must** be preserved for the test to function correctly.

### 2.1 Card System & Navigation (`card-manager.js`)
The UI is divided into 10 "cards" (Steps 0-9). The `CardManager` handles transitions between them.

**Card Containers:**
- `[sk-target="card-0"]` to `[sk-target="card-9"]`: These attributes must be placed on the main wrapper of each step.
- `.is-gsap`: Add this class to elements inside a card that should animate (slide in/out) during transitions.

**Navigation Buttons:**
- `[sk-action="next:click"]`: Triggers the transition to the next card.
- `[sk-action="previous:click"]`: Triggers the transition to the previous card.
- `.inactive`: Class toggled by JS to disable/enable the "Next" button based on form validation.

### 2.2 Audio Players & Volume Controls (`hearing-test-logic.js`)
The test uses 12 audio players (6 frequencies for each ear).

**Audio Elements:**
- `<audio id="audioPlayer1">` to `<audio id="audioPlayer12">`: The HTML5 audio elements.
  - 1-6: Left Ear (250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz)
  - 7-12: Right Ear (250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz)

**Volume Sliders (Range Inputs):**
- `id="volume250L"`, `id="volume500L"`, ..., `id="volume8000L"`: Left ear sliders.
- `id="volume250R"`, `id="volume500R"`, ..., `id="volume8000R"`: Right ear sliders.
- `.range-slider_ht`: Class used for styling the sliders.

**Volume Buttons (Up/Down):**
- `id="Lvol250d"`, `id="Lvol250u"`, etc.: Down/Up buttons for Left ear.
- `id="Rvol250d"`, `id="Rvol250u"`, etc.: Down/Up buttons for Right ear.

**Volume Value Displays:**
- `id="volumeValue1"` to `id="volumeValue12"`: Elements displaying the current volume percentage.

### 2.3 Pre-Test Questionnaire & Validation
The JS validates that users have answered questions before allowing them to proceed.

**Questionnaire Form:**
- `id="pre-test-questions"`: The form containing the initial 4 questions.
- `name="struggle-to-hear"`, `name="miss-hearing"`, `name="transcript-benefit"`, `name="hard-to-follow"`: Radio button groups.

**Setup Checkboxes:**
- `id="im-in-a-quiet-place"`: Checkbox for Card 2.
- `id="headphones-on"`: Checkbox for Card 3.
- `id="sound-comfortable"`: Checkbox for Card 4.
- `.rb_ht` and `.radio-button-wrap_ht`: Classes used for custom radio/checkbox click handling.

### 2.4 Calibration & Quick Volume Check (`calibration.js`)
- `id="audioPlayer"`: The audio element for the calibration sound (frog sound).
- `id="playPauseButton"`: The button to play/pause the calibration sound.
- `.play_icon` / `.pause_icon`: Icons toggled during playback.
- `[sk-target="calibration-button"]`: Triggers the calibration logic.
- `[sk="go"]`: The "Next" button on the calibration card, enabled after checking.

### 2.5 Results & Submission
- `id="showValues"`: Button that triggers the calculation of results.
- `[db-result-title]`: Target for injecting the result heading (e.g., "Mild Hearing Loss").
- `[db-result-copy]`: Target for injecting the result description.
- `id="name"`, `id="email"`: Input fields for user details.
- `id="submit-ht"`: The final submit button that sends data to the webhook.
- `[load]`: Attribute on the submit button to trigger the loader.
- `.loader-small`: The loader element that gets the `.is-active` class on submission.
- `id="myCanvas"`: The canvas element used for drawing the audiogram (currently hidden/base64 encoded).

---

## 3. Core Modules

### 3.1 Card Manager (`CardManager` Class)
The UI is structured as a series of "cards" (Steps 0-9). The `CardManager` handles:
- **Transitions**: Uses GSAP to animate cards in and out with a sliding effect.
- **Validation**: Checks if questions are answered or checkboxes are ticked before enabling the "Next" button.
- **State Management**: Tracks the current step and manages the visibility of elements.

### 3.2 Audio Engine
The test uses 12 audio players (6 frequencies for each ear: 250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz).

- **Volume Control**: Users adjust volume in steps of `0.0625` (6.25%).
- **Calibration**: A dedicated "Frog Sound" test ensures the user's volume is set correctly before starting.
- **Playback Logic**: Only one frequency plays at a time. When a volume slider is adjusted, the corresponding frequency plays automatically.

### 3.3 Result Calculation
Results are calculated based on the average volume threshold across all frequencies.
- **Groups**:
    - **Group 1 (<= 15dB loss)**: No Hearing Loss.
    - **Group 2 (16-34dB loss)**: Mild Hearing Loss.
    - **Group 3 (35-49dB loss)**: Moderate Loss.
    - **Group 4 (> 49dB loss)**: Severe to Profound Loss.

---

## 4. Integration Details

### 4.1 External Dependencies
- **GSAP (3.12.2)**: Core animation engine.
- **ScrollToPlugin**: Used for smooth scrolling interactions.

### 4.2 Backend Communication
- **Endpoint**: `https://ht.nagish.io/webhook`
- **Payload**: Includes user name, email, pre-test answers, frequency results, and a Base64 PNG of the audiogram canvas.

---

## 5. Maintenance Notes

### Switching to GitHub Hosting
The core logic is currently embedded inline in Webflow. If you wish to move it to an external file:
1. Copy the script content to `hearing-test/hearing-test.js` in this repository.
2. Replace the inline script in Webflow with:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/Kunsho85/nagish/hearing-test/hearing-test.js"></script>
   ```

### Updating Frequencies or Sounds
To change the audio files, update the `ID`s of the HTML5 Audio elements in Webflow to match `audioPlayer1` through `audioPlayer12`.

## 6. Audio Files

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
