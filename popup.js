let port = chrome.runtime.connect({name: "chatGpt"});

// request selected text when popup is opened
port.postMessage({request: 'getSelectedText'});

port.onMessage.addListener(function(msg) {
    if (msg.selectedText) {
        document.getElementById('prompt-content').value = msg.selectedText;
    }
});

document.getElementById('save-button').addEventListener('click', () => {
    const title = document.getElementById('prompt-title').value;
    const content = document.getElementById('prompt-content').value;

    if (title && content) {let port = chrome.runtime.connect({name: "chatGpt"});

port.postMessage({request: 'getSelectedText'});

port.onMessage.addListener(function(msg) {
    if (msg.selectedText) {
        document.getElementById('prompt-content').value = msg.selectedText;
    }
});

document.getElementById('save-button').addEventListener('click', () => {
    const title = document.getElementById('prompt-title').value.trim();
    const content = document.getElementById('prompt-content').value.trim();

    if (title && content) {
        chrome.storage.local.get('prompts', ({prompts}) => {
            const newPrompt = {
                id: new Date().getTime(),
                title: title,
                content: content,
                dateEdited: new Date()
            };

            prompts = prompts ? [...prompts, newPrompt] : [newPrompt];

            chrome.storage.local.set({prompts}, () => {
                window.location.reload();
            });
        });
    }
});

document.getElementById('download-button').addEventListener('click', () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(prompts)], {type: 'application/json'}));
            a.download = 'my-saved-chatgpt-prompts.json';
            a.click();
        }
    });
});

window.onload = () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const promptsList = document.getElementById('prompts-list');
            prompts.forEach(prompt => {
                promptsList.appendChild(createPromptElement(prompt));
            });
        }
    });
};

function createPromptElement(prompt) {
    const promptElement = document.createElement('div');

    const title = document.createElement('p');
    title.textContent = prompt.title;

    const content = document.createElement('p');
    content.textContent = prompt.content;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        // code to edit prompt
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this prompt?')) {
            // code to delete prompt
        }
    });

    promptElement.appendChild(title);
    promptElement.appendChild(content);
    promptElement.appendChild(editButton);
    promptElement.appendChild(deleteButton);

    return promptElement;
}

        chrome.storage.local.get('prompts', ({prompts}) => {
            const newPrompt = {
                id: new Date().getTime(),
                title: title,
                content: content,
                dateEdited: new Date()
            };

            prompts = prompts ? [...prompts, newPrompt] : [newPrompt];

            chrome.storage.local.set({prompts}, () => {
                window.location.reload();
            });
        });
    }
});

document.getElementById('download-button').addEventListener('click', () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(prompts)], {type: 'application/json'}));
            a.download = 'my-saved-chatgpt-prompts.json';
            a.click();
        }
    });
});

window.onload = () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const promptsList = document.getElementById('prompts-list');
            prompts.forEach(prompt => {
                promptsList.appendChild(createPromptElement(prompt));
            });
        }
    });
};

// helper function to create a prompt element
function createPromptElement(prompt) {
    const promptElement = document.createElement('div');

    const title = document.createElement('p');
    title.textContent = prompt.title;

    const content = document.createElement('p');
    content.textContent = prompt.content;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        document.getElementById('prompt-title').value = prompt.title;
        document.getElementById('prompt-content').value = prompt.content;

        // Save the ID of the prompt being edited
        document.getElementById('new-prompt').dataset.editing = prompt.id;
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this prompt?')) {
            chrome.storage.local.get('prompts', ({prompts}) => {
                const updatedPrompts = prompts.filter(p => p.id !== prompt.id);

                chrome.storage.local.set({prompts: updatedPrompts}, () => {
                    window.location.reload();
                });
            });
        }
    });

    promptElement.appendChild(title);
    promptElement.appendChild(content);
    promptElement.appendChild(editButton);
    promptElement.appendChild(deleteButton);

    return promptElement;
}

// load prompts when popup opens
window.onload = () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const promptsList = document.getElementById('prompts-list');
            prompts.forEach(prompt => {
                promptsList.appendChild(createPromptElement(prompt));
            });
        }
    });
};

document.getElementById('save-button').addEventListener('click', () => {
    const title = document.getElementById('prompt-title').value.trim();
    const content = document.getElementById('prompt-content').value.trim();

    if (title && content) {
        chrome.storage.local.get('prompts', ({prompts}) => {
            const editingId = document.getElementById('new-prompt').dataset.editing;
            let updatedPrompts = prompts;

            if (editingId) {
                // Edit existing prompt
                const promptIndex = prompts.findIndex(p => p.id === Number(editingId));
                updatedPrompts[promptIndex].title = title;
                updatedPrompts[promptIndex].content = content;
                updatedPrompts[promptIndex].dateEdited = new Date();

                // Clear the data attribute
                delete document.getElementById('new-prompt').dataset.editing;
            } else {
                // Create new prompt
                const newPrompt = {
                    id: new Date().getTime(),
                    title: title,
                    content: content,
                    dateEdited: new Date()
                };

                updatedPrompts = prompts ? [...prompts, newPrompt] : [newPrompt];
            }

            chrome.storage.local.set({prompts: updatedPrompts}, () => {
                window.location.reload();
            });
        });
    }
});

document.getElementById('download-button').addEventListener('click', () => {
    chrome.storage.local.get('prompts', ({prompts}) => {
        if (prompts) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(prompts)], {type: 'application/json'}));
            a.download = 'my-saved-chatgpt-prompts.json';
            a.click();
        }
    });
});
