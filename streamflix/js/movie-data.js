// Movie data with titles and poster URLs
const movieData = [
  {
    id: 1,
    title: "Stranger Things",
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    match: "97%",
    rating: "TV-14",
    duration: "4 Seasons",
    genres: ["Sci-Fi", "Horror", "Drama"]
  },
  {
    id: 2,
    title: "The Witcher",
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    match: "95%",
    rating: "TV-MA",
    duration: "2 Seasons",
    genres: ["Fantasy", "Action", "Adventure"]
  },
  {
    id: 3,
    title: "Inception",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    match: "91%",
    rating: "PG-13",
    duration: "2h 28m",
    genres: ["Sci-Fi", "Action", "Thriller"]
  },
  {
    id: 4,
    title: "The Queen's Gambit",
    posterUrl: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    match: "98%",
    rating: "TV-MA",
    duration: "Limited Series",
    genres: ["Drama", "History"]
  },
  {
    id: 5,
    title: "Soul",
    posterUrl: "https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
    match: "93%",
    rating: "PG",
    duration: "1h 40m",
    genres: ["Animation", "Family", "Comedy"]
  },
  {
    id: 6,
    title: "The Dark Knight",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    match: "89%",
    rating: "PG-13",
    duration: "2h 32m",
    genres: ["Action", "Crime", "Drama"]
  },
  {
    id: 7,
    title: "Tiger King",
    posterUrl: "https://image.tmdb.org/t/p/w500/pmjYMCnKtNpWNdtJoqRhCkQQXSB.jpg",
    match: "96%",
    rating: "TV-MA",
    duration: "Limited Series",
    genres: ["Documentary", "Crime"]
  },
  {
    id: 8,
    title: "The Lord of the Rings",
    posterUrl: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
    match: "92%",
    rating: "PG-13",
    duration: "2h 58m",
    genres: ["Fantasy", "Adventure"]
  }
];

// Function to update movie posters and titles
function updateMoviePosters() {
  // Get all poster containers
  const posterContainers = document.querySelectorAll('.poster-container');
  
  // Loop through each container and update with real data
  posterContainers.forEach((container, index) => {
    // Use modulo to cycle through our movie data if we have more containers than movies
    const movieIndex = index % movieData.length;
    const movie = movieData[movieIndex];
    
    // Update poster image
    const posterImg = container.querySelector('.row-poster');
    if (posterImg) {
      posterImg.src = movie.posterUrl;
      posterImg.alt = movie.title;
      
      // Add title as data attribute
      posterImg.dataset.title = movie.title;
    }
    
    // Update movie details
    const matchSpan = container.querySelector('.match');
    if (matchSpan) matchSpan.textContent = movie.match + ' Match';
    
    const ratingSpan = container.querySelector('.rating');
    if (ratingSpan) ratingSpan.textContent = movie.rating;
    
    const durationSpan = container.querySelector('.duration');
    if (durationSpan) durationSpan.textContent = movie.duration;
    
    // Update genres
    const genresDiv = container.querySelector('.poster-genres');
    if (genresDiv && movie.genres) {
      genresDiv.innerHTML = movie.genres.map(genre => `<span>${genre}</span>`).join(' • ');
    }
  });
  
  // Update hero title if needed
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Replace with text title for the featured movie
    heroTitle.outerHTML = `<h1 class="hero-title" style="font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">STRANGER THINGS</h1>`;
  }
  
  // Update hero background
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundImage = `url(${movieData[0].posterUrl})`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center top';
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateMoviePosters);