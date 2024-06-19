const movieName = 'The Walking Dead';

fetch(`https://api.themoviedb.org/3/search/movie?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(movieName)}`)
.then(response => response.json())
.then(data => {
    if (data.results && data.results.length > 0) {
        const movieTitle = data.results[0].title;
        const movieOverview = data.results[0].overview;

        const movieContainer = document.querySelector('.movie2Container');

        movieContainer.innerHTML = `
            <h1>${movieTitle}</h1>
            <p>${movieOverview}</p>
        `;
    } else {
        console.log('Filmul nu a fost găsit');
    }
})
.catch(error => console.error('Error:', error));

const movieName1 = 'Joker';

fetch(`https://api.themoviedb.org/3/search/movie?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(movieName1)}`)
.then(response => response.json())
.then(data => {
    if (data.results && data.results.length > 0) {
        const movieTitle = data.results[0].title;
        const movieOverview = data.results[0].overview;

        const movieContainer = document.querySelector('.movie1Container');

        movieContainer.innerHTML = `
            <h1>${movieTitle}</h1>
            <p>${movieOverview}</p>
        `;
    } else {
        console.log('Filmul nu a fost găsit');
    }
})
.catch(error => console.error('Error:', error));


const movieName3 = 'Stranger Things';

fetch(`https://api.themoviedb.org/3/search/movie?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(movieName3)}`)
.then(response => response.json())
.then(data => {
    if (data.results && data.results.length > 0) {
        const movieTitle = data.results[0].title;
        const movieOverview = data.results[0].overview;

        const movieContainer = document.querySelector('.movie3Container');

        movieContainer.innerHTML = `
            <h1>${movieTitle}</h1>
            <p>${movieOverview}</p>
        `;
    } else {
        console.log('Filmul nu a fost găsit');
    }
})
.catch(error => console.error('Error:', error));