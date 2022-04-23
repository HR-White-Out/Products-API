
-- \i Database/schema.sql
-- \i Database/ETL-Script.sql

DROP DATABASE IF EXISTS products_db;
CREATE DATABASE products_db;
\c products_db;
DROP TABLE IF EXISTS products, features, related, styles, photos, skus;
DROP TABLE IF EXISTS Products, Features, RelatedProducts, Styles, Photos, Skus;
--Products 1000,011
--Features 2,219,279
--Related  4,508,263
--Styles 1,958,102
--Photos 5,655,656
--Skus //11,323,917

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
  CONSTRAINT fk_Features_Products FOREIGN KEY(product_id) REFERENCES Products(id)
);


CREATE TABLE IF NOT EXISTS RelatedProducts (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  curr_prod_id INT NOT NULL,
  related_prod_id INT NOT NULL,
  CONSTRAINT fk_RelatedProducts_Products FOREIGN KEY(curr_prod_id) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Styles (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  sale_price VARCHAR(50),
  original_price VARCHAR(50) NOT NULL,
  default_style BOOLEAN NOT NULL,
  CONSTRAINT fk_Styles_Products FOREIGN KEY(product_id) REFERENCES Products(id)
);

CREATE TABLE IF NOT EXISTS Photos (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  style_id INT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_URL TEXT NOT NULL,
  CONSTRAINT fk_Photos_Styles FOREIGN KEY(style_id) REFERENCES Styles(id)
);

CREATE TABLE IF NOT EXISTS Skus (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  style_id INT NOT NULL,
  size VARCHAR(8) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_Skus_Styles FOREIGN KEY(style_id) REFERENCES Styles(id)
);


-- ---
-- ALL Queries I make
-- ---

-------------------PRODUCTS-----------
--"SELECT * FROM Products WHERE id BETWEEN $1 AND $2"
-------------------PRODUCTS/PRODUCT ID-----------
--"SELECT * FROM products WHERE id =$1"
--SELECT * FROM Features WHERE product_id = $1
CREATE INDEX CONCURRENTLY Products_id_idx ON Products USING HASH (id);
CREATE INDEX CONCURRENTLY Features_product_id_idx ON Features USING HASH (product_id);

------------------- FEATURES--------------------
--SELECT * FROM Styles WHERE Styles.product_id =$1 ORDER BY id ASC;'
--SELECT * FROM Photos WHERE Photos.style_id =$1
--SELECT * FROM Skus WHERE Skus.style_id = $1
CREATE INDEX CONCURRENTLY Styles_product_id_idx ON Styles USING HASH (product_id);
CREATE INDEX CONCURRENTLY Photos_style_id_idx ON Photos USING HASH (style_id);
CREATE INDEX CONCURRENTLY Skus_style_id_idx ON Skus USING HASH (style_id);

--------------------RELATED----------------------------
--SELECT * FROM RelatedProducts where curr_prod_id = $1
CREATE INDEX CONCURRENTLY RelatedProducts_curr_prod_id_idx ON RelatedProducts USING HASH (curr_prod_id);





