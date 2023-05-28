chrome.contextMenus.create({
    id: "saveAsPrompt",
    title: 'Save as Prompt',
    contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveAsPrompt") {
        // Set the selected text in storage
        chrome.storage.local.set({selectedText: info.selectionText}, () => {
            // Open a new tab with the prompt creation page
            chrome.tabs.create({url: 'createPrompt.html'});
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "usePrompt") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  } else if (request.text === "requestSelectedText") {
    chrome.storage.local.get("selectedText", function (data) {
      sendResponse({ selectedText: data.selectedText });
    });

    // Indicate that the response function will be called asynchronously
    return true;
  }
});
