import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import {authenticateToken} from '../middleware/authorization.js';
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
    const VerifyUser = await pool.query('select * from usersdata where user_email = $1',[req.body.email])
   
    if(VerifyUser.rows[0]) return res.status(401).json({error:"this user is already existed"});
//create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
   await pool.query(
      'INSERT INTO usersdata (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *'
      , [req.body.name, req.body.email, hashedPassword]);

//check the user record and get the id 
      const get_id = await pool.query('SELECT user_id FROM usersdata WHERE user_email=$1',[req.body.email])


      //create user_type
     await pool.query('INSERT INTO user_type(user_type_name,user_id) VALUES($1,$2)',[req.body.role,get_id.rows[0].user_id])

    res.send('you successfully registered');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//show all the packages 




export default router;