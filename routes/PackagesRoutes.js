
const express = require('express');

const {show_Packages,package_Add, package_Attribute, show_Attributes, addFilterPackages }= require('../controllers/packageController.js')
const {authenticateToken} =require( '../middleware/authorization.js')
const router = express.Router();



router.route('/showPackages').get(show_Packages)
router.route('/packageAdd').post(authenticateToken,package_Add)
router.route('/packageAttributes').post(package_Attribute)

router.route('/showAttributes').get(show_Attributes)
router.route('/addFilterPackages').post(addFilterPackages)
module.exports = router;