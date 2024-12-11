// Handle Proceed Button for New User
document.getElementById("proceed-new-user").addEventListener("click", function () {
    const userId = document.getElementById("generatedUserId").innerText;
    if (userId) {
        alert(`User ID ${userId} has been created. You can now use this ID for future recommendations.`);
        document.getElementById("recommendations").innerHTML = "<p>Start by rating movies or selecting genres.</p>";
    } else {
        alert("No User ID found. Please generate a User ID first.");
    }
});

// Handle Fetch Recommendations for Existing User
document.getElementById("fetch-history").addEventListener("click", async function () {
    const userId = document.getElementById("existingUserId").value;
    if (!userId) {
        alert("Please enter a valid User ID.");
        return;
    }

    try {
        const response = await fetch(`/fetch-history/${userId}`);
        const data = await response.json();
        const recommendationsDiv = document.getElementById("recommendations");

        if (data.recommendations.length > 0) {
            recommendationsDiv.innerHTML = "<h3>Your Past Recommendations:</h3><ul>" +
                data.recommendations.map(movie => `<li>${movie}</li>`).join("") +
                "</ul>";
        } else {
            recommendationsDiv.innerHTML = "<p>No recommendations found for this User ID.</p>";
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        alert("An error occurred while fetching recommendations. Please try again.");
    }
});
