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