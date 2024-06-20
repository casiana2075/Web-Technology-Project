
if (document.cookie.includes('username')) {
    window.location.href = 'homePage.html';
}

document.getElementById('register-form').addEventListener('submit', event => {
    event.preventDefault();
    console.log('Form submitted');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;

    console.log(username, password, confirmPassword, email);

    fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword, email })
    }).then(response => {
        if (response.status === 200) {
            let date = new Date();
            date.setMonth(date.getMonth() + 1);
            document.cookie = `username=${username}; expires=${date.toUTCString()}; path=/`;
            window.location.href = 'homePage.html';
        } else {
            response.json().then(data => {
                const errorDiv = document.getElementById('error-message');
                const errorMessage = document.createElement('p');
                errorMessage.textContent = data.message;
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '14px';
                errorMessage.style.fontWeight = 'bold';
                
                errorDiv.innerHTML = '';
                errorDiv.appendChild(errorMessage);

            });
        }
    });
});