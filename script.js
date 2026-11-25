const languageDropdown = document.getElementById("languageDropdown");
const fetchRepoBtn = document.getElementById("fetchRepoBtn");
const repoDetails = document.getElementById("repoDetails");
const refreshBtn = document.getElementById("refreshBtn");
const statusMessage = document.getElementById("statusMessage");

const repoName = document.getElementById("repoName");
const repoDescription = document.getElementById("repoDescription");
const repoStars = document.getElementById("repoStars");
const repoForks = document.getElementById("repoForks");
const repoIssues = document.getElementById("repoIssues");
const repoLink = document.getElementById("repoLink");

const API_URL = "https://api.github.com/search/repositories";

function populateLanguages() {
    const languages = ["JavaScript", "Python", "Java", "Ruby", "Go"];
    languages.forEach(language => {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        languageDropdown.appendChild(option);
    });
}

async function fetchRandomRepo(language) {
    toggleLoading(true);
    try {
        // Pick a random page (1-10) so results vary more
        const page = Math.floor(Math.random() * 10) + 1;
        const response = await fetch(
            `${API_URL}?q=language:${encodeURIComponent(language)}&sort=stars&per_page=30&page=${page}`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            displayRandomRepo(data.items);
        } else {
            showStatusMessage("No repositories found for this language.", "error");
        }
    } catch (error) {
        showStatusMessage("Error fetching repository. Try again.", "error");
    } finally {
        toggleLoading(false);
    }
}

function displayRandomRepo(repos) {
    const randomRepo = repos[Math.floor(Math.random() * repos.length)];

    repoName.textContent = randomRepo.name;
    repoDescription.textContent = randomRepo.description || "No description available.";
    repoStars.textContent = randomRepo.stargazers_count;
    repoForks.textContent = randomRepo.forks_count;
    repoIssues.textContent = randomRepo.open_issues_count;

    // THE FIX: point the link at the actual repository
    repoLink.href = randomRepo.html_url;

    repoDetails.classList.remove("hidden");
    refreshBtn.classList.remove("hidden");
}

function toggleLoading(isLoading) {
    fetchRepoBtn.disabled = isLoading;
    refreshBtn.disabled = isLoading;
    statusMessage.textContent = isLoading ? "Loading..." : "";
}

function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type === "error" ? "error" : "";
}

fetchRepoBtn.addEventListener("click", () => {
    const selectedLanguage = languageDropdown.value;
    if (selectedLanguage) {
        fetchRandomRepo(selectedLanguage);
    } else {
        showStatusMessage("Please select a language.", "error");
    }
});

refreshBtn.addEventListener("click", () => {
    const selectedLanguage = languageDropdown.value;
    if (selectedLanguage) {
        fetchRandomRepo(selectedLanguage);
    }
});
 
populateLanguages();                                                                                             