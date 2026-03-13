# Nagish Webflow Scripts

This repository contains the custom JavaScript code for the Nagish website, including the interactive hearing test and various animations. The code has been organized into a monorepo structure for easier maintenance and future development.

This document provides an overview of the repository structure and instructions on how to integrate the scripts into a Webflow project.

## Repository Structure

The repository is organized as follows:

```
Nagish/
├── hearing-test/         # Scripts for the interactive hearing test
├── live-transcribe/      # Scripts for animations on the live-transcribe page
├── shared/               # Scripts used across multiple pages
└── docs/                 # Additional documentation
```

## Scripts & Usage

To use these scripts in your Webflow project, you need to host them and replace the old `slater.app` URLs in your custom code settings. A recommended way to do this is by using a CDN that serves raw files from GitHub, such as [jsDelivr](https://www.jsdelivr.com/).

Once this repository is public on GitHub at `github.com/<your-username>/Nagish`, the files can be accessed via jsDelivr URLs.

### Hearing Test

Located in the `hearing-test/` directory.

*   `hearing-test.js`: The core logic for the hearing test, including audio playback, volume control, and result calculation.
*   `inline-scripts.js`: Additional scripts for managing the card-based UI, handling user interactions, and other minor functionalities.

**Integration:**

1.  Add the following scripts to your Webflow project's custom code section (before the closing `</body>` tag):

    ```html
    <!-- Replace <your-username> with the actual GitHub username -->
    <script src="https://cdn.jsdelivr.net/gh/<your-username>/Nagish/hearing-test/hearing-test.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/<your-username>/Nagish/hearing-test/inline-scripts.js"></script>
    ```

2.  Remove the old script tags that point to `slater.app/3728/26937.js`.

### Live Transcribe Animations

Located in the `live-transcribe/` directory.

*   `gsap-drawsvg-inline.js`: An inline version of the GSAP DrawSVG plugin used for SVG animations.
*   `bar-animation.js`: The custom script for the bar animation that triggers on scroll.

**Integration:**

1.  Ensure you have GSAP loaded in your project. If not, add it:
    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    ```
2.  Add the animation scripts:
    ```html
    <script src="https://cdn.jsdelivr.net/gh/<your-username>/Nagish/live-transcribe/gsap-drawsvg-inline.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/<your-username>/Nagish/live-transcribe/bar-animation.js"></script>
    ```

### Shared Scripts

Located in the `shared/` directory.

*   `appsflyer.js`: A third-party script for marketing attribution. This was previously loaded from `slater.app/4870/8766.js`.

**Integration:**

1.  Replace the old Slater script with the new one:
    ```html
    <script src="https://cdn.jsdelivr.net/gh/<your-username>/Nagish/shared/appsflyer.js"></script>
    ```

## How It Was Built

The scripts were originally hosted on Slater.app and embedded in the Nagish Webflow project. Due to maintenance issues (as mentioned in the Slack conversation), the scripts have been:

1.  Extracted from the live website (`nagish.com`).
2.  Analyzed and identified.
3.  Organized into this repository.

This approach ensures that the code is version-controlled, easier to manage, and not dependent on a third-party service that may go down.
