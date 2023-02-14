
const express = require('express');
const { user_editProfile, provider_editProfile } = require('../controllers/editProfileController.js');


const {authenticateToken} =require( '../middleware/authorization.js')
const router = express.Router();


router.route('/userEditProfile').post(authenticateToken,user_editProfile)
router.route('/providerEditProfile').post(authenticateToken,provider_editProfile)



  // export default router;
  module.exports = router;