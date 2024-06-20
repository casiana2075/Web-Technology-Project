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
    const apiUrl = 'https://api.themoviedb.org/3/person/popular?api_key=524b8acb224e3bc712c2c9b11ddeca4e';
    let currentPage = 1;
    function fetchAndDisplayActors(page) {
        fetch(`${apiUrl}&page=${page}`)
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
                    actorAnchor.href = "actorProfile.html";
                    actorAnchor.appendChild(actorDiv);
    
                    imageContainer.appendChild(actorAnchor);
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
});
