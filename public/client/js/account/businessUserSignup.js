console.log("JavaScript file is connected!");
// booking appointment app hit create,get api
const API_URL = `http://localhost:8000`  
document.addEventListener('DOMContentLoaded', () => {

    
    document.getElementById('signup-form').addEventListener('submit', handleFormSubmit)
    
    // Handle form submission signup
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const UserData = {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            phone_no:document.getElementById('phone_no').value,
            organization:document.getElementById('organization').value,
        };
        // Create a new blog
        SignupUser(UserData);
        
        // Reset the form fields
        document.getElementById('signup-form').reset();
    }
    
    
    // Create a new user (POST)
   async function SignupUser(UserData) {
        try {
            await axios.post(`${API_URL}/bUser/signup-user`,UserData) 
            window.location.href = "../account/businessUserLogin.html"
        } catch (error) {
            displayError(error);  // Example error message
            function displayError (error) {
                let err = document.getElementById('custom-alert');
                err.innerHTML = error.response.data.error;  // Insert error message
                err.style.display = 'block';  // Show the alert
                console.log("-----", error.response);  // Log error response
            
                // Optionally hide the alert after a few seconds
                setTimeout(function () {
                    err.style.display = 'none';  // Hide alert after 5 seconds
                }, 5000);
            }    
        }        
    }
    
});






