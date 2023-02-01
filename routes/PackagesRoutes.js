import express from 'express';
import pool from '../db.js';

import format from 'pg-format';

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



router.post('/packageAdd', async (req, res) => {
  try {


   //insert values in package detail
   const packVerify = await pool.query('SELECT * FROM package_detail WHERE pack_title = $1', [req.body.packageTitle]);
  
   if(packVerify.rows[0]) return res.status(401).json({error:"please select unique package title"});

  await pool.query('INSERT INTO package_detail(pack_title,pack_description,price) VALUES($1,$2,$3)',
  [req.body.packageTitle,req.body.packageDes,req.body.packagePrice]);

    const get_pkg_id = await pool.query('SELECT pack_id FROM package_detail WHERE pack_title=$1',[req.body.packageTitle])




      //insert value in attribute
      const attibuteVerify = await pool.query('SELECT * FROM attribute_pkg WHERE attribute_name = $1', [req.body.attributeTitle]);
              
      let get_attribute_id ;

      if(attibuteVerify.rows[0]) {
        get_attribute_id = attibuteVerify.rows[0].attribute_id

      }else if(attibuteVerify.rows.length === 0)
      {

       
       
        await pool.query(format('INSERT INTO attribute_pkg(attribute_name) VALUES %L', req.body.attributeTitle),
     [])
     const get_id  = await pool.query(format('SELECT * FROM attribute_pkg WHERE attribute_name= %L',req.body.attributeTitle),[])
     console.log(get_id.rows.attribute_id);
    //  get_attribute_id = get_id .rows.attribute_id

      }

     

    
   
  
//insert id's of package and attribute as forign key
    //  await pool.query('INSERT INTO package_attribute (pack_id,attribute_id , attribute_value) VALUES($1,$2,$3)',
     
    //  [get_pkg_id.rows[0].pack_id,get_attribute_id,req.body.attibuteValue])

  res.json("successfully add package")
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});


export default router;