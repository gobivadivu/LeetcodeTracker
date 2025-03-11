document.addEventListener("DOMContentLoaded", function(){
    let problemList = document.getElementById('problem-list');
    let clearButton = document.getElementById('clear-history');

    chrome.storage.sync.get("problems", function(data){
        console.log("Stored PRoblems:", data.problems);
        
        let problems = data.problems || [];

        if (problems.length === 0) {
            problemList.innerHTML = "<p>No problems found.</p>";
            return;
        }

        problemList.innerHTML = "";

        problems.forEach((problem)=>{
            let li = document.createElement("li");
            li.textContent = `${problem.title} (${problem.difficulty})`;

            li.addEventListener("click", function () {
                alert(`Opening: ${problem.title}`);
                window.open(problem.url, "_blank");
            });
            problemList.appendChild(li);
        });
    });

    clearButton.addEventListener("click", function() {
        chrome.storage.sync.set({problems: []}, function() {
            problemList.innerHTML = "<p> No problems found. </p>";
            console.log("History cleared");
        })
    })
});