const addActor = document.getElementById('add-actor');

if (document.cookie.includes('username')) {
    console.log('User is logged in and can add an actor');
    addActor.style.display = '';
} else {
    addActor.style.display = 'none';
}