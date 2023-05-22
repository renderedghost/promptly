// This function sends the selected text to the popup script
function sendSelectionToPopup() {
    let selectedText = window.getSelection().toString();
    if (selectedText) {
        chrome.runtime.sendMessage({ type: "textSelection", text: selectedText });
    }
}

// Listening for a message from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getSelectedText") {
        sendSelectionToPopup();
    }
});