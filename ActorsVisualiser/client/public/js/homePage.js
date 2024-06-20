//logout function
function logoutUser() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
}   

const login = document.getElementById('login');
const register = document.getElementById('register');
const logout = document.getElementById('logout');

if (document.cookie.includes('username')) {
    console.log('User is logged in');
    login.style.display = 'none';
    register.style.display = 'none';
    logout.style.display = '';
} else {
    login.style.display = '';
    register.style.display = '';
    logout.style.display = 'none';
}

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