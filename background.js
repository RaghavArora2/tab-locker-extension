// Function to start locking tabs
function startLockingTabs() {
    console.log('Starting to lock tabs...');
    
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (!tab.url.startsWith('chrome://')) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        func: lockTab
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            console.error(`Error injecting script: ${chrome.runtime.lastError.message}`);
                        } else {
                            console.log(`Successfully locked tab: ${tab.id}`);
                        }
                    }
                );
            } else {
                console.log(`Skipping restricted tab: ${tab.url}`);
            }
        });
    });
}

// Function to lock a tab
function lockTab() {
    document.body.innerHTML = `
        <style>
            body {
                background: #333;
                color: #fff;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                overflow: hidden;
            }
            .lock-screen {
                border-radius: 12px;
                background: #444;
                padding: 20px;
                text-align: center;
            }
            .lock-screen h1 {
                margin: 0;
                font-size: 24px;
            }
            .lock-screen p {
                font-size: 18px;
            }
        </style>
        <div class="lock-screen">
            <h1>Tab Locked</h1>
            <p>Please enter the password in the extension popup to unlock.</p>
        </div>
    `;
    document.title += ' - Locked'; // Append ' - Locked' to the title
}

// Function to unlock a tab
function unlockTab() {
    document.body.innerHTML = ''; // Clear lock screen
    document.title = document.title.replace(' - Locked', ''); // Remove ' - Locked' from title
}

// Add listener for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'unlock') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id },
                        func: unlockTab
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            console.error(`Error injecting script: ${chrome.runtime.lastError.message}`);
                        } else {
                            sendResponse({ success: true });
                        }
                    }
                );
            } else {
                sendResponse({ success: false });
            }
        });
        // Keep the message channel open until `sendResponse` is called
        return true;
    }
});

// Start locking tabs when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    startLockingTabs();
});
