const path = require('path');
const fs = require('fs');
const pool = require('./db.js');
const csv = require('csv-parser');


const offset = 40343;
const timeIncrement = 60000;

console.log('Loading database ...');

//_________________________________________INITIALIZE POSTGRESQL DATABAES WITH CSV FILES __________________________________________________
//order: product, related, features, styles, photos, skus
(function readCSV_WriteToDB(){


  console.log('--------IN ORDER 1 ----------');
  console.log('start writing products');//full-1,000,011 lines
  fs.createReadStream(path.resolve(__dirname, '../ExampleData/*product.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    pool.query('INSERT INTO products (id, product_id, product_name, category, default_price, slogan, description, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)',[parseInt(data.id), parseInt(data.id)+offset, data.name, data.category, data.default_price, data.slogan, data.description,  new Date(), new Date()]);
  })
  .on('end', ()=>console.log('finished writing ... products'));



  setTimeout(() => {
    console.log('-------IN ORDER 2 ----------');
    console.log('start writing related'); //full is 4,508,263 lines
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*related.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
    // console.log('related data:', data);
    pool.query('INSERT INTO related (id, current_product_id, related_product_id) VALUES ($1,$2,$3)',[parseInt(data.id), parseInt(data.current_product_id)+offset, parseInt(data.related_product_id)+offset]);
    })
    .on('end', ()=>console.log('finished writing ... related'));
  }, timeIncrement*0.8);


   setTimeout(() => {
    console.log('---------IN ORDER 3 ---------');
    console.log('start writing styles'); //full is 1,958,102
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*styles.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
      pool.query('INSERT INTO styles (id, product_id, name, sale_price, original_price, default_style) VALUES ($1,$2,$3,$4,$5,$6)',[parseInt(data.id), parseInt(data.productId)+offset, data.name, data.sale_price, parseInt(data.original_price), (data.default_style ==='1')?true:false]);
    })
    .on('end', ()=>console.log('finished writing ... styles'));
  }, timeIncrement*2.5);

  setTimeout(() => {
    console.log('--------IN ORDER 4 ------');
    console.log('start writing photos'); //full is 5,655,647 or 5,655,463?
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*photos.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
      // console.log('photos data:', data);
      pool.query('INSERT INTO photos (id, product_id, url, thumbnail_url) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.styleId)+offset, data.url, data.thumbnail_url]);
    })
    .on('end', ()=>console.log('finished writing ... photos'));
  }, timeIncrement*5);

  //20 items
  setTimeout(() => {
    console.log('---------IN ORDER 5 --------');
    console.log('start writing features'); //full is 2219279
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*features.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
      // console.log('feature data:', data);
      pool.query('INSERT INTO features (id, product_id, feature, value) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.product_id)+offset, data.feature, data.value]);
    })
    .on('end', ()=>console.log('finished writing ... features'));
  }, timeIncrement*6);


  //shortened - 182 entries
  setTimeout(() => {
    console.log('------------IN ORDER 6 --------');
    console.log('start writing skus');  //11,323,917
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*skus.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
      // console.log('skus data:', data);
      pool.query('INSERT INTO skus (id, product_id, size, quantity) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.styleId)+offset, data.size, data.quantity]);
    })
    .on('end', ()=>console.log('finished writing ... skus'));
  }, timeIncrement*7);




})()
