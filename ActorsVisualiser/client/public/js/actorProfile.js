const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get('id');

// Get the actor's details
fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=524b8acb224e3bc712c2c9b11ddeca4e`)
    .then(response => response.json())
    .then(data => {
        if (!data.profile_path) {
            document.getElementById('actor-profile-image').src = 'https://via.placeholder.com/200x450?text=No+Image+Available';
        } else {
            document.getElementById('actor-profile-image').src = `https://image.tmdb.org/t/p/w500${data.profile_path}`;
        }
        document.getElementById('actor-name').textContent = data.name;
        document.getElementById('actor-details').textContent = data.biography || 'Sorry, no biography available for this actor for now.';
        document.getElementById('actor-profile-birthday').textContent = `Birthday: ${data.birthday || 'N/A'}`;
        document.getElementById('actor-profile-deathday').textContent = `Deathday: ${data.deathday || 'N/A'}`;
        document.getElementById('actor-profile-department').textContent = `Known for: ${data.known_for_department || 'N/A'}`;
        document.getElementById('actor-profile-birthplace').textContent = `Place of Birth: ${data.place_of_birth || 'N/A'}`;
    })
    .catch(error => console.error('Error:', error));

// Get the actor's movies
fetch(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=524b8acb224e3bc712c2c9b11ddeca4e`)
    .then(response => response.json())
    .then(data => {
        let actorsMovies = document.getElementById('actors-movies');

        actorsMovies.innerHTML = '';

        if (data.cast && data.cast.length > 0) {
            data.cast.forEach(movie => {
                if (movie.poster_path) {
                    let movieElement = document.createElement('li');
                    let movieImage = document.createElement('img');

                    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    movieImage.alt = movie.title;
                    movieElement.appendChild(movieImage);

                    let movieTitle = document.createElement('p');
                    movieTitle.textContent = movie.title;
                    movieTitle.style.color = 'white';
                    movieElement.appendChild(movieTitle);

                    actorsMovies.appendChild(movieElement);
                }
            });
        } else {
            let noMovies = document.createElement('p');
            noMovies.textContent = 'Sorry, no movies available for this actor for now.';
            noMovies.style.color = 'white';
            actorsMovies.appendChild(noMovies);
        }
    })
    .catch(error => console.error('Error:', error));