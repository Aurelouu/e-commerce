class ClientAuth {
    isLoggedIn() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        console.log(currentUser);

        if (currentUser === null) {
            return false;
        }

        return true;
    }

    disconnect() {
        localStorage.removeItem('user');
        window.location.reload(false);
        return true;
    }

    isAdmin() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser === null) {
            return false;
        }
        if (currentUser.role === "admin") {
            return true;
        }
        return false;
    }

    getUser() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        return currentUser;
    }

    getRole() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        return currentUser.role;
    }

    getName() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        return currentUser.name;
    }

    getEmail() {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        return currentUser.email;
    }

    getCreationDate() {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        return currentUser.creation_date;
    }
}

export default new ClientAuth();