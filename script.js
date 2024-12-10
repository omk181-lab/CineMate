document.getElementById("recommendation-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form submission

    const userId = document.getElementById("user-id").value;
    const movieId = document.getElementById("movie-id").value;

    try {
        // Fetch recommendation from Flask API
        const response = await fetch(`http://127.0.0.1:5000/predict?user_id=${userId}&movie_id=${movieId}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Update the DOM with the prediction result
        const resultDiv = document.getElementById("result");
        resultDiv.style.color = "green"; // Set success color
        resultDiv.textContent = `Predicted rating for user ${data.user_id} on movie ${data.movie_id}: ${data.predicted_rating}`;
    } catch (error) {
        // Handle errors
        const resultDiv = document.getElementById("result");
        resultDiv.style.color = "red";
        resultDiv.textContent = `Error: ${error.message}`;
        console.error("Error fetching recommendation:", error);
    }
});
