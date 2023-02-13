// import express from 'express';
// import pool from '../db.js';
// import bcrypt from 'bcrypt';
// import  from ;
const express = require('express');
const pool = require('../db.js');
const bcrypt= require('bcrypt');
const {authenticateToken} =require('../middleware/authorization.js')
// import { jwtTokens } from '../utils/jwt-helpers.js';

// let refreshTokens = [];

const router = express.Router();

/* GET users listing. */
router.get('/allusers',authenticateToken, async (req, res) => {
  try {
    console.log(req.cookies);
    const users = await pool.query('SELECT * FROM usersdata');
    res.json({users : users.rows});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.post('/', async (req, res) => {
  try {
    // check the user is already present or not
    if(!(req.body.name && req.body.email && req.body.password && req.body.role)){
      return res.status(401).json({error:"please fill all the credentials"})
    }
    const VerifyUser = await pool.query('select * from usersdata where user_email = $1',[req.body.email])
   
    if(VerifyUser.rows[0]) return res.status(401).json({error:"this user is already existed"});


    let findRole = await pool.query('select role_name from user_role where role_name=$1',[req.body.role])
    console.log(findRole.rows[0].role_name)
    let getRoleId;
    if(findRole.rows[0].role_name==='service_user'){
      getRoleId = await pool.query(`select role_id from user_role where role_name ='service_user' `)
    }else if(findRole.rows[0].role_name==='service_provider'){
      console.log('provider env')
      getRoleId = await pool.query(`select role_id from user_role where role_name ='service_provider' `)
    }
console.log(getRoleId.rows[0].role_id)
//create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
   await pool.query(
      'INSERT INTO usersdata (user_name,user_email,user_password,role_id) VALUES ($1,$2,$3,$4) RETURNING *'
      , [req.body.name, req.body.email, hashedPassword,getRoleId.rows[0].role_id]);





    
    
    
 
     

    res.send('you successfully registered');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//show all the packages 




// export default router;
module.exports = router