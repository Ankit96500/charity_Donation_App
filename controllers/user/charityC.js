import User from "../../models/userM.js";
import bUser from "../../models/businessUserM.js";
import {CreateResponse} from "../../utils/customFun.js";
import Charity from "../../models/charityM.js";
import Razorpay from "razorpay";
import Order from "../../models/ordersM.js";
import dotenv from "dotenv";
import {mailProtocolMiddelware} from "../../utils/nodemailer.js";
import { where } from "sequelize";
import Registration from "../../models/RegistrationM.js";


dotenv.config();


export const getAllCharities = async (req,res)=>{
    try {
        const dt = await Charity.findAll();
        console.log('thi is call-->');

        const username = req.user.name
        const data = {dt,username}

        res.status(201).json(CreateResponse("success","data fetched",data));
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'charity data not fetched'));
    }
}


export const getCharityData = async (req,res)=>{
    const charity_id = req.query.charity_id;
    
    try {
        const dt = await Charity.findAll({
          where:{id:charity_id},
          include:{
            model:bUser,
            as:"busertb",
            attributes:["name","organization_name","phone_no","email"]
          }
        })

        if (dt.length > 0) {
          const charity = dt[0];
          const formattedData={
              name:charity.name,
              picture:charity.picture,
              location:charity.location,
              goal:charity.goal,
              donation:charity.donation,
              createdAt:charity.createdAt,
              person:charity.busertb.name,
              email:charity.busertb.email,
              organization_name:charity.busertb.organization_name
            }
            // console.log('formateed data',formattedData);
            const username = req.user.name
            const data = {formattedData,username}
        
            res.status(201).json(CreateResponse("success","data fetched",data));
          }else{
 
            const username = req.user.name
            const data = {dt,username}
            // console.log('charity data',dt);
            
            res.status(201).json(CreateResponse("success","data fetched",data));
          }
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'charity data not fetched'));
    }
}


export const getDonationHistory = async (req,res)=>{
  console.log('iam a calling.. doantion histiry');
  
  try {
    const dt = await Registration.findAll();
    console.log('thi is call-->');

    const username = req.user.name
    const data = {dt,username}
    console.log('data:',dt);
    
    res.status(201).json(CreateResponse("success","doantion history data fetched",data));
} catch (error) {
    res.status(400).json(CreateResponse("failed","error occured",null,'doantion history data not fetched'));
}
}



export const buyService = async (req, res) => {
    if (!req.user) {
        res.status(401).json(CreateResponse("failed","error occured",null,'UnAuthorized'));
        return;
      }
    try {
      var instance = new Razorpay({
        key_id: process.env.KEY_ID || 'not exist',
        key_secret: process.env.KEY_SECRET || "not exist",
      });
      
      instance.orders.create(
        { amount: 200, currency: "INR", receipt: "Please Visit Again!",notes:{
          company_name:"Salon Book Appointment",
          customer:req.user.name
        }},
        async (err, order) => {
          if (err) {
            console.log('error hit->',err);
            
            return res.status(500).json(CreateResponse("failed","error occured",null,'Error Creating Order'));
          }
          if (order) {
            // save this order in the database
            // console.log('created order',order);
            try {
              await Order.create({
                orderId: order.id,
                status: "Pending",
                userID: req.user.id,
              })
           
              const data = { order: order, key_id: process.env.KEY_ID }
              res.status(201).json(CreateResponse("success","process done",data));
            } catch (error) {
                console.log('eror insidfe the if:',error);                
              res.status(500).json(CreateResponse("failed","error occured",null,'saving order to data base'));
            }
          }
        }
      );
    } catch (error) {
        console.log('this error->',error);
        
      res.status(401).json(CreateResponse("failed","error occured",null,'unknow error occur'));
    }
  };

export const updateBuyServiceStatus = async (req, res) => {
    try {
      const { order_id, payment_id ,charity_id} = req.body;
  
      // Get order object
      const orderObj = await Order.findOne({ where: { orderId: order_id } });
      if (!orderObj) {
          res
          .status(404)
          .json(CreateResponse("failed","error occured",null,'order not found'));
          return;
      }
      // Update order with paymentId and status
      await orderObj.update({
        paymentId: payment_id,
        status: "SUCCESSFUL",
      });
  
  
      // Update user to become premium user
      if (!req.user) {
        res.status(401).json(CreateResponse("failed","error occured",null,'UnAuthorized'));
        return;
      }
      const user = await User.findByPk(req.user.id);
      if (!user) {
        res.status(404).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
      }
  
    //   await user.update({ isPremiumUser: true });

    // create Registration Table:
    await Registration.create({
      charity_ID:charity_id,
      username:user.name,
      status:true,
      user_ID:user.id
    })
    
    // here will send mail to user:
      const msg = `Congratulation ${user.name} You Have Booked Appointment Successfully`
      mailProtocolMiddelware(user.email,msg);

      // Return success response
      res.status(201).json(CreateResponse("success","transcation successful"));
      return;
    } catch (error) {
        res
        .status(500)
        .json(CreateResponse("failed","error occured",null,'internal server error'));
    }
  };
  
export const transactionFailed = async (req, res) => {
 
  
    try {
      const { order_id ,charity_id} = req.body;
  
      // Get order object
      const orderObj = await Order.findOne({ where: { orderId: order_id } });
      if (!orderObj) {
        res
          .status(404)
          .json(CreateResponse("failed","error occured",null,'order not found'));
        return;
        }
      // Update order with paymentId and status
      await orderObj.update({
        status: "FAILED",
      });
      
      const user = await User.findByPk(req.user.id);
      if (!user) {
        res.status(404).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
      }
    
      // here will send mail to user:
      const msg = `Sorry ${user.name}, You Registration HasBeen Cancelled:`
      mailProtocolMiddelware(user.email,msg);

      // update Registration Table:
      await Registration.create({
        charity_ID:charity_id,
        username:user.name,
        status:false,
        user_ID:user.id
      })
    
      // Return success response
      res.status(201).json(CreateResponse("success","transcation failed successfully"));
      return;
    } catch (error) {
      // console.error("Error in TransactionFailed:", error);
      res
        .status(500)
        .json(CreateResponse("failed","error occured",null,'internal server error'));
    }
  };
  


