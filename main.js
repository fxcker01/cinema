const searchForm = document.getElementById('searchForm');
const moreButton = document.getElementById('moreButton');
const loadingIcon = document.getElementById('loadingIcon');
const moviesContainer = document.getElementById('moviesContainer');

searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
});


moreButton.addEventListener('click', function() {
  moreButton.style.display = 'none'; 
  loadingIcon.classList.add('show');
  loadingIcon.classList.remove('show'); 
  moreButton.style.display = 'block'; 
});


class MovieService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  
  async search(title, movie, page) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apiKey}&s=${title}&t=${movie}&page=${page}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apiKey}&i=${movieId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  }
}

class DOMUtils {
  constructor(movieService) {
    this.movieService = movieService;
    this.searchForm = document.getElementById('searchForm');
    this.titleInput = document.getElementById('titleInput');
    this.movieInput = document.getElementById('movieInput');
    this.moviesContainer = document.getElementById('moviesContainer');
    this.moreButton = document.getElementById('moreButton');
    this.loadingIcon = document.getElementById('loadingIcon');
    this.page = 1;
    this.moviesPerPage = 5;
    this.lastSearchKey = 'lastSearch';

    this.restoreLastSearch();

    this.searchForm.addEventListener('submit', this.handleSearch.bind(this));
    this.moreButton.addEventListener('click', this.loadMoreMovies.bind(this));

    
    
  }

  handleSearch(event) {
    event.preventDefault();
    this.clearMoviesContainer();
    this.showLoadingIcon();

    const title = this.titleInput.value;
    const movie = this.movieInput.value;

    if (!this.validateInput(title, movie)) {
      this.hideLoadingIcon();
      return;
    }
    this.movieService.search(title, movie)
    .then(movies => {
      this.displayMovies(movies);
      this.hideLoadingIcon();
    })
    .catch(error => {
      console.error('Movie search error:', error);
      this.hideLoadingIcon();
    });
}
async loadMoreMovies() {
  this.page++;
  this.showLoadingIcon();
  this.disableMoreButton();

  const title = this.titleInput.value;
  const movie = this.movieInput.value;

  if (!this.validateInput(title, movie)) {
    this.hideLoadingIcon();
    this.enableMoreButton();
    return;
  }

  this.movieService.loadMoreMovies(title, movie, this.page)
    .then(movies => {
      this.displayMovies(movies);
      this.hideLoadingIcon();
      this.enableMoreButton();
    })
    .catch(error => {
      console.error('Movie download error:', error);
      this.hideLoadingIcon();
      this.enableMoreButton();
    });
}





showLoadingIcon() {
  const loadingIcon = document.createElement('img');
  loadingIcon.src = 'img/gifload.gif';
  loadingIcon.alt = 'Loading...';
  loadingIcon.className = 'loading-icon';

  const loadMoreButton = document.getElementById('loadMoreButton');
  loadMoreButton.parentNode.insertBefore(loadingIcon, loadMoreButton);
}

hideLoadingIcon() {
  const loadingIcon = document.querySelector('.loading-icon');
  if (loadingIcon) {
    loadingIcon.remove();
  }
}

disableMoreButton() {
  const loadMoreButton = document.getElementById('loadMoreButton');
  loadMoreButton.disabled = true;
}

enableMoreButton() {
  const loadMoreButton = document.getElementById('loadMoreButton');
  loadMoreButton.disabled = false;
}

async handleSearch(event) {
  event.preventDefault();
  this.clearMoviesContainer();
  this.showLoadingIcon();

  const title = this.titleInput.value;
  const movie = this.movieInput.value;

  try {
    const movies = await this.movieService.search(title, movie, this.page);
    this.saveLastSearch(title, movie);
    this.renderMovies(movies.Search.slice(0, this.moviesPerPage)); 
  } catch (error) {
    console.error('Error searching movies:', error);
  }

  this.hideLoadingIcon();
}

