const Pool = require('pg').Pool;

//on EC2 Node instance pointing to EC2 Database
const pool = new Pool({
  user: 'postgres',
  database: 'products_db',
  host: '3.14.247.112',
  port: 5432
});

// //local development
// const pool = new Pool({
//   user: 'Dennis',
//   password: 'mac',
//   database: 'products_db',
//   host: 'localhost',
//   port: 5432
// });

module.exports = pool;