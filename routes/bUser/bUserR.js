
import { Router } from 'express';

import { postSignupUser ,postLoginUser} from '../../controllers/bUser/accountC.js';
import {getAllBUserCharities,createUpdateCharityPost,editUserGet,editUserUpdate,editCharity} from "../../controllers/bUser/charityC.js";

import {bUserAuthorized} from "../../middleware/bUserAuthorize.js";

const router = Router();

// /admin/create user => POST
router.post('/signup-user', postSignupUser);

// /admin/loginuser => POST
router.post('/login-user', postLoginUser);

// get all business user charity
router.get('/get-dt',bUserAuthorized,getAllBUserCharities);

router.get('/edit-charity-dt',bUserAuthorized,editCharity);

// create charity business user:
router.post('/create-update-charity',bUserAuthorized,createUpdateCharityPost);

router.get('/edit-user',bUserAuthorized,editUserGet);

router.put('/edit-user-update',bUserAuthorized,editUserUpdate);




export default router;
