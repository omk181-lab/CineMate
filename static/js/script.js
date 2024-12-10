document.getElementById("recommendationForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    const userId = document.getElementById("user_id").value;
    const recommendationsDiv = document.getElementById("recommendations");

    try {
        const response = await fetch(`/recommend?user_id=${userId}`);
        const data = await response.json();

        // Display recommendations
        if (data.error) {
            recommendationsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            recommendationsDiv.innerHTML = "<h2>Recommended Movies:</h2>";
            data.forEach(movie => {
                recommendationsDiv.innerHTML += `
                    <p><strong>${movie.title}</strong> (${movie.avg_rating.toFixed(1)} ⭐)
                    <br>Genres: ${movie.genres}</p>
                `;
            });
        }
    } catch (error) {
        recommendationsDiv.innerHTML = `<p>Error fetching recommendations. Please try again.</p>`;
    }
});
