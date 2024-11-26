
// console.log("JavaScript file is connected!");
const API_URL = `http://localhost:8000`  

document.getElementById('login-form').addEventListener('submit',handleFormLogin);
// handel form submission login
function handleFormLogin(event){
    event.preventDefault();

    const UserData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    // Create a new blog
    LoginUser(UserData);

    // Reset the form fields
    document.getElementById('login-form').reset();
   
}

// login a user (POST)

async function LoginUser(LoginUserData) {
    const e  = document.getElementById('error')
    try {
        const response = await axios.post(`${API_URL}/user/login-user`,LoginUserData)
        localStorage.setItem('token',response.data.data.token);
        localStorage.setItem('check',response.data.data.check);
        // Redirect to another HTML page
        window.location.href = "../home/home.html"; 
    } catch (error) {
        displayError(error);  // Example error message
        function displayError (error) {
            let err = document.getElementById('custom-alert');
            err.innerHTML = error;  // Insert error message
            err.style.display = 'block';  // Show the alert
            console.log("-----", error.response.data);  // Log error response
        
            // Optionally hide the alert after a few seconds
            setTimeout(function () {
                err.style.display = 'none';  // Hide alert after 5 seconds
            }, 5000);
        }
    }
}




