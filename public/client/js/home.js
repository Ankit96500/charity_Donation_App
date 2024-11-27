

const API_URL = "http://localhost:8000";

// load localstorage creds:
const token = localStorage.getItem('token');
const check = localStorage.getItem('check');


// Get elements from the DOM
const logout = document.getElementById('logout');
const addservice = document.getElementById('addservices');
const addcharitycontainer = document.getElementById('addCharityFormContainer');
const username =  document.getElementById("username");
const searchbarcontainer = document.getElementById('searchBarContainer');
const donationhistory = document.getElementById('donationHistory');
const editUser = document.getElementById('editUser');

// Select elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Reference to the container where cards will be displayed
const servicesContainer = document.getElementById('services');

document.getElementById('addCharityForm').addEventListener('submit',handelAddCharityForm)


const errorid = document.getElementById("error");


// Function to render to Home page from the API
async function renderHomePage() {
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
      localStorage.removeItem('charity_id');
      // get all service from database
      if (check === "user") {
        searchbarcontainer.style.display = "inline";
        donationhistory.style.display = "inline";
        donationhistory.innerText = "Donation History";

        const response1 = await axios.get(`${API_URL}/user/get-dt`,{ headers: { Authorization: token } })
        console.log('coming response1',response1);
        username.innerHTML = response1.data.data.username
        const servicesData = response1.data.data.dt;
        
        // Loop through the services array and create a card for each service
        if (Array.isArray(servicesData)) {
          servicesData.forEach(service => {
            servicesContainer.appendChild(createServiceCard(service));
          });
        }
        
      } else { 
        // show charity form and edit user:
        addcharitycontainer.style.display = 'inline';
        editUser.style.display = "inline";
        editUser.innerText = "Edit User";

        const response2 = await axios.get(`${API_URL}/bUser/get-dt`,{ headers: { Authorization: token } })
        console.log('coming response2',response2);

        username.innerHTML = response2.data.data.username
        const servicesData = response2.data.data.dt;
        
        // Loop through the services array and create a card for each service
        if (Array.isArray(servicesData)) {
          console.log('heah..');
          servicesData.forEach(service => {
            servicesContainer.appendChild(createServiceCard(service));
          });
        }
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



// Handle form submission
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const search = searchInput.value.trim().toLowerCase();
  console.log('search:',search);
  
  try {
      const response1 = await axios.get(`${API_URL}/user/get-search-data?search=${search}`,{ headers: { Authorization: token } })
      console.log('coming response1',response1);
       // Clear the container for fresh search results
      servicesContainer.innerHTML = "";

      const servicesData = response1.data.data;
      if (Array.isArray(servicesData)) {
        servicesData.forEach(service => {
          servicesContainer.appendChild(createServiceCard(service));
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
 
});


// this will create and update
async function handelAddCharityForm(event){
  event.preventDefault();
  const serviceData ={
    charitynm :document.getElementById('addCharityInput').value || '',
    picture : document.getElementById('addCharityPicture').value || '',
    location : document.getElementById('addCharityLocation').value || '',
    donation : document.getElementById('addCharityDonation').value || '',
    goal : document.getElementById('addCharityGoal').value || "",
    ch_id : document.getElementById('ch_id').value  || "",
  }
  document.getElementById('addCharityForm').reset();
 
  try {
    const response = await axios.post(`${API_URL}/bUser/create-update-charity`,serviceData,{headers:{'Authorization':token}});
    const responseData = response.data.data;  
    servicesContainer.appendChild(createServiceCard(responseData));
    window.location.reload(true);

  } catch (error) {
    displayError(error);  // Example error message
    function displayError (error) {
        let err = document.getElementById('custom-alert');
        err.innerHTML = error;  // Insert error message
        err.style.display = 'block';  // Show the alert
        console.log("-----", error);  // Log error response
    
        // Optionally hide the alert after a few seconds
        setTimeout(function () {
            err.style.display = 'none';  // Hide alert after 5 seconds
        }, 5000);
    }
    
  }

}


// Function to create a card
function createServiceCard(data) {
    
  // Create card container
    const card = document.createElement('div');
    card.className = 'card';

    // Add card image
    const img = document.createElement('img');
    img.src = data.picture; // Update the picture path if necessary
    img.alt = data.name;
    card.appendChild(img);
    
    // Add card content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Add service name
    const serviceName = document.createElement('h4');
    serviceName.textContent = data.name;
    cardContent.appendChild(serviceName);

    // Add location
    const location = document.createElement('p');
    location.textContent = `Location: ${data.location}`;
    cardContent.appendChild(location);
    
    // Add posted at
    const postedAt = document.createElement('p');
    postedAt.textContent = `Posted At: ${data.createdAt}`;
    cardContent.appendChild(postedAt);


    // Add price
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `Donation: ${data.donation}`;
    cardContent.appendChild(price);


    if (check === "user") {
      // Add a right-aligned "Book Appointment" button
      const bookButton = document.createElement('button');
      bookButton.className = 'book-btn';
      bookButton.textContent = 'Registration';
        // Add event listener to handle clicks
         bookButton.addEventListener('click', () => {
          localStorage.setItem("charity_id",data.id);
          window.location.href = "../home/bookAppointment.html"
        });
      cardContent.appendChild(bookButton);
      
    } else{
       // Add a right-aligned "edit" button
       const editButton = document.createElement('button');
       editButton.className = 'edit-btn';
       editButton.textContent = 'Edit';
         // Add event listener to handle clicks
          editButton.addEventListener('click', () => {
          editCharity(data.id);
          //  window.location.href = "../home/bookAppointment.html"
         });
       cardContent.appendChild(editButton);

    }

    // Append content to the card
    card.appendChild(cardContent);

    // Return the complete card
    return card;
}

// edit charity
async function editCharity(ch_id){
  try {
      console.log(' iam caling edit charity');
      
    const response1 = await axios.get(`${API_URL}/buser/edit-charity-dt?charity_id=${ch_id}`,{ headers: { Authorization: token } })
    console.log('coming response1',response1);
    const Data = response1.data.data.dt;
    document.getElementById('addCharityInput').value = Data.name
    document.getElementById('addCharityPicture').value = Data.picture
    document.getElementById('addCharityLocation').value = Data.location
    document.getElementById('addCharityDonation').value = Data.donation
    document.getElementById('addCharityGoal').value = Data.goal
    document.getElementById('ch_id').value = Data.id

    
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

// redirect to edit user page:
editUser.addEventListener('click',async ()=>{
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
  window.location.href = '../home/editBuser.html'
});

// redirect to donation history page:
donationhistory.addEventListener("click",async ()=>{
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
  window.location.href = '../home/donationHistory.html'
})



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

// Initial rendering of expenses from CRUD CRUD API
renderHomePage();

