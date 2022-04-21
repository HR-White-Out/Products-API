const mongoose = require('mongoose');

const products = mongoose.Schema({
  product: [
    {
      product_id: char,
      product_name: char,
      category: char,
      default_price: int,
      description: char,
      slogan: char,
      created_at: char,
      updated_at: char,
    }
  ],
  related: [
    {
      related_items: [],
    }
  ],
  features: [
    {
      feature: [],
      value:[],
    }
  ],
  styles: [
    {
      name: [],
      sale_price: [], --array of sale prices
      original_price: [],
      default_style:[]
    }
  ],
  photos: [
    {
      url: [],
      thumbnail_url:[]
    }
  ],
  skus: [
    {
      sku_id: [], --holds all sku-ids, style_id[0], size[0] quantity[0] would refer to sku_id[0]
      style_id:[],
      size: [],
      quantity:[],
    }
  ],

});