let currentPage = 1;
let totalPages = 3;
let movies = [];

async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

function isMovieFavorite(movieId) {
    return localStorage.getItem(movieId) !== null;
}

function renderMovies(movieData) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';
    movieData.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        const title = movie.title || 'movie-title';
        const voteCount = movie.vote_count || 'vote-count';
        const voteAverage = movie.vote_average || 'vote-average';
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://via.placeholder.com/150';
        movieCard.innerHTML = `
      <img src="${posterPath}" alt="${title}">
      <h3>${title}</h3>
      <p>Vote Count: ${voteCount}</p>
      <p>Vote Average: ${voteAverage}</p>
      <button onclick="toggleFavorite(${movie.id})" ${isMovieFavorite(movie.id) ? 'class="favorite"' : ''}>${isMovieFavorite(movie.id) ? 'Remove' : 'Save'}</button>
    `;
        movieList.appendChild(movieCard);
    });
}

async function movief() {
    const res = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US')
    const data = res.json();
    console.log("data", data)
    return data;
}

async function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value;
    console.log(searchTerm);
    if (!searchTerm) {
        return alert('Please enter a search term.');
    }

    const moviess = await movief();
    console.log(" mk", moviess)
    const mov = moviess.results.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log(mov)
    renderMovies(mov);
}

function sortMoviesByDate() {
    movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    renderMovies(movies);
}

function sortMoviesByRating() {
    movies.sort((a, b) => a.vote_average - b.vote_average);
    renderMovies(movies);
}

function showAllMovies() {
    renderMovies(movies);
}

function showFavoriteMovies() {
    const favoriteMovies = movies.filter(movie => localStorage.getItem(movie.id));
    renderMovies(favoriteMovies);
}

function toggleFavorite(movieId) {
    if (localStorage.getItem(movieId)) {
        localStorage.removeItem(movieId);
    } else {
        localStorage.setItem(movieId, true);
    }
    // Re-render movies to reflect changes in favorites
    renderMovies(movies);
}

function updatePaginationButtons() {
    const prevButton = document.querySelector('.pagination button:first-child');
    const nextButton = document.querySelector('.pagination button:last-child');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    document.getElementById('currentPage').textContent = `Current Page: ${currentPage}`;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchAndRenderMovies();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchAndRenderMovies();
    }
}

async function fetchAndRenderMovies() {
    const movieData = await fetchMovies(currentPage);
    renderMovies(movieData);
    updatePaginationButtons();
}

// Initial setup
fetchAndRenderMovies();

