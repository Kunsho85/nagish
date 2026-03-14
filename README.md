# Nagish — Hearing Test Scripts

This repository contains the custom JavaScript code for the Nagish hearing test, hosted on `nagish.com/hearing-test` and built in Webflow.

## Repository Structure

```
nagish/
├── hearing-test/
│   ├── hearing-test-logic.js # Core hearing test logic (audio, volume, results)
│   ├── card-manager.js       # UI step/card management (GSAP)
│   ├── calibration.js        # Volume calibration logic
│   ├── mirror-click.js       # Mirror click interaction handler
│   └── form-loader.js        # Form submission loader animation
├── .gitignore
├── README.md
└── HEARING_TEST_DOCS.md
```

## Scripts Overview

### `hearing-test/hearing-test-logic.js`
The main script responsible for all audio playback, volume control, slider behavior, result calculation, and sending results to the backend.

### `hearing-test/card-manager.js`
Handles the multi-step UI transitions using GSAP. It manages the visibility and animations of the test cards.

### `hearing-test/calibration.js`
Ensures the user's audio is correctly calibrated before starting the actual test.

### `hearing-test/mirror-click.js` & `hearing-test/form-loader.js`
Utility scripts for specific UI interactions and loading states during form submission.

## Integration in Webflow

The scripts are currently embedded **inline** in the Webflow project for performance. This repository serves as a version-controlled backup and a reference for developers.

To load these scripts externally via jsDelivr CDN, use the following tags:

```html
<script src="https://cdn.jsdelivr.net/gh/Kunsho85/nagish/hearing-test/hearing-test-logic.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Kunsho85/nagish/hearing-test/card-manager.js"></script>
<!-- Add other scripts as needed -->
```

## Security Audit
A basic security audit has been performed on these scripts. No sensitive data (API keys, secrets, or credentials) were found hardcoded in the JavaScript files. The backend communication is handled via a secure webhook endpoint.

## Documentation
For a detailed technical breakdown of how the system works, please refer to [HEARING_TEST_DOCS.md](./HEARING_TEST_DOCS.md).
