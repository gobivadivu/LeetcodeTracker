document.addEventListener("DOMContentLoaded", function(){
    let problemList = document.getElementById('problem-list');

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
                window.open(`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/ /g, "-")}/`, "_blank");
            });
            problemList.appendChild(li);
        });
    });
});