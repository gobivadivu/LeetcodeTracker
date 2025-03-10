function getProblemDetails() {
    // Ensure the script only runs on problem pages (not the problem list page)
    if (!window.location.pathname.startsWith("/problems/")) {
        console.warn("Not on a problem page, skipping.");
        return;
    }

    // Selecting the problem title (specific to problem page)
    let titleElement = document.querySelector("a.truncate.cursor-text.whitespace-normal");
    
    // Selecting the problem difficulty
    let difficultyElement = document.querySelector("div.text-difficulty-easy, div.text-difficulty-medium, div.text-difficulty-hard");

    if (titleElement && difficultyElement) {
        let problem = {
            title: titleElement.textContent.trim(),
            difficulty: difficultyElement.textContent.trim(),
            timestamp: new Date().toLocaleString(),
            url: window.location.href//store URL and later retrieve
        };

        chrome.storage.sync.get("problems", function (data) {
            let problems = data.problems || [];
        
            // Find the index of the problem if it already exists
            let existingIndex = problems.findIndex(p => p.title === problem.title);
        
            if (existingIndex !== -1) {
                // Remove the existing problem from its old position
                problems.splice(existingIndex, 1);
            }
        
            // Add the problem at the top
            problems.unshift(problem);
        
            // Keep only the last 5 problems
            if (problems.length > 5) problems.pop();
        
            // Save the updated list
            chrome.storage.sync.set({ problems: problems }, function () {
                console.log("Problem stored:", problem);
            });
        });
        
        
    } else {
        console.warn("Could not find problem details on this page.");
    }
}

// Run function on page load
getProblemDetails();

// Observe for changes in the page structure (for dynamic loading issues)
const observer = new MutationObserver(() => {
    getProblemDetails();
});
observer.observe(document.body, { childList: true, subtree: true });

console.log("content.js running");
