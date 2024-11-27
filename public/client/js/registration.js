

const API_URL = "http://13.203.0.136:8000"

// load localstorage creds:
const token = localStorage.getItem('token');
const check = localStorage.getItem('check');

const charity_id = localStorage.getItem('charity_id');
const username =  document.getElementById("username");
const servicesContainer = document.getElementById('services');
const logout = document.getElementById('logout');
const donationhistory = document.getElementById('donationHistory');


const buyServiceBtn = document.getElementById("rzp-button1");
async function renderCharityRegistrationPage(){
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

        donationhistory.style.display = "inline";
        donationhistory.innerText = "Donation History"; 
        const response =  await axios.get(`${API_URL}/user/get-charity?charity_id=${charity_id}`,{headers:{'Authorization':token}});
        console.log(" coming reposene: ", response);

        let responseData;
        if (response.data.data.dt) {
          responseData = response.data.data.dt
        } else {
          responseData = response.data.data.formattedData
        }  
        username.innerHTML = response.data.data.username;
        servicesContainer.appendChild(createServiceCard(responseData));
        
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


// Function to create a card
function createServiceCard(data) {
    console.log('insdie the data',data);
    
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

    // Add charity name
    const charityName = document.createElement('h4');
    charityName.textContent = data.name;
    cardContent.appendChild(charityName);

    // Add organization name
    const organizationName = document.createElement('h3');
    organizationName.textContent = data.organization_name;
    cardContent.appendChild(organizationName);

    // add person
    const founder = document.createElement('h4');
    founder.textContent =`Founder: ${ data.person}`;
    cardContent.appendChild(founder);
   
    // add person
    const founderEmail = document.createElement('p');
    founderEmail.textContent =`${ data.email}`;
    cardContent.appendChild(founderEmail);

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
    price.textContent = `Donation: ₹${data.donation}`;
    cardContent.appendChild(price);
    
    // Add goal
    const goal = document.createElement('p');
    goal.className = 'goal';
    goal.textContent = `Goal: ${data.goal}`;
    cardContent.appendChild(goal);

    // Append content to the card
    card.appendChild(cardContent);

    // Return the complete card
    return card;
}

// function buy premium handeler
buyServiceBtn.addEventListener("click", async (e) => {
    console.log(' i am click nbutn');

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
      const response = await axios.get(`${API_URL}/user/buy-service`,{ headers: { 'Authorization': token } });  
      
      var options = {
        key: response.data.data.key_id, // Enter the Key ID generated from the Dashboard
        order_id: response.data.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        description: "Test Transaction",
        // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
        handler: async function (res) {
          await axios.post(
            `${API_URL}/user/update-service-status`,
            {
              order_id: options.order_id,
              payment_id: res.razorpay_payment_id,
              charity_id:charity_id,
            },
            { headers: { Authorization: token } }
          );
          // console.log(`handeler function:L ${order_id}  ----   ${payment_id}`);
          
          window.location.reload(); // reload the page
        },
      };
    
      var rzp1 = new Razorpay(options);
    
      rzp1.open();
      e.preventDefault();
      
       // if payement failed..
      rzp1.on("payment.failed", async function (params) {
        console.log('payemd faild called',params);
        
         try {
           await axios.post( `${API_URL}/user/service-transcation-failed`,
               { order_id: options.order_id , charity_id:charity_id,},{ headers: { Authorization: token } })
         } catch (error) {
          console.log(`Payment has been cancelled`);
         }
     
      });
    } catch (error) {
      displayError(error);  // Example error message
      function displayError (error) {
          let err = document.getElementById('custom-alert');
          err.innerHTML = `${error} Check Your Internet Connection`;  // Insert error message
          err.style.display = 'block';  // Show the alert
        
          // Optionally hide the alert after a few seconds
          setTimeout(function () {
              err.style.display = 'none';  // Hide alert after 5 seconds
          }, 5000);
      }
    }
    
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




renderCharityRegistrationPage();

