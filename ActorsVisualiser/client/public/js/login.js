

if (document.cookie.includes('username')) {
    window.location.href = 'homePage.html';
}

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
            let date = new Date();
            date.setMonth(date.getMonth() + 1);
            document.cookie = `username=${username}; expires=${date.toUTCString()}; path=/`;
            window.location.href = 'homePage.html';
        } else {
            alert('Invalid username or password');
        }
    });


});