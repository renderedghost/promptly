let selectedText = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'textSelection') {
        selectedText = request.text;
    }
});

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        if (msg.request === 'getSelectedText') {
            port.postMessage({selectedText: selectedText});
        }
    });
});
