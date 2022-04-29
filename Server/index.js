const express = require('express');
const pool = require('../Database/db.js');
const app = express();
const helperfunctions = require('./Helper/helperfunctions.js');
app.use(express.json());

//one terminal - npm run server
//second terminal - run psql, fill in database
//third terminal (k6 stress tests) -  k6 run Tests/K6_StressTests/script.js

//___________________________________________________________R O U T E S __________________________________________________________________

// Products API call -  GET API/products - params: page (int), count (int)
app.get('/products', async(req,res)=>{
  try{
    let page = parseInt(req.query.page);
    let count = parseInt(req.query.count);
    if (count === 0) res.json([]);
    let startIndex, endIndex;
    (page>1) ? startIndex = (page-1)*count+1 : startIndex = 1;
    endIndex = startIndex + (count-1);
    if (isNaN(page) && isNaN(count)){
      startIndex = 1;
      endIndex = 5;
    }
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
    const oneProduct = await pool.query("SELECT * FROM Products WHERE id =$1", [idSelected]);
    let response = oneProduct.rows[0];
    const featureQuery = await pool.query("SELECT * FROM Features WHERE product_id = $1", [idSelected]);
    response['features']= featureQuery.rows;
    res.json(response);
  }
  catch(err){
    console.error(err.message)
  }
})

// Product Styles API Call - GET API/products/:product_id/styles -params: product_id
app.get('/products/:product_id/styles', async (req, res)=>{
  try {
    let idSelected = parseInt(req.params.product_id);
    const allStyles = await pool.query('SELECT * FROM Styles WHERE Styles.product_id =$1 ORDER BY id ASC;', [idSelected]);
    let uniqueStyles = helperfunctions.findUniqueStyleIds(allStyles.rows);
    let allPhotos = [];
    for (let i =0; i<uniqueStyles.length; i++){
      let photoQuery = await pool.query('SELECT * FROM Photos WHERE Photos.style_id =$1', [uniqueStyles[i]]);
      photoQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
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

// GET /products/:product_id/related params: product_id (int)
app.get('/products/:product_id/related', (req, res)=>{
  var sqlQuery = `SELECT json_agg(related_prod_id)
    FROM RelatedProducts
    WHERE curr_prod_id = ${req.params.product_id};`;

  pool.query(sqlQuery, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.status(200).send(result.rows[0].json_agg);
    }
  });
  pool.end;
});

app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});