const express = require('express');
const pool = require('../Database/db.js');
const app = express();
// const { performance } = require('perf_hooks');
const helperfunctions = require('./Helper/helperfunctions.js');
app.use(express.json());

//one terminal - npm run server
//second terminal - run psql, fill in database
//third terminal (k6 stress tests) -  k6 run Tests/K6_StressTests/script.js

//___________________________________________________________R O U T E S __________________________________________________________________

// Products API call -  GET API/products - params: page (int), count (int)
app.get('/products', async(req,res)=>{
  try{
    // let startTime = performance.now()
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
    // console.log('startIndex:',startIndex);
    // console.log('endIndex:',endIndex);
    const fiveProducts = await pool.query("SELECT * FROM Products WHERE id BETWEEN $1 AND $2", [startIndex, endIndex]);
    res.json(fiveProducts.rows);
    // let endTime = performance.now()
    // console.log(`Get Req to /Products took ${endTime - startTime} milliseconds`)
  }
  catch(err){
    console.error(err.message);
  }
})

// Product Information API call - GET API/products/:product_id - params: product_id
app.get('/products/:product_id', async (req,res)=>{
  try{
    // let startTime = performance.now()
    // console.log('req params', req.params);
    let idSelected = parseInt(req.params.product_id); //req.params looks like { product_id: '40344' }

    // console.log('Product Info API Call id Selected was', idSelected);
    const oneProduct = await pool.query("SELECT * FROM Products WHERE id =$1", [idSelected]);
    let response = oneProduct.rows[0];
    // console.log(response);
    const featureQuery = await pool.query("SELECT * FROM Features WHERE product_id = $1", [idSelected]);
    // console.log('-------feature query------------------');
    // console.log(featureQuery.rows);
    // console.log('-------response------------------');
    response['features']= featureQuery.rows;

    res.json(response);
    // let endTime = performance.now()
    // console.log(`Get Req to /ProductID took ${endTime - startTime} milliseconds`)
  }
  catch(err){
    console.error(err.message)
  }
})

// Product Styles API Call - GET API/products/:product_id/styles -params: product_id
app.get('/products/:product_id/styles', async (req, res)=>{
  try {
    // let startTime = performance.now()
    // console.log('----------------in Get Styles Block------------------');
    let idSelected = parseInt(req.params.product_id);
    // console.log('Product Styles API Call id Selected was', idSelected);
    // console.log('----------------querying DB for styles-----------------');


    // console.log('----------------method 1-----------------');

    // let startTime1 = performance.now()
    const allStyles = await pool.query('SELECT * FROM Styles WHERE Styles.product_id =$1 ORDER BY id ASC;', [idSelected]);
    // console.log('allStylesRow', allStyles.rows);

    let uniqueStyles = helperfunctions.findUniqueStyleIds(allStyles.rows);
    // let endTime1 = performance.now()
    // console.log(`Test fetch from DB styles then find unique styles ${endTime1 - startTime1} milliseconds`)
    // console.log('----------------END method 1 -----------------');

    // console.log('----------------find unique styles-----------------');
    // console.log(uniqueStyles);
    let allPhotos = [];
    for (let i =0; i<uniqueStyles.length; i++){
      let photoQuery = await pool.query('SELECT * FROM Photos WHERE Photos.style_id =$1', [uniqueStyles[i]]);
      photoQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
      // console.log('----- after photoquery-----------------');
      // console.log('photoQuery', photoQuery.rows)
      allPhotos.push(photoQuery.rows);
    }
    // console.log('-----all photos looks like-----------------');
    // console.log(allPhotos);

    let allSkus=[];
    for (let i=0; i<uniqueStyles.length;i++){
      let skuQuery = await pool.query('SELECT * FROM Skus WHERE Skus.style_id = $1',[uniqueStyles[i]]);
      skuQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
      allSkus.push(skuQuery.rows);
    }
    let response = helperfunctions.formatReturnObject(idSelected, allStyles.rows, allPhotos, allSkus);
    // let endTime = performance.now()
    // console.log(`Get Req to /Styles took ${endTime - startTime} milliseconds`)
    res.json(response);
  }
  catch (err) {
    console.error(err.message);
  }
});

// GET /products/:product_id/related params: product_id (int)
app.get('/products/:product_id/related', async (req, res)=>{
  try {
    let idSelected = parseInt(req.params.product_id);

    const relatedQuery = await pool.query('SELECT array_agg(related_prod_id) AS related FROM relatedProducts WHERE relatedProducts.curr_prod_id = $1',[idSelected]);
    let response = helperfunctions.formatRelated(relatedQuery.rows);
    res.json(response);
  }
  catch (err) {
    console.error(err.message);
  }
});

app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});