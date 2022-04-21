






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
    console.log('start writing photos'); //full is 5,655,647
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
    console.log('start writing skus');
    fs.createReadStream(path.resolve(__dirname, '../ExampleData/*skus.csv'))
    .pipe(csv({}))
    .on('data', (data)=>{
      // console.log('skus data:', data);
      pool.query('INSERT INTO skus (id, product_id, size, quantity) VALUES ($1,$2,$3,$4)',[parseInt(data.id), parseInt(data.styleId)+offset, data.size, data.quantity]);
    })
    .on('end', ()=>console.log('finished writing ... skus'));
  }, timeIncrement*7);





CREATE TABLE IF NOT EXISTS Products (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  slogan VARCHAR(300) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(300) NOT NULL,
  default_price VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Features (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  feature VARCHAR(50) NOT NULL,
  value VARCHAR(50) NOT NULL,
  CONSTRAINT features_id
    FOREIGN KEY(product_id)
      REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Styles (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  sale_price VARCHAR(50),
  original_price VARCHAR(50) NOT NULL,
  default_style BOOLEAN NOT NULL,
  CONSTRAINT styles_id
    FOREIGN KEY(product_id)
      REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Photos (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  style_id INT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_URL TEXT NOT NULL,
  CONSTRAINT photos_id
    FOREIGN KEY(style_id)
      REFERENCES Styles(id)
);

CREATE TABLE IF NOT EXISTS Skus (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  style_id INT NOT NULL,
  size VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT sku_id
    FOREIGN KEY(style_id)
      REFERENCES Styles(id)
);

CREATE TABLE IF NOT EXISTS Related_Products (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  curr_prod_id INT NOT NULL,
  related_prod_id INT NOT NULL,
  CONSTRAINT related_product_id
    FOREIGN KEY(curr_prod_id)
      REFERENCES Products(id)
);