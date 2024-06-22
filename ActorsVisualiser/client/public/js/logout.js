function logoutUser() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
}   

const login = document.getElementById('login');
const register = document.getElementById('register');
const logout = document.getElementById('logout');
const addActor = document.getElementById('add-actor');
const addToFavorites = document.getElementById('add-to-favorites');

if (document.cookie.includes('username')) {
    console.log('User is logged in');
    login.style.display = 'none';
    register.style.display = 'none';
    logout.style.display = '';
    addActor.style.display = '';
    addToFavorites.style.display = '';

} else {
    login.style.display = '';
    register.style.display = '';
    logout.style.display = 'none';
    addActor.style.display = 'none';
    addToFavorites.style.display = 'none';
}