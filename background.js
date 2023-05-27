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