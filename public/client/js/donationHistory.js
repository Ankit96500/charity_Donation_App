
const API_URL = "http://localhost:8000";


// load localstorage creds:
const token = localStorage.getItem('token');
const check = localStorage.getItem('check');

// Get elements from the DOM
const logout = document.getElementById('logout');
const username =  document.getElementById("username");


async function renderDonationPage() {   
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

        const response1 = await axios.get(`${API_URL}/user/get-donation-history`,{ headers: { Authorization: token } })
        console.log('coming response1',response1);
        username.innerHTML = response1.data.data.username;

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



//logout function
logout.addEventListener("click",()=>{
    //redirect to login page and vanish all localstorage data:
    localStorage.removeItem('check')
    localStorage.removeItem('token')
    console.log('i am calling logout');
    
    if (check === "user") {
      // reirect to user login
      window.location.href = "../account/customerLogin.html"    
    } else {
      // reirect to business-user login
      window.location.href = "../account/businessUserLogin.html"    
    }
  
  })
  

renderDonationPage();


