import bUser from "../../models/businessUserM.js";
import JWT from "jsonwebtoken";
import {CreateResponse} from "../../utils/customFun.js";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "sequelize";
const saltRounds = 10;


export async function postSignupUser(req, res){
  const { name, email, password,phone_no,organization }= req.body;
  try {
    const hashpassword = await bcrypt.hash(password, saltRounds);

    const data = await bUser.create({
      name: name,
      password: hashpassword,
      email: email,
      organization_name:organization,
      phone_no:phone_no
    });

    res
    .status(201)
    .json(CreateResponse("success","user Signup Successfully",data))
  } catch (error) {  
    if (error instanceof sequelize.UniqueConstraintError) {
      res.status(400).json(CreateResponse("failed","error occured",null,'Email Must Be Unique'));
    } else {
      res.status(500).json(CreateResponse("failed","error occured",null,'something went wrong'));
    }
  }
}

export async function postLoginUser(req, res){
  const email = req.body.email;
  const password = req.body.password;

  try {
    // first check , given email exist or not
    const buser = await bUser.findOne({
      where: {
        email: email,
      },
    });
    // If the user does not exist
    if (!buser) {
      res.status(404).json(CreateResponse("failed","error occured",null,'User Doesnt Exist'));
      return;
    }

    // If the user exists, compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, buser.password);

    // If the password does not match
    if (!isPasswordMatch) {
      res.status(401).json(CreateResponse("failed","error occured",null,'Incorrect Password'));
      return;
    }
    // If both email and password are correct, send the user data as the response
      JWT.sign({ userID: buser.id, name: buser.name },process.env.JWT_SECRET_KEY || 'not exist',(err,token) => {
        if (err) {
          res.status(500).json(CreateResponse("failed","error occured",null,'token not generated'));
        }
        res.status(200).json(CreateResponse("success","toekn genration done",{token,check:'buser'}));
      }
    );
  } catch (error) {
    res.status(500).json(CreateResponse("failed","error occured",null,'an errorOccured during login'));
  }
}

