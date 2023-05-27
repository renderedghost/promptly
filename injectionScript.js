chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'usePrompt') {
    document.querySelector('#chat-input').value = request.text; // Replace '#chat-input' with the actual id or class of the ChatGPT input box
  }
});