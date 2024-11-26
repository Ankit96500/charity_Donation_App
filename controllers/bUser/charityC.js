
import {CreateResponse} from "../../utils/customFun.js";
import Charity from "../../models/charityM.js";


export const getAllBUserCharities = async (req,res)=>{
    console.log('b user->',req.buser.id);
    
    try {
        if (!req.buser || typeof req.buser.getCharitytb !== 'function') {
            throw new Error('Invalid request: req.buser or getCharitytb method is undefined');
        }    
        // const dt = await Charity.findAll({where:{id:req.buser.id}});
        const dt = await req.buser.getCharitytb();
        const username = req.buser.name
        const data = {dt,username}

        
        res.status(201).json(CreateResponse("success","data fetched",data));
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'service data not fetched'));
    }
}


export const createCharityPost = async (req,res)=>{
    console.log('request data',req.body);
    console.log('request username',req.buser.name);

    const {charitynm,picture,location,donation,goal} = req.body;
    
    try {
        const dt = await Charity.create({
            name:charitynm,
            picture:picture,
            location:location,
            donation:donation,
            goal:goal,
            bUser_ID:req.buser.id
        });
        console.log('date craetd-->',dt);
        
        res.status(201).json(CreateResponse("success","data created",dt));
    } catch (error) {
        res.status(400).json(CreateResponse("failed","error occured",null,'charity data not created'));
    }
}




