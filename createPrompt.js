window.onload = () => {
  const titleField = document.getElementById("prompt-title");
  const contentField = document.getElementById("prompt-content");
  const titleError = document.getElementById("title-error");
  const contentError = document.getElementById("content-error");

  // Clear the fields
  titleField.value = "";
  contentField.value = "";

  // Set focus on the title field
  titleField.focus();

  // Request the selected text
  chrome.runtime.sendMessage({ text: "requestSelectedText" }, (response) => {
    if (chrome.runtime.lastError) {
      // Handle error here
      console.log(chrome.runtime.lastError);
    } else if (response && response.selectedText) {
      // If there is selected text and the content field is empty, fill it with the selected text
      if (!contentField.value) {
        contentField.value = response.selectedText;
      }
    }
  });

  // Add an event listener to the save button
document.getElementById('save-button').addEventListener('click', (event) => {
    event.preventDefault();
    const title = titleField.value.trim();
    const content = contentField.value.trim();

    // Validate inputs
    let isValid = true;

    if (!title) {
        titleError.textContent = 'Title cannot be empty.';
        isValid = false;
    } else {
        titleError.textContent = '';
    }

    if (!content) {
        contentError.textContent = 'Content cannot be empty.';
        isValid = false;
    } else {
        contentError.textContent = '';
    }

    if (isValid) {
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
}

document.getElementById("cancel-button").addEventListener("click", () => {
  window.close();
});