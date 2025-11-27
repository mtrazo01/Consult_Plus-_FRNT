const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'consultplus',    
  password: 'postgree', 
  

});

module.exports = pool;
