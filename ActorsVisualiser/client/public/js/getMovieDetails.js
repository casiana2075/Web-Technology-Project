const apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=524b8acb224e3bc712c2c9b11ddeca4e';

fetch(apiUrl)
.then(response => response.json())
.then(data => {
    if (data.results && data.results.length > 0) {
        for(let i = 0; i < 3; i++) {
            const movie = data.results[i];
            const movieContainer = document.querySelector(`.movie${i+1}Container`);

            movieContainer.innerHTML = `
                <h1>${movie.title}</h1>
                <p>${movie.overview}</p>
            `;

            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=524b8acb224e3bc712c2c9b11ddeca4e`)
            .then(response => response.json())
            .then(data => {
                if (data.cast && data.cast.length > 0) {
                    const actors = data.cast.slice(0, 5).map(actor => actor.name).join(', ');
                    movieContainer.innerHTML += `<p>Actors: ${actors}</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
        }
    } else {
        console.log('Nu s-au găsit filme');
    }
})
.catch(error => console.error('Error:', error));