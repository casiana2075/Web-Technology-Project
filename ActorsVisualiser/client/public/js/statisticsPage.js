function generateTvSeriesChart(chart, newData) {
    if (!chart || !chart.data) {
        console.error("Chart or chart data is not defined");
        return;
    }

    const tvSeriesData = {};
    newData.forEach(item => {
        if (!tvSeriesData[item.show]) {
            tvSeriesData[item.show] = { actorCount: 0, wonCount: 0 };
        }
        tvSeriesData[item.show].actorCount += 1;
        if (item.won) {
            tvSeriesData[item.show].wonCount += 1;
        }
    });

    Object.keys(tvSeriesData).forEach(show => {
        const actorCount = tvSeriesData[show].actorCount;
        const wonCount = tvSeriesData[show].wonCount;
        const labelIndex = chart.data.labels.indexOf(show);

        if (labelIndex === -1) {
            chart.data.labels.push(show);
            chart.data.datasets[0].data.push(actorCount);
            chart.data.datasets[1].data.push(wonCount);
        } else {
            chart.data.datasets[0].data[labelIndex] = actorCount;
            chart.data.datasets[1].data[labelIndex] = wonCount;
        }
    });
    chart.update();
}

function generateChart(chart, newData) {
    if (!chart || !chart.data) {
        console.error("Chart or chart data is not defined");
        return;
    }

    newData.forEach(item => {
        const labelIndex = chart.data.labels.indexOf(item.show);

        if (labelIndex === -1) {
            chart.data.labels.push(item.show);
            chart.data.datasets[0].data.push(item.actorCount);
            chart.data.datasets[1].data.push(item.wonCount);
        } else {
            chart.data.datasets[0].data[labelIndex] = item.actorCount;
            chart.data.datasets[1].data[labelIndex] = item.wonCount;
        }
    });
    chart.update();
}