  async loadMoreMovies() {
    this.page++;
    this.showLoadingIcon();
    this.disableMoreButton();

    const title = this.titleInput.value;
    const movie = this.movieInput.value;

    try {
      const movies = await this.movieService.search(title, movie, this.page);
      this.renderMovies(movies.Search.slice(0, this.moviesPerPage)); 
    } catch (error) {
      console.error('Error loading more movies:', error);
    }

    this.hideLoadingIcon();
    this.enableMoreButton();
  }


  renderMovies(movies) {
    const movieRows = Math.ceil(movies.length / 5); 
  
    for (let i = 0; i < movieRows; i++) {
      const movieRow = document.createElement('div');
      movieRow.className = 'movie-row';
  
      for (let j = i * 5; j < (i + 1) * 5 && j < movies.length; j++) {
        const movie = movies[j];
  
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
  
        const movieImage = document.createElement('img');
        movieImage.src = movie.Poster;
        movieImage.alt = movie.Title;
        movieElement.appendChild(movieImage);
  
        const movieTitle = document.createElement('p');
        movieTitle.textContent = movie.Title;
        movieElement.appendChild(movieTitle);
  
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.className = 'details-button';
        movieElement.appendChild(detailsButton);
  
        detailsButton.addEventListener('click', () => this.showMovieDetails(movie.imdbID));
  
        movieRow.appendChild(movieElement);
      }
  
      this.moviesContainer.appendChild(movieRow);
    }
  
    if (movies.length < this.moviesPerPage) {
      this.disableMoreButton();
    } else {
      this.enableMoreButton();
    }
  }
  
  renderMovieDetails(movieDetails) {
    this.clearMovieDetails();
  
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
  
    const moviePoster = document.createElement('img');
    moviePoster.src = movieDetails.Poster;
    moviePoster.alt = movieDetails.Title;
    moviePoster.className = 'movie-poster';
    modalContent.appendChild(moviePoster);
  
    const movieInfo = document.createElement('div');
    movieInfo.className = 'movie-info';
  
    const titleElement = document.createElement('h3');
    titleElement.textContent = movieDetails.Title;
    movieInfo.appendChild(titleElement);
  
    const releasedElement = document.createElement('p');
    releasedElement.textContent = `Released: ${movieDetails.Released}`;
    movieInfo.appendChild(releasedElement);
  
    const genreElement = document.createElement('p');
    genreElement.textContent = `Genre: ${movieDetails.Genre}`;
    movieInfo.appendChild(genreElement);
  
    const countryElement = document.createElement('p');
    countryElement.textContent = `Country: ${movieDetails.Country}`;
    movieInfo.appendChild(countryElement);
  
    const directorElement = document.createElement('p');
    directorElement.textContent = `Director: ${movieDetails.Director}`;
    movieInfo.appendChild(directorElement);
  
    const writerElement = document.createElement('p');
    writerElement.textContent = `Writer: ${movieDetails.Writer}`;
    movieInfo.appendChild(writerElement);
  
    const actorsElement = document.createElement('p');
    actorsElement.textContent = `Actors: ${movieDetails.Actors}`;
    movieInfo.appendChild(actorsElement);
  
    const awardsElement = document.createElement('p');
    awardsElement.textContent = `Awards: ${movieDetails.Awards}`;
    movieInfo.appendChild(awardsElement);
    modalContent.appendChild(movieInfo);
    this.movieDetailsContent.appendChild(modalContent);
  
    const loadingIcon = this.movieDetailsContent.querySelector('.loading-icon');
    if (loadingIcon) {
      loadingIcon.remove();
    }
  }
  

  clearMoviesContainer() {
    this.moviesContainer.innerHTML = '';
    this.page = 1;
  }

  showLoadingIcon() {
    this.loadingIcon.style.display = 'block';
  }

  hideLoadingIcon() {
    this.loadingIcon.style.display = 'none';
  }

  disableMoreButton() {
    this.moreButton.disabled = true;
  }

  enableMoreButton() {
    this.moreButton.disabled = false;
  }

  saveLastSearch(title, movie) {
    const lastSearch = {
      title,
      movie
    };
    localStorage.setItem(this.lastSearchKey, JSON.stringify(lastSearch));
  }

