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

	const promptLink = document.createElement("a");
	promptLink.className = "prompt-link";
	promptLink.href = "#";
	promptLink.addEventListener("click", () => {
		usePrompt(prompt.content);
	});

	const title = document.createElement("p");
	title.className = "prompt-title";
	title.textContent = prompt.title;

	const preview = document.createElement("p");
	preview.className = "prompt-content";
	preview.textContent = prompt.content;

	const buttonGroup = document.createElement("div");
	buttonGroup.className = "button-group";

	const editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.className = "small";
	editButton.addEventListener("click", () => {
		// Save the ID of the prompt being edited
		chrome.storage.local.set({ editId: prompt.id }, () => {
			chrome.tabs.create({ url: "editPrompt.html" });
		});
	});

	promptLink.appendChild(title);
	promptGroup.appendChild(promptLink);
	promptGroup.appendChild(preview);
	li.appendChild(promptGroup);
	buttonGroup.appendChild(editButton);
	li.appendChild(buttonGroup);

	return li;
}

// Function to send the prompt content to the active tab
function usePrompt(content) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const activeTab = tabs[0];
		if (activeTab.url.startsWith("https://chat.openai.com")) {
		chrome.tabs.sendMessage(activeTab.id, {
			action: "usePrompt",
			text: content,
		});
	}
});
}