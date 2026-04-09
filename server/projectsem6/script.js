// script.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication logic (for demonstration purposes)
    if (username === 'admin' && password === 'password') {
        // Redirect to home page on successful login
        window.location.href = 'home.html';
    } else {
        // Show error message
        document.getElementById('errorMessage').innerText = 'Invalid username or password';
    }
});