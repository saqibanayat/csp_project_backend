import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    // console.log(req.cookies, req.get('origin'));
    const { email, password } = req.body;
    const users = await pool.query('SELECT * FROM usersdata WHERE user_email = $1', [email]);
    if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    //PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
    if (!validPassword) return res.status(401).json({error: "Incorrect password"});
   
    //get user_type
    const userType =await pool.query('SELECT user_type_name FROM user_type WHERE user_id = $1',[users.rows[0].user_id])
    const getUserType = userType.rows[0].user_type_name;
    //JWT
    
    let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
    res.json({getUserType,tokens});
  } catch (error) {
    res.status(401).json({error: error.message});
  }

});




router.get('/refresh_token',(req,res)=>{
  try {
      const refreshToken = req.cookies.refresh_token;

      if(refreshToken ===null) return res.status(401).json ({error:'null refresh token'});
      jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
          if(error) return res.status(403)({error: error.message});
          let tokens = jwtTokens(user);
          res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
          res.json(tokens);
      })
  } catch (error) {
      res.status(401).json({error:error.message});
  }
})


export default router;