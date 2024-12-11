document.getElementById("preferences-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const movieRatings = Array.from(document.querySelectorAll(".rating"))
        .filter(select => select.value)
        .map(select => `${select.dataset.movieId}:${select.value}`)
        .join(",");

    const response = await fetch("/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieRatings }),
    });

    const data = await response.json();
    displayRecommendations(data.recommendations);
});

function displayRecommendations(recommendations) {
    const movieGrid = document.getElementById("movie-grid");
    movieGrid.innerHTML = "";

    recommendations.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
            <img src="${movie.poster_url}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Genre: ${movie.genres}</p>
            <p>Rating: ${movie.rating}</p>
            <p>Year: ${movie.release_year}</p>
            <p>Language: ${movie.language}</p>
        `;

        movieGrid.appendChild(movieCard);
    });
}
