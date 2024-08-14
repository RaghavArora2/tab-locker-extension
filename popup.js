document.getElementById('unlock-btn').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    chrome.runtime.sendMessage({ action: 'unlock', password: password }, (response) => {
        if (response.success) {
            alert('Tab unlocked successfully');
            window.close();
        } else {
            alert(response.error || 'Failed to unlock tab');
        }
    });
});
