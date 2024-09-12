document.addEventListener('DOMContentLoaded', function () {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {

            document.getElementById('navbar-container').innerHTML = data;

            const user = localStorage.getItem('user');
            let role = '';

            if (user) {
                const userData = JSON.parse(user);
                role = userData.role;
            }

            const navbar = document.querySelector('.navbar-nav'); // Query the navbar once

            if (role === 'admin') {
                const adminNavItem = document.createElement('li');
                adminNavItem.classList.add('nav-item');
                adminNavItem.innerHTML = '<a class="nav-link" href="admin.html">Admin Dashboard</a>';

                const logoutNavItem = navbar.querySelector('.logout-nav-item');
                if (logoutNavItem) {
                    navbar.insertBefore(adminNavItem, logoutNavItem);
                }
            } else {
                const userNavItem = document.createElement('li');
                userNavItem.classList.add('nav-item');
                userNavItem.innerHTML = '<a class="nav-link" href="profile.html">Profile</a>'; // Corrected 

                const logoutNavItem = navbar.querySelector('.logout-nav-item');
                if (logoutNavItem) {
                    navbar.insertBefore(userNavItem, logoutNavItem);
                }
            }
        })
        .catch(error => console.error("Error loading navbar:", error));

});


function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
