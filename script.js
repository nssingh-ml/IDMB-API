 
const apiKey = '95b08d68';
const apiUrl = 'https://www.omdbapi.com/';

let userFeedbackArray = [];

const movieListContainer = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
let currentPage = 1;
const moviesPerPage = 10;

// Function to fetch the movie list from OMDB API
async function fetchMovieList(searchQuery = '', page = 1) {
  try {
    // const url = `${apiUrl}?s=${searchQuery}&apikey=${apiKey}&type=movie&page=${page}`;
    const url = `${apiUrl}?s=${searchQuery}&apikey=${apiKey}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
      return data;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    // searchStatus.innerHTML = `${error}... Try a different search`; 
    console.error('Error fetching movie list:', error.message);
    return [];
  }
}

// Function to display movies on the page
function displayMovies(movies) {
  movieListContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.addEventListener("click", () => openModal(movie));

    const posterImg = document.createElement('img');
    posterImg.src = movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.jpg';
    posterImg.alt = movie.Title;
    posterImg.classList.add('movie-poster');

    const title = document.createElement('p');
    title.textContent = movie.Title;
    title.classList.add('movie-title');

    movieCard.appendChild(posterImg);
    movieCard.appendChild(title);

    movieListContainer.appendChild(movieCard);
  });
}

// Function to handle pagination
function handlePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / moviesPerPage);
    const paginationContainer = document.getElementById('pagination');
  
    paginationContainer.innerHTML = '';
  
    // Create the "Previous" button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    if(prevButton.disabled){
    prevButton.classList.add('disabled');
    }
    prevButton.classList.add('prev');
    prevButton.addEventListener('click', () => {
        searchMovies(searchInput.value.trim(), currentPage - 1);
    });
    
    paginationContainer.appendChild(prevButton);
    

    // Show compact pagination format
    
    const maxVisiblePages = totalPages>=5? 5:totalPages;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfMaxVisiblePages;
    let endPage = currentPage + halfMaxVisiblePages;

    if (startPage <= 0) {
        startPage = 1;
        endPage = maxVisiblePages;
    } else if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
    }

    if (startPage > 1) {
        // Show the first page
        addPageButton(1, currentPage);
        if (startPage > 2) {
        // Show ellipsis if there are more pages before the first visible page
        paginationContainer.appendChild(createEllipsis());
        }
    }

  for (let i = startPage; i <= endPage; i++) {
    // Show the page numbers between startPage and endPage
    addPageButton(i, currentPage);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      // Show ellipsis if there are more pages after the last visible page
      paginationContainer.appendChild(createEllipsis());
    }
    // Show the last page
    addPageButton(totalPages, currentPage);
  }
  
    // Create the "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    // nextButton.classList.add('disabled');
    prevButton.classList.add('next');
    nextButton.addEventListener('click', () => {
        searchMovies(searchInput.value.trim(), currentPage + 1);
    });
     
    paginationContainer.appendChild(nextButton);

    // Update active state for page buttons
  const pageButtons = paginationContainer.querySelectorAll('button:not(.prev):not(.next)');
  pageButtons.forEach((button) => {
    if (Number(button.textContent) === currentPage) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });


  }

  // Function to add page button with active class if it's the current page
function addPageButton(page, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.addEventListener('click', () => {
      searchMovies(searchInput.value.trim(), page);
    });
    if (page === currentPage) {
      pageButton.classList.add('active');
    }
    // else{
    //     pageButton.classList.remove('active');
    // }
    paginationContainer.appendChild(pageButton);
  }
  
  // Function to create an ellipsis element
  function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('ellipsis');
    return ellipsis;
  }


  // Function to fetch movies based on search query
async function searchMovies(searchQuery,page = 1) {
    const movies = await fetchMovieList(searchQuery,page);
    displayMovies(movies.Search);
    handlePagination(movies.totalResults)
  }
  
  // Function to handle search input change
  function handleSearchInput() {
    const searchQuery = searchInput.value.trim();
    if (searchQuery === '') {
      fetchAndDisplayMovies();
    } else {
      searchMovies(searchQuery);
    }
  }

  // Function to handle search button click
function handleSearchButtonClick() {
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== '') {
      searchMovies(searchQuery);
    }
  }
  
  // Event listener for search input
  searchInput.addEventListener('input', handleSearchInput);
  const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', handleSearchButtonClick);


// Function to fetch and display movies with pagination
async function fetchAndDisplayMovies() {
  const searchQuery = searchInput.value.trim()===''? 'harry':searchInput.value.trim();
  // const searchQuery = searchInput.value.trim()
  
   
  const movies = await fetchMovieList(searchQuery, currentPage);
   
  searchMovies(movies);
  displayMovies(movies);

  if (movies.length > 0) {
    handlePagination(movies[0].totalResults);
  } else {
    document.getElementById('pagination').innerHTML = '';
  }
}

// Function to display movie details
// const movieListContainer = document.getElementById('movieList');
const movieDetailsContainer = document.getElementById('movieDetails');


 

  // modals activation for the movie details
const modal = document.getElementById('filter-modal');
const closeBtn = modal.querySelector('.close');
closeBtn.addEventListener('click', closeModal);
function openModal(movie) {
  modal.style.display = 'block';
  showMovieDetails(movie);
}
function closeModal() {
  const movieDetailsHtmlElement = document.getElementById("movieDetails");
  movieDetailsHtmlElement.innerHTML = ``;
  modal.style.display = 'none';
}
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
// Fetch only details
async function fetchMovieDetails(movieID) {
  searchStatus.innerHTML = ``;
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}&type=movie`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
  }
  catch(error) {
    searchStatus.innerHTML = `${error}... Try a different search`; // display appropriate message
    return []; // Return an empty array in case of an error
  }
}

