
const express = require('express');

const pool = require('../db.js');
const {authenticateToken} =require( '../middleware/authorization.js')
const router = express.Router();



router.post('/userEditProfile',authenticateToken, async (req,res)=>{
    try {
      const finduser =await pool.query('select * from  service_user_profile where user_id=$1',[req.user.user_id])
      if(finduser.rows[0].length===0){
        await pool.query(
            'insert into  service_user_profile( first_name,last_name,phone_no,email,user_id) values($1,$2,$3,$4,$5)'
            , [req.body.firstName,req.body.lastName,req.body.phoneNo,req.user.user_email, req.user.user_id]);
            res.send({message:"succesfully edit profile"})
        }
        else{
          await pool.query(`update service_user_profile set first_name=$1,last_name=$2,phone_no=$3 where user_id=$4`,[
            req.body.firstName,req.body.lastName,req.body.phoneNo, req.user.user_id
          ])
          res.send({message:"succesfully update profile"})
        }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })



  router.post('/providerEditProfile',authenticateToken, async (req,res)=>{
    try {
    const finduser =await pool.query('select * from  service_provider_profile where user_id=$1',[req.user.user_id])
    if(finduser.rows[0].length===0){
          await pool.query(
            `insert into service_provider_profile ( first_name,last_name,phone_no, 
            company, address, city, zip_code ,email,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`
            , [req.body.firstName,req.body.lastName,req.body.phoneNo, 
              req.body.company,req.body.address,req.body.city,req.body.zipCode,req.user.user_email,req.user.user_id]);
            res.send({message:"succesfully edit profile"})
    }
else{
  await pool.query(`update service_provider_profile set first_name=$1,last_name=$2,phone_no=$3, 
  company=$4, address=$5, city=$6, zip_code=$7 where user_id=$8`,[req.body.firstName,req.body.lastName,req.body.phoneNo, 
    req.body.company,req.body.address,req.body.city,req.body.zipCode,req.user.user_id])
    res.send({message:"succesfully update profile"})
}
    
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })
  // export default router;
  module.exports = router;