  restoreLastSearch() {
    const lastSearch = JSON.parse(localStorage.getItem(this.lastSearchKey));
    if (lastSearch) {
      this.titleInput.value = lastSearch.title;
      this.movieInput.value = lastSearch.movie;
      this.handleSearch(new Event('submit'));
    }
  }

  async showMovieDetails(movieId) {
    this.showLoadingIcon();
    this.showModal();

    try {
      const movieDetails = await this.movieService.getMovieDetails(movieId);
      this.renderMovieDetails(movieDetails);
    } catch (error) {
      console.error('Error getting movie details:', error);
    }

    this.hideLoadingIcon();
  }

  showModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    modalContent.innerHTML = `
      <span id="closeModalButton" class="close-modal">&times;</span>
      <div id="movieDetailsContent" class="modal-data">
        <img src="img/gifload.gif" alt="Loading...">
      </div>
      <div id="movieImageContainer" class="modal-image"></div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    this.closeModalButton = document.getElementById('closeModalButton');
    this.closeModalButton.addEventListener('click', this.closeMovieDetailsModal.bind(this));
    modalContent.addEventListener('click', (event) => event.stopPropagation());

    this.movieDetailsModal = modalOverlay;
    this.movieDetailsContent = modalContent.querySelector('#movieDetailsContent');
    this.movieImageContainer = modalContent.querySelector('#movieImageContainer');
  }
  renderMovieDetails(movieDetails) {
    this.clearMovieDetails();
  
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
  
    const moviePoster = document.createElement('img');
    moviePoster.src = movieDetails.Poster;
    moviePoster.alt = movieDetails.Title;
    moviePoster.className = 'movie-poster';
    modalContent.appendChild(moviePoster);
  
    const movieInfo = document.createElement('div');
    movieInfo.className = 'movie-info';
  
    const titleElement = document.createElement('h3');
    titleElement.textContent = movieDetails.Title;
    movieInfo.appendChild(titleElement);
  
    const releasedElement = document.createElement('p');
    releasedElement.textContent = `Released: ${movieDetails.Released}`;
    movieInfo.appendChild(releasedElement);
  
    const genreElement = document.createElement('p');
    genreElement.textContent = `Genre: ${movieDetails.Genre}`;
    movieInfo.appendChild(genreElement);
  
    const countryElement = document.createElement('p');
    countryElement.textContent = `Country: ${movieDetails.Country}`;
    movieInfo.appendChild(countryElement);
  
    const directorElement = document.createElement('p');
    directorElement.textContent = `Director: ${movieDetails.Director}`;
    movieInfo.appendChild(directorElement);
  
    const writerElement = document.createElement('p');
    writerElement.textContent = `Writer: ${movieDetails.Writer}`;
    movieInfo.appendChild(writerElement);
  
    const actorsElement = document.createElement('p');
    actorsElement.textContent = `Actors: ${movieDetails.Actors}`;
    movieInfo.appendChild(actorsElement);
  
    const awardsElement = document.createElement('p');
    awardsElement.textContent = `Awards: ${movieDetails.Awards}`;
    movieInfo.appendChild(awardsElement);
  
    
  
    modalContent.appendChild(movieInfo);
    this.movieDetailsContent.appendChild(modalContent);
  
    const loadingIcon = this.movieDetailsContent.querySelector('img');
    if (loadingIcon) {
      loadingIcon.remove();
    }
  }
  
  

  clearMovieDetails() {
    this.movieDetailsContent.innerHTML = '';
    const loadingIcon = document.createElement('img');
    loadingIcon.src = 'img/gifload.gif';
    loadingIcon.alt = 'Loading...';
    this.movieDetailsContent.appendChild(loadingIcon);
  }

  closeMovieDetailsModal() {
    if (this.movieDetailsModal) {
      this.movieDetailsModal.remove();
      this.movieDetailsModal = null;
    }
  }
}

const apiKey = '945b05bf';
const movieService = new MovieService(apiKey);
const domUtils = new DOMUtils(movieService);
