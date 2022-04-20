
-- //postgres terminal may need to type

-- psql products_db
-- i\schema.sql

--\l list all databases in postgresql
--\c move into database
--\q quit
--\! clear -- to clear console


DROP DATABASE IF EXISTS products_db;
CREATE DATABASE products_db;
DROP TABLE IF EXISTS products, features, related, styles, photos, skus;
-- DECLARE newNum integer DEFAULT 40343;
-- CREATE OR REPLACE FUNCTION products_db.returnOffset(numeric)
-- RETURNS numeric AS
-- $BODY$
--   declare offset numeric =$1;
--   begin
--     return id;
--   end;
--   $BODY$
--   LANGUAGE plpgsql VOLATILE

------------------------------------------------------------------------------------------
CREATE TABLE products(
  id SERIAL NOT NULL,
  product_id SERIAL UNIQUE NOT NULL,
  product_name VARCHAR(25) NOT NULL,
  category VARCHAR(25) NOT NULL,
  default_price DECIMAL(12,2) NOT NULL,
  slogan VARCHAR(50),
  description VARCHAR(255),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY(id)
);
SET timezone = 'America/Los_Angeles';
ALTER SEQUENCE products_product_id_seq RESTART 40344;

--tests
INSERT INTO products (id, product_name, category, default_price, slogan, description, created_at, updated_at)
VALUES (1, 'Camo Onesie', 'Jackets', 140, 'Blendi n to your crowd', 'the so fatigues will wake you up..',  current_timestamp, current_timestamp);
INSERT INTO products (id, product_name, category, default_price, slogan, description, created_at, updated_at )
VALUES (2, 'Bright Future Sunglasses', 'Accessories', 69, 'youve got to wear shades', 'where youre going you might not need..', current_timestamp, current_timestamp);
INSERT INTO products (id, product_name, category, default_price, slogan, description, created_at, updated_at )
VALUES (3, 'Morning Joggers', 'Pants', 40, 'make yourself a morning person', 'whether youre a morning person ...', current_timestamp, current_timestamp);

------------------------------------------------------------------------------------------
CREATE TABLE features(
    id SERIAL NOT NULL,
    product_id SERIAL NOT NULL,
    feature  VARCHAR(50),
    value VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

--tests
INSERT INTO features (id, product_id, feature, value)
VALUES (1, 1+40343, 'Fabric', 'Canvas');
INSERT INTO features (id, product_id, feature, value)
VALUES (2, 1+40343, 'Buttons', 'Brass');
INSERT INTO features (id, product_id, feature, value)
VALUES (3, 2+40343, 'Lenses', 'Ultrasheen');

------------------------------------------------------------------------------------------

CREATE TABLE related(
    id SERIAL NOT NULL,
    current_product_id SERIAL NOT NULL,
    related_product_id SERIAL NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (current_product_id) REFERENCES products (product_id),
    FOREIGN KEY (related_product_id) REFERENCES products (product_id)
);

--tests
INSERT INTO related (id, current_product_id, related_product_id)
VALUES (1, 1+40343, 2+40343);
INSERT INTO related (id, current_product_id, related_product_id)
VALUES (2, 1+40343, 3+40343);

------------------------------------------------------------------------------------------


CREATE TABLE styles(
    id SERIAL NOT NULL,
    product_id SERIAL NOT NULL,
    name VARCHAR(50) NOT NULL,
    sale_price DECIMAL(12,2),
    original_price DECIMAL(12,2) NOT NULL,
    default_style BOOLEAN NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

INSERT INTO styles (id, product_id, name, sale_price,original_price,default_style)
VALUES (1, 1+40343, 'forest green & black', null, 140, true); -- 1 is int not boolean
INSERT INTO styles (id, product_id, name, sale_price,original_price,default_style)
VALUES (2, 1+40343, 'desert', null, 140, false);


------------------------------------------------------------------------------------------
CREATE TABLE photos(
    id SERIAL NOT NULL,
    product_id SERIAL NOT NULL,
    url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

INSERT INTO photos (id, product_id, url, thumbnail_url)
VALUES (1,1+40343, 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80','https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80');
INSERT INTO photos (id, product_id, url, thumbnail_url)
VALUES (2,1+40343, 'https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80','https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80');



------------------------------------------------------------------------------------------
CREATE TABLE skus(
    id SERIAL NOT NULL,
    product_id SERIAL NOT NULL,
    size VARCHAR(4),
    quantity SMALLINT,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

INSERT INTO skus(id, product_id, size, quantity)
VALUES(1, 1+40343, 'XS', 8);
INSERT INTO skus(id, product_id, size, quantity)
VALUES(2, 1+40343, 'S', 16);

INSERT INTO skus(id, product_id, size, quantity)
VALUES(3, 1+40343, 'M', 17);
INSERT INTO skus(id, product_id, size, quantity)
VALUES(4, 1+40343, 'L', 10);










