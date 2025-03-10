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
            timestamp: new Date().toLocaleString()
        };

        chrome.storage.sync.get("problems", function(data) {
            let problems = data.problems || [];

             //  Check if the problem is already in the list
            let isDuplicate = problems.some(p => p.title === problem.title);

            // Store only if it's a new problem
            if (!isDuplicate) {
                problems.unshift(problem);
                if (problems.length > 5) problems.pop(); // Keep only the last 5 problems

                chrome.storage.sync.set({ problems: problems }, function() {
                    console.log("Problem stored:", problem);
                });
            }
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
