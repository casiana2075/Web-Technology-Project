document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '524b8acb224e3bc712c2c9b11ddeca4e';
    const apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;
    let currentPage = 1;
    let allActorsData = [];

    function fetchAndDisplayPopularActor(actorElementId, actorIndex) {
        fetch(`${apiUrl}&page=1`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > actorIndex) {
                    let actor = data.results[actorIndex];
                    let actorElement = document.getElementById(actorElementId);

                    actorElement.querySelector('.logoCaption').textContent = `${actor.name} - ${actor.known_for_department}`;
                    actorElement.querySelector('.infoBox').textContent = actor.biography;
                    actorElement.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${actor.profile_path}')`;

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

                    // Store actor data for search
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
                allActorsData = allActorsData.concat(data.results);

                data.results.forEach((actor) => {
                    let actorDiv = document.createElement('div');
                    actorDiv.classList.add('actorCircle');
                    actorDiv.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${actor.profile_path}')`;
                    actorDiv.style.backgroundSize = 'cover';
                    actorDiv.style.backgroundPosition = 'center';

                    let actorNameDiv = document.createElement('div');
                    actorNameDiv.textContent = actor.name;
                    actorNameDiv.classList.add('actorName');
                    actorDiv.appendChild(actorNameDiv);

                    let actorAnchor = document.createElement('a');
                    actorAnchor.href = `actorProfile.html?id=${actor.id}`;
                    console.log(`Generated URL: actorProfile.html?id=${actor.id}`);
                    actorAnchor.appendChild(actorDiv);

                    imageContainer.appendChild(actorAnchor);

                    // Store actor data for search
                    allActorsData.push({
                        id: actor.id,
                        name: actor.name,
                        biography: actor.biography,
                        profile_path: actor.profile_path
                    });
                });
            })
            .catch(error => console.error(error));
    }

    fetchAndDisplayActors(currentPage);

    document.getElementById("moreButton").addEventListener("click", function(event) {
        event.preventDefault();
        currentPage++;
        fetchAndDisplayActors(currentPage);
    });

    document.getElementById('edition').addEventListener('click', () => {
        sessionStorage.setItem('filter', 'edition');
    });

    document.getElementById('movies').addEventListener('click', () => {
        sessionStorage.setItem('filter', 'movies');
    });

    document.getElementById('tv-series').addEventListener('click', () => {
        sessionStorage.setItem('filter', 'tv-series');
    });

    document.getElementById('category').addEventListener('click', () => {
        sessionStorage.setItem('filter', 'category');
    });

    let searchBar = document.querySelector('.search-button input');

    searchBar.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            let searchTerm = this.value.toLowerCase();
            let containers = document.querySelectorAll('.container, .actorCircle');
            let found = false;

            containers.forEach(function(container) {
                if (!found) {
                    let containerText = container.innerText.toLowerCase();
                    if (containerText.includes(searchTerm)) {
                        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        found = true;
                    } else {
                        let actorNames = container.querySelectorAll('.actorName, .infoBox');
                        actorNames.forEach(function(actorName) {
                            let originalDisplay = actorName.style.display;
                            actorName.style.display = 'block';
                            if (actorName.innerText.toLowerCase().includes(searchTerm)) {
                                actorName.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                found = true;
                            }
                            actorName.style.display = originalDisplay;
                        });
                    }
                }
            });

            if (!found) {
                // Search in the preloaded actor data
                allActorsData.forEach((actor) => {
                    if (actor.name.toLowerCase().includes(searchTerm) || actor.biography.toLowerCase().includes(searchTerm)) {
                        let actorDiv = document.querySelector(`.actorCircle[style*="${actor.profile_path}"]`);
                        if (actorDiv) {
                            actorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            found = true;
                        }
                    }
                });

                if (!found) {
                    alert('No matches found');
                }
            }
        }
    });
});
