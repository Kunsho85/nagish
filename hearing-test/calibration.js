document.addEventListener("DOMContentLoaded", function () {
    const calibrationButton = document.querySelector('[sk-target="calibration-button"]');
    const nextButton = document.querySelector('[sk="go"]');
    const audioPlayer = document.getElementById("audioPlayer");
    
    if (!calibrationButton || !nextButton || !audioPlayer) return;

    calibrationButton.addEventListener("click", function () {
        // Simulate activating the 'go' button
        nextButton.classList.remove("inactive");
    });
    
    nextButton.addEventListener("click", function () {
        // Check if audio is playing before transitioning to next step
        if (!audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0; // Reset audio
        }
    });
});