// New User Flow
document.getElementById("new-user").addEventListener("click", async function () {
    const response = await fetch("/generate-user-id");
    const data = await response.json();
    const userId = data.userId;

    // Display the generated User ID
    document.getElementById("generatedUserId").innerText = userId;
    document.getElementById("new-user-section").style.display = "block";

    // Save User ID to localStorage for future use
    localStorage.setItem("userId", userId);
});

// Copy User ID
document.getElementById("copy-user-id").addEventListener("click", function () {
    const userId = document.getElementById("generatedUserId").innerText;
    navigator.clipboard.writeText(userId);
    alert("User ID copied to clipboard!");
});

// Existing User Flow
document.getElementById("existing-user").addEventListener("click", function () {
    document.getElementById("existing-user-section").style.display = "block";
});

// Fetch Recommendations for Existing User
document.getElementById("fetch-history").addEventListener("click", async function () {
    const userId = document.getElementById("existingUserId").value;
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
});
