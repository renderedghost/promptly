let selectedText = '';

// Listen for right-click events
window.addEventListener('contextmenu', (event) => {
    // Get the selected text, if any
    selectedText = window.getSelection().toString();
});

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'requestSelectedText') {
        // Respond with the selected text
        sendResponse({selectedText: selectedText});
    }
});
