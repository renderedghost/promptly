window.onload = () => {
  const titleField = document.getElementById("prompt-title");
  const contentField = document.getElementById("prompt-content");
  const titleError = document.getElementById("title-error");
  const contentError = document.getElementById("content-error");

  // If an id is stored, we are editing a prompt
  chrome.storage.local.get("editId", ({ editId }) => {
    if (editId) {
      chrome.storage.local.get("prompts", ({ prompts = [] }) => {
        const promptToEdit = prompts.find((prompt) => prompt.id === editId);
        titleField.value = promptToEdit.title;
        contentField.value = promptToEdit.content;
      });
    }
  });

  document.getElementById("save-button").addEventListener("click", (event) => {
    event.preventDefault();

    const title = titleField.value.trim();
    const content = contentField.value.trim();

    // Validate inputs
    let isValid = true;

    if (!title) {
      titleError.textContent = "Title cannot be empty.";
      isValid = false;
    } else {
      titleError.textContent = "";
    }

    if (!content) {
      contentError.textContent = "Content cannot be empty.";
      isValid = false;
    } else {
      contentError.textContent = "";
    }

    if (isValid) {
      chrome.storage.local.get(["prompts", "editId"], ({ prompts = [], editId }) => {
        let updatedPrompts;

        if (editId) {
          // Edit existing prompt
          const promptIndex = prompts.findIndex((p) => p.id === editId);
          updatedPrompts = [...prompts];
          updatedPrompts[promptIndex] = {
            ...updatedPrompts[promptIndex],
            title,
            content,
            dateEdited: new Date(),
          };

          // Remove editId from storage
          chrome.storage.local.remove("editId");
        }

        chrome.storage.local.set({ prompts: updatedPrompts }, () => {
          window.close();
        });
      });
    }
  });
};

document.getElementById("cancel-button").addEventListener("click", () => {
  window.close();
});
