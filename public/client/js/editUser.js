
const API_URL = "http://localhost:8000";


// load localstorage creds:
const token = localStorage.getItem('token');
const check = localStorage.getItem('check');

// Get elements from the DOM


async function renderEditPage() {
    try {
        if (token === null) {
            // if token not available
            if (check === "user") {
              // reirect to user login
              window.location.href = "../account/customerLogin.html"    
            } else {
              // reirect to business-user login
              window.location.href = "../account/businessUserLogin.html"    
            }
        }
        const response = await axios.get(`${API_URL}/bUser/edit-user`,{ headers: { Authorization: token } })
        console.log('coming response2',response.data.data);
        const dt = response.data.data
        document.getElementById("userName").value = dt.name;
        document.getElementById("userEmail").value = dt.email;
        document.getElementById("userPhone").value = dt.phone_no;
        document.getElementById("userOrganization").value = dt.organization_name;
    } catch (error) {
        displayError(error);  // Example error message
        function displayError (error) {
            let err = document.getElementById('custom-alert');
            console.log('error:',error);
              
            err.innerHTML = error;  // Insert error message
            err.style.display = 'block';  // Show the alert
        
            // Optionally hide the alert after a few seconds
            setTimeout(function () {
                err.style.display = 'none';  // Hide alert after 5 seconds
            }, 5000);
        }
        
    }
}


// Handle form submission
document.getElementById("updateUserForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Capture updated data
    const updatedUserData = {
        name: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        phone_no: document.getElementById("userPhone").value,
        organization_name: document.getElementById("userOrganization").value,
    };
    try {
        if (token === null) {
            // if token not available
            if (check === "user") {
              // reirect to user login
              window.location.href = "../account/customerLogin.html"    
            } else {
              // reirect to business-user login
              window.location.href = "../account/businessUserLogin.html"    
            }
        }
        const response = await axios.put(`${API_URL}/bUser/edit-user-update`,updatedUserData,{ headers: { Authorization: token } })
        
        window.location.href = "../home/home.html"
    } catch (error) {
        displayError(error);  // Example error message
        function displayError (error) {
            let err = document.getElementById('custom-alert');
            console.log('error:',error.response.data);
              
            err.innerHTML = error.response.data.error;  // Insert error message
            err.style.display = 'block';  // Show the alert
        
            // Optionally hide the alert after a few seconds
            setTimeout(function () {
                err.style.display = 'none';  // Hide alert after 5 seconds
            }, 5000);
        }
        
    }

    
});





renderEditPage();
