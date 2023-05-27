chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "usePrompt") {
    document.querySelector("#prompt-textarea").value = request.text;
  }
});