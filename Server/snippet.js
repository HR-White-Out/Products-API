
  fs.createReadStream(path.resolve(__dirname, '../ExampleData/**photos_shortened.csv'))
  .pipe(csv({}))
  .on('data', (data)=>{
    // console.log(data);
    pool.query('INSERT INTO photos (id, product_id, url, thumbnail_url) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.productId)+offset, data.url, data.thumbnail_url]);
  })
  .on('end', ()=>console.log('finished writing photos'));
