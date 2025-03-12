const { Pool } = require('pg');

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {};

if (ENV === 'production') {
  config.connectionString = process.end.DATABASE_URL;
  config.max = 2;
}

//! not sure what to do about this????
// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured")
// } else {
//     console.log(`Connected to ${process.env.PGDATABASE}`)
// }

module.exports = new Pool(config);
