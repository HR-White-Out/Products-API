
-- \i Database/new schema.sql

DROP DATABASE IF EXISTS products_db;
CREATE DATABASE products_db;
DROP TABLE IF EXISTS products, features, related, styles, photos, skus;
DROP TABLE IF EXISTS Products, Features, related, Styles, Photos, Skus;
--products 1000,011
--features 2,219,279
--styles 1,958,102
--photos 5,655,463
--skus //11,323,917
-- related  4,508,263
--

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