//Show the Details of the movies and render the DOM
async function showMovieDetails(movie) {
  const feedback = userFeedbackArray.find(feedback => feedback.feedback_id === movie.imdbID); // if already rated
  let rating = comment = "";
  if(feedback) {
    rating = feedback.rating;
    comment = feedback.comment;
  }
  const movieDetailsHtmlElement = document.getElementById("movieDetails");
  movieDetailsHtmlElement.style.display = "block";

  const posterImg = document.createElement("img");
  posterImg.src = movie.Poster;
  posterImg.alt = movie.Title;

  movieDetailsHtmlElement.appendChild(posterImg);

  const movieDetails = await fetchMovieDetails(movie.imdbID);  

  console.log(movieDetailsHtmlElement)
  //dynamically add the <h6> tags for the details
  Object.keys(movieDetails).forEach(key => {
    const hTag = document.createElement("h6");
    hTag.style.color = "black";
    if(key!=="Ratings" && key!=="Poster"){
      hTag.innerHTML = `${key} : ${movieDetails[key]}`;  
      movieDetailsHtmlElement.appendChild(hTag);
    }  
  });

  const feedbackForm = document.createElement("div");
  feedbackForm.className = "form-for-user-rating";
  feedbackForm.innerHTML = `
  <div id="ratingInput" class="rating-container">
  <p>Rating (1-5 stars):</p>
  <label><input type="radio" name="rating" value="1" ${(rating==="1")? "checked" : "" }><span></span></label>
  <label><input type="radio" name="rating" value="2" ${(rating==="2")? "checked" : "" }><span></span></label>
  <label><input type="radio" name="rating" value="3" ${(rating==="3")? "checked" : "" }><span></span></label>
  <label><input type="radio" name="rating" value="4" ${(rating==="4")? "checked" : "" }><span></span></label>
  <label><input type="radio" name="rating" value="5" ${(rating==="5")? "checked" : "" }><span></span></label>
</div>
    <textarea id="commentInput" placeholder="Leave a comment">${comment}</textarea>
    <h4 id="message" style="color:red;"></h4>
    <div class="rating-buttons">
      <button id="saveButton" style="margin-right:10px;" onclick="saveRatingAndComment('${movie.imdbID}')">Save Rating & Comment</button>
      <button id="saveButton" onclick="closeModal()">Hide Details</button>
    <div>
  `;
  movieDetailsHtmlElement.appendChild(feedbackForm);
}


// Function to fetch additional movie details from OMDB API
async function fetchMovieDetails(movieId) {
  try {
    const url = `${apiUrl}?apikey=${apiKey}&i=${movieId}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === 'True') {
      return data;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    return [];
  }
}

// Function to save user's rating and comment
function saveRatingAndComment(movieId) {
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const commentInput = document.getElementById('commentInput').value;
  
    if (!ratingInput) {
      alert('Please select a rating.');
      return;
    }
  
    const rating = ratingInput.value;
    const comment = commentInput.trim();
    console.log(rating,comment);
    // Retrieve existing data from local storage or initialize an empty object
    const storedData = JSON.parse(localStorage.getItem('movieFeedback')) || {};
  
    // Save the user's rating and comment for the movie in local storage
    storedData[movieId] = { rating, comment };
    localStorage.setItem('movieFeedback', JSON.stringify(storedData));
  
    // Display success message or perform other actions as needed
    alert('Rating and comment saved successfully.');
  }


// Initial load of movies
fetchAndDisplayMovies();