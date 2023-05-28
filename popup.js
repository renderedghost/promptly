window.onload = () => {
    // Load prompts from storage
    chrome.storage.local.get("prompts", ({ prompts = [] }) => {
        const promptList = document.getElementById("prompt-list");

        // Clear list
        promptList.innerHTML = "";

        prompts.forEach((prompt) => {
            const promptElement = createPromptElement(prompt);
            promptList.appendChild(promptElement);
        });
    });

    // Add a click event to the create button
    document.getElementById("create-button").addEventListener("click", () => {
        chrome.tabs.create({ url: "createPrompt.html" });
    });
};

// Helper function to create a prompt element
function createPromptElement(prompt) {
  const li = document.createElement("li");

  const title = document.createElement("p");
  title.textContent = prompt.title;

  const preview = document.createElement("p");
  preview.textContent = prompt.content;
  preview.style.whiteSpace = "nowrap";
  preview.style.overflow = "hidden";
  preview.style.textOverflow = "ellipsis";

  const useButton = document.createElement("button");
  useButton.textContent = "Use";
  useButton.classList.add("small");
  useButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.url.startsWith("https://chat.openai.com")) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: "usePrompt",
          text: prompt.content,
        });
      }
    });
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("small");
  editButton.addEventListener("click", () => {
    // Save the ID of the prompt being edited
    chrome.storage.local.set({ editId: prompt.id }, () => {
      chrome.tabs.create({ url: "editPrompt.html" });
    });
  });

  li.appendChild(title);
  li.appendChild(preview);
  li.appendChild(useButton);
  li.appendChild(editButton);

  return li;
}