const express = require('express');
const pool = require('../Database/db.js');
const app = express();
const helperfunctions = require('./Helper/helperfunctions.js');
app.use(express.json());


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
    const query = `
    SELECT
      json_build_object(
        'id', id,
        'name', name,
        'slogan', slogan,
        'description', description,
        'category', category,
        'defaultPrice', defaultPrice,
        'createdAt', createdAt,
        'updatedAt', updatedAt,
        'features', (
          SELECT coalesce(json_agg(features), '[]'::json)
          FROM (
            SELECT feature, value
            FROM features
            WHERE productId = p.id
          ) as features
        )
      ) as product
      FROM products p WHERE id=${idSelected}`;
    return pool.query(query);
  }
  catch(err){
    console.error(err.message)
  }
})

// Product Styles API Call - GET API/products/:product_id/styles -params: product_id
app.get('/products/:product_id/styles', async (req, res)=>{
  try {
    let idSelected = parseInt(req.params.product_id);
    const query = `
    SELECT json_build_object(
      'productId', id,
      'results', (
        SELECT coalesce(json_agg(styles), '[]'::json)
        FROM (
          SELECT
          id AS style_id,
          name AS name,
          originalPrice AS original_price,
          salePrice AS sale_price,
          defaultStyle AS default,
          (
            SELECT coalesce(json_agg(photos), '[]'::json) AS photos
            FROM (
              SELECT
              thumbnailUrl AS thumbnail_url,
              url
              FROM photos
              WHERE styleId = styles.id
            ) AS photos
          ),
          (
            SELECT json_object_agg(
              id,
              json_build_object(
                'size', size,
                'quantity', quantity
              )
            )
            FROM skus WHERE styleId = styles.id
          ) as skus
          FROM styles
          WHERE productId = p.id
        ) AS styles
      )
    ) AS product
    FROM products p
    WHERE id=${selectedID}`;
  
    let allSkus=[];
    for (let i=0; i<uniqueStyles.length;i++){
      let skuQuery = await pool.query(query);
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
app.get('/products/:product_id/related', async (req, res)=>{
  try {
    // let startTime = performance.now()
    let idSelected = parseInt(req.params.product_id);
    const relatedQuery = await pool.query('SELECT * FROM RelatedProducts where curr_prod_id = $1',[idSelected]);
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