function createChartContext(elementId, chartType) {
    const ctx = document.getElementById(elementId).getContext('2d');
    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Number of Nominated Actors',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Number of Winning Actors',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function exportCSV(charts) {
    const csvRows = [];
    const headers = ['Show', 'Number of Nominated Actors', 'Number of Winning Actors'];
    csvRows.push(headers.join(','));

    charts.forEach(chart => {
        if (chart && chart.data) {
            chart.data.labels.forEach((label, index) => {
                const row = [
                    label,
                    chart.data.datasets[0].data[index],
                    chart.data.datasets[1].data[index]
                ];
                csvRows.push(row.join(','));
            });
        }
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);

    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'chart_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportWebP(charts) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const chartWidth = charts[0].width;
    const chartHeight = charts[0].height;

    canvas.width = chartWidth * charts.length;
    canvas.height = chartHeight;

    charts.forEach((chart, index) => {
        ctx.drawImage(chart.canvas, chartWidth * index, 0);
    });

    canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'all_charts.webp';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 'image/webp');
}

function exportSVG(charts) {
    const svgRows = [];
    charts.forEach((chart, index) => {
        if (chart) {
            const svgUrl = chart.toBase64Image('image/svg+xml', 1);
            fetch(svgUrl)
                .then(res => res.text())
                .then(data => {
                    svgRows.push(data);
                    if (index === charts.length - 1) {
                        const blob = new Blob(svgRows, { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `all_charts.svg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                });
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    let start = 0;
    const increment = 3;
    let filteredItems = [];
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    let displayedShows = new Set();
    let displayedActors = new Set();
    let barChart, lineChart, pieChart;

    const loadImages = async (filterValue, resetStart = false) => {
        if (resetStart) {
            start = 0;
            filteredItems = [];
            displayedShows.clear();
            displayedActors.clear();
        }
        const resultsContainer = document.querySelector('.movies ul');
        if (resetStart) {
            resultsContainer.innerHTML = '';
        }

        let responseText = '';
        let response;

        if (filter === 'year') {
            response = await fetch(`http://localhost:3001/api/awardsInfo?year=${encodeURIComponent(filterValue)}`);
        } else if (filter === 'category' || filter === 'movies') {
            response = await fetch(`http://localhost:3001/api/awardsInfo?category=${encodeURIComponent(filterValue)}`);
        } else if (filter === 'tv-series') {
            response = await fetch(`http://localhost:3001/api/seriesCategories`);
        }

        if (response) {
            const newItems = await response.json();
            let filteredNewItems;

            if (filter === 'year') {
                const specialItems = newItems.filter(item => item.year && item.year.includes('26th Annual Screen Actors Guild Awards'));
                const otherItems = newItems.filter(item => item.year && !item.year.includes('26th Annual Screen Actors Guild Awards'));
                otherItems.sort((a, b) => b.year.localeCompare(a.year));
                filteredNewItems = specialItems.concat(otherItems);
            } else if (filter === 'category' || filter === 'tv-series') {
                filteredNewItems = newItems.filter(item => item.category && item.category !== '');
            }

            filteredItems = filteredItems.concat(filteredNewItems);
            console.log('filteredItems:', filteredItems);

            let chartData = [];

            if (filter === 'tv-series') {
                console.log('Generating charts for TV series');
                for (const item of filteredItems) {
                    const showName = item.show || 'Unknown';
                    if (!displayedShows.has(showName)) {
                        const actors = filteredItems.filter(i => i.show === showName);
                        const wonCount = actors.filter(actor => actor.won).length;
                        chartData.push({ show: showName, actorCount: actors.length, wonCount: wonCount });
                        displayedShows.add(showName);

                        let showImageUrl = '';
                        try {
                            const tmdbShowResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(showName)}`);
                            const tmdbShowData = await tmdbShowResponse.json();
                            if (tmdbShowData.results && tmdbShowData.results.length > 0) {
                                showImageUrl = tmdbShowData.results[0].poster_path ? "https://image.tmdb.org/t/p/w500" + tmdbShowData.results[0].poster_path : '';
                            }
                        } catch (error) {
                            console.error('Error fetching show image:', error);
                        }

                        responseText += `<div class="show-container"><img class="show-image" src="${showImageUrl}" alt="${showName}"><h3>${showName}</h3><div class="actors-container">`;
                        for (const actor of actors) {
                            let actorImageUrl = '';
                            try {
                                const tmdbActorResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(actor.full_name)}`);
                                const tmdbActorData = await tmdbActorResponse.json();
                                if (tmdbActorData.results && tmdbActorData.results.length > 0) {
                                    actorImageUrl = tmdbActorData.results[0].profile_path ? "https://image.tmdb.org/t/p/w500" + tmdbActorData.results[0].profile_path : '';
                                }
                            } catch (error) {
                                console.error('Error fetching actor image:', error);
                            }

                            responseText += `<div class="actor-item"><img class="actor-image" src="${actorImageUrl}" alt="${actor.full_name}"><p>${actor.full_name}</p></div>`;
                        }
                        responseText += `</div></div>`;
                    }
                }
                generateTvSeriesChart(barChart, chartData);
                generateTvSeriesChart(lineChart, chartData);
                generateTvSeriesChart(pieChart, chartData);
            } else {
                for (let i = start; i < start + increment && i < filteredItems.length; i++) {
                    const item = filteredItems[i];
                    const showName = item.show || '';

                    if (showName && !displayedShows.has(showName)) {
                        console.log('Fetching show info for:', showName);
                        const tmdbShowResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(showName)}`);
                        const tmdbShowData = await tmdbShowResponse.json();
                        console.log('tmdbShowData:', tmdbShowData);

                        if (tmdbShowData.results && tmdbShowData.results.length > 0) {
                            const showInfo = tmdbShowData.results[0];
                            const showImageUrl = showInfo.poster_path ? "https://image.tmdb.org/t/p/w500" + showInfo.poster_path : '';

                            responseText += `<div class="show-container"><img class="fade show-image" src="${showImageUrl}" alt="${showName}"><p class="show-title">${showName}</p><div class="actors-container">`;
                            displayedShows.add(showName);

                            const actors = filteredItems.filter(item => item.show === showName);
                            console.log('Actors for show:', showName, actors);

                            const wonCount = actors.filter(actor => actor.won).length;
                            chartData.push({ show: showName, actorCount: actors.length, wonCount: wonCount });

                            for (const actor of actors) {
                                if (displayedActors.has(actor.full_name)) {
                                    continue;
                                }
                                console.log('Fetching actor info for:', actor.full_name);
                                const tmdbActorResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=524b8acb224e3bc712c2c9b11ddeca4e&query=${encodeURIComponent(actor.full_name)}`);
                                const tmdbActorData = await tmdbActorResponse.json();
                                console.log('tmdbActorData:', tmdbActorData);

                                if (tmdbActorData.results && tmdbActorData.results.length > 0) {
                                    const actorInfo = tmdbActorData.results[0];
                                    const actorImageUrl = actorInfo.profile_path ? "https://image.tmdb.org/t/p/w500" + actorInfo.profile_path : '';
                                    const actorPageUrl = `actorProfile.html?id=${actorInfo.id}`;

                                    if (actorImageUrl) {
                                        responseText += `<div class="actor-item"><a href="${actorPageUrl}"><img class="fade actor-image" src="${actorImageUrl}" alt="${actorInfo.name}"></a><p class="actor-name">${actorInfo.name}</p></div>`;
                                    } else {
                                        responseText += `<div class="actor-item"><p class="actor-name">${actorInfo.name}</p></div>`;
                                    }
                                    displayedActors.add(actor.full_name);
                                } else {
                                    console.log('No actors found for:', actor.full_name);
                                }
                            }

                            responseText += `</div></div>`;
                        } else {
                            console.log('No show found for:', showName);
                        }
                    }
                }
                generateChart(barChart, chartData);
                generateChart(lineChart, chartData);
                generateChart(pieChart, chartData);
            }

            resultsContainer.innerHTML += responseText;
            start += increment;
        }
    };

    try {
        if (filter === 'year') {
            const yearsResponse = await fetch('http://localhost:3001/api/years');
            const years = await yearsResponse.json();
            const yearsContainer = document.querySelector('.years');
            if (!yearsContainer) {
                console.error('No element with class "years" found');
                return;
            }
            years.sort((a, b) => b.year - a.year).forEach(year => {
                if (year.year !== null) {
                    const button = document.createElement('button');
                    button.textContent = year.year;
                    button.classList.add('category-button');
                    button.addEventListener('click', () => loadImages(year.year, true));
                    yearsContainer.appendChild(button);
                }
            });
        } else if (filter === 'category') {
            const categoriesResponse = await fetch('http://localhost:3001/api/categories');
            const categories = await categoriesResponse.json();
            const categoriesContainer = document.querySelector('.categories');
            if (!categoriesContainer) {
                console.error('No element with class "categories" found');
                return;
            }
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category.category;
                button.classList.add('category-button');
                button.addEventListener('click', () => loadImages(category.category, true));
                categoriesContainer.appendChild(button);
            });
        } else if (filter === 'movies') {
            const category = 'MOVIES';
            await loadImages(category, true);
        } else if (filter === 'tv-series') {
            await loadImages(filter, true);
        }

        barChart = createChartContext('barChart', 'bar');
        lineChart = createChartContext('lineChart', 'line');
        pieChart = createChartContext('pieChart', 'pie');
    } catch (error) {
        console.error('Error:', error);
    }

    const moreButton = document.getElementById('moreButton');
    moreButton.addEventListener('click', () => {
        const filterValue = urlParams.get('category') || urlParams.get('year') || 'tv-series';
        loadImages(filterValue);
    });

    const initialFilterValue = urlParams.get('category') || urlParams.get('year') || 'tv-series';
    if (initialFilterValue) {
        loadImages(initialFilterValue, true);
    }

    document.getElementById('exportCSV').addEventListener('click', () => exportCSV([barChart, lineChart, pieChart]));
    document.getElementById('exportWebP').addEventListener('click', () => exportWebP([barChart, lineChart, pieChart]));
    document.getElementById('exportSVG').addEventListener('click', () => exportSVG([barChart, lineChart, pieChart]));
});
