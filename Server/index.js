const express = require('express');
const pool = require('../Database/db.js');
const app = express();

app.use(express.json());


//___________________________________________________________R O U T E S __________________________________________________________________

// List Products API call -  GET API/products - params: page (int), count (int)
app.get('/products', async(req,res)=>{
  try{
    const fiveProducts = await pool.query("SELECT * FROM products"); //change this command 1 to 5
    res.json(fiveProducts.rows);
  }
  catch(err){
    console.error(err.message);
  }
})

// Product Information API call - GET API/products/:product_id - params: product_id
app.get('/products/:product_id', async (req,res)=>{
  try{
    let idSelected = parseInt(req.params.product_id); //req.params looks like { product_id: '40344' }
    const oneProduct = await pool.query("SELECT * FROM products WHERE product_id =$1", [idSelected]);
    res.json(oneProduct.rows[0]);
  }
  catch(err){
    console.error(err.message)
  }
})

// Product Information API call
// GET API/products/:product_id
// params: product_id


// Product Styles
// GET API/products/:product_id/styles
// params: product_id





app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});