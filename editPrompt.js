window.onload = () => {
    const titleField = document.getElementById('prompt-title');
    const contentField = document.getElementById('prompt-content');

    // If an id is stored, we are editing a prompt
    chrome.storage.local.get('editId', ({editId}) => {
        if (editId) {
            chrome.storage.local.get('prompts', ({prompts = []}) => { // Ensure that prompts is an array
                const promptToEdit = prompts.find(prompt => prompt.id === editId);
                titleField.value = promptToEdit.title;
                contentField.value = promptToEdit.content;
            });
        }
    });
};

document.getElementById('save-button').addEventListener('click', () => {
    const title = titleField.value.trim();
    const content = contentField.value.trim();

    if (title && content) {
        chrome.storage.local.get(['prompts', 'editId'], ({prompts = [], editId}) => {
            let updatedPrompts;

            if (editId) {
                // Edit existing prompt
                const promptIndex = prompts.findIndex(p => p.id === editId);
                updatedPrompts = [...prompts];
                updatedPrompts[promptIndex] = {...updatedPrompts[promptIndex], title, content, dateEdited: new Date()};

                // Remove editId from storage
                chrome.storage.local.remove('editId');
            }

            chrome.storage.local.set({prompts: updatedPrompts}, () => {
                window.close();
            });
        });
    }
});
