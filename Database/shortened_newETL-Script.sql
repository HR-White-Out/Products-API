
-- \i Database/shortened_newETL-Script.sql

COPY Products(id, name, slogan, description, category, default_price)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**product_shortened.csv'
DELIMITER ','
CSV HEADER;

COPY Features(id, product_id, feature, value)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**features_shortened.csv'
DELIMITER ','
CSV HEADER;

COPY RelatedProducts(id, curr_prod_id, related_prod_id)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**related_shortened.csv'
DELIMITER ','
CSV HEADER;

COPY Styles(id, product_id, name, sale_price, original_price, default_style)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**styles_shortened.csv'
DELIMITER ','
CSV HEADER;

COPY Photos(id, style_id, url, thumbnail_url)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**photos_shortened.csv'
DELIMITER ','
CSV HEADER;

COPY Skus(id, style_id, size, quantity)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/**skus_shortened.csv'
DELIMITER ','
CSV HEADER;
