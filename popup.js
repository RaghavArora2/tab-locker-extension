document.getElementById('unlock-btn').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    // Send the unlock message with password to background.js
    chrome.runtime.sendMessage({ action: 'unlock', password: password }, (response) => {
        if (response.success) {
            alert('Tab unlocked successfully');
            window.close(); // Close the popup
        } else {
            alert(response.error || 'Failed to unlock tab');
        }
    });
});
