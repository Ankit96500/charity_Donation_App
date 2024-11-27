
const API_URL = "http://localhost:8000";


// load localstorage creds:
const token = localStorage.getItem('token');
const check = localStorage.getItem('check');

// Get elements from the DOM
const logout = document.getElementById('logout');
const username =  document.getElementById("username");
const tableBody = document.getElementById('charity-table-body');
const downloadBtn =  document.getElementById('downloadBtn');

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
        const formattedData = response1.data.data.formattedData;
        
        if (Array.isArray(formattedData)) {
          formattedData.forEach((item) => {
            // Create a new row
            const row = document.createElement('tr');
      
            // Create and append cells for each column
            row.innerHTML = `
              <td>${item.s_no}</td>
              <td class="${item.payment_status ? 'status-true' : 'status-false'}">
                ${item.payment_status ? 'Payment Done' : 'Failed'}
              </td>
              <td>${item.organization}</td>
              <td>${item.person}</td>
              <td>${item.charity_name}</td>
              <td>${item.donation.toLocaleString()}</td>
              <td>${item.created}</td>
            `;
      
            // Append the row to the table body
            tableBody.appendChild(row);
          });
        }

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


downloadBtn.addEventListener("click",async ()=>{
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
    const response = await axios.get(`${API_URL}/user/download-receipt`,{headers:{'Authorization':token}})
        
    if (response.data.state === false) {
      alert(' sorry there is no donation history available: ')
    }
    const jsonData = response.data.data
   
    // Create a link element
    const link = document.createElement('a');

    // link.href = response.data.data;
    link.href = jsonData;
    console.log('Link URL', link.href);

    // Set the download attribute to trigger the download
    link.download = "doantion-history-Report.csv";  // Corrected the .json extension

    link.click();

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
});



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


