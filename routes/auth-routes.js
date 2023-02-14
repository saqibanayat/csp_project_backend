
const express = require('express');
const {authenticateToken} =require('../middleware/authorization.js')
const router = express.Router();

const { login, forgetPassword, restPassword, logout, refreshToken, newUser, allUser } = require('../controllers/userController.js');

router.route('/register').post(newUser)
router.route('/allusers').get(authenticateToken,allUser)

router.route('/login').post(login)

router.route('/forgetpassword').post(forgetPassword)
router.route('/restpassword/:id').post(restPassword)

router.route('/logout').delete(logout)
router.route('/refresh_token').get(refreshToken)


module.exports= router;