document.addEventListener("DOMContentLoaded", () => {
    const recommendationsContainer = document.getElementById("recommendationsContainer");
    const preferencesForm = document.getElementById("preferencesForm");

    // Mock Data for Recommendations (You can replace this with real data from the backend)
    const movies = [
        {
            title: "Inception",
            genre: "Sci-Fi",
            poster: "https://posters.movieposterdb.com/10_06/2010/1375666/l_1375666_07030c72.jpg",
            rating: 4.7,
            releaseYear: 2010,
            language: "English"
        },
        {
            title: "Titanic",
            genre: "Romance",
            poster: "https://posters.movieposterdb.com/12_06/1997/120338/l_120338_80e415d1.jpg",
            rating: 4.8,
            releaseYear: 1997,
            language: "English"
        },
        {
            title: "The Dark Knight",
            genre: "Action",
            poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            rating: 4.9,
            releaseYear: 2008,
            language: "English"
        },
        {
            title: "Parasite",
            genre: "Thriller",
            poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            rating: 4.6,
            releaseYear: 2019,
            language: "Korean"
        }
    ];

    // Function to display movies
    const displayMovies = (filteredMovies) => {
        recommendationsContainer.innerHTML = "";
        filteredMovies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.className = "movie-card";
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Rating: ${movie.rating}</p>
                <p>Year: ${movie.releaseYear}</p>
                <p>Language: ${movie.language}</p>
            `;
            recommendationsContainer.appendChild(movieCard);
        });
    };

    // Handle form submission and filter movies
    preferencesForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get preferences from form inputs
        const selectedGenres = Array.from(document.getElementById("genres").selectedOptions).map(option => option.value);
        const minRating = parseFloat(document.getElementById("minRating").value) || 0;
        const maxRating = parseFloat(document.getElementById("maxRating").value) || 5;

        // Filter movies based on preferences
        const filteredMovies = movies.filter(movie => {
            const matchesGenre = selectedGenres.length ? selectedGenres.includes(movie.genre) : true;
            const matchesRating = movie.rating >= minRating && movie.rating <= maxRating;
            return matchesGenre && matchesRating;
        });

        // Display filtered movies
        displayMovies(filteredMovies);
    });

    // Initial Display
    displayMovies(movies);
});
