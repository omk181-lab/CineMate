document.getElementById("rating-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = document.getElementById("userId").value;
    const movieRatings = Array.from(document.querySelectorAll(".rating"))
        .filter(select => select.value) // Only include rated movies
        .map(select => `${select.dataset.movieId}:${select.value}`)
        .join(",");

    const response = await fetch("/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, movieRatings }),
    });

    const data = await response.json();
    const recommendationsDiv = document.getElementById("recommendations");

    if (data.recommendations) {
        recommendationsDiv.innerHTML = "<h3>Recommendations:</h3><ul>" +
            data.recommendations.map(movie => `<li>${movie}</li>`).join("") +
            "</ul>";
    } else {
        recommendationsDiv.innerHTML = "<p>No recommendations available.</p>";
    }
});
