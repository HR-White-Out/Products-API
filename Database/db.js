const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'Dennis',
  password: 'mac',
  database: 'products_db',
  host: 'localhost',
  port: 5432
});

module.exports = pool;