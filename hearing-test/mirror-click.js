//Mirror effect click
document.addEventListener('DOMContentLoaded', function() {
    const triggerButton = document.getElementById('next_ht-6');
    
    if (triggerButton) {
        triggerButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            const targetButton = document.querySelector('.mirror_click');
            if (targetButton) {
                targetButton.click();
            }
        });
    }
});