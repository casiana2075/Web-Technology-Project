document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '524b8acb224e3bc712c2c9b11ddeca4e';
    const apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`;
    const localApiUrl = 'http://localhost:3001/api/actorsFromDb';
    const localApi = 'http://localhost:3001/api/actors';
    const placeholderImage = '../resources/placeholder.jpg';
    let currentPage = 1;
    let actorsPerPage = 1000;
    let allActorsData = [];
    let currentLetter = '';
    let actorBuffer = [];
    let allLettersActors = {};

    async function fetchActorIdFromTmdb(actorName) {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].id; // return the first match
        }
        return null;
    }

    async function fetchLocalActors() {
        const response = await fetch(localApiUrl);
        return response.json();
    }

    async function fetchAndDisplayPopularActor(actorElementId, actorIndex, page = 1) {
        try {
            const response = await fetch(`${apiUrl}&page=${page}`);
            const data = await response.json();
            if (data.results && data.results.length > actorIndex) {
                let actor = data.results[actorIndex];
                let localActors = await fetchLocalActors();

                if (!localActors.some(localActor => localActor.full_name && localActor.full_name.toLowerCase() === actor.name.toLowerCase())) {
                    console.log(`${actor.name} is not found in local actors. Fetching next actor...`);
                    return fetchAndDisplayPopularActor(actorElementId, actorIndex + 2, page);
                }

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
            } else if (data.results.length === 0) {
                console.log(`No more actors found on page ${page}.`);
            } else {
                console.log(`Fetching next page ${page + 1}...`);
                return fetchAndDisplayPopularActor(actorElementId, 0, page + 1);
            }
        } catch (error) {
            console.error(error);
        }
    }

    fetchAndDisplayPopularActor('logoActors1', 0);
    fetchAndDisplayPopularActor('logoActors2', 1);
    fetchAndDisplayPopularActor('logoActors3', 2);
   
    async function fetchAndDisplayActors(page, letter = '', append = false, numActors = 1000) {
        let actorsToFetch = numActors;
        let pagesNeeded = Math.ceil(actorsToFetch / 20); // 20 actors per page (tmdb api limit)
        let fetchPromises = [];
    
        for (let i = 0; i < pagesNeeded; i++) {
            fetchPromises.push(
                fetch(`${apiUrl}&page=${page + i}`)
                    .then(response => response.json())
            );
        }
    
        const results = await Promise.all(fetchPromises);
    
        let imageContainer = document.querySelector('.actorsTable .actorsLine');
        if (!imageContainer) {
            console.error('Element with class "actorsTable .actorsLine" not found');
            return;
        }
    
        if (!append) {
            imageContainer.innerHTML = ''; 
            actorBuffer = []; 
        }
    
        let allNewActors = [];
        results.forEach(data => {
            let newActors = letter ? data.results.filter(actor => actor.name.toLowerCase().startsWith(letter)) : data.results;
            allNewActors.push(...newActors);
        });
    
        let existingActorsResponse = await fetch(localApiUrl);
        let existingActorsData = await existingActorsResponse.json();
        let existingActorNames = new Set(existingActorsData.map(actor => actor.full_name ? actor.full_name.toLowerCase() : null));
    
        let filteredNewActors = allNewActors.filter(actor => !existingActorNames.has(actor.name.toLowerCase()));
    
        actorBuffer = actorBuffer.concat(filteredNewActors.slice(0, actorsToFetch)); 
        displayActorsFromBuffer(actorsPerPage); 
    
        currentPage += pagesNeeded; 
    }
    
    function displayActorsFromBuffer(numActorsToDisplay = 100) {
        let imageContainer = document.querySelector('.actorsTable .actorsLine');
        if (!imageContainer) {
            console.error('Element with class "actorsTable .actorsLine" not found');
            return;
        }
    
        for (let i = 0; i < numActorsToDisplay && actorBuffer.length > 0; i++) {
            let actor = actorBuffer.shift(); 
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
                actorAnchor.href = `actorProfile.html?id=tmdb-${actor.id}`;
                console.log(`Generated URL: actorProfile.html?id=tmdb-${actor.id}`);
                actorAnchor.appendChild(actorDiv);
    
                imageContainer.appendChild(actorAnchor);
    
                allActorsData.push({
                    id: actor.id,
                    name: actor.name,
                    biography: actor.biography,
                    profile_path: actor.profile_path
                });
            }
        }
    }

    
    async function fetchAndStoreActorsByLetter(letter) {
        let page = 1;
        allLettersActors[letter] = [];
        let actorsFound = false;

        while (!actorsFound) {
            const response = await fetch(`${apiUrl}&page=${page}`);
            const data = await response.json();

            const actors = data.results.filter(actor => actor.name.toLowerCase().startsWith(letter));
            if (actors.length > 0) {
                allLettersActors[letter].push(...actors);
                actorsFound = true;
            }

            if (data.results.length === 0) break; 
            page++;
        }

        if (allLettersActors[letter].length === 0) {
            console.error(`No actors found starting with letter "${letter}"`);
        }
    }

    async function fetchAllLettersActors() {
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(97 + i); // 'a' to 'z'
            await fetchAndStoreActorsByLetter(letter);
        }
    }

    fetchAllLettersActors();

    function fetchAndDisplayLocalActors() {
        fetch(localApi)
            .then(response => response.json())
            .then(async data => {
                console.log(data);
                let imageContainer = document.querySelector('.actorsTable .actorsLine');

                for (const actor of data) {
                    console.log(actor);
                    const actorId = await fetchActorIdFromTmdb(actor.actorname);
                    let actorDiv = document.createElement('div');
                    actorDiv.classList.add('actorCircle');

                    if (actor.image === undefined || actor.image === null || actor.image === "") {
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
                    actorAnchor.href = `actorProfile.html?id=tmdb-${actorId}&name=${encodeURIComponent(actor.actorname)}`;
                    console.log(`Generated URL: actorProfile.html?id=tmdb-${actorId}&name=${encodeURIComponent(actor.actorname)}`);
                    actorAnchor.appendChild(actorDiv);

                    imageContainer.appendChild(actorAnchor);
                }
            })
            .catch(error => console.error(error));
    }
    fetchAndDisplayLocalActors();

    const moreButton = document.getElementById("moreButton");
    if (moreButton) {
        moreButton.addEventListener("click", function(event) {
            event.preventDefault();
            if (actorBuffer.length < actorsPerPage) {
                fetchAndDisplayActors(currentPage, currentLetter, true, 100); 
            } else {
                displayActorsFromBuffer(actorsPerPage); 
            }
        });
    }

    const editionButton = document.getElementById('edition');
    if (editionButton) {
        editionButton.addEventListener('click', () => {
            sessionStorage.setItem('filter', 'edition');
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

        async function searchTmdbForActor(actorName) {
            const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0]; // return the first match
            }
            return null;
        }

        function searchLocalForActor(actorName) {
            return fetch(localApiUrl)
                .then(response => response.json())
                .then(data => {
                    return data.filter(actor => 
                        actor.full_name && actor.full_name.toLowerCase().includes(actorName.toLowerCase())
                    );
                });
        }

        function searchLocalApiForActor(actorName) {
            return fetch(localApi)
                .then(response => response.json())
                .then(data => {
                    return data.filter(actor => 
                        actor.actorname && actor.actorname.toLowerCase().includes(actorName.toLowerCase())
                    );
                });
        }

        searchBar.addEventListener('input', function() {
            let searchTerm = this.value.toLowerCase();
            console.log(`Searching for: ${searchTerm}`);
            if (searchTerm) {
                Promise.all([searchLocalForActor(searchTerm), searchLocalApiForActor(searchTerm), searchTmdbForActor(searchTerm)])
                    .then(async results => {
                        let [localResultsFromDb, localResultsFromApi, tmdbResult] = results;

                        console.log("Local results from DB:", localResultsFromDb);
                        console.log("Local results from API:", localResultsFromApi);
                        console.log("TMDB result:", tmdbResult);

                        let recommendations = '';

                        if (localResultsFromDb.length > 0) {
                            for (const actor of localResultsFromDb) {
                                const actorId = await fetchActorIdFromTmdb(actor.full_name);
                                recommendations += `<li><a href="#" data-actor-id="tmdb-${actorId}" data-actor-name="${actor.full_name}" class="always-active">${actor.full_name}</a></li>`;
                            }
                        }

                        if (localResultsFromApi.length > 0) {
                            recommendations += localResultsFromApi.map(actor => `<li><a href="#" data-actor-id="local-${actor.id}" data-actor-name="${actor.actorname}" class="always-active">${actor.actorname}</a></li>`).join('');
                        }

                        if (tmdbResult) {
                            recommendations += `<li><a href="#" data-actor-id="tmdb-${tmdbResult.id}" data-actor-name="${tmdbResult.name}" class="always-active">${tmdbResult.name}</a></li>`;
                        }

                        if (recommendations) {
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
                let actorId = event.target.getAttribute('data-actor-id');
                let actorName = event.target.getAttribute('data-actor-name');
                window.location.href = `actorProfile.html?id=${actorId}&name=${encodeURIComponent(actorName)}`;
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

    const alphabetLinks = document.querySelectorAll('.letter');
    alphabetLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let letter = this.getAttribute('data-letter').toLowerCase();
            currentLetter = letter;
            currentPage = 1;
            allActorsData = [];
            fetchActorsByLetter(letter);
        });
    });

    async function fetchActorsByLetter(letter) {
        let imageContainer = document.querySelector('.actorsTable .actorsLine');
        imageContainer.innerHTML = ''; 

        if (!allLettersActors[letter]) {
            await fetchAndStoreActorsByLetter(letter);
        }

        actorBuffer = [...allLettersActors[letter]]; 
        displayActorsFromBuffer(actorsPerPage); 
    }

    fetchAndDisplayActors(currentPage, '', true, 100);
});
