
import { Router } from 'express';

import { postSignupUser ,postLoginUser} from '../../controllers/user/accountC.js';

import {getAllCharities,getCharityData,buyService,updateBuyServiceStatus,transactionFailed,getDonationHistory,downloadReceipt,getAllSearchData} from '../../controllers/user/charityC.js'
import { UserAuthorized } from '../../middleware/userAuthorize.js';


const router = Router();

// /admin/create user => POST
router.post('/signup-user', postSignupUser);

// /admin/loginuser => POST
router.post('/login-user', postLoginUser);

router.get('/get-dt',UserAuthorized,getAllCharities);

// get all serach data
router.get('/get-search-data',UserAuthorized,getAllSearchData);

router.get('/get-charity',UserAuthorized,getCharityData);

router.get('/get-donation-history',UserAuthorized,getDonationHistory);

router.get('/download-receipt',UserAuthorized,downloadReceipt);



// razopay intergrationa setup ::
router.get("/buy-service",UserAuthorized,buyService);

router.post("/update-service-status",UserAuthorized,updateBuyServiceStatus);

router.post("/service-transcation-failed",UserAuthorized,transactionFailed);

export default router;
