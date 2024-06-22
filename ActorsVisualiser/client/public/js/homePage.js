document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '524b8acb224e3bc712c2c9b11ddeca4e';
    const apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;
    const localApiUrl = 'http://localhost:3001/api/getActors';
    const placeholderImage = '../resources/placeholder.jpg';
    let currentPage = 1;
    let allActorsData = [];

    function fetchAndDisplayPopularActor(actorElementId, actorIndex) {
        fetch(`${apiUrl}&page=1`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > actorIndex) {
                    let actor = data.results[actorIndex];
                    let actorElement = document.getElementById(actorElementId);

                    if (!actorElement) {
                        console.error(`Element with id ${actorElementId} not found`);
                        return;
                    }

                    actorElement.querySelector('.logoCaption').textContent = `${actor.name} - ${actor.known_for_department}`;
                    actorElement.querySelector('.infoBox').textContent = actor.biography;
                    actorElement.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${actor.profile_path || placeholderImage}')`;

                    actorElement.addEventListener('mouseover', () => {
                        fetch(`https://api.themoviedb.org/3/person/${actor.id}?api_key=${apiKey}`)
                            .then(response => response.json())
                            .then(actorData => {
                                actorElement.querySelector('.infoBox').textContent = actorData.biography.substring(0, 500) + '...';
                                actorElement.querySelector('.infoBox').style.display = 'block';
                                actorElement.classList.add('dimmed');
                            })
                            .catch(error => console.error(error));
                    });

                    actorElement.addEventListener('mouseout', () => {
                        actorElement.querySelector('.infoBox').style.display = 'none';
                        actorElement.classList.remove('dimmed');
                    });

                    allActorsData.push({
                        id: actor.id,
                        name: actor.name,
                        biography: actor.biography,
                        profile_path: actor.profile_path
                    });
                }
            })
            .catch(error => console.error(error));
    }

    fetchAndDisplayPopularActor('logoActors1', 0);
    fetchAndDisplayPopularActor('logoActors2', 1);
    fetchAndDisplayPopularActor('logoActors3', 2);

    function fetchAndDisplayActors(page) {
        fetch(`${apiUrl}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                let imageContainer = document.querySelector('.actorsTable .actorsLine');
                if (!imageContainer) {
                    console.error('Element with class "actorsTable .actorsLine" not found');
                    return;
                }

                data.results.forEach((actor) => {
                    // Check if the actor is already displayed
                    if (!allActorsData.some(existingActor => existingActor.id === actor.id)) {
                        let actorDiv = document.createElement('div');
                        actorDiv.classList.add('actorCircle');
                        actorDiv.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${actor.profile_path || placeholderImage}')`;
                        actorDiv.style.backgroundSize = 'cover';
                        actorDiv.style.backgroundPosition = 'center';

                        let actorNameDiv = document.createElement('div');
                        actorNameDiv.textContent = actor.name;
                        actorNameDiv.classList.add('actorName');
                        actorDiv.appendChild(actorNameDiv);

                        let actorAnchor = document.createElement('a');
                        actorAnchor.href = `actorProfile.html?id=${actor.id}`;
                        actorAnchor.appendChild(actorDiv);

                        imageContainer.appendChild(actorAnchor);

                        allActorsData.push({
                            id: actor.id,
                            name: actor.name,
                            biography: actor.biography,
                            profile_path: actor.profile_path
                        });
                    }
                });
            })
            .catch(error => console.error(error));
    }
    fetchAndDisplayActors(currentPage);

    const moreButton = document.getElementById("moreButton");
    if (moreButton) {
        moreButton.addEventListener("click", function(event) {
            event.preventDefault();
            currentPage++;
            fetchAndDisplayActors(currentPage);
        });
    }

    const editionButton = document.getElementById('edition');
    if (editionButton) {
        editionButton.addEventListener('click', () => {
            sessionStorage.setItem('filter', 'edition');
        });
    }

    const moviesButton = document.getElementById('movies');
    if (moviesButton) {
        moviesButton.addEventListener('click', () => {
            sessionStorage.setItem('filter', 'movies');
        });
    }

    const tvSeriesButton = document.getElementById('tv-series');
    if (tvSeriesButton) {
        tvSeriesButton.addEventListener('click', () => {
            sessionStorage.setItem('filter', 'tv-series');
        });
    }

    const categoryButton = document.getElementById('category');
    if (categoryButton) {
        categoryButton.addEventListener('click', () => {
            sessionStorage.setItem('filter', 'category');
        });
    }

    let searchBar = document.querySelector('#searchBox input');
    if (searchBar) {
        console.log("Search bar found.");
        let recommendationsDiv = document.createElement('div');
        recommendationsDiv.classList.add('search-recommendations');
        document.querySelector('.searchBox').appendChild(recommendationsDiv);

        function searchTmdbForActor(actorName) {
            return fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        return data.results[0]; // return the first match
                    }
                    return null;
                });
        }

        searchBar.addEventListener('input', function() {
            let searchTerm = this.value.toLowerCase();
            console.log(`Searching for: ${searchTerm}`);
            if (searchTerm) {
                fetch(localApiUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Fetched data:", data);
                        let searchResults = data.filter(actor => 
                            actor.full_name && actor.full_name.toLowerCase().includes(searchTerm)
                        );

                        console.log("Search results:", searchResults);

                        if (searchResults.length > 0) {
                            let recommendations = searchResults.map(actor => `<li><a href="#" data-actor-name="${actor.full_name}" class="always-active">${actor.full_name}</a></li>`).join('');
                            recommendationsDiv.innerHTML = `<ul class="always-active">${recommendations}</ul>`;
                            recommendationsDiv.style.display = 'block';
                        } else {
                            recommendationsDiv.innerHTML = '';
                            recommendationsDiv.style.display = 'none';
                        }
                    })
                    .catch(error => console.error('Error fetching actors:', error));
            } else {
                recommendationsDiv.innerHTML = '';
                recommendationsDiv.style.display = 'none';
            }
        });

        recommendationsDiv.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                let actorName = event.target.getAttribute('data-actor-name');
                searchTmdbForActor(actorName).then(actor => {
                    if (actor) {
                        window.location.href = `actorProfile.html?id=${actor.id}`;
                    } else {
                        alert('Actor not found in TMDB');
                    }
                });
            }
        });

        document.addEventListener('click', function(event) {
            if (!searchBar.contains(event.target) && !recommendationsDiv.contains(event.target)) {
                recommendationsDiv.style.display = 'none';
            }
        });
    } else {
        console.log("Search bar not found.");
    }
});
