const express = require('express');
const pool = require('../Database/db.js');
const app = express();
const { performance } = require('perf_hooks');
const helperfunctions = require('./Helper/helperfunctions.js');
app.use(express.json());


//___________________________________________________________R O U T E __________________________________________________________________


// SQL COMMANDS


// -- -- -- SELECT *
// -- -- -- FROM Styles
// -- -- -- INNER JOIN Photos
// -- -- -- ON (styles.id = photos.style_id)
// -- -- -- WHERE Styles.product_id=1 AND Photos.style_id=1


// -- SELECT *
// -- FROM Styles
// -- WHERE Styles.product_id=1;


// -- SELECT *
// -- FROM Photos
// -- WHERE Photos.style_id = ANY (SELECT id FROM Styles WHERE Styles.product_id=1);

// SELECT *
// FROM
// (SELECT *
// 	FROM Styles
// 		WHERE Styles.product_id=1) As S
// INNER JOIN (
// SELECT *
// FROM Photos
// WHERE Photos.style_id = ANY (SELECT id FROM Styles WHERE Styles.product_id=1)
// )  X
// ON 1=1
// ORDER BY S.name ASC;


//END SQL COMMANDS


// Product Styles API Call - GET API/products/:product_id/styles -params: product_id
app.get('/products/:product_id/styles', async (req, res)=>{
  try {
    let startTime = performance.now()
    console.log('----------------in Get Styles Block------------------');
    let idSelected = parseInt(req.params.product_id);
    console.log('Product Styles API Call id Selected was', idSelected);
    console.log('----------------querying DB for styles-----------------');
    const allStyles = await pool.query('SELECT * FROM Styles WHERE Styles.product_id =$1 ORDER BY id ASC;', [idSelected]);
    console.log('allStylesRow', allStyles.rows);

    let uniqueStyles = helperfunctions.findUniqueStyleIds(allStyles.rows);
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
    console.log('-----all photos looks like-----------------');
    console.log(allPhotos);

    let allSkus=[];
    for (let i=0; i<uniqueStyles.length;i++){
      let skuQuery = await pool.query('SELECT * FROM Skus WHERE Skus.style_id = $1',[uniqueStyles[i]]);
      skuQuery.rows.sort((a,b)=>{
        return a.id-b.id;
      })
      allSkus.push(skuQuery.rows);
    }
    let response = helperfunctions.formatReturnObject(idSelected, allStyles.rows, allPhotos, allSkus);
    let endTime = performance.now()
    console.log(`Get Req to /Styles took ${endTime - startTime} milliseconds`)
    res.json(response);
  }
  catch (err) {
    console.error(err.message);
  }
});


app.listen(3000, ()=>{
  console.log('server listening on port 3000');
});