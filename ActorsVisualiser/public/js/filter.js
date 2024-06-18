export function filterCategory(category) {
    console.log(`Filtering category: ${category}`);

    fetch(`http://localhost:3000/api/awardsInfo?category=${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('filteredItems', JSON.stringify(data));
            window.location.href = 'statisticsPage.html';
        })
        .catch(error => console.error('Error fetching data:', error));
        
}
window.filterCategory = filterCategory;

/* de refacut */
 function fiterYear(year) {
    console.log(`Filtering year: ${year}`);

    fetch(`http://localhost:3000/api/awardsInfo?year=${encodeURIComponent(year)}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('filteredItems', JSON.stringify(data));
            window.location.href = 'statisticsPage.html';
        })
        .catch(error => console.error('Error fetching data:', error));
    }