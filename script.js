// Replace 'YOUR_API_KEY' with your actual OMDB API key
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
    console.error('Error fetching movie list:', error.message);
    return [];
  }
}

// Function to display movies on the page
function displayMovies(movies) {
  movieListContainer.innerHTML = '';

  movies.forEach(movie => {
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
    // prevButton.addEventListener('click', () => {
    //   currentPage--;
    //   fetchAndDisplayMovies();
    // });
  
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



    // for (let i = 1; i <= totalPages; i++) {
    //   const pageButton = document.createElement('button');
    //   pageButton.textContent = i;
    //   pageButton.disabled = currentPage === i;
    //   pageButton.addEventListener('click', () => {
    //     currentPage = i;
    //     fetchAndDisplayMovies();
    //   });
  
    //   paginationContainer.appendChild(pageButton);
    // }
  
    // Create the "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    // nextButton.classList.add('disabled');
    prevButton.classList.add('next');
    nextButton.addEventListener('click', () => {
        searchMovies(searchInput.value.trim(), currentPage + 1);
    });
    // nextButton.addEventListener('click', () => {
    //   currentPage++;
    //   fetchAndDisplayMovies();
    // });
  
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
  const searchQuery = searchInput.value.trim();
//   if(searchQuery===''){
    
//   }
  const movies = await fetchMovieList(searchQuery, currentPage);

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


// function displayMovieDetails(movie) {
//     console.log(movie.Title);
//   movieDetailsContainer.innerHTML = `
//     <h2>${movie.Title}</h2>
//     <img src="${movie.Poster}" alt="${movie.Title} Poster">
//     <p><strong>Year:</strong> ${movie.Year}</p>
//     <p><strong>Rated:</strong> ${movie.Rated}</p>
//     <p><strong>Genre:</strong> ${movie.Genre}</p>
//     <p><strong>Plot:</strong> ${movie.Plot}</p>
//     <p><strong>Director:</strong> ${movie.Director}</p>
//     <p><strong>Actors:</strong> ${movie.Actors}</p>
//     <!-- Add more movie information here as needed -->
//   `;
// }

// Function to display movie details
// function displayMovieDetails(movie) {
//     if (!movie) {
//       // If the movie details are not available, clear the movie details section
//       movieDetailsContainer.innerHTML = '';
//       return;
//     }
//     const m_array=Object.entries(movie);

//     let mov_details='';
//     for(const [key,value] of m_array){
//         if(key==='Poster'){
//             continue;
//         }
//         mov_details+= `<p><strong>${key}:</strong> ${value}</p>`;
//     }
//     movieDetailsContainer.innerHTML = `
//       <h2>${movie.Title}</h2>
//       <img src="${movie.Poster}" alt="${movie.Title} Poster">
//       ${mov_details}
//     `;
  
//     // Show the movie details section by adding the "active" class
//     movieDetailsContainer.classList.add('active');
//   }

  // **************** modals activation for the movie details
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


// **************** Show the Details of the movies and render the DOM
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

  const movieDetails = await fetchMovieList(movie.imdbID); // get the details of the movie

  // **************** dynamically add the <h6> tags for the details
  Object.keys(movieDetails).forEach(key => {
    const hTag = document.createElement("h6");
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




// Function to open the movie details page in a new window
function openMovieDetailsPage(movie) {
    const movieDetailsPage = window.open('', '_blank', 'width=800,height=600');
    const m_array=Object.entries(movie);

    let mov_details='';
    for(const [key,value] of m_array){
        if(key==='Poster'){
            continue;
        }
        mov_details+= `<p><strong>${key}:</strong> ${value}</p>`;
    }
    // Movie details page content
    const movieDetailsContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${movie.Title} - Movie Details</title>
      <link rel="stylesheet" href="styles.css">
      <style>
      .movie-details-page {
        width: 80%;
        max-width: 300px;
        margin: 30px auto;
        padding: 20px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: #5a5454;
        text-align: center;
      }
      
      .movie-details-page h2 {
        margin-top: 0;
      }
      
      .movie-details-page img {
        max-width: 100%;
        height: auto;
      }
      
      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background-color: #ccc;
        border: none;
        cursor: pointer;
      }  
      /* CSS for the feedback form */
        #feedbackForm {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        }

        #ratingInput {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        }

        #ratingInput p {
        margin: 0;
        margin-right: 10px;
        }

        textarea {
        width: 100%;
        height: 100px;
        resize: vertical;
        margin-bottom: 10px;
        }

        #saveButton,
        #hideButton {
        background-color: #007bff;
        color: #fff;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
        }

        #hideButton {
        background-color: #dc3545;
        }

        #saveButton:hover,
        #hideButton:hover {
        background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="movie-details-page">
        <button class="close-button" onclick="window.close()">X</button>
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="${movie.Title} Poster">
        ${mov_details}
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Rated:</strong> ${movie.Rated}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <!-- Add more movie information here as needed -->
      </div>

      <!-- Feedback Form -->
    <div id="feedbackForm">
      <div id="ratingInput" style="display:flex; align-items:center;">
        <p>Rating (1-5 stars):</p>
        <label><input type="radio" name="rating" value="1" ${(movie.rating === "1") ? "checked" : ""}>1</label>
        <label><input type="radio" name="rating" value="2" ${(movie.rating === "2") ? "checked" : ""}>2</label>
        <label><input type="radio" name="rating" value="3" ${(movie.rating === "3") ? "checked" : ""}>3</label>
        <label><input type="radio" name="rating" value="4" ${(movie.rating === "4") ? "checked" : ""}>4</label>
        <label><input type="radio" name="rating" value="5" ${(movie.rating === "5") ? "checked" : ""}>5</label>
      </div>
      <textarea id="commentInput" placeholder="Leave a comment">${comment}</textarea>
      <button id="saveButton" onclick="saveRatingAndComment('${movie.imdbID}')">Save Rating & Comment</button>
      <button id="hideButton" onclick="hideMovieDetails()">Hide Details</button>
    </div>

     

    </body>
    </html>
    `;
  
    // Set the content of the new window
    movieDetailsPage.document.body.innerHTML = movieDetailsContent;
    // Function to save user's rating and comment
    
 

  }

  // Function to hide movie details
function hideMovieDetails() {
    // Hide the movie details section by removing the "active" class
    movieDetailsContainer.classList.remove('active');
  }

// async function openModal(movie){
//     const movieId=movie.imdbID;
//     // console.log("display",movie.imdbID);
//   if (movieId) {
//     const movie_d = await fetchMovieDetails(movieId);
//     displayMovieDetails(movie_d);
//     if (movie_d) {
//         openMovieDetailsPage(movie_d);
//         // showMovieDetails(movieId);
//       }
//   }
// }

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