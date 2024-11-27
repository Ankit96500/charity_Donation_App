
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import { join } from "path";

//----
dotenv.config()
const app = express();

const PORT = process.env.PORT || 8000

// middelware setup
app.use(express.static(join(process.cwd(),"public")));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.redirect('/client/account/customerLogin.html')
});


// loads routes
import userRoutes from "./routes/user/userR.js";
import bUserRoutes from "./routes/bUser/bUserR.js";

app.use("/user",userRoutes);
app.use("/bUser",bUserRoutes);

// // import models:
import User from "./models/userM.js";
import Charity from "./models/charityM.js";
import bUser from "./models/businessUserM.js";
import Orders from "./models/ordersM.js";
import Registration from "./models/RegistrationM.js";


// USER <---> Registration
User.hasMany(Registration,{foreignKey:"userID",as:"registertb",onDelete:"CASCADE"});
Registration.belongsTo(User,{foreignKey:"userID" ,as:"usertb"})

// // CHARITY <---> Registration
Charity.hasMany(Registration,{foreignKey:"charity_ID",as:"registertb",onDelete:"CASCADE"});
Registration.belongsTo(Charity,{foreignKey:"charity_ID",as:"charitytb"});

// BUSER <----> CHARITY
bUser.hasMany(Charity,{foreignKey:"bUser_ID",as:"charitytb",onDelete:"CASCADE"});
Charity.belongsTo(bUser,{foreignKey:"bUser_ID",as:"busertb"});

// User <--> Order
User.hasMany(Orders,{foreignKey:"userID",as:"orders",onDelete:"CASCADE"});
Orders.belongsTo(User,{foreignKey:"userID",as:"usertb",});




// port listening
sequelize.sync()
// Registration.sync({alter:true})
// .sync({alter:true})
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`running at port http://localhost:${PORT}`);
  });
})
.catch((error)=>{
  console.log(error);
});








