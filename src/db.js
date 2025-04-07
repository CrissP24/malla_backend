const {Pool} = require('pg')
const pool =new  Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Damm123',
    database: 'moduloss',
    port: '5432'
})
module.exports = pool;