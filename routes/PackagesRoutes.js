
const express = require('express');

const pool = require('../db.js');

// const {authenticateToken} =require( '../middleware/authorization.js')
const router = express.Router();





//show all the packages 

router.get('/showPackages', async (req,res)=>{
  try {
    const users = await pool.query('select * from package_Detail');
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})
//--------------------------------------------------------------------------


router.post('/packageAdd', async (req, res) => {
  try {


   //insert values in package detail
   const packVerify = await pool.query('SELECT pack_id FROM package_detail WHERE pack_title = $1', [req.body.packageTitle]);
   let get_package_id ;
   if(packVerify.rows[0]) {
    get_package_id =  packVerify.rows[0].pack_id
   }
   else if(packVerify.rows.length === 0){
    await pool.query('INSERT INTO package_detail(pack_title,pack_description,price) VALUES($1,$2,$3)',
  [req.body.packageTitle,req.body.packageDes,req.body.packagePrice]);

    const get_pkg_id = await pool.query('SELECT pack_id FROM package_detail WHERE pack_title=$1',[req.body.packageTitle])
    get_package_id = get_pkg_id .rows[0].pack_id
   }

  




      //insert value in attribute 
      const attibuteVerify = await pool.query('SELECT * FROM attribute_pkg WHERE attribute_name = $1', [req.body.attributeTitle]);
              
      let get_attribute_id ;

      if(attibuteVerify.rows[0]) {
        get_attribute_id = attibuteVerify.rows[0].attribute_id

      }else if(attibuteVerify.rows.length === 0)
      {

       
       
        await pool.query('INSERT INTO attribute_pkg(attribute_name) VALUES ($1)',
     [req.body.attributeTitle])
    
     const get_id  = await pool.query('SELECT attribute_id FROM attribute_pkg WHERE attribute_name= $1',[req.body.attributeTitle])
    
     get_attribute_id = get_id .rows[0].attribute_id

      }

     //insert id's of package and attribute as forign key
     await pool.query('INSERT INTO package_attribute (pack_id,attribute_id , attribute_value) VALUES($1,$2,$3)',
     
     [get_package_id,get_attribute_id,req.body.attributeValue])

  res.json({message:"successfully add package"})
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
//---------------------------------------------------------------------------



//find attributes of single package

router.post('/showAttributes', async (req,res)=>{
  try {
    const packId = await pool.query('select pack_id from package_Detail where pack_title=$1',[req.body.packageTitle]);
    if (packId.rows.length === 0) return res.status(401).json({error:"please chose valid pacakge"});
    // console.log(packId);
    const getPackId = packId.rows[0].pack_id;
    console.log(getPackId );
   const getAttributes= pool.query('SELECT  Attribute_pkg.attribute_name FROM Package_attribute JOIN Attribute_pkg ON Package_attribute.attribute_id=Attribute_pkg.attribute_id where Package_attribute.pack_id=$1',[getPackId])
    res.json(getAttributes);
   
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})
// export default router;
module.exports = router;