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
    displayRecommendations(data.recommendations);
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
    displayRecommendations(data.recommendations);
});

function displayRecommendations(recommendations) {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendationsList.innerHTML = recommendations.map(
        group => `
        <h3>Since you liked "${group.likedMovie}" (Rating: ${group.likedRating}):</h3>
        <ul>${group.recommendedMovies.map(movie => `<li>${movie}</li>`).join("")}</ul>`
    ).join("");
}
