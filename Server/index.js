const express = require('express');
const pool = require('../Database/db.js');
const app = express();

const helperfunctions = require('./Helper/helperfunctions.js');
app.use(express.json());


//___________________________________________________________R O U T E __________________________________________________________________

// Products API call -  GET API/products - params: page (int), count (int)
app.get('/products', async(req,res)=>{
  try{
    let page = parseInt(req.query.page);
    let count = parseInt(req.query.count);
    if (count === 0) res.json([]);
    let startIndex, endIndex;
    (page>1) ? startIndex = (page-1)*count+1 : startIndex = 1;
    // console.log('startIndex:',startIndex);
    endIndex = startIndex + (count-1);
    // console.log('endIndex:',endIndex);
    const fiveProducts = await pool.query("SELECT * FROM Products WHERE id BETWEEN $1 AND $2", [startIndex, endIndex]);
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
    console.log('Product Info API Call id Selected was', idSelected);
    const oneProduct = await pool.query("SELECT * FROM products WHERE id =$1", [idSelected]);
    res.json(oneProduct.rows[0]);
  }
  catch(err){
    console.error(err.message)
  }
})


// Product Styles API Call - GET API/products/:product_id/styles -params: product_id
app.get('/products/:product_id/styles', async (req, res)=>{
  try {
    console.log('----------------in Get Styles Block------------------');
    let idSelected = parseInt(req.params.product_id);
    console.log('Product Styles API Call id Selected was', idSelected);
    const allStylesPhotos = await pool.query('SELECT * FROM Styles INNER JOIN Photos ON (Styles.product_id = $1 AND Photos.style_id=Styles.id) ', [idSelected]);
    //  const allStylesPhotos = await pool.query('SELECT * FROM Styles WHERE Styles.product_id = $1', [idSelected]); //delete


    const allSkus = await pool.query ('SELECT * FROM Skus INNER JOIN Styles ON (Styles.product_id = $1 AND Skus.style_id = Styles.id)', [idSelected]);
    console.log('----in Get Block Made Query Call---')
    console.log('all styles photos', allStylesPhotos.rows);
    // console.log('allSkus are', allSkus.rows);

    let response = helperfunctions.formatReturnObject(allStylesPhotos.rows, allSkus.rows);
    res.json([]);
  }
  catch (err) {
    console.error(err.message);
  }
});


// Related Products API CALL  GET /products/:product_id/related params: product_id (int)











app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});