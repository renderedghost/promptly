window.onload = () => {
    const titleField = document.getElementById('prompt-title');
    const contentField = document.getElementById('prompt-content');

    // Clear the fields
    titleField.value = '';
    contentField.value = '';

    // Set focus on the title field
    titleField.focus();

    // Retrieve the selected text from storage and fill it into the content field
    chrome.storage.local.get('selectedText', ({selectedText}) => {
        if (selectedText) {
            contentField.value = selectedText;
        }
    });

    // Add an event listener to the save button
    document.getElementById('save-button').addEventListener('click', () => {
        const title = titleField.value.trim();
        const content = contentField.value.trim();

        if (title && content) {
            // Save the prompt
            chrome.storage.local.get('prompts', ({prompts = []}) => {
                const newPrompt = {
                    id: new Date().getTime(),
                    title: title,
                    content: content,
                    dateEdited: new Date()
                };
                prompts.push(newPrompt);
                chrome.storage.local.set({prompts: prompts}, () => {
                    // Close the window
                    window.close();
                });
            });
        }
    });
};