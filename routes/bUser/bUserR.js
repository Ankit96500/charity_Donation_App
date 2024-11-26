
import { Router } from 'express';

import { postSignupUser ,postLoginUser} from '../../controllers/bUser/accountC.js';
import {getAllBUserCharities,createCharityPost} from "../../controllers/bUser/charityC.js";

import {bUserAuthorized} from "../../middleware/bUserAuthorize.js";

const router = Router();

// /admin/create user => POST
router.post('/signup-user', postSignupUser);

// /admin/loginuser => POST
router.post('/login-user', postLoginUser);

// get all business user charity
router.get('/get-dt',bUserAuthorized,getAllBUserCharities);

// create charity business user:
router.post('/create-charity',bUserAuthorized,createCharityPost);




export default router;
