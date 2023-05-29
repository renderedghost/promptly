window.onload = () => {
  const searchBox = document.getElementById("search-box");

  // Load prompts from storage
  const loadPrompts = () => {
    chrome.storage.local.get("prompts", ({ prompts = [] }) => {
      const promptList = document.getElementById("prompt-list");

      // Clear list
      promptList.innerHTML = "";

      // Filter prompts based on search query
      const searchQuery = searchBox.value.toLowerCase();
      const filteredPrompts = prompts.filter((prompt) =>
      prompt.title.toLowerCase().includes(searchQuery)
      );

      filteredPrompts.forEach((prompt) => {
        const promptElement = createPromptElement(prompt);
        promptList.appendChild(promptElement);
      });
    });
  };

  // Initial load of prompts
  loadPrompts();

  // Add a click event to the create button
  document.getElementById("create-button").addEventListener("click", () => {
    chrome.tabs.create({ url: "createPrompt.html" });
  });

  // Add an input event to the search box to reload prompts when the search query changes
  searchBox.addEventListener("input", loadPrompts);
};

// Helper function to create a prompt element
function createPromptElement(prompt) {
  const li = document.createElement("li");
  li.className = "prompt-item";

  const promptGroup = document.createElement("div");
  promptGroup.className = "prompt-group";

  const title = document.createElement("p");
  title.textContent = prompt.title;
  title.className = "prompt-title";

  const preview = document.createElement("p");
  preview.textContent = prompt.content;
  preview.className = "prompt-content";

  promptGroup.appendChild(title);
  promptGroup.appendChild(preview);

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

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

buttonGroup.appendChild(editButton);
buttonGroup.appendChild(useButton);

li.appendChild(promptGroup);
li.appendChild(buttonGroup);

return li;
}
