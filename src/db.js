const { Pool } = require('pg');

const pool = new Pool({
  user: "root",
  host: "dpg-cvkrgi3e5dus73bt6ji0-a.oregon-postgres.render.com",
  database: "syllabus_41et",
  password: "LIfjDoBnekl6DK1m2I6s2jJbeRs9LTnk",
  port: 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
  keepAlive: true,
  connectionTimeoutMillis: 120000,
});

module.exports = pool;
