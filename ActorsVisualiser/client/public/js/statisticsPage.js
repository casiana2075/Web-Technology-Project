document.addEventListener('DOMContentLoaded', async () => {
    let start = 0;
    const increment = 20;
    let filteredItems = [];
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');

    const loadImages = async (category, resetStart = false) => {
        if (resetStart) {
            start = 0;
        }
        const resultsContainer = document.querySelector('.movies ul');
        resultsContainer.innerHTML = ''; 
        let responseTextWithImages = '';
        let responseTextWithoutImages = '';
        let displayedActors = {};
    
        let response;
        if (category) {
            response = await fetch(`http://localhost:3001/api/awardsInfo?category=${encodeURIComponent(category)}`);
        }

        if (response) {
            filteredItems = await response.json();
            console.log('filteredItems:', filteredItems);

            for (let i = start; i < start + increment && i < filteredItems.length; i++) {
                const item = filteredItems[i];
                const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(item.full_name)}`);
                const tmdbData = await tmdbResponse.json();

                if (tmdbData.results && tmdbData.results.length > 0) {
                    const actorInfo = tmdbData.results[0];

                    if (displayedActors[actorInfo.name]) {
                        continue;
                    }

                    if (actorInfo.profile_path) {
                        const imageUrl = "https://image.tmdb.org/t/p/w500" + actorInfo.profile_path;
                        const actorPageUrl = `actorProfile.html`;
                        responseTextWithImages += `<li><a href="${actorPageUrl}"><img class="fade" src="${imageUrl}" alt="${actorInfo.name}"></a><p style="color: white;">${actorInfo.name}</p></li>`;
                    } else if (actorInfo.name) {
                        responseTextWithoutImages += `<li><p style="color: white;">${actorInfo.name}</p></li>`;
                    }
                    displayedActors[actorInfo.name] = true;
                } else {
                    responseTextWithoutImages += `<li><p style="color: white;">No actors found</p></li>`;
                }
            }

            resultsContainer.innerHTML += responseTextWithImages + responseTextWithoutImages;
            start += increment;
        }
    };

    try {
        if (filter === 'year') {
            const yearsResponse = await fetch('http://localhost:3001/api/years');
            const years = await yearsResponse.json();
            console.log('yearsResponse:', yearsResponse);
            console.log('years:', years);
            const yearsContainer = document.querySelector('.years');
            yearsContainer.addEventListener('mouseover', () => {
                yearsContainer.style.height = 'auto';
            });
            
            yearsContainer.addEventListener('mouseout', () => {
                yearsContainer.style.height = '140px'; 
            });
            if (!yearsContainer) {
                console.error('No element with class "years" found');
                return;
            }
            years.forEach(year => {
                years.sort((a, b) => a.year - b.year).forEach(year => {
                    console.log('year:', year);
                    if (year.year !== null) {
                        const button = document.createElement('button');
                        button.textContent = year.year;
                        button.classList.add('category-button');
                        button.addEventListener('click', () => loadImages(false, year.year, true));
                        yearsContainer.appendChild(button);
                    }
                });
            });
        } else if (filter === 'category') {
            const categoriesResponse = await fetch('http://localhost:3001/api/categories');
            const categories = await categoriesResponse.json();
            const categoriesContainer = document.querySelector('.categories');
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.category;
                button.classList.add('category-button');
                button.addEventListener('click', () => loadImages(category.category, true));
                categoriesContainer.appendChild(button);
            });
        }  else if (filter === 'movies' || filter === 'tv-series') {
            const category = filter === 'movies' ? 'MOVIES' : 'TV SERIES';
            await loadImages(category, null, true);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
