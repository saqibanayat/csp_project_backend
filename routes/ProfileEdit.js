
const express = require('express');

const pool = require('../db.js');

const router = express.Router();



router.post('/userEditProfile', async (req,res)=>{
    try {
        await pool.query(
            'UPDATE service_user_profile SET first_name=$1,last_name=$2,phone_no=$3 WHERE email =$4'
            , [req.body.firstName,req.body.lastName,req.body.phoneNo, req.body.email]);
            res.send({message:"succesfully edit profile"})
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })



  router.post('/providerEditProfile', async (req,res)=>{
    try {
        await pool.query(
            'UPDATE service_provider_profile SET first_name=$1,last_name=$2,phone_no=$3, company =$5, address=$6, city=$7, zip_code=$8 WHERE email =$4'
            , [req.body.firstName,req.body.lastName,req.body.phoneNo, req.body.email,req.body.company,req.body.address,req.body.city,req.body.zipCode]);
            res.send({message:"succesfully edit profile"})
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })
  // export default router;
  module.exports = router;