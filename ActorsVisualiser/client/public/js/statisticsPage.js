document.addEventListener('DOMContentLoaded', async () => {
    let start = 0;
    const increment = 20;
    let filteredItems = [];

    const loadImages = async (category,resetStart = false) => {
        if (resetStart) {
            start = 0;
        }
        const resultsContainer = document.querySelector('.movies ul');
        let responseTextWithImages = '';
        let responseTextWithoutImages = '';
        let displayedActors = {};
        ///placeholder for year
        const year = "2019 - 25th Annual";
        const response = await fetch(`http://localhost:3001/api/awardsInfo?category=${encodeURIComponent(category)}&year=${encodeURIComponent(year)}`);
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
                } else if (actorInfo.name) { // check if actor has a name
                    responseTextWithoutImages += `<li><p style="color: white;">${actorInfo.name}</p></li>`;
                }
                displayedActors[actorInfo.name] = true;
            } else {
                responseTextWithoutImages += `<li><p style="color: white;">No actors found</p></li>`;
            }
        }

        resultsContainer.innerHTML += responseTextWithImages + responseTextWithoutImages;
        start += increment;
    };

    try {
        const categoriesResponse = await fetch('http://localhost:3001/api/categories');
        console.log('categoriesResponse:', categoriesResponse);
        const categories = await categoriesResponse.json();

        const categoriesContainer = document.querySelector('.categories');
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.category; // assuming each category is an object with a property called 'name'
            button.classList.add('category-button');
            button.addEventListener('click', () => loadImages(button.textContent, true));
            categoriesContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});