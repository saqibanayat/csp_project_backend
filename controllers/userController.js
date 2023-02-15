const express = require("express");
const router = express.Router();
router.use(express.json());
const pool = require('../db.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const {jwtTokens, refreshJwtToken } =require('../utils/jwt-helpers.js');
const catchAsyncFun = require("../middleware/catchAsyncFun.js");

// let bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

exports.newUser = catchAsyncFun(async(req,res)=>{


  try {
    // check the user is already present or not
    if(!(req.body.name && req.body.email && req.body.password && req.body.role)){
      return res.status(401).json({error:"please fill all the credentials"})
    }
    const VerifyUser = await pool.query('select * from usersdata where user_email = $1',[req.body.email])
   
    if(VerifyUser.rows[0]) return res.status(401).json({error:"this user is already existed"});


    let findRole = await pool.query('select role_name from user_role where role_name=$1',[req.body.role])
   
    let getRoleId;
    if(findRole.rows[0].role_name==='service_user'){
      getRoleId = await pool.query(`select role_id from user_role where role_name ='service_user' `)
    }else if(findRole.rows[0].role_name==='service_provider'){
      
      getRoleId = await pool.query(`select role_id from user_role where role_name ='service_provider' `)
    }

//create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
   await pool.query(
      'INSERT INTO usersdata (user_name,user_email,user_password,role_id) VALUES ($1,$2,$3,$4) RETURNING *'
      , [req.body.name, req.body.email, hashedPassword,getRoleId.rows[0].role_id]);


    res.send('you successfully registered');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})
exports.allUser = catchAsyncFun(async(req,res)=>{

  try {
    
    const users = await pool.query('SELECT * FROM usersdata');
    res.json({users : users.rows});
  } catch (error) {
    res.status(500).json({error: error.message});
  }

})


//user login function
exports.login = catchAsyncFun(async(req,res)=>{
    try {
        
        if(!(req.body.email && req.body.password )){
          return res.status(401).json({error:"please fill all the credentials"})
        }
    
        const {email,password} = req.body;
        
        const users = await pool.query('SELECT * FROM usersdata WHERE user_email = $1', [email]);
        if (users.rows.length === 0) return res.status(401).json({error:"invalid email or password"});
        const userName = users.rows[0].user_name;
       
       
        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
        if (!validPassword) return res.status(401).json({error: "invalid email or password"});
       
        //get user_type
        const userType =await pool.query(`select role_name from user_role join usersdata on user_role.role_id=
        usersdata.role_id where user_id=$1`,[users.rows[0].user_id])
        const getUserRole = userType.rows[0].role_name;
        //JWT
        
        let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
        // let refresh = refreshJwtToken(users.rows[0])
        res.cookie('refresh_token', tokens.accessToken, {httpOnly: true,sameSite:'None',secure:true,domain:'localhost:3000',maxAge:1000*60*60*24});
        res.json({getUserRole,userName,tokens});
      } catch (error) {
        res.status(401).json({error: error.message});
      }
})




//forget password... send email on user email
exports.forgetPassword = catchAsyncFun(async(req,res)=>{
    try{
        if(!(req.body.email )){
          return res.status(401).json({error:"please fill all the credentials"})
        }
      let user=await pool.query('select * from usersdata where user_email = $1',[req.body.email])
      if (user.rows.length === 0) return res.status(401).json({error:"user not found"});
      console.log(user.rows[0].user_id);
      // const num = 8;
      // const randomNameGenerator = num => {
      //    let res = '';
      //    for(let i = 0; i < num; i++){
      //       const random = Math.floor(Math.random() * 27);
      //       res += String.fromCharCode(97 + random);
      //    };
      //    return res;
      // };
      // let newpassword=randomNameGenerator(num);
      
      
      // const hashedPassword = await bcrypt.hash(randomNameGenerator(num), 10);
      // await pool.query('update usersdata set user_password=$1 where user_email=$2',[newpassword,req.body.email])
      
      
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service:"gmail",
        secure: true, 
        auth: {
          user: "saqibanayat90@gmail.com",
          pass: "gxtioueedssetghd"
        },
      });
      var link = "http://localhost:8000/api/auth/restpassword/"+user.rows[0].user_id; 
      var mailOptions = {
        from: "testing@engcoders.com",
        to: req.body.email,
        subject: "Welcome to rojer's project",
        html:
         "<p>clik the link and rest your password</p><a href="+link+">Click here</a>"
         
          
      };
    
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




// reset the new password
exports.restPassword = catchAsyncFun(async(req,res)=>{

    try{
        let user = await pool.query("select * from usersdata where user_id = $1", [
          req.params.id,
        ]);
       
        if (!user.rows[0]) {
          return res.json({ message: "user not found" });
        }
        
        let { newPassword, confirmPassword } = req.body;
        // if (!bcrypt.compareSync(password, user.rows[0].password)) {
        //   return res.json({ message: "oldpassword does not match" });
        // }
        if (newPassword != confirmPassword) {
          return res.json({ message: "newpassword does not match" });
        }
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
      
        // user.rows[0].password = hashedPassword;
      
       
        await pool.query("update usersdata set user_password = $1 where user_id =$2", [
         hashedPassword,
          req.params.id,
        ]);
        res.json({
          message: "Password changed successfully",
        });
      }catch(error) {
        res.status(401).json({error: error.message});
      }
})



//user logout
exports.logout = catchAsyncFun(async(req,res)=>{

    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message:'Refresh token deleted.'});
      } catch (error) {
        res.status(401).json({error: error.message});
      }
    })



//refresh token
exports.refreshToken = catchAsyncFun(async(req,res)=>{


    try {
        const refreshToken = req.cookies.refresh_token;
  console.log(refreshToken);
        if(refreshToken ===null) return res.status(401).json ({error:'null refresh token'});

        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(error,user)=>{

            if(error) return res.status(403)({error: error.message});

            let refreshTk = refreshJwtToken(user);
            let token= jwtTokens(user);
            res.cookie('refresh_token', refreshTk.accessToken, {httpOnly: true,sameSite:'None',secure:true,domain:'localhost:3000',maxAge:1000*60*60*24});
            res.json(token);

        })
    
    } catch (error) {
        res.status(401).json({error:error.message});
    }


})