

document.getElementById('login-form').addEventListener('submit', event => {

    event.preventDefault();

    console.log('Form submitted');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(response => {
        if (response.status === 200) {
            window.location.href = 'homePage.html';
        } else {
            alert('Invalid username or password');
        }
    });


});