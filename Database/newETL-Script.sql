COPY Products(id, name, slogan, description, category, default_price)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*product.csv'
DELIMITER ','
CSV HEADER;

COPY Features(id, product_id, feature, value)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*features.csv'
DELIMITER ','
CSV HEADER;

COPY Styles(id, product_id, name, sale_price, original_price, default_style)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*styles.csv'
DELIMITER ','
CSV HEADER;

COPY Photos(id, style_id, url, thumbnail_url)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*photos.csv'
DELIMITER ','
CSV HEADER;

COPY Skus(id, style_id, size, quantity)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*skus.csv'
DELIMITER ','
CSV HEADER;

COPY Related_Products(id, curr_prod_id, related_prod_id)
FROM '/Users/Dennis/Desktop/Products-API/ExampleData/*related.csv'
DELIMITER ','
CSV HEADER;