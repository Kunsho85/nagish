# Nagish — Hearing Test Scripts

This repository contains the custom JavaScript code for the Nagish hearing test, hosted on `nagish.com/hearing-test` and built in Webflow.

## Repository Structure

```
nagish/
├── hearing-test/
│   ├── hearing-test.js      # Core hearing test logic (audio, volume, results)
│   └── inline-scripts.js    # UI card management and interaction handlers
├── .gitignore
└── README.md
```

## Scripts

### `hearing-test/hearing-test.js`

The main script responsible for all audio playback, volume control, slider behaviour, result calculation, and sending results to the backend. Previously hosted on Slater (`slater.app/3728/26937`).

### `hearing-test/inline-scripts.js`

Handles the multi-step card UI, checkbox interactions, calibration button logic, mirror click effect, and form load animation. These scripts are embedded inline in the Webflow page custom code and are stored here for version control purposes only.

## Integration in Webflow

The `hearing-test.js` script is loaded via jsDelivr CDN. Add the following tag to the **Hearing Test page custom code** (before `</body>`), replacing the old Slater loader:

```html
<script src="https://cdn.jsdelivr.net/gh/Kunsho85/nagish/hearing-test/hearing-test.js"></script>
```

Remove the old Slater script tag:

```html
<!-- REMOVE THIS -->
<script>document.addEventListener("DOMContentLoaded", function() { ... loadhearingtestsound ... })</script>
```

The `inline-scripts.js` content remains embedded directly in the Webflow page custom code and does not need to be loaded externally.

## How It Was Built

The hearing test is a fully custom JavaScript implementation embedded in a Webflow project. It uses pre-recorded audio files hosted in Webflow Assets, custom range sliders, a canvas-based audiogram, and a multi-step card UI controlled by custom JS. Results are sent to a backend endpoint and the audiogram is rendered as a PNG for email delivery.
