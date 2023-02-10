
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db.js');
const bcrypt= require('bcrypt');
const {jwtTokens, refreshJwtToken } =require('../utils/jwt-helpers.js');
const router = express.Router();
const nodemailer = require('nodemailer')

router.post('/login', async (req, res) => {
 
  try {
    // console.log(req.cookies, req.get('origin'));
    if(!(req.body.email && req.body.password )){
      return res.status(401).json({error:"please fill all the credentials"})
    }

    const {email,password} = req.body;
    
    const users = await pool.query('SELECT * FROM usersdata WHERE user_email = $1', [email]);
    if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    const userName = users.rows[0].user_name;
    const userEmail = users.rows[0].user_email;
   
    //PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
    if (!validPassword) return res.status(401).json({error: "Incorrect password"});
   
    //get user_type
    const userType =await pool.query('SELECT user_type_name FROM user_type WHERE user_id = $1',[users.rows[0].user_id])
    const getUserType = userType.rows[0].user_type_name;
    //JWT
    
    let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    // let refresh = refreshJwtToken(users.rows[0])
    res.cookie('refresh_token', tokens.accessToken, {httpOnly: true,sameSite:'None',maxAge:1000*60*60*24});
    res.json({getUserType,userName,tokens});
  } catch (error) {
    res.status(401).json({error: error.message});
  }

});

//reset password
router.post('/resetpassword', async (req, res) => {
try{
  if(!(req.body.email )){
    return res.status(401).json({error:"please fill all the credentials"})
  }
let user=await pool.query('select user_email from usersdata where user_email = $1',[req.body.email])
if (user.rows.length === 0) return res.status(401).json({error:"user not found"});

const num = 8;
const randomNameGenerator = num => {
   let res = '';
   for(let i = 0; i < num; i++){
      const random = Math.floor(Math.random() * 27);
      res += String.fromCharCode(97 + random);
   };
   return res;
};
let newpassword=randomNameGenerator(num);
console.log(newpassword)


// const hashedPassword = await bcrypt.hash(randomNameGenerator(num), 10);
await pool.query('update usersdata set user_password=$1 where user_email=$2',[newpassword,req.body.email])


var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service:"gmail",
  // port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "saqibanayat90@gmail.com",
    pass: "gxtioueedssetghd"
  },
});
// var link = "http://localhost:4000/auth/verify-account?id=" + hashedlink;
var mailOptions = {
  from: "testing@engcoders.com",
  to: req.body.email,
  subject: "Welcome to rojer's project",
  html:
    `<p>this is your new password </p></br>
    <p> ${newpassword}</p>`
   
    
};
console.log()
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }

})
res.json({message:"please check your email for new password"})
}catch
  (error) {
    res.status(401).json({error:error.message});
}
})




router.get('/refresh_token',(req,res)=>{
  try {
      const refreshToken = req.cookies.refresh_token;

      if(refreshToken ===null) return res.status(401).json ({error:'null refresh token'});
      jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
          if(error) return res.status(403)({error: error.message});
          let refreshTk = refreshJwtToken(user);
          let token= jwtTokens(user);
          res.cookie('refresh_token',refreshTk.refreshToken,{httpOnly:true});
          res.json(token);
      })
  } catch (error) {
      res.status(401).json({error:error.message});
  }
})

router.delete('/logout', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({message:'Refresh token deleted.'});
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});
// export default router;
module.exports= router;