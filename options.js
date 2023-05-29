window.onload = () => {
  // Handle export button click
  document.getElementById("exportButton").addEventListener("click", () => {
    chrome.storage.local.get("prompts", ({ prompts = [] }) => {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(prompts));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "prompts.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  });

  // Handle import file selection
  document
    .getElementById("import-file")
    .addEventListener("change", importPrompts);
};

/// Import prompts
function importPrompts() {
  const fileInput = document.getElementById("import-file");
  const file = fileInput.files[0];
  const feedbackMessage = document.getElementById("feedback-message");

  if (file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const importedPrompts = JSON.parse(event.target.result);

        // Load existing prompts from storage
        chrome.storage.local.get("prompts", ({ prompts = [] }) => {
          // Create a set of existing prompt IDs for quick lookup
          const existingPromptIds = new Set(prompts.map((prompt) => prompt.id));

          // Filter out imported prompts that already exist
          const newPrompts = importedPrompts.filter(
            (prompt) => !existingPromptIds.has(prompt.id)
          );

          // Combine existing prompts with new prompts and save
          const combinedPrompts = [...prompts, ...newPrompts];
          chrome.storage.local.set({ prompts: combinedPrompts }, () => {
            feedbackMessage.textContent = "Prompts imported successfully.";
            feedbackMessage.style.color = "green";
          });
        });
      } catch (error) {
        feedbackMessage.textContent = "Invalid JSON file.";
        feedbackMessage.style.color = "red";
      }
    };

    reader.readAsText(file);
  } else {
    feedbackMessage.textContent = "Please select a file.";
    feedbackMessage.style.color = "red";
  }
}
