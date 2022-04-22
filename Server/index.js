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
    const oneProduct = await pool.query("SELECT * FROM Products WHERE id =$1", [idSelected]);
    // console.log('-----One PRoduct------------------');
    let response = oneProduct.rows[0];
    // console.log(response);
    const featureQuery = await pool.query("SELECT * FROM Features WHERE product_id = $1", [idSelected]);
    // console.log('-------feature query------------------');
    // console.log(featureQuery.rows);
    console.log('-------response------------------');
    response['features']= featureQuery.rows;

    console.log(response);


    res.json(response);
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
    const allStyles = await pool.query('SELECT * FROM Styles WHERE Styles.product_id =$1 ORDER BY id ASC;', [idSelected]);
    let uniqueStyles = helperfunctions.findUniqueStyleIds(allStyles.rows);
    let allPhotos = [];
    for (let i =0; i<uniqueStyles.length; i++){
      let photoQuery = await pool.query('SELECT * FROM Photos WHERE Photos.style_id =$1', [uniqueStyles[i]]);
      photoQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
      console.log('-----photoquery-----------------');
      console.log('photoQuery', photoQuery.rows)
      allPhotos.push(photoQuery.rows);
    }
    let allSkus=[];
    for (let i=0; i<uniqueStyles.length;i++){
      let skuQuery = await pool.query('SELECT * FROM Skus WHERE Skus.style_id = $1',[uniqueStyles[i]]);
      skuQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
      allSkus.push(skuQuery.rows);
    }
    let response = helperfunctions.formatReturnObject(idSelected, allStyles.rows, allPhotos, allSkus);
    res.json(response);
  }
  catch (err) {
    console.error(err.message);
  }
});

// Related Products API CALL  GET /products/:product_id/related params: product_id (int)


app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});