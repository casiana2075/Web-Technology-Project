document.addEventListener('DOMContentLoaded', () => {
    const apiUrl1 = 'https://api.themoviedb.org/3/person/popular?api_key=524b8acb224e3bc712c2c9b11ddeca4e';

    function fetchAndDisplayPopularActor(actorElementId, actorIndex) {
        fetch(`${apiUrl1}&page=1`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > actorIndex) {
                    let actor = data.results[actorIndex];
                    let actorElement = document.getElementById(actorElementId);

                    actorElement.querySelector('.logoCaption').textContent = `${actor.name} - ${actor.known_for_department}`;
                    actorElement.querySelector('.infoBox').textContent = actor.biography;
                    actorElement.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${actor.profile_path}')`;

                    actorElement.addEventListener('mouseover', () => {
                        fetch(`https://api.themoviedb.org/3/person/${actor.id}?api_key=524b8acb224e3bc712c2c9b11ddeca4e`)
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
                }
            })
            .catch(error => console.error(error));
    }

    fetchAndDisplayPopularActor('logoActors1', 0);
    fetchAndDisplayPopularActor('logoActors2', 1);
    fetchAndDisplayPopularActor('logoActors3', 2);

    let currentPage = 1;
    const tmdbApiUrl = 'https://api.themoviedb.org/3/person/popular?api_key=524b8acb224e3bc712c2c9b11ddeca4e';
    const localApiUrl = 'http://localhost:3001/api/actors';


    function fetchAndDisplayActors(page) {
        // Fetch actors from TMDB
        fetch(`${tmdbApiUrl}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                let imageContainer = document.querySelector('.actorsTable .actorsLine');

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
                    actorAnchor.href = `actorProfile.html?id=tmdb-${actor.id}`;
                    console.log(`Generated URL: actorProfile.html?id=tmdb-${actor.id}`);
                    actorAnchor.appendChild(actorDiv);

                    imageContainer.appendChild(actorAnchor);
                });
            })
            .catch(error => console.error(error));
    }

    function fetchAndDisplayLocalActors() {
        // Fetch actors from local API
        fetch(localApiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let imageContainer = document.querySelector('.actorsTable .actorsLine');

               data.forEach((actor) => {
                   console.log(actor);
                   let actorDiv = document.createElement('div');
                   actorDiv.classList.add('actorCircle');

                   if(actor.image === undefined || actor.image === null || actor.image === "") {
                       actorDiv.style.backgroundImage = 'url("https://via.placeholder.com/200x450?text=No+Image+Available")';
                   } else {
                   let imageUrl = `http://localhost:3001/api/resources/images/${actor.image}`;
                   actorDiv.style.backgroundImage = `url('${imageUrl}')`;
                   }

                   actorDiv.style.backgroundSize = 'cover';
                   actorDiv.style.backgroundPosition = 'center';

                    let actorNameDiv = document.createElement('div');
                    actorNameDiv.textContent = actor.actorname;
                    actorNameDiv.classList.add('actorName');
                    actorDiv.appendChild(actorNameDiv);

                    let actorAnchor = document.createElement('a');
                    actorAnchor.href = `actorProfile.html?id=local-${actor.id}&name=${encodeURIComponent(actor.actorname)}`;
                    console.log(`Generated URL: actorProfile.html?id=local-${actor.id}&name=${encodeURIComponent(actor.actorname)}`);
                    actorAnchor.appendChild(actorDiv);

                    imageContainer.appendChild(actorAnchor);
                });
            })
            .catch(error => console.error(error));
    }

    fetchAndDisplayActors(currentPage);
    fetchAndDisplayLocalActors();

    document.getElementById("moreButton").addEventListener("click", function (event) {
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
});
