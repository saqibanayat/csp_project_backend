
const express = require('express');

const pool = require('../db.js');

const router = express.Router();



router.get('/showAttributes', async (req,res)=>{
    try {
       const attributeValues= await pool.query(
            'select * from attribute_pkg');
            res.send(attributeValues.rows)
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  })
  // export default router;
  module.exports = router;