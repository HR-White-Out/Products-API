//run in terminal k6 run Tests/K6_StressTests/script.js

import http from 'k6/http';
import { check, sleep } from 'k6';

const products_URL = 'http://localhost:3000/products';
const productID_URL = 'http://localhost:3000/products/:product_id';
const styles_URL = 'http://localhost:3000/products/:product_id/styles';
const related_URL = 'http://localhost:3000/products/:product_id/related';


export const options = {
    // InsecureSkipTLSVerify: true,
    // noConnectionReuse: false,
    vus: 1,
    duration:'10s'
};

export default function () {
  // const params = {
  //   page: 1,
  //   count: 5,
  // };
  http.get('http://localhost:3000/products/?page=1&count=5');
  // console.log(res);
}
