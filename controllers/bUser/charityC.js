
import {CreateResponse} from "../../utils/customFun.js";
import Charity from "../../models/charityM.js";
import bUser from "../../models/businessUserM.js";


export const getAllBUserCharities = async (req,res)=>{
    if (!req.buser || typeof req.buser.getCharitytb !== 'function') {
        res.status(400).json(CreateResponse("failed","error occured",null,'Invalid request: req.buser or getCharitytb method is undefined'));
        return;
    }    
    try {
        // const dt = await Charity.findAll({where:{id:req.buser.id}});
        const dt = await req.buser.getCharitytb();
        const username = req.buser.name
        const data = {dt,username}

        
        res.status(201).json(CreateResponse("success","data fetched",data));
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'service data not fetched'));
    }
}


export const createUpdateCharityPost = async (req,res)=>{
    if (!req.buser) {
        res.status(400).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
    }    
    const {charitynm,picture,location,donation,goal,ch_id} = req.body;
    try {
        let charity;
        if (ch_id) {
           charity = await Charity.findByPk(ch_id);            
        }
        if (charity) {   
            const dt = await charity.update({
                name:charitynm,
                picture:picture,
                location:location,
                donation:donation,
                goal:goal,
                bUser_ID:req.buser.id
            });            
            res.status(201).json(CreateResponse("success","data created",dt));
            return;            
        } else {
            const dt = await Charity.create({
                name:charitynm,
                picture:picture,
                location:location,
                donation:donation,
                goal:goal,
                bUser_ID:req.buser.id
            });            
            res.status(201).json(CreateResponse("success","data created",dt));
            return;
        }
    } catch (error) {
        console.log('disply error',error);       
        res.status(400).json(CreateResponse("failed","error occured",null,'charity data not created'));
    }
}

export const editCharity = async (req,res)=>{
    if (!req.buser) {
        res.status(400).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
    }    
    const charity_id = req.query.charity_id;
    try {
      const dt = await Charity.findByPk(charity_id);
  
      const data = {dt}
  
      res.status(201).json(CreateResponse("success","data fetched",data));
      return;
    } catch (error) {
      res.status(400).json(CreateResponse("failed","error occured",null,'charity data not fetched'));
    }
}
  

export const editUserGet = async (req,res)=>{
    if (!req.buser) {
        res.status(400).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
    }    
    try {
      
        const data = await bUser.findByPk(req.buser.id);
        
        res.status(201).json(CreateResponse("success","data fetched",data));
        return;
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'service data not fetched'));
    }
}

// for update busre
export const editUserUpdate = async (req,res)=>{
    if (!req.buser) {
        res.status(400).json(CreateResponse("failed","error occured",null,'user not found'));
        return;
    }    
    try {
        const {name,email,phone_no,organization_name} = req.body
       
        const user = await bUser.findByPk(req.buser.id);
        await user.update({
            name:name,
            email:email,
            phone_no:phone_no,
            organization_name:organization_name
        })
        res.status(201).json(CreateResponse("success","data Updated.."));
        return;
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'user personal data not updated'));
    }
}