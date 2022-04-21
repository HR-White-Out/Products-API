const express = require('express');
const pool = require('../Database/db.js');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const app = express();
app.use(express.json());

const offset = 40343;

//1 terminal - npm run server

//_________________________________________INITIALIZE POSTGRESQL DATABAES WITH CSV FILES __________________________________________________
//order: product, related, features, styles, photos, skus
(function readCSV_WriteToDB(){

  fs.createReadStream(path.resolve(__dirname, '../ExampleData/**product_shortened.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    // console.log(data);
    pool.query('INSERT INTO products (id, product_id, product_name, category, default_price, slogan, description, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)',[parseInt(data.id), parseInt(data.id)+offset, data.name, data.category, data.default_price, data.slogan, data.description,  new Date(), new Date()]);
  })
  .on('end', ()=>console.log('finished writing products'));

  fs.createReadStream(path.resolve(__dirname, '../ExampleData/**related_shortened.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    // console.log(data);
    pool.query('INSERT INTO related (id, current_product_id, related_product_id) VALUES ($1,$2,$3)',[parseInt(data.id), parseInt(data.current_product_id)+offset, parseInt(data.related_product_id)+offset]);
  })
  .on('end', ()=>console.log('finished writing related'));


  fs.createReadStream(path.resolve(__dirname, '../ExampleData/**features_shortened.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    // console.log(data);
    pool.query('INSERT INTO features (id, product_id, feature, value) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.product_id)+offset, data.feature, data.value]);
  })
  .on('end', ()=>console.log('finished writing features'));


  fs.createReadStream(path.resolve(__dirname, '../ExampleData/**styles_shortened copy.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    console.log(data);
    // console.log((data.sale_price === 'null') ? null : data.sale_price);
    pool.query('INSERT INTO styles (id, product_id, name, sale_price, original_price, default_style) VALUES ($1,$2,$3,$4,$5,$6)',[parseInt(data.id), parseInt(data.product_id)+offset, data.name, 'hello', 43, true]);
  })
  .on('end', ()=>console.log('finished writing styles'));

  //(data.sale_price === 'null') ? null : parseInt(data.sale_price)
  //parseInt(data.original_price)


})()


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