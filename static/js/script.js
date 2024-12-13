document.getElementById("rating-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const ratings = Array.from(document.querySelectorAll(".rating"))
        .filter(rating => rating.value)
        .map(rating => ({ movieId: rating.dataset.movieId, rating: rating.value }));

    const response = await fetch("/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratings }),
    });

    const data = await response.json();
    displayRatingRecommendations(data.recommendations);
});

document.getElementById("preferences-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const genres = Array.from(document.querySelectorAll("input[name='genre']:checked"))
        .map(checkbox => checkbox.value);
    const yearMin = document.getElementById("year-min").value;
    const yearMax = document.getElementById("year-max").value;
    const ratingMin = document.getElementById("rating-min").value;
    const ratingMax = document.getElementById("rating-max").value;

    const response = await fetch("/recommend-genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genres, yearMin, yearMax, ratingMin, ratingMax }),
    });

    const data = await response.json();
    displayGenreRecommendations(data.recommendations);
});

function displayRatingRecommendations(recommendations) {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendationsList.innerHTML = recommendations.length
        ? recommendations.map(rec => `
            <div>
                <h3>Since you liked "${rec.likedMovie}" (Rating: ${rec.likedRating}):</h3>
                <ul>
                    ${rec.recommendedMovies.map(movie => `<li>${movie}</li>`).join("")}
                </ul>
            </div>
        `).join("")
        : "<p>No recommendations found based on your ratings.</p>";
}

function displayGenreRecommendations(recommendations) {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendationsList.innerHTML = recommendations.length
        ? recommendations.map(movie => `
            <div>
                <strong>${movie.title}</strong><br>
                <em>Genre:</em> ${movie.genres}<br>
                <em>Year:</em> ${movie.release_year}<br>
                <em>Rating:</em> ${movie.rating}
            </div>
        `).join("<hr>")
        : "<p>No recommendations found based on your preferences.</p>";
